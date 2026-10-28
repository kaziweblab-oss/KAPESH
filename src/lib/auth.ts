import { createHmac, timingSafeEqual } from "node:crypto";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/connection";
import { UserModel } from "@/db/models";

export const SESSION_COOKIE = "kpesh_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export const userRoles = ["admin", "editor", "author"] as const;
export type UserRole = (typeof userRoles)[number];

export type UserSession = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  expiresAt: number;
};

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random value of at least 32 characters.");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.includes(value as UserRole);
}

export async function getSession(): Promise<UserSession | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const separator = raw.lastIndexOf(".");
  if (separator <= 0) return null;

  const payload = raw.slice(0, separator);
  const signature = raw.slice(separator + 1);
  let expectedSignature: string;

  try {
    expectedSignature = sign(payload);
  } catch (error) {
    console.error("Unable to validate admin session configuration.", error);
    return null;
  }

  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expectedSignature);
  if (
    actualBytes.length !== expectedBytes.length ||
    !timingSafeEqual(actualBytes, expectedBytes)
  ) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("id" in parsed) ||
      !("email" in parsed) ||
      !("name" in parsed) ||
      !("role" in parsed) ||
      !("expiresAt" in parsed) ||
      typeof parsed.id !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      !isUserRole(parsed.role) ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<UserSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  if (!isValidObjectId(session.id)) redirect("/admin/login");
  await connectToDatabase();
  const user = await UserModel.findById(session.id).select("name email role isActive").lean();
  if (!user || !user.isActive || !isUserRole(user.role)) redirect("/admin/login");

  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt: session.expiresAt,
  };
}

export async function requireRole(allowedRoles: readonly UserRole[]): Promise<UserSession> {
  const session = await requireSession();
  if (!allowedRoles.includes(session.role)) redirect("/admin");
  return session;
}

export async function setSession(
  session: Omit<UserSession, "expiresAt">,
): Promise<void> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ ...session, expiresAt })).toString("base64url");
  const value = `${payload}.${sign(payload)}`;

  (await cookies()).set({
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
