import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/db/connection";
import { AuditLogModel, UserModel } from "@/db/models";
import { requireRole } from "@/lib/auth";
import { rejectCrossOriginMutation } from "@/lib/security";
import { createUserSchema, userRoles } from "@/lib/validations/auth";

const userUpdateSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().max(120).email(),
  role: z.enum(userRoles),
  isActive: z.boolean(),
});

export async function GET() {
  await requireRole(["admin"]);
  await connectToDatabase();
  const users = await UserModel.find({})
    .select("name email role isActive lastLoginAt createdAt")
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const session = await requireRole(["admin"]);
  const parsed = createUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid user details." },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const existing = await UserModel.exists({ email: parsed.data.email });
  if (existing)
    return NextResponse.json({ error: "That email is already in use." }, { status: 409 });

  try {
    const user = await UserModel.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
      role: parsed.data.role,
    });
    await logUserChange(
      session.id,
      "create",
      user.id,
      null,
      {
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      request,
    );
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
    console.error("Unable to create admin user.", error);
    return NextResponse.json({ error: "Unable to create this user." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const session = await requireRole(["admin"]);
  const parsed = userUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid user details." },
      { status: 400 },
    );
  }
  if (parsed.data.id === session.id && (!parsed.data.isActive || parsed.data.role !== "admin")) {
    return NextResponse.json(
      { error: "You cannot disable or demote your own account." },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const before = await UserModel.findById(parsed.data.id).select("name email role isActive").lean();
  if (!before) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (
    before.role === "admin" &&
    before.isActive &&
    (parsed.data.role !== "admin" || !parsed.data.isActive) &&
    (await UserModel.countDocuments({ role: "admin", isActive: true })) <= 1
  ) {
    return NextResponse.json(
      { error: "At least one active administrator must remain." },
      { status: 400 },
    );
  }

  try {
    const user = await UserModel.findByIdAndUpdate(
      parsed.data.id,
      {
        $set: {
          name: parsed.data.name,
          email: parsed.data.email,
          role: parsed.data.role,
          isActive: parsed.data.isActive,
        },
      },
      { new: true, runValidators: true },
    ).select("name email role isActive");
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    await logUserChange(session.id, "update", user.id, before, user.toObject(), request);
    return NextResponse.json({ user });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
    console.error("Unable to update admin user.", error);
    return NextResponse.json({ error: "Unable to update this user." }, { status: 500 });
  }
}

async function logUserChange(
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
    collectionName: "User",
    documentId,
    before,
    after,
    ipHash: ip ? createHash("sha256").update(ip).digest("hex") : "",
  });
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}
