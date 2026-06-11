const ENC = new TextEncoder();

async function hmacHex(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", ENC.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, ENC.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toBase64url(text: string): string {
  const bytes = ENC.encode(text);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64url(b64: string): string {
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const base64 = (b64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

type TokenType = "verify" | "reset";

const TTL: Record<TokenType, number> = {
  verify: 24 * 60 * 60 * 1000, // 24 hours
  reset: 60 * 60 * 1000,       // 1 hour
};

export async function createToken(type: TokenType, userId: string): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET ?? "fallback-dev-secret";
  const expiry = Date.now() + TTL[type];
  const payload = `${type}|${userId}|${expiry}`;
  const sig = await hmacHex(payload, secret);
  return toBase64url(`${payload}|${sig}`);
}

export async function verifyToken(
  token: string,
  expectedType: TokenType
): Promise<{ valid: true; userId: string } | { valid: false; error: string }> {
  try {
    const decoded = fromBase64url(token);
    const parts = decoded.split("|");
    if (parts.length !== 4) return { valid: false, error: "invalid_format" };

    const [type, userId, expiryStr, sig] = parts;
    if (type !== expectedType) return { valid: false, error: "wrong_type" };

    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() > expiry) return { valid: false, error: "expired" };

    const secret = process.env.NEXTAUTH_SECRET ?? "fallback-dev-secret";
    const payload = `${type}|${userId}|${expiryStr}`;
    const expected = await hmacHex(payload, secret);
    if (sig !== expected) return { valid: false, error: "invalid_signature" };

    return { valid: true, userId };
  } catch {
    return { valid: false, error: "parse_error" };
  }
}
