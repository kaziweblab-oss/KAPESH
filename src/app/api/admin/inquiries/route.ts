import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/db/connection";
import { AuditLogModel, InquiryModel } from "@/db/models";
import { requireRole } from "@/lib/auth";
import { rejectCrossOriginMutation } from "@/lib/security";

const updateSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
  status: z.enum(["new", "read", "replied", "archived"]),
  notes: z.string().trim().max(2000),
});

export async function GET() {
  await requireRole(["admin", "editor"]);
  await connectToDatabase();
  const inquiries = await InquiryModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ inquiries });
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const session = await requireRole(["admin", "editor"]);
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid inquiry update." },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const before = await InquiryModel.findById(parsed.data.id).lean();
  if (!before) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  try {
    const inquiry = await InquiryModel.findByIdAndUpdate(
      parsed.data.id,
      { $set: { status: parsed.data.status, notes: parsed.data.notes } },
      { new: true, runValidators: true },
    );
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    const ip = request.headers.get("x-nf-client-connection-ip") ?? "";
    await AuditLogModel.create({
      user: session.id,
      action: "update",
      collectionName: "Inquiry",
      documentId: inquiry.id,
      before,
      after: inquiry.toObject(),
      ipHash: ip ? createHash("sha256").update(ip).digest("hex") : "",
    });
    return NextResponse.json({ inquiry: inquiry.toObject() });
  } catch (error) {
    console.error("Unable to update inquiry.", error);
    return NextResponse.json({ error: "Unable to update this inquiry." }, { status: 500 });
  }
}
