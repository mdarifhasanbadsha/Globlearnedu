// ─────────────────────────────────────────────────────────────
// Live inbox stream (Server-Sent Events).
//
// One long-lived connection per open inbox instead of polling. The
// browser asks "tell me when something changes"; we answer only when it
// does, so an idle inbox costs nothing and a busy one is instant.
//
// Cloudflare Workers must not hold a connection open indefinitely, so the
// stream closes itself after a bounded lifetime and the browser
// reconnects automatically (EventSource does this natively).
// ─────────────────────────────────────────────────────────────

export const STREAM_MAX_MS = 45_000;
export const PING_MS = 10_000;

export interface StreamCursor {
  conversationCount: number;
  lastMessageAt: string | null;
  latestMessageId: string | null;
}

/** Has anything changed since the browser last asked? */
export function cursorChanged(prev: StreamCursor, next: StreamCursor): boolean {
  return (
    prev.conversationCount !== next.conversationCount ||
    prev.lastMessageAt !== next.lastMessageAt ||
    prev.latestMessageId !== next.latestMessageId
  );
}

export function formatSseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}
