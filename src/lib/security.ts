import { NextResponse } from "next/server";

export function rejectCrossOriginMutation(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) {
    return NextResponse.json(
      { error: "Origin header is required for this request." },
      { status: 403 },
    );
  }

  try {
    if (new URL(origin).origin === new URL(request.url).origin) return null;
  } catch {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
}
