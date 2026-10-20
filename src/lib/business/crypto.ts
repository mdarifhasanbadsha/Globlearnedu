// ─────────────────────────────────────────────────────────────
// Credential encryption (AES-256-GCM).
// The key lives in the environment, never in the database.
// Ciphertext format: v1.<ivB64>.<tagB64>.<dataB64>
// ─────────────────────────────────────────────────────────────

const VERSION = "v1";

function rawKey(): Uint8Array | null {
  const value = process.env.CREDENTIALS_ENCRYPTION_KEY;
  if (!value) return null;
  const trimmed = value.trim();

  // Prefer a 64-char hex key; fall back to UTF-8 bytes from a long passphrase.
  if (/^[0-9a-f]{64}$/i.test(trimmed)) {
    const out = new Uint8Array(32);
    for (let i = 0; i < 32; i++) out[i] = parseInt(trimmed.substr(i * 2, 2), 16);
    return out;
  }
  if (trimmed.length >= 32) {
    return new TextEncoder().encode(trimmed.slice(0, 32));
  }
  return null;
}

export function isEncryptionConfigured(): boolean {
  return rawKey() !== null;
}

async function importKey(usage: KeyUsage[]): Promise<CryptoKey> {
  const bytes = rawKey();
  if (!bytes) throw new Error("CREDENTIALS_ENCRYPTION_KEY is not configured");
  const keyBytes = new Uint8Array(bytes).buffer as ArrayBuffer;
  return crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, usage);
}

function toB64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromB64(s: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
}

export async function encryptCredentials(obj: unknown): Promise<string> {
  const key = await importKey(["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array<ArrayBuffer>;
  const plaintext = new TextEncoder().encode(JSON.stringify(obj)) as Uint8Array<ArrayBuffer>;
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);

  // WebCrypto returns ciphertext||tag; split the trailing 16-byte tag.
  const all = new Uint8Array(cipher);
  const data = all.slice(0, all.length - 16);
  const tag = all.slice(all.length - 16);

  return [
    VERSION,
    toB64(iv.buffer as ArrayBuffer),
    toB64(tag.buffer as ArrayBuffer),
    toB64(data.buffer as ArrayBuffer),
  ].join(".");
}

export async function decryptCredentials(payload: string): Promise<Record<string, unknown>> {
  const [version, ivB64, tagB64, dataB64] = payload.split(".");
  if (version !== VERSION || !ivB64 || !tagB64 || !dataB64) {
    throw new Error("Malformed ciphertext");
  }

  const key = await importKey(["decrypt"]);
  const iv = fromB64(ivB64);
  const tag = fromB64(tagB64);
  const data = fromB64(dataB64);

  const combined = new Uint8Array(new ArrayBuffer(data.length + tag.length));
  combined.set(data, 0);
  combined.set(tag, data.length);

  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, combined);
  return JSON.parse(new TextDecoder().decode(plain));
}
