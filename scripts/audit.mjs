// Full audit: are all built features actually working end to end?
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const BIZ = "18a043a9-0160-4e2f-800a-413f6ff8de6f";
const BASE = "http://localhost:3000";

let pass = 0, fail = 0, warn = 0;
const ok = (n, c, extra = "") => { c ? (pass++, console.log(`  OK    ${n}`)) : (fail++, console.log(`  FAIL  ${n} ${extra}`)); };
const wr = (n, m) => { warn++; console.log(`  WARN  ${n}: ${m}`); };

console.log("=== 1. DATA ===");
const [{ n: msgs }] = await sql`select count(*)::int n from biz_messages where business_id=${BIZ}`;
const [{ n: convs }] = await sql`select count(*)::int n from biz_conversations where business_id=${BIZ}`;
const [{ n: leads }] = await sql`select count(*)::int n from biz_leads where business_id=${BIZ}`;
const [{ n: kn }] = await sql`select count(*)::int n from biz_knowledge_entries where business_id=${BIZ}`;
const [{ n: knOk }] = await sql`select count(*)::int n from biz_knowledge_entries where business_id=${BIZ} and status='approved'`;
const [{ n: style }] = await sql`select count(*)::int n from biz_style_guides where business_id=${BIZ}`;
const [{ n: styleOk }] = await sql`select count(*)::int n from biz_style_guides where business_id=${BIZ} and status='approved'`;
console.log(`  messages=${msgs} conversations=${convs} leads=${leads}`);
console.log(`  knowledge=${kn} (approved ${knOk}) | style guides=${style} (approved ${styleOk})`);
ok("messenger history imported", msgs > 5000, msgs);
ok("knowledge entries exist", kn === 11, kn);
ok("style guide generated", style >= 1, style);
if (knOk === 0) wr("knowledge not approved", "AI cannot cite any university facts yet");
if (styleOk === 0) wr("style not approved", "AI still uses generic tone");

console.log("\n=== 2. DATA INTEGRITY ===");
const [{ n: orphan }] = await sql`
  select count(*)::int n from biz_messages m
  left join biz_conversations c on c.id = m.conversation_id
  where m.business_id=${BIZ} and c.id is null`;
ok("no orphan messages", orphan === 0, orphan);

const [{ n: emptyBody }] = await sql`
  select count(*)::int n from biz_messages where business_id=${BIZ} and trim(body) = ''`;
ok("no empty message bodies", emptyBody === 0, emptyBody);

const [{ n: badDir }] = await sql`
  select count(*)::int n from biz_messages
  where business_id=${BIZ} and direction not in ('in','out')`;
ok("all directions valid", badDir === 0, badDir);

const [{ n: noPeriod }] = await sql`
  select count(*)::int n from biz_knowledge_entries
  where business_id=${BIZ} and tuition_amount is not null and tuition_period is null`;
ok("all tuition has a period", noPeriod === 0, noPeriod);

const [{ n: pastDl }] = await sql`
  select count(*)::int n from biz_knowledge_entries
  where business_id=${BIZ} and application_deadline ~ '202[0-5]'`;
ok("no obviously stale deadlines", pastDl === 0, pastDl);

console.log("\n=== 3. VOICE HANDLING ===");
const [{ n: voice }] = await sql`
  select count(*)::int n from biz_messages where business_id=${BIZ} and media_kind='audio'`;
const [{ n: voicePh }] = await sql`
  select count(*)::int n from biz_messages
  where business_id=${BIZ} and media_kind='audio' and body = '[voice message]'`;
const [{ n: voiceTr }] = await sql`
  select count(*)::int n from biz_messages
  where business_id=${BIZ} and media_kind='audio' and transcript is not null`;
console.log(`  voice messages=${voice}, placeholder body=${voicePh}, transcribed=${voiceTr}`);
ok("voice messages have a placeholder, not empty", voicePh === voice, `${voicePh}/${voice}`);
ok("no fake transcripts", voiceTr === 0, voiceTr);

console.log("\n=== 4. WEBHOOK ===");
const r = await fetch(`${BASE}/api/business/webhooks/meta?hub.mode=subscribe&hub.verify_token=gl_edu_wh_2027&hub.challenge=AUDIT`);
const body = await r.text();
ok("webhook handshake returns challenge", r.status === 200 && body === "AUDIT", `${r.status} ${body.slice(0, 40)}`);

const bad = await fetch(`${BASE}/api/business/webhooks/meta?hub.mode=subscribe&hub.verify_token=WRONG&hub.challenge=X`);
ok("rejects wrong verify token", bad.status === 403, bad.status);

console.log("\n=== 5. PUBLIC CHAT API ===");
const chat = await fetch(`${BASE}/api/public/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "audit ping " + Date.now(), token: "" }),
});
const cj = await chat.json();
ok("public chat reachable without login", chat.status === 200, chat.status);
ok("returns a guest token", typeof cj.token === "string" && cj.token.startsWith("g_"));
if (cj.token) {
  await sql`delete from biz_messages where conversation_id = ${cj.conversationId}`;
  await sql`delete from biz_ai_runs where conversation_id = ${cj.conversationId}`;
  await sql`delete from biz_conversations where id = ${cj.conversationId}`;
}

console.log("\n=== 6. PAGES (unauthenticated must redirect) ===");
for (const p of ["/business", "/business/inbox", "/business/knowledge", "/business/style", "/business/connections"]) {
  const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
  ok(`${p} protected`, res.status === 307 || res.status === 302, res.status);
}

console.log("\n=== 7. EXISTING APP UNTOUCHED ===");
for (const t of ["users", "applications", "universities", "programs"]) {
  const [{ c }] = await sql.query(`select count(*)::int c from ${t}`);
  console.log(`  ${t}: ${c}`);
}
const [{ n: usersN }] = await sql`select count(*)::int n from users`;
ok("users table intact (24)", usersN === 24, usersN);

console.log(`\n=== RESULT: ${pass} ok, ${fail} failed, ${warn} warnings ===`);
process.exit(fail === 0 ? 0 : 1);
