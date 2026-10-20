// Build leads from imported conversation history, score and categorise them.
// Idempotent: re-running updates existing leads instead of duplicating.
import { neon } from "@neondatabase/serverless";
import { extractSignals, assessLead } from "../src/lib/business/lead-score.ts";

const sql = neon(process.env.DATABASE_URL);
const BIZ = "18a043a9-0160-4e2f-800a-413f6ff8de6f";

const convs = await sql`
  select c.id, c.visitor_id, c.channel, c.last_message_at,
         (select full_name from biz_leads l where l.conversation_id = c.id limit 1) as existing_name
  from biz_conversations c
  where c.business_id = ${BIZ}
  order by c.last_message_at desc`;

console.log(`conversations to analyse: ${convs.length}`);

let created = 0, updated = 0;
const tally = { hot: 0, warm: 0, cold: 0, ignore: 0 };
const categories = new Map();

for (const c of convs) {
  const msgs = await sql`
    select direction, author_kind, body, created_at
    from biz_messages where conversation_id = ${c.id} order by created_at`;

  if (msgs.length === 0) continue;

  const signals = extractSignals(
    msgs.map((m) => ({
      direction: m.direction,
      authorKind: m.author_kind,
      body: m.body ?? "",
      createdAt: new Date(m.created_at),
    }))
  );

  const a = assessLead(signals);
  tally[a.priority]++;
  categories.set(a.category, (categories.get(a.category) ?? 0) + 1);

  const lastInbound = signals.inboundCount > 0 ? new Date() : null;
  const nextAt =
    a.nextActionInDays == null
      ? null
      : new Date(Date.now() + a.nextActionInDays * 86_400_000);

  const existing = await sql`
    select id from biz_leads where business_id = ${BIZ} and conversation_id = ${c.id} limit 1`;

  const values = {
    score: a.score,
    priority: a.priority,
    category: a.category,
    reasoning: a.reasoning,
    nextAction: a.nextAction,
    nextActionAt: nextAt,
    ignored: a.ignored,
    ignoreReason: a.ignoreReason,
    hasContact: signals.hasContact,
    contactChannel: signals.contactChannel,
    inboundCount: signals.inboundCount,
    intentSignals: JSON.stringify({
      fee: signals.askedFee,
      scholarship: signals.askedScholarship,
      visa: signals.askedVisa,
      apply: signals.askedApply,
      mbbs: signals.askedMBBS,
      language: signals.askedLanguage,
      degree: signals.askedDegree,
    }),
  };

  if (existing.length > 0) {
    await sql`update biz_leads set
        score=${values.score}, priority=${values.priority}, category=${values.category},
        reasoning=${values.reasoning}, next_action=${values.nextAction},
        next_action_at=${values.nextActionAt}, ignored=${values.ignored},
        ignore_reason=${values.ignoreReason}, has_contact=${values.hasContact},
        contact_channel=${values.contactChannel}, inbound_count=${values.inboundCount},
        intent_signals=${values.intentSignals}::jsonb, updated_at=now()
      where id=${existing[0].id}`;
    updated++;
  } else {
    // Stage follows priority so the pipeline view is meaningful immediately.
    const stage =
      a.priority === "hot" ? "qualified"
      : a.priority === "warm" ? "profile_pending"
      : a.priority === "ignore" ? "closed"
      : "new";

    await sql`insert into biz_leads
        (business_id, conversation_id, source, stage, score, priority, category,
         reasoning, next_action, next_action_at, ignored, ignore_reason,
         has_contact, contact_channel, inbound_count, intent_signals)
      values (${BIZ}, ${c.id}, ${c.channel === "messenger" ? "messenger_import" : "website_chat"},
        ${stage}, ${values.score}, ${values.priority}, ${values.category},
        ${values.reasoning}, ${values.nextAction}, ${values.nextActionAt},
        ${values.ignored}, ${values.ignoreReason}, ${values.hasContact},
        ${values.contactChannel}, ${values.inboundCount}, ${values.intentSignals}::jsonb)`;
    created++;
  }
}

console.log(`\ncreated ${created}, updated ${updated}`);
console.log("by priority:", JSON.stringify(tally));
console.log("by category:", JSON.stringify(Object.fromEntries(categories), null, 1));

const top = await sql`
  select category, priority, score, inbound_count, has_contact, reasoning
  from biz_leads where business_id=${BIZ} and priority='hot'
  order by score desc limit 5`;
console.log("\nsample hot leads:");
for (const t of top) {
  console.log(`  [${t.score}] ${t.category} · ${t.inbound_count} msgs · contact=${t.has_contact}`);
  console.log(`      ${t.reasoning.slice(0, 110)}`);
}
