import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { LoginAttemptModel, UserModel } from "@/db/models";
import { setSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

const LOGIN_ATTEMPT_LIMIT = 8;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const email = parsed.data.email.trim().toLowerCase();
    const headers = request.headers;
    const ipAddress =
      headers.get("x-nf-client-connection-ip") ??
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const key = createHash("sha256").update(`${email}|${ipAddress}`).digest("hex");
    const now = new Date();
    const windowEndsAt = new Date(now.getTime() + LOGIN_WINDOW_MS);
    const attempt = await LoginAttemptModel.findOneAndUpdate(
      { key },
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

    if (attempt && attempt.attempts > LOGIN_ATTEMPT_LIMIT) {
      const retryAfter = Math.max(
        1,
        Math.ceil((attempt.windowEndsAt.getTime() - now.getTime()) / 1000),
      );
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    const user = await UserModel.findOne({ email }).select("+passwordHash").lean();

    if (!user || !user.isActive || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "Two-factor verification is enabled but not configured for this login flow." },
        { status: 403 },
      );
    }

    await LoginAttemptModel.deleteOne({ key });
    await UserModel.updateOne({ _id: user._id }, { $set: { lastLoginAt: now } });
    await setSession({
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Unable to log in right now." }, { status: 500 });
  }
}
