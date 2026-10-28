import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectToDatabase } from "@/db/connection";
import {
  AuditLogModel,
  MediaModel,
  PostModel,
  ProductModel,
  ProjectModel,
  ServiceModel,
  SiteSettingModel,
  TestimonialModel,
} from "@/db/models";
import { requireRole } from "@/lib/auth";
import { rejectCrossOriginMutation } from "@/lib/security";
import { repairMojibakeDeep } from "@/lib/text-encoding";
import { localizedTextSchema } from "@/lib/validations/common";

const settingsSchema = z.object({
  siteName: localizedTextSchema,
  shortName: z.string().trim().min(1).max(40),
  tagline: localizedTextSchema,
  logo: z.object({
    url: z.string().trim().max(2048).default(""),
    publicId: z.string().trim().max(200).default(""),
    alt: localizedTextSchema.default({ bn: "", en: "" }),
    width: z.coerce.number().int().min(0).max(100_000).default(0),
    height: z.coerce.number().int().min(0).max(100_000).default(0),
  }),
  backgroundVideo: z.object({
    url: z.string().trim().max(2048).default(""),
    publicId: z.string().trim().max(200).default(""),
    mimeType: z.enum(["", "video/mp4", "video/webm"]).default(""),
  }),
  faviconUrl: z.string().trim().max(2048),
  theme: z.object({
    navy: z.string().regex(/^#[0-9a-f]{6}$/i),
    navy2: z.string().regex(/^#[0-9a-f]{6}$/i),
    brand: z.string().regex(/^#[0-9a-f]{6}$/i),
    brandDark: z.string().regex(/^#[0-9a-f]{6}$/i),
  }),
  contact: z.object({
    phone: z.string().trim().max(40),
    phoneAlt: z.string().trim().max(40),
    email: z.string().trim().max(120),
    whatsapp: z.string().trim().max(40),
    address: localizedTextSchema,
    mapUrl: z.string().trim().max(2048),
  }),
  social: z.object({
    facebook: z.string().trim().max(2048),
    youtube: z.string().trim().max(2048),
    instagram: z.string().trim().max(2048),
    linkedin: z.string().trim().max(2048),
  }),
  seo: z.object({
    title: localizedTextSchema,
    description: localizedTextSchema,
    keywords: z.array(z.string().trim().min(1).max(60)).max(30),
    ogImageUrl: z.string().trim().max(2048),
  }),
});

export async function GET() {
  await requireRole(["admin"]);
  await connectToDatabase();
  const settings = repairMojibakeDeep(
    await SiteSettingModel.findOne({ key: "site" }).lean(),
  );
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const session = await requireRole(["admin"]);
  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid site settings." },
      { status: 400 },
    );
  }
  const { url: videoUrl, publicId, mimeType } = parsed.data.backgroundVideo;
  const videoMetadataProvided = Boolean(videoUrl || publicId || mimeType);
  if (videoMetadataProvided) {
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim().replace(/\/+$/, "");
    if (
      !urlEndpoint ||
      !urlEndpoint.startsWith("https://") ||
      !videoUrl ||
      !videoUrl.startsWith(`${urlEndpoint}/`) ||
      !publicId ||
      !mimeType
    ) {
      return NextResponse.json(
        { error: "Choose a valid MP4 or WebM video uploaded to the configured HTTPS ImageKit account." },
        { status: 400 },
      );
    }
  }

  await connectToDatabase();
  try {
    const before = await SiteSettingModel.findOne({ key: "site" }).lean();
    const settings = await SiteSettingModel.findOneAndUpdate(
      { key: "site" },
      { $set: { ...parsed.data, updatedBy: session.id } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    const ip = request.headers.get("x-nf-client-connection-ip") ?? "";
    await AuditLogModel.create({
      user: session.id,
      action: before ? "update" : "create",
      collectionName: "SiteSetting",
      documentId: String(settings._id),
      before,
      after: settings.toObject(),
      ipHash: ip ? createHash("sha256").update(ip).digest("hex") : "",
    });
    const cleanupWarnings = await cleanupReplacedAssets(before, parsed.data);
    revalidatePath("/");
    revalidatePath("/bn");
    revalidatePath("/en");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    return NextResponse.json({ settings: settings.toObject(), cleanupWarnings });
  } catch (error) {
    console.error("Unable to save site settings.", error);
    return NextResponse.json({ error: "Unable to save site settings." }, { status: 500 });
  }

  type SettingsAsset = {
    url?: string;
    publicId?: string;
  };

  async function cleanupReplacedAssets(
    before: (Record<string, unknown> & { logo?: SettingsAsset | null; backgroundVideo?: SettingsAsset | null }) | null,
    after: { logo: SettingsAsset; backgroundVideo: SettingsAsset },
  ) {
    if (!before) return [];
    const warnings: string[] = [];
    const oldLogo = before.logo;
    const oldVideo = before.backgroundVideo;

    if (oldLogo?.publicId && oldLogo.publicId !== after.logo.publicId && oldLogo.url) {
      const referenced = await Promise.all([
        ServiceModel.exists({ "cover.url": oldLogo.url }),
        ProjectModel.exists({ $or: [{ "cover.url": oldLogo.url }, { "gallery.url": oldLogo.url }] }),
        ProductModel.exists({ $or: [{ "cover.url": oldLogo.url }, { "images.url": oldLogo.url }] }),
        PostModel.exists({ "cover.url": oldLogo.url }),
        TestimonialModel.exists({ "avatar.url": oldLogo.url }),
        SiteSettingModel.exists({ $or: [{ "faviconUrl": oldLogo.url }, { "seo.ogImageUrl": oldLogo.url }] }),
      ]);
      if (referenced.some(Boolean)) {
        warnings.push("The previous logo is still used elsewhere and was not deleted.");
      } else {
        const deleted = await deleteImageKitAsset(oldLogo.publicId);
        if (deleted) await MediaModel.deleteOne({ publicId: oldLogo.publicId });
        else warnings.push("The previous logo could not be deleted from ImageKit.");
      }
    }

    if (oldVideo?.publicId && oldVideo.publicId !== after.backgroundVideo.publicId) {
      if (!(await deleteImageKitAsset(oldVideo.publicId))) {
        warnings.push("The previous background video could not be deleted from ImageKit.");
      }
    }
    return warnings;
  }

  async function deleteImageKitAsset(publicId: string) {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) return false;
    try {
      const response = await fetch(
        `https://api.imagekit.io/v1/files/${encodeURIComponent(publicId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
          cache: "no-store",
        },
      );
      if (!response.ok) {
        console.error("ImageKit rejected settings asset deletion.", { status: response.status, publicId });
      }
      return response.ok;
    } catch (error) {
      console.error("Unable to delete replaced settings asset.", error);
      return false;
    }
  }
}
