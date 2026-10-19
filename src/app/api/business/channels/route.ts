import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizChannelConnections } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { getChannel } from "@/lib/business/channels";
import { encryptCredentials, isEncryptionConfigured } from "@/lib/business/crypto";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Save channel credentials.
 * We store them encrypted and mark the channel NEEDS_RECONNECT by default —
 * a channel only becomes "connected" after an external check succeeds.
 */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const channelKey = typeof payload?.channel === "string" ? payload.channel : "";
  const spec = getChannel(channelKey);
  if (!spec) return NextResponse.json({ error: "Unknown channel" }, { status: 400 });

  if (spec.manualFields.length === 0) {
    return NextResponse.json(
      { error: `${spec.label} requires no credentials.` },
      { status: 400 }
    );
  }

  const incoming = payload?.credentials;
  if (!incoming || typeof incoming !== "object") {
    return NextResponse.json({ error: "credentials object required" }, { status: 400 });
  }

  // Keep only declared fields, and require the non-optional ones.
  const clean: Record<string, string> = {};
  for (const f of spec.manualFields) {
    const v = incoming[f.key];
    if (typeof v === "string" && v.trim().length > 0) clean[f.key] = v.trim();
  }

  if (Object.keys(clean).length === 0) {
    return NextResponse.json({ error: "No credential values provided" }, { status: 400 });
  }

  if (!isEncryptionConfigured()) {
    return NextResponse.json(
      {
        error:
          "CREDENTIALS_ENCRYPTION_KEY is not set, so credentials cannot be stored safely. " +
          "Add a 64-character hex key to the environment first.",
      },
      { status: 503 }
    );
  }

  const businessId = getBusinessId();
  const encrypted = await encryptCredentials(clean);

  const existing = await db
    .select({ id: bizChannelConnections.id })
    .from(bizChannelConnections)
    .where(
      and(
        eq(bizChannelConnections.businessId, businessId),
        eq(bizChannelConnections.channel, channelKey)
      )
    )
    .limit(1);

  // Credentials alone are not proof of a working connection.
  const values = {
    businessId,
    channel: channelKey,
    credentialsEnc: encrypted,
    status: "needs_reconnect",
    lastError: "Credentials saved but not yet verified against the provider.",
    lastCheckedAt: new Date(),
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db
      .update(bizChannelConnections)
      .set(values)
      .where(eq(bizChannelConnections.id, existing[0].id));
  } else {
    await db.insert(bizChannelConnections).values(values);
  }

  return NextResponse.json({
    ok: true,
    verified: false,
    note:
      "Not verified. A live check requires the Meta app to be approved; until then the " +
      "channel stays in needs_reconnect and is not used for sending.",
  });
}

/** Disconnect a channel and erase its stored credentials. */
export async function DELETE(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { searchParams } = new URL(req.url);
  const channelKey = searchParams.get("channel") ?? "";
  if (!getChannel(channelKey)) {
    return NextResponse.json({ error: "Unknown channel" }, { status: 400 });
  }

  const businessId = getBusinessId();
  await db
    .delete(bizChannelConnections)
    .where(
      and(
        eq(bizChannelConnections.businessId, businessId),
        eq(bizChannelConnections.channel, channelKey)
      )
    );

  return NextResponse.json({ ok: true });
}
