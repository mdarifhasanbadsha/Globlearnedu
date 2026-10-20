// Verify everything on the LIVE site after deploy.
const BASE = "https://globlearnedu.com";
let pass = 0, fail = 0;
const check = (n, c, extra = "") => {
  if (c) { pass++; console.log(`  PASS  ${n}`); }
  else { fail++; console.log(`  FAIL  ${n} ${extra}`); }
};

const t0 = Date.now();
const r = await fetch(`${BASE}/api/public/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "language program er fee koto?", token: "" }),
});
const j = await r.json();
const elapsed = Date.now() - t0;

console.log("aiEnabled:", j.aiEnabled, "| modelMs:", j.modelMs, "| typingMs:", j.typingMs);
console.log("reply:", (j.reply ?? "").slice(0, 160));
console.log("cards:", JSON.stringify(j.cards?.[0] ?? null));
console.log("chips:", (j.quickReplies ?? []).map((q) => q.label).join(" | "));
console.log("elapsed:", elapsed, "ms");

check("AI is live", j.aiEnabled === true);
check("reply present", (j.reply ?? "").length > 20);
check("cards returned", Array.isArray(j.cards) && j.cards.length > 0, j.cards?.length);
check("fee has period", /per semester|per year|per month/i.test(j.cards?.[0]?.tuitionLabel ?? ""), j.cards?.[0]?.tuitionLabel);
check("quick replies returned", (j.quickReplies ?? []).length > 0);
check("typingMs is a number", typeof j.typingMs === "number");

if (j.token) {
  const h = await fetch(`${BASE}/api/public/chat?token=${j.token}`);
  const hj = await h.json();
  check("history restores", hj.found === true && (hj.messages ?? []).length > 0);
}

const h2 = await fetch(`${BASE}/api/public/chat?token=g_${"0".repeat(32)}`).then((x) => x.json());
check("unknown token blocked", (h2.messages ?? []).length === 0);

const wh = await fetch(`${BASE}/api/business/webhooks/meta?hub.mode=subscribe&hub.verify_token=gl_edu_wh_2027&hub.challenge=X`).then((x) => x.text());
check("webhook still verified", wh === "X", wh.slice(0, 30));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
