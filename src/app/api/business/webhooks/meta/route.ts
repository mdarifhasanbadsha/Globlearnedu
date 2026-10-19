import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

/**
 * Meta webhook for the GL Education Page.
 *
 * GET  — verification handshake. Meta calls this once when you click
 *        "Verify and save". We must echo hub.challenge back as plain text
 *        with a 200, or Meta rejects the URL.
 *
 * POST — event delivery. Verified with X-Hub-Signature-256 (HMAC-SHA256 of
 *        the RAW body). We acknowledge fast and persist; we never do slow
 *        AI work inside the request.
 */

function verifyToken(): string | null {
  const t = process.env.META_VERIFY_TOKEN?.trim();
  return t && t.length > 0 ? t : null;
}

function appSecret(): string | null {
  const s = process.env.META_APP_SECRET?.trim();
  return s && s.length > 0 ? s : null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expected = verifyToken();

  if (!expected) {
    // Misconfiguration, not a bad request from Meta: say so clearly.
    return new NextResponse("META_VERIFY_TOKEN is not configured on the server", {
      status: 503,
    });
  }

  if (mode !== "subscribe") {
    return new NextResponse("Unexpected hub.mode", { status: 400 });
  }

  // Constant-time comparison to avoid leaking the token by timing.
  const a = Buffer.from(token ?? "");
  const b = Buffer.from(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    return new NextResponse("Verification token mismatch", { status: 403 });
  }

  // Meta expects the raw challenge, echoed verbatim.
  return new NextResponse(challenge ?? "", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

function validSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = appSecret();
  if (!secret) return false;
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  const provided = signatureHeader.slice("sha256=".length);
  const a = Buffer.from(provided, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  // Read the raw text first: the signature is over the exact bytes.
  const raw = await req.text();
  const sig = req.headers.get("x-hub-signature-256");

  if (!appSecret()) {
    return new NextResponse("META_APP_SECRET is not configured on the server", {
      status: 503,
    });
  }

  if (!validSignature(raw, sig)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  // Meta always expects a fast 200 so it does not retry aggressively.
  try {
    const { routeMetaEvent } = await import("@/lib/business/meta-events");
    await routeMetaEvent(payload);
  } catch (e) {
    // Never fail the webhook on our own processing error: Meta would
    // redeliver and we would duplicate. Capture and move on.
    console.error("meta webhook processing error", (e as Error)?.message);
  }

  return new NextResponse("EVENT_RECEIVED", { status: 200 });
}
