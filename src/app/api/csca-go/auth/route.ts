export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/resend";

const SESSION_DAYS = 30;
const OTP_MINUTES = 10;
const OTP_RESEND_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;

function firstRow(result: any) {
  return result?.rows?.[0] ?? result?.[0] ?? null;
}
function rowsOf(result: any): any[] {
  return result?.rows ?? result ?? [];
}
function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" },
  });
}
function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}
function normalizePhone(value: unknown) {
  return String(value ?? "").replace(/[^0-9]/g, "");
}
function phoneVariants(value: unknown): [string, string, string, string] {
  const digits = normalizePhone(value);
  const values = new Set<string>([digits]);
  if (digits.startsWith("00")) values.add(digits.slice(2));
  if (digits.startsWith("880") && digits.length >= 12) {
    values.add("0" + digits.slice(3));
    values.add(digits.slice(3));
  } else if (digits.startsWith("01") && digits.length === 11) {
    values.add("880" + digits.slice(1));
    values.add(digits.slice(1));
  } else if (digits.startsWith("86") && digits.length === 13) {
    // Chinese E.164 mobile number: also compare the national mobile part.
    values.add(digits.slice(2));
  }
  // Do not guess a country from a generic leading "1": NANP and other countries
  // can share similar national-number lengths. Phone login must not cross-match
  // unrelated numbers; callers should use the number format saved to their account.
  const list = Array.from(values).filter(Boolean).slice(0, 4);
  while (list.length < 4) list.push(list[list.length - 1] ?? digits);
  return [list[0], list[1], list[2], list[3]];
}
function hashToken(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function rateKey(action: string, identifier: string) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) throw new Error("The authentication secret is not configured.");
  return crypto.createHmac("sha256", secret).update(action + ":" + identifier.trim().toLowerCase()).digest("hex");
}
async function isRateLimited(action: string, identifier: string, maxAttempts: number, windowSeconds: number) {
  const keyHash = rateKey(action, identifier);
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS count FROM csca_go_mobile_rate_limits
    WHERE action = ${action} AND key_hash = ${keyHash}
      AND created_at > now() - (${windowSeconds} * interval '1 second')
  `);
  return Number(firstRow(result)?.count ?? 0) >= maxAttempts;
}
async function recordRateAttempt(action: string, identifier: string) {
  const keyHash = rateKey(action, identifier);
  // Keep the rate-limit table bounded; only recent attempts affect enforcement.
  await db.execute(sql`DELETE FROM csca_go_mobile_rate_limits WHERE created_at < now() - interval '1 day'`);
  await db.execute(sql`INSERT INTO csca_go_mobile_rate_limits(action, key_hash) VALUES (${action}, ${keyHash})`);
}
async function clearRateAttempts(action: string, identifier: string) {
  const keyHash = rateKey(action, identifier);
  await db.execute(sql`DELETE FROM csca_go_mobile_rate_limits WHERE action = ${action} AND key_hash = ${keyHash}`);
}
function hashOtp(email: string, otp: string) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) throw new Error("The authentication secret is not configured.");
  return crypto.createHmac("sha256", secret).update(email + ":" + otp).digest("hex");
}
function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value);
}
function passwordError(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
}
function userPayload(user: any) {
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
async function ensureMobileTables() {
  await db.execute(sql.raw(sqlCreateOtpTable));
  await db.execute(sql.raw(sqlCreateSessionsTable));
  await db.execute(sql.raw(sqlSessionIndex));
  await db.execute(sql.raw(sqlOtpExpiryIndex));
  // Terms acceptance is recorded during mobile registration; create its table before OTP completion.
  await db.execute(sql.raw(sqlCreateTermsTable));
  await db.execute(sql.raw(sqlCreateRateLimitsTable));
  await db.execute(sql.raw(sqlRateLimitsIndex));
  await db.execute(sql.raw(sqlRateLimitsExpiryIndex));
}
const sqlCreateOtpTable = `
CREATE TABLE IF NOT EXISTS csca_go_registration_otps (
  email varchar(255) PRIMARY KEY,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  phone varchar(30) NOT NULL,
  country varchar(100) NOT NULL,
  password_hash varchar(255) NOT NULL,
  otp_hash varchar(64) NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  resend_after timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
)`;
const sqlCreateSessionsTable = `
CREATE TABLE IF NOT EXISTS csca_go_mobile_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash varchar(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
)`;
const sqlSessionIndex = `CREATE INDEX IF NOT EXISTS csca_go_mobile_sessions_user_idx ON csca_go_mobile_sessions(user_id, expires_at)`;
const sqlOtpExpiryIndex = `CREATE INDEX IF NOT EXISTS csca_go_registration_otps_expiry_idx ON csca_go_registration_otps(expires_at)`;
const sqlCreateRateLimitsTable = `
CREATE TABLE IF NOT EXISTS csca_go_mobile_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action varchar(24) NOT NULL,
  key_hash varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
)`;
const sqlRateLimitsIndex = `CREATE INDEX IF NOT EXISTS csca_go_mobile_rate_limits_lookup_idx ON csca_go_mobile_rate_limits(action, key_hash, created_at DESC)`;
const sqlRateLimitsExpiryIndex = `CREATE INDEX IF NOT EXISTS csca_go_mobile_rate_limits_expiry_idx ON csca_go_mobile_rate_limits(created_at)`;

const sqlCreateTermsTable = `
CREATE TABLE IF NOT EXISTS csca_go_terms_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  policy_version varchar(40) NOT NULL,
  source varchar(40) NOT NULL DEFAULT 'android_app',
  accepted_at timestamptz NOT NULL DEFAULT now()
)`;

function bearerToken(request: NextRequest) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}
async function createMobileSession(userId: string) {
  const accessToken = crypto.randomBytes(32).toString("hex");
  await db.execute(
    // Only the SHA-256 hash is persisted; the bearer token is returned once to the app.
    (await import("drizzle-orm")).sql`INSERT INTO csca_go_mobile_sessions(user_id, token_hash, expires_at)
      VALUES(${userId}, ${hashToken(accessToken)}, now() + make_interval(days => ${SESSION_DAYS}))`
  );
  return { accessToken, expiresInSeconds: SESSION_DAYS * 24 * 60 * 60 };
}
async function authenticatedUser(request: NextRequest) {
  const token = bearerToken(request);
  if (!token || token.length < 40) return null;
  const result = await db.execute(sql`
    SELECT u.id, u.email, u.first_name, u.last_name, u.name, u.phone, u.country, u.image,
           u.email_verified, u.role
    FROM csca_go_mobile_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)}
      AND s.revoked_at IS NULL
      AND s.expires_at > now()
      AND u.is_active = true
    LIMIT 1
  `);
  const user = firstRow(result);
  if (!user) return null;
  await db.execute(sql`UPDATE csca_go_mobile_sessions SET last_used_at = now() WHERE token_hash = ${hashToken(token)}`);
  return { user: userPayload(user), tokenHash: hashToken(token) };
}

export async function GET(request: NextRequest) {
  try {
    await ensureMobileTables();
    const auth = await authenticatedUser(request);
    if (!auth) return json({ error: "Your session has expired. Please sign in again." }, 401);
    return json({ authenticated: true, user: auth.user });
  } catch (error) {
    console.error("[CSCA Go auth] session lookup failed:", error);
    return json({ error: "Unable to verify your session right now." }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureMobileTables();
    const body = await request.json().catch(() => ({}));
    const action = String(body.action ?? "");

    if (action === "requestOtp") {
      // Expired, abandoned registrations contain only hashed OTP/password material; purge them before accepting more.
      await db.execute(sql`DELETE FROM csca_go_registration_otps WHERE expires_at < now()`);
      const firstName = String(body.firstName ?? "").trim().slice(0, 100);
      const lastName = String(body.lastName ?? "").trim().slice(0, 100);
      const email = normalizeEmail(body.email);
      const rawPhone = String(body.phone ?? "").trim().slice(0, 30);
      const phoneDigits = normalizePhone(rawPhone);
      const phoneOptions = phoneVariants(rawPhone);
      const country = String(body.country ?? "").trim().slice(0, 100);
      const password = String(body.password ?? "");
      const acceptedTerms = body.acceptedTerms === true;
      const pError = passwordError(password);

      if (!acceptedTerms) return json({ error: "Accept the Terms of Service and Privacy Policy to create your account." }, 400);
      if (!firstName || !lastName || !email || !rawPhone || !country) {
        return json({ error: "Complete your name, email, phone number, country and password." }, 400);
      }
      if (!validEmail(email)) return json({ error: "Enter a valid email address." }, 400);
      if (await isRateLimited("otp", email, 5, 3600)) return json({ error: "Too many verification codes requested for this email. Please try again later." }, 429);
      if (phoneDigits.length < 7 || phoneDigits.length > 15) return json({ error: "Enter a valid phone number including country code." }, 400);
      if (pError) return json({ error: pError }, 400);

      const [existingEmail] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existingEmail) return json({ error: "An account with this email already exists. Please sign in instead." }, 409);

      const existingPhone = await db.execute(sql`
        SELECT id FROM users
        WHERE regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g') IN (${phoneOptions[0]}, ${phoneOptions[1]}, ${phoneOptions[2]}, ${phoneOptions[3]})
        LIMIT 1
      `);
      if (firstRow(existingPhone)) return json({ error: "This phone number is already linked to an account. Sign in with that account or use a different number." }, 409);

      const passwordHash = await bcrypt.hash(password, 12);
      const otp = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
      const otpHash = hashOtp(email, otp);
      const challenge = await db.execute(sql`
        INSERT INTO csca_go_registration_otps
          (email, first_name, last_name, phone, country, password_hash, otp_hash, attempts, expires_at, resend_after, created_at)
        VALUES
          (${email}, ${firstName}, ${lastName}, ${rawPhone}, ${country}, ${passwordHash}, ${otpHash}, 0,
           now() + interval '10 minutes', now() + interval '60 seconds', now())
        ON CONFLICT (email) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          phone = EXCLUDED.phone,
          country = EXCLUDED.country,
          password_hash = EXCLUDED.password_hash,
          otp_hash = EXCLUDED.otp_hash,
          attempts = 0,
          expires_at = EXCLUDED.expires_at,
          resend_after = EXCLUDED.resend_after,
          created_at = now()
        WHERE csca_go_registration_otps.resend_after <= now()
        RETURNING email
      `);
      if (!firstRow(challenge)) return json({ error: "Please wait a minute before requesting another code." }, 429);

      const emailResult = await sendEmail({
        to: email,
        subject: "Your CSCA Go verification code",
        templateName: "csca-go-email-otp",
        sensitive: true,
        html: `<!doctype html><html><body style="margin:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#182943"><div style="max-width:540px;margin:24px auto;background:#fff;border-radius:18px;padding:32px"><p style="color:#c8102e;font-weight:800;letter-spacing:2px">CSCA GO · GL EDUCATION</p><h1 style="font-size:24px">Verify your email</h1><p>Hello ${firstName.replace(/[&<>"]/g, "")},</p><p>Enter this one-time verification code in CSCA Go to finish creating your student account.</p><div style="margin:24px 0;padding:18px;text-align:center;background:#fff0f2;border-radius:12px;font-size:32px;font-weight:800;letter-spacing:8px;color:#c8102e">${otp}</div><p>This code expires in 10 minutes. Do not share it with anyone.</p><p style="font-size:12px;color:#64748b">If you did not request this code, you can ignore this email.</p></div></body></html>`,
      });
      if (!emailResult.success) {
        await db.execute(sql`DELETE FROM csca_go_registration_otps WHERE email = ${email} AND otp_hash = ${otpHash}`);
        return json({ error: "We couldn't send your verification email. Please check your address and try again shortly." }, 502);
      }
      await recordRateAttempt("otp", email);
      return json({ success: true, message: "Verification code sent.", email, expiresInSeconds: OTP_MINUTES * 60, resendAfterSeconds: OTP_RESEND_SECONDS });
    }

    if (action === "verifyOtp") {
      const email = normalizeEmail(body.email);
      const otp = String(body.otp ?? "").trim();
      if (!validEmail(email) || !/^\d{6}$/.test(otp)) return json({ error: "Enter the email address and six-digit verification code." }, 400);
      const result = await db.execute(sql`SELECT email, first_name, last_name, phone, country, password_hash, otp_hash, attempts, expires_at, (expires_at > now()) AS is_valid FROM csca_go_registration_otps WHERE email = ${email} LIMIT 1`);
      const challenge = firstRow(result);
      if (!challenge) return json({ error: "This verification code is no longer available. Request a new one." }, 400);
      if (Number(challenge.attempts) >= OTP_MAX_ATTEMPTS) {
        await db.execute(sql`DELETE FROM csca_go_registration_otps WHERE email = ${email}`);
        return json({ error: "Too many incorrect attempts. Request a new verification code." }, 429);
      }
      if (!challenge.is_valid) {
        await db.execute(sql`DELETE FROM csca_go_registration_otps WHERE email = ${email}`);
        return json({ error: "This code has expired. Request a new verification code." }, 400);
      }
      const expected = String(challenge.otp_hash);
      const supplied = hashOtp(email, otp);
      const matches = expected.length === supplied.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
      if (!matches) {
        await db.execute(sql`UPDATE csca_go_registration_otps SET attempts = attempts + 1 WHERE email = ${email}`);
        return json({ error: "The verification code is incorrect." }, 400);
      }

      const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existing) {
        await db.execute(sql`DELETE FROM csca_go_registration_otps WHERE email = ${email}`);
        return json({ error: "An account with this email already exists. Please sign in." }, 409);
      }
      const phoneOptions = phoneVariants(challenge.phone);
      const existingPhone = await db.execute(sql`
        SELECT id FROM users
        WHERE regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g') IN (${phoneOptions[0]}, ${phoneOptions[1]}, ${phoneOptions[2]}, ${phoneOptions[3]})
        LIMIT 1
      `);
      if (firstRow(existingPhone)) return json({ error: "This phone number is already linked to an account. Contact support if this is your number." }, 409);

      const firstName = String(challenge.first_name);
      const lastName = String(challenge.last_name);
      const referralCode = crypto.randomBytes(4).toString("hex").toUpperCase();
      const inserted = await db.insert(users).values({
        email,
        passwordHash: String(challenge.password_hash),
        firstName,
        lastName,
        name: (firstName + " " + lastName).trim(),
        phone: String(challenge.phone),
        country: String(challenge.country),
        role: "student",
        isActive: true,
        emailVerified: new Date(),
        referralCode,
      }).returning({
        id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName,
        name: users.name, phone: users.phone, country: users.country, image: users.image,
        emailVerified: users.emailVerified, role: users.role,
      });
      const user = inserted[0];
      await db.execute(sql`INSERT INTO csca_go_terms_acceptances(user_id, policy_version, source) VALUES (${user.id}, '2026-10', 'android_app')`);
      await db.execute(sql`DELETE FROM csca_go_registration_otps WHERE email = ${email}`);
      const session = await createMobileSession(String(user.id));
      return json({ success: true, accessToken: session.accessToken, expiresInSeconds: session.expiresInSeconds, user: userPayload(user) }, 201);
    }

    if (action === "login") {
      const identifier = String(body.identifier ?? "").trim();
      const password = String(body.password ?? "");
      if (!identifier || !password) return json({ error: "Enter your email or phone number and password." }, 400);
      const rateIdentifier = identifier.includes("@") ? normalizeEmail(identifier) : Array.from(new Set(phoneVariants(identifier))).sort().join(":");
      if (await isRateLimited("login", rateIdentifier, 10, 900)) return json({ error: "Too many unsuccessful sign-in attempts. Wait 15 minutes and try again." }, 429);
      let user: any = null;
      if (identifier.includes("@")) {
        const email = normalizeEmail(identifier);
        if (!validEmail(email)) return json({ error: "Enter a valid email address." }, 400);
        const [match] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        user = match ?? null;
      } else {
        const digits = normalizePhone(identifier);
        if (digits.length < 7 || digits.length > 15) return json({ error: "Enter a valid email or international phone number." }, 400);
        const phoneOptions = phoneVariants(identifier);
        const result = await db.execute(sql`
          SELECT id, email, password_hash, first_name, last_name, name, phone, country, image, email_verified, role, is_active
          FROM users
          WHERE regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g') IN (${phoneOptions[0]}, ${phoneOptions[1]}, ${phoneOptions[2]}, ${phoneOptions[3]})
          LIMIT 2
        `);
        const matches = rowsOf(result);
        if (matches.length > 1) return json({ error: "This phone number matches more than one account. Please sign in with your email." }, 409);
        user = matches[0] ?? null;
        if (user) {
          user.passwordHash = user.password_hash;
          user.firstName = user.first_name;
          user.lastName = user.last_name;
          user.emailVerified = user.email_verified;
          user.isActive = user.is_active;
        }
      }
      if (!user || !user.passwordHash || !user.isActive || !(await bcrypt.compare(password, String(user.passwordHash)))) {
        await recordRateAttempt("login", rateIdentifier);
        return json({ error: "Invalid email/phone number or password." }, 401);
      }
      if (String(user.role) !== "student") return json({ error: "CSCA Go student login is available for student accounts." }, 403);
      await clearRateAttempts("login", rateIdentifier);
      const session = await createMobileSession(String(user.id));
      return json({ success: true, accessToken: session.accessToken, expiresInSeconds: session.expiresInSeconds, user: userPayload(user) });
    }

    if (action === "logout") {
      const token = bearerToken(request);
      if (token) {
        await db.execute(sql`UPDATE csca_go_mobile_sessions SET revoked_at = now() WHERE token_hash = ${hashToken(token)} AND revoked_at IS NULL`);
      }
      return json({ success: true });
    }

    return json({ error: "Unsupported authentication action." }, 400);
  } catch (error) {
    console.error("[CSCA Go auth] request failed:", error);
    return json({ error: "Authentication service is temporarily unavailable. Please try again." }, 500);
  }
}
