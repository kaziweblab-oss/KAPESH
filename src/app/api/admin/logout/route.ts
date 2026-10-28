import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { rejectCrossOriginMutation } from "@/lib/security";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  await clearSession();
  return NextResponse.json({ ok: true });
}
