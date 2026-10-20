import { db } from "@/lib/db";
import { bizChannelConnections } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { CHANNELS, channelEnvReady } from "@/lib/business/channels";
import { eq } from "drizzle-orm";
import ConnectionsClient from "./_ConnectionsClient";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage() {
  const businessId = getBusinessId();

  const rows = await db
    .select({
      channel: bizChannelConnections.channel,
      displayName: bizChannelConnections.displayName,
      status: bizChannelConnections.status,
      lastError: bizChannelConnections.lastError,
      lastCheckedAt: bizChannelConnections.lastCheckedAt,
    })
    .from(bizChannelConnections)
    .where(eq(bizChannelConnections.businessId, businessId));

  const byChannel = new Map(rows.map((r) => [r.channel, r]));

  const channels = CHANNELS.map((spec) => {
    const existing = byChannel.get(spec.key);
    return {
      key: spec.key,
      label: spec.label,
      icon: spec.icon,
      description: spec.description,
      docsUrl: spec.docsUrl,
      blocker: spec.blocker,
      manualFields: spec.manualFields.map((f) => ({
        key: f.key,
        label: f.label,
        placeholder: f.placeholder ?? "",
        secret: f.secret ?? false,
      })),
      envReady: channelEnvReady(spec),
      // website is always available; others need credentials
      status: existing?.status ?? (spec.key === "website" ? "connected" : "disconnected"),
      displayName: existing?.displayName ?? null,
      lastError: existing?.lastError ?? null,
      lastCheckedAt: existing?.lastCheckedAt?.toISOString() ?? null,
    };
  });

  return <ConnectionsClient channels={channels} />;
}
