// ─────────────────────────────────────────────────────────────
// Messenger contact profile sync.
//
// Meta already returns the person's real name and profile picture; we
// simply never asked. This resolves a PSID into a human identity and
// records where the conversation came from.
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizConversations } from "@/lib/db/schema.business";
import { eq, and } from "drizzle-orm";

export interface ProfileResult {
  ok: boolean;
  name?: string | null;
  picture?: string | null;
  locale?: string | null;
  error?: string;
}

function token(): string | null {
  const t = process.env.META_PAGE_ACCESS_TOKEN?.trim();
  return t && t.length > 0 ? t : null;
}

function graph(): string {
  const v = process.env.META_GRAPH_VERSION?.trim() || "v23.0";
  return `https://graph.facebook.com/${v}`;
}

/**
 * Resolve a conversation's participant identity.
 *
 * Thread ids are stored as `t_<psid>` and the `t_` prefix is REQUIRED by
 * the Graph API — stripping it returns "object does not exist". The name
 * comes from the thread's participants, and the PSID from that same
 * participant list; only then can we ask for a profile picture.
 */
export async function fetchProfile(threadOrPsid: string): Promise<ProfileResult> {
  const t = token();
  if (!t) return { ok: false, error: "NO_TOKEN" };

  try {
    let psid: string | null = null;
    let name: string | null = null;

    if (threadOrPsid.startsWith("t_")) {
      const res = await fetch(
        `${graph()}/${encodeURIComponent(threadOrPsid)}?fields=participants&access_token=${t}`,
        { signal: AbortSignal.timeout(12_000) }
      );
      const json: any = await res.json();
      if (!res.ok) {
        return { ok: false, error: json?.error?.message ?? `HTTP ${res.status}` };
      }

      const pageId = process.env.META_PAGE_ID ?? "";
      const other = (json?.participants?.data ?? []).find(
        (p: any) => p?.id && p.id !== pageId
      );
      if (!other) return { ok: false, error: "no participant found" };
      psid = other.id;
      name = other.name ?? null;
    } else {
      psid = threadOrPsid;
    }

    // Now that we have the PSID, try to enrich with picture and locale.
    let picture: string | null = null;
    let locale: string | null = null;

    if (psid) {
      try {
        const pr = await fetch(
          `${graph()}/${encodeURIComponent(psid)}?fields=name,profile_pic,locale&access_token=${t}`,
          { signal: AbortSignal.timeout(10_000) }
        );
        const pj: any = await pr.json();
        if (pr.ok) {
          name = pj?.name ?? name;
          picture = pj?.profile_pic ?? null;
          locale = pj?.locale ?? null;
        }
      } catch {
        /* name from participants is enough */
      }
    }

    return { ok: !!name, name, picture, locale };
  } catch (e: any) {
    return { ok: false, error: e?.name === "TimeoutError" ? "timeout" : (e?.message ?? "network") };
  }
}

/**
 * Read where this conversation started.
 * Referral data only exists on the live event, so this uses whatever
 * Meta can still tell us for the thread.
 */
export async function fetchConversationSource(threadId: string): Promise<{
  kind: string | null;
  ref: string | null;
  postId: string | null;
  adId: string | null;
  url: string | null;
}> {
  const t = token();
  if (!t) return { kind: null, ref: null, postId: null, adId: null, url: null };

  try {
    const res = await fetch(
      `${graph()}/${encodeURIComponent(threadId)}/messages?limit=1&fields=referral&access_token=${t}`,
      { signal: AbortSignal.timeout(12_000) }
    );
    const json: any = await res.json();
    const ref = json?.data?.[0]?.referral;

    if (!ref) return { kind: null, ref: null, postId: null, adId: null, url: null };

    return {
      kind: ref.source ?? ref.type ?? "unknown",
      ref: ref.ref ?? null,
      postId: ref.post_id ?? null,
      adId: ref.ad_id ?? null,
      url: ref.source_url ?? null,
    };
  } catch {
    return { kind: null, ref: null, postId: null, adId: null, url: null };
  }
}

/** Sync and persist a conversation's identity. */
export async function syncConversationProfile(
  businessId: string,
  conversationId: string
): Promise<{ ok: boolean; name?: string | null; error?: string }> {
  const [conv] = await db
    .select({
      id: bizConversations.id,
      visitorId: bizConversations.visitorId,
      channel: bizConversations.channel,
    })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, conversationId)))
    .limit(1);

  if (!conv || conv.channel !== "messenger") {
    return { ok: false, error: "not a messenger conversation" };
  }

  const profile = await fetchProfile(conv.visitorId);
  if (!profile.ok) {
    return { ok: false, error: profile.error };
  }

  await db
    .update(bizConversations)
    .set({
      contactName: profile.name ?? null,
      contactPicture: profile.picture ?? null,
      contactLocale: profile.locale ?? null,
      profileSyncedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(bizConversations.id, conv.id));

  return { ok: true, name: profile.name };
}

/** Turn a webhook referral object into stored source fields. */
export function referralFields(referral: any): Record<string, unknown> {
  if (!referral || typeof referral !== "object") return {};
  return {
    sourceKind: (referral.source ?? referral.type ?? "unknown").slice(0, 30),
    sourceRef: typeof referral.ref === "string" ? referral.ref.slice(0, 200) : null,
    sourceAdId: typeof referral.ad_id === "string" ? referral.ad_id.slice(0, 100) : null,
    sourcePostId: typeof referral.post_id === "string" ? referral.post_id.slice(0, 100) : null,
    sourceUrl: typeof referral.source_url === "string" ? referral.source_url : null,
  };
}
