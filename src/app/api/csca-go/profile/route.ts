export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { uploadFile } from "@/lib/storage/r2";

const noCache = { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" };
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: noCache });
const firstRow = (result: any) => result?.rows?.[0] ?? result?.[0] ?? null;
const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

function bearer(request: NextRequest) {
  const match = (request.headers.get("authorization") ?? "").match(/^Bearer\s+([a-f0-9]{64})$/i);
  return match?.[1] ?? "";
}
function safeUser(user: any) {
  const firstName = String(user.firstName ?? user.first_name ?? "");
  const lastName = String(user.lastName ?? user.last_name ?? "");
  return {
    id: String(user.id),
    email: String(user.email ?? ""),
    firstName,
    lastName,
    name: String(user.name ?? [firstName, lastName].filter(Boolean).join(" ")),
    phone: String(user.phone ?? ""),
    country: String(user.country ?? ""),
    image: user.image ? String(user.image) : null,
    emailVerified: Boolean(user.emailVerified ?? user.email_verified),
    role: String(user.role ?? "student"),
  };
}
async function authorizedUser(request: NextRequest) {
  const token = bearer(request);
  if (!token) return null;
  const result = await db.execute(sql`
    SELECT u.id, u.email, u.first_name, u.last_name, u.name, u.phone, u.country, u.image,
           u.email_verified, u.role, u.is_active
    FROM csca_go_mobile_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)}
      AND s.revoked_at IS NULL AND s.expires_at > now()
      AND u.is_active = true AND u.role = 'student'
    LIMIT 1
  `);
  return firstRow(result);
}

export async function GET(request: NextRequest) {
  try {
    const user = await authorizedUser(request);
    if (!user) return json({ error: "Sign in again to manage your profile." }, 401);
    return json({ user: safeUser(user) });
  } catch (error) {
    console.error("[CSCA Go profile] GET failed:", error);
    return json({ error: "Unable to load your profile right now." }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await authorizedUser(request);
    if (!authUser) return json({ error: "Sign in again to manage your profile." }, 401);
    const body = await request.json().catch(() => ({}));
    const displayName = String(body.displayName ?? "").trim().replace(/\s+/g, " ");
    if (displayName.length < 2 || displayName.length > 120) {
      return json({ error: "Display name must be between 2 and 120 characters." }, 400);
    }
    const updated = await db.update(users)
      .set({ name: displayName, updatedAt: new Date() })
      .where(eq(users.id, String(authUser.id)))
      .returning({
        id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName,
        name: users.name, phone: users.phone, country: users.country, image: users.image,
        emailVerified: users.emailVerified, role: users.role,
      });
    if (!updated[0]) return json({ error: "Profile not found." }, 404);
    return json({ success: true, user: safeUser(updated[0]) });
  } catch (error) {
    console.error("[CSCA Go profile] update failed:", error);
    return json({ error: "Unable to save your profile right now." }, 500);
  }
}

function validImage(bytes: Buffer, type: string) {
  if (type === "image/jpeg") return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  if (type === "image/webp") return bytes.length > 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  return false;
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authorizedUser(request);
    if (!user) return json({ error: "Sign in again to manage your profile." }, 401);
    const form = await request.formData();
    const file = form.get("avatar");
    if (!(file instanceof File)) return json({ error: "Choose a profile image first." }, 400);
    if (file.size <= 0 || file.size > 3 * 1024 * 1024) return json({ error: "Profile images must be 3 MB or smaller." }, 400);
    const type = file.type.toLowerCase();
    if (!["image/jpeg", "image/png", "image/webp"].includes(type)) {
      return json({ error: "Use a JPG, PNG, or WebP image." }, 400);
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!validImage(bytes, type)) return json({ error: "The file does not appear to be a valid JPG, PNG, or WebP image." }, 400);
    const extension = type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : "webp";
    const key = "profiles/" + String(user.id) + "/avatar-" + crypto.randomUUID() + "." + extension;
    const image = await uploadFile(key, bytes, type);
    const updated = await db.update(users)
      .set({ image, updatedAt: new Date() })
      .where(eq(users.id, String(user.id)))
      .returning({
        id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName,
        name: users.name, phone: users.phone, country: users.country, image: users.image,
        emailVerified: users.emailVerified, role: users.role,
      });
    if (!updated[0]) return json({ error: "Profile not found after image upload." }, 404);
    return json({ success: true, user: safeUser(updated[0]) });
  } catch (error) {
    console.error("[CSCA Go profile] image upload failed:", error);
    return json({ error: "Unable to upload your profile image. Check the connection and try again." }, 500);
  }
}
