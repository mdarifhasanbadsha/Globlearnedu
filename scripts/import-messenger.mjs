// ─────────────────────────────────────────────────────────────
// Messenger history importer.
//
// Pulls conversations + messages from the Graph API into biz_* tables.
// Idempotent: re-running does not duplicate messages (external_id key).
// Voice notes are downloaded and queued for local transcription.
//
// Usage:
//   node --env-file=.env.local scripts/import-messenger.mjs [--limit N]
// ─────────────────────────────────────────────────────────────

import { neon } from "@neondatabase/serverless";
import { writeFileSync, mkdirSync } from "node:fs";

const TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.META_PAGE_ID;
const VERSION = process.env.META_GRAPH_VERSION ?? "v23.0";
const BIZ = "18a043a9-0160-4e2f-800a-413f6ff8de6f";
const G = `https://graph.facebook.com/${VERSION}`;

if (!TOKEN || !PAGE_ID) {
  console.error("META_PAGE_ACCESS_TOKEN and META_PAGE_ID are required");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const argLimit = process.argv.indexOf("--limit");
const LIMIT = argLimit > -1 ? Number(process.argv[argLimit + 1]) : Infinity;

mkdirSync("scratch_voice", { recursive: true });

const [run] = await sql`
  insert into biz_import_runs (business_id, channel, status)
  values (${BIZ}, 'messenger', 'running') returning id`;
console.log("import run:", run.id);

let convSeen = 0, convCreated = 0, msgImported = 0, msgSkipped = 0;
let voiceFound = 0;
const voiceQueue = [];

async function get(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      continue;
    }
    const j = await res.json().catch(() => ({}));
    throw new Error(`${res.status}: ${j?.error?.message ?? "unknown"}`);
  }
  throw new Error("retries exhausted");
}

// 1. Walk all conversations
let convUrl = `${G}/${PAGE_ID}/conversations?limit=50&fields=id,updated_time&access_token=${TOKEN}`;
const conversations = [];
while (convUrl) {
  const j = await get(convUrl);
  conversations.push(...(j.data ?? []));
  convUrl = j.paging?.next ?? null;
}
console.log(`conversations discovered: ${conversations.length}`);

for (const conv of conversations) {
  if (convSeen >= LIMIT) break;
  convSeen++;

  const threadId = conv.id; // e.g. t_1234 (participant-scoped thread id)

  // Find or create the conversation row keyed on the thread id.
  let [row] = await sql`
    select id from biz_conversations
    where business_id = ${BIZ} and channel = 'messenger' and visitor_id = ${threadId}
    limit 1`;

  if (!row) {
    [row] = await sql`
      insert into biz_conversations
        (business_id, visitor_id, channel, status, ai_state, subject)
      values (${BIZ}, ${threadId}, 'messenger', 'open', 'paused', 'Imported Messenger thread')
      returning id`;
    convCreated++;
  }

  const convId = row.id;

  // 2. Walk messages in this thread
  let mUrl =
    `${G}/${threadId}/messages?limit=100` +
    `&fields=id,message,from,created_time,attachments&access_token=${TOKEN}`;

  while (mUrl) {
    let mj;
    try {
      mj = await get(mUrl);
    } catch (e) {
      console.log(`  skip thread ${threadId}: ${e.message}`);
      break;
    }

    for (const m of mj.data ?? []) {
      const body = (m.message ?? "").trim();
      const atts = m.attachments?.data ?? [];
      const audio = atts.find((a) => {
        const url = a.file_url ?? a.payload?.url ?? a.video_data?.url ?? "";
        return /audio|voice|\.mp4\/audioclip|audioclip/i.test(`${a.mime_type ?? ""} ${url}`);
      });

      if (!body && !audio) {
        msgSkipped++;
        continue;
      }

      // Media-aware dedupe key.
      const externalId = m.id ? `${threadId}:${m.id}` : null;

      if (externalId) {
        const [dupe] = await sql`
          select id from biz_messages
          where business_id = ${BIZ} and external_id = ${externalId} limit 1`;
        if (dupe) { msgSkipped++; continue; }
      }

      const fromName = m.from?.name ?? "";
      const fromId = m.from?.id ?? "";
      const isPage = fromId === PAGE_ID || /globlearn/i.test(fromName);

      const mediaUrl = audio ? (audio.file_url ?? audio.payload?.url ?? audio.video_data?.url) : null;

      await sql`
        insert into biz_messages
          (business_id, conversation_id, direction, author_kind, body,
           created_at, media_url, media_kind, external_id, meta)
        values (
          ${BIZ}, ${convId}, ${isPage ? "out" : "in"}, ${isPage ? "staff" : "student"},
          ${body || "[voice message]"}, ${m.created_time ? new Date(m.created_time) : new Date()},
          ${mediaUrl}, ${audio ? "audio" : null}, ${externalId},
          ${JSON.stringify({ source: "messenger_import", from: fromName || fromId }) }::jsonb
        )`;
      msgImported++;

      if (mediaUrl) {
        voiceFound++;
        voiceQueue.push({ url: mediaUrl, convId, externalId });
      }
    }

    mUrl = mj.paging?.next ?? null;
  }

  if (convSeen % 25 === 0) {
    console.log(`  ...${convSeen}/${conversations.length} threads, ${msgImported} messages`);
  }
}

// Refresh last_message_at so the inbox sorts sensibly.
await sql`
  update biz_conversations c set last_message_at = coalesce(
    (select max(created_at) from biz_messages m where m.conversation_id = c.id), c.created_at)
  where c.business_id = ${BIZ} and c.channel = 'messenger'`;

console.log(`\nimported: ${msgImported} messages, skipped ${msgSkipped}, new threads ${convCreated}`);
console.log(`voice messages: ${voiceFound}`);

// Download voice files for transcription.
const manifest = [];
for (const [i, v] of voiceQueue.entries()) {
  try {
    const res = await fetch(v.url);
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    const file = `scratch_voice/voice_${String(i + 1).padStart(3, "0")}.m4a`;
    writeFileSync(file, buf);
    manifest.push({ file, externalId: v.externalId, bytes: buf.length });
  } catch {
    /* skip unreadable audio */
  }
}
writeFileSync("scratch_voice/manifest.json", JSON.stringify(manifest, null, 1));
console.log(`downloaded ${manifest.length} voice files for transcription`);

await sql`
  update biz_import_runs set
    status = 'completed', finished_at = now(),
    conversations_seen = ${convSeen}, conversations_created = ${convCreated},
    messages_imported = ${msgImported}, messages_skipped = ${msgSkipped},
    voice_found = ${voiceFound}
  where id = ${run.id}`;

console.log("done");
