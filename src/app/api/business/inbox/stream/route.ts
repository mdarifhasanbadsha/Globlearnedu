import { db } from "@/lib/db";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { cursorChanged, formatSseEvent, STREAM_MAX_MS, PING_MS, type StreamCursor } from "@/lib/business/sse";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Snapshot of "what the inbox looks like right now". */
async function snapshot(businessId: string): Promise<StreamCursor> {
  // One query, not two: a single row carrying the newest message plus the
  // conversation count keeps the 3s tick cheap on a free-tier database.
  const [row] = await db.execute(sql`
    select
      (select count(*)::int from biz_conversations where business_id = ${businessId}) as conv_count,
      (select id from biz_messages
        where business_id = ${businessId}
        order by created_at desc limit 1) as latest_id,
      (select created_at from biz_messages
        where business_id = ${businessId}
        order by created_at desc limit 1) as latest_at
  `).then((r: any) => (r.rows ?? r));

  return {
    conversationCount: Number((row as any)?.conv_count ?? 0),
    lastMessageAt: (row as any)?.latest_at
      ? new Date((row as any).latest_at).toISOString()
      : null,
    latestMessageId: (row as any)?.latest_id ?? null,
  };
}

/**
 * Server-Sent Events stream for the inbox.
 *
 * Emits "update" when something changed and "ping" to keep the connection
 * alive. Deliberately checks the database at a slow interval (3s) rather
 * than continuously — this is a low-frequency poll on ONE connection per
 * open inbox, not one request per client per second.
 */
export async function GET(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(formatSseEvent(event, data)));
        } catch {
          closed = true;
        }
      };

      let prev = await snapshot(businessId);
      send("ready", prev);

      const startedAt = Date.now();
      let lastPing = Date.now();

      const tick = async () => {
        if (closed) return;

        // Bounded lifetime: Cloudflare cannot hold a request open forever.
        if (Date.now() - startedAt > STREAM_MAX_MS) {
          send("bye", { reason: "lifetime" });
          closed = true;
          try {
            controller.close();
          } catch {
            /* already closed */
          }
          return;
        }

        try {
          const next = await snapshot(businessId);
          if (cursorChanged(prev, next)) {
            prev = next;
            send("update", next);
          } else if (Date.now() - lastPing > PING_MS) {
            lastPing = Date.now();
            send("ping", { t: lastPing });
          }
        } catch {
          /* transient db error: keep the stream alive */
        }

        if (!closed) setTimeout(tick, 3000);
      };

      setTimeout(tick, 3000);

      // Client went away.
      req.signal?.addEventListener("abort", () => {
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
