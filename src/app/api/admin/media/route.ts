import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
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

const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"] as const;
const mediaSchema = z.object({
  fileId: z.string().trim().min(1).max(200),
  url: z.string().url().max(2048),
  width: z.number().int().min(0).max(100_000),
  height: z.number().int().min(0).max(100_000),
  size: z
    .number()
    .int()
    .min(0)
    .max(8 * 1024 * 1024),
  mimeType: z.enum(imageTypes),
  alt: z.object({ bn: z.string().trim().max(300), en: z.string().trim().max(300) }),
});
const altSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
  alt: z.object({ bn: z.string().trim().max(300), en: z.string().trim().max(300) }),
});

export async function GET() {
  await requireRole(["admin", "editor"]);
  await connectToDatabase();
  const media = repairMojibakeDeep(
    await MediaModel.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .select("url publicId provider alt width height mimeType size createdAt")
      .lean(),
  );
  return NextResponse.json({ media });
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const session = await requireRole(["admin", "editor"]);
  const parsed = mediaSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid media details." },
      { status: 400 },
    );
  }
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.replace(/\/+$/, "");
  if (!urlEndpoint || !parsed.data.url.startsWith(`${urlEndpoint}/`)) {
    return NextResponse.json(
      { error: "The uploaded image URL does not match the configured ImageKit endpoint." },
      { status: 400 },
    );
  }

  await connectToDatabase();
  try {
    const media = await MediaModel.create({
      url: parsed.data.url,
      publicId: parsed.data.fileId,
      provider: "imagekit",
      alt: parsed.data.alt,
      width: parsed.data.width,
      height: parsed.data.height,
      mimeType: parsed.data.mimeType,
      size: parsed.data.size,
      uploadedBy: session.id,
    });
    await logMediaChange(session.id, "create", media.id, null, media.toObject(), request);
    return NextResponse.json({ media: media.toObject() }, { status: 201 });
  } catch (error) {
    console.error("Unable to save uploaded media metadata.", error);
    return NextResponse.json(
      {
        error:
          "Image uploaded, but its library record could not be saved. Remove it from ImageKit before retrying.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const session = await requireRole(["admin", "editor"]);
  const parsed = altSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid alt text." },
      { status: 400 },
    );
  }
  await connectToDatabase();
  const before = await MediaModel.findById(parsed.data.id).lean();
  if (!before) return NextResponse.json({ error: "Media item not found." }, { status: 404 });
  try {
    const media = await MediaModel.findByIdAndUpdate(
      parsed.data.id,
      { $set: { alt: parsed.data.alt } },
      { new: true, runValidators: true },
    );
    if (!media) return NextResponse.json({ error: "Media item not found." }, { status: 404 });
    await logMediaChange(session.id, "update", media.id, before, media.toObject(), request);
    return NextResponse.json({ media: media.toObject() });
  } catch (error) {
    console.error("Unable to update media alt text.", error);
    return NextResponse.json({ error: "Unable to update this media item." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const session = await requireRole(["admin", "editor"]);
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "A valid media ID is required." }, { status: 400 });
  }
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "ImageKit is not configured. Add its private key to the server environment." },
      { status: 503 },
    );
  }
  await connectToDatabase();
  const before = await MediaModel.findById(id).lean();
  if (!before) return NextResponse.json({ error: "Media item not found." }, { status: 404 });
  if (before.provider !== "imagekit" || !before.publicId) {
    return NextResponse.json(
      { error: "This provider's media must be removed from its hosting service directly." },
      { status: 400 },
    );
  }

  try {
    const referenced = await Promise.all([
      ServiceModel.exists({ "cover.url": before.url }),
      ProjectModel.exists({ $or: [{ "cover.url": before.url }, { "gallery.url": before.url }] }),
      ProductModel.exists({ $or: [{ "cover.url": before.url }, { "images.url": before.url }] }),
      PostModel.exists({ "cover.url": before.url }),
      TestimonialModel.exists({ "avatar.url": before.url }),
      SiteSettingModel.exists({
        $or: [
          { "logo.url": before.url },
          { faviconUrl: before.url },
          { "seo.ogImageUrl": before.url },
        ],
      }),
    ]);
    if (referenced.some(Boolean)) {
      return NextResponse.json(
        {
          error: "This image is in use. Replace or remove it from its content before deleting it.",
        },
        { status: 409 },
      );
    }

    const response = await fetch(
      `https://api.imagekit.io/v1/files/${encodeURIComponent(before.publicId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      console.error("ImageKit rejected media deletion.", { status: response.status });
      return NextResponse.json(
        { error: "ImageKit could not delete this image. The library record was left unchanged." },
        { status: 502 },
      );
    }

    await MediaModel.findByIdAndDelete(id);
    await logMediaChange(session.id, "delete", id, before, null, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to delete media from ImageKit.", error);
    return NextResponse.json(
      { error: "Unable to delete this image from ImageKit." },
      { status: 502 },
    );
  }
}

async function logMediaChange(
  actorId: string,
  action: string,
  documentId: string,
  before: unknown,
  after: unknown,
  request: Request,
) {
  const ip = request.headers.get("x-nf-client-connection-ip") ?? "";
  await AuditLogModel.create({
    user: actorId,
    action,
    collectionName: "Media",
    documentId,
    before,
    after,
    ipHash: ip ? createHash("sha256").update(ip).digest("hex") : "",
  });
}
