import { NextResponse } from "next/server";

function hexToUint8(hex: string) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) arr[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  return arr;
}

function timingSafeEqualHex(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  const ua = hexToUint8(a);
  const ub = hexToUint8(b);
  let res = 0;
  for (let i = 0; i < ua.length; i++) res |= ua[i] ^ ub[i];
  return res === 0;
}

async function computeHmacHex(secret: string, message: string) {
  // Use Web Crypto if available (edge/workers), otherwise Node's createHmac
  if (typeof (globalThis as any).crypto?.subtle !== "undefined") {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const { createHmac } = await import("crypto");
  return createHmac("sha256", secret).update(message).digest("hex");
}

export async function GET() {
  return NextResponse.json({ message: "Clerk Webhook" });
}

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CLERK_WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  const raw = await request.text();
  const header = request.headers.get("clerk-signature") || request.headers.get("Clerk-Signature") || request.headers.get("signature") || "";

  // Header may be in formats like "v1=<hex>" or a raw hex string. Extract hex if present.
  let receivedSig = "";
  const v1Match = header.match(/v1=([0-9a-fA-F]+)/);
  if (v1Match) {
    receivedSig = v1Match[1];
  } else {
    // fallback: take the whole header if it looks hex-like
    const hexMatch = header.match(/^[0-9a-fA-F]+$/);
    if (hexMatch) receivedSig = header;
  }

  const expected = await computeHmacHex(secret, raw);
  const verified = timingSafeEqualHex(expected, receivedSig);
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // TODO: handle specific Clerk events here

  return NextResponse.json({ message: "Clerk webhook received", event });
}
