import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  await requireRole(["admin", "editor"]);
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!publicKey || !privateKey || !urlEndpoint) {
    return NextResponse.json(
      {
        error:
          "ImageKit is not configured. Add its keys and URL endpoint to the server environment.",
      },
      { status: 503 },
    );
  }

  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60;
  const signature = createHmac("sha1", privateKey).update(`${token}${expire}`).digest("hex");
  return NextResponse.json({ token, expire, signature, publicKey, urlEndpoint });
}
