import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { InquiryModel, LoginAttemptModel, SiteSettingModel } from "@/db/models";
import { inquirySchema } from "@/lib/validations/inquiry";
import { sendInquiryNotification } from "@/lib/email";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  const parsed = inquirySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check your information." },
      { status: 400 },
    );
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  await connectToDatabase();
  const ip =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");
  const now = new Date();
  const windowEndsAt = new Date(now.getTime() + WINDOW_MS);
  const attempt = await LoginAttemptModel.findOneAndUpdate(
    { key: `inquiry:${ipHash}` },
    [
      {
        $set: {
          attempts: {
            $cond: [{ $gt: ["$windowEndsAt", now] }, { $add: ["$attempts", 1] }, 1],
          },
          windowEndsAt: {
            $cond: [{ $gt: ["$windowEndsAt", now] }, "$windowEndsAt", windowEndsAt],
          },
        },
      },
    ],
    { upsert: true, new: true, updatePipeline: true },
  ).lean();

  if (attempt && attempt.attempts > MAX_ATTEMPTS) {
    const retryAfter = Math.max(
      1,
      Math.ceil((attempt.windowEndsAt.getTime() - now.getTime()) / 1000),
    );
    return NextResponse.json(
      { error: "Too many messages were submitted. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  try {
    const inquiry = await InquiryModel.create({
      ...parsed.data,
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? "",
    });
    try {
      const settings = await SiteSettingModel.findOne({ key: "site" })
        .select("contact.email")
        .lean();
      const notificationRecipient =
        process.env.INQUIRY_NOTIFICATION_EMAIL?.trim() || settings?.contact?.email || "";
      const notification = await sendInquiryNotification(parsed.data, notificationRecipient);
      if (notification.status === "not_configured") {
        console.warn("Inquiry saved, but email notification is not configured.", {
          missing: notification.missing,
        });
      }
    } catch (error) {
      console.error("Inquiry saved, but email notification failed.", error);
    }
    return NextResponse.json({ ok: true, id: String(inquiry._id) }, { status: 201 });
  } catch (error) {
    console.error("Unable to save public inquiry.", error);
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
