// Backfill names and photos for existing Messenger threads (rate-limited).
import { neon } from "@neondatabase/serverless";
import { fetchProfile } from "../src/lib/business/profile.ts";

const sql = neon(process.env.DATABASE_URL);
const BIZ = "18a043a9-0160-4e2f-800a-413f6ff8de6f";

const convs = await sql`
  select id, visitor_id from biz_conversations
  where business_id = ${BIZ} and channel = 'messenger'
    and (contact_name is null or contact_name = '')
  order by last_message_at desc
  limit 600`;

console.log(`threads needing a profile: ${convs.length}`);

let ok = 0, failed = 0;
const errors = new Map();

for (const [i, c] of convs.entries()) {
  const p = await fetchProfile(c.visitor_id);

  if (p.ok && p.name) {
    await sql`update biz_conversations set
        contact_name = ${p.name},
        contact_picture = ${p.picture ?? null},
        contact_locale = ${p.locale ?? null},
        profile_synced_at = now()
      where id = ${c.id}`;
    ok++;
  } else {
    failed++;
    const key = p.error ?? "unknown";
    errors.set(key, (errors.get(key) ?? 0) + 1);
  }

  if ((i + 1) % 50 === 0) {
    console.log(`  ${i + 1}/${convs.length} — resolved ${ok}, failed ${failed}`);
  }

  // Be polite to the Graph API.
  await new Promise((r) => setTimeout(r, 60));
}

console.log(`\nresolved ${ok}, failed ${failed}`);
if (errors.size) {
  console.log("failure reasons:");
  for (const [k, v] of errors) console.log(`  ${v}x ${k.slice(0, 90)}`);
}

const [{ n: named }] = await sql`
  select count(*)::int n from biz_conversations
  where business_id=${BIZ} and channel='messenger' and contact_name is not null`;
const [{ n: total }] = await sql`
  select count(*)::int n from biz_conversations
  where business_id=${BIZ} and channel='messenger'`;
console.log(`\nnamed: ${named}/${total} messenger threads`);
