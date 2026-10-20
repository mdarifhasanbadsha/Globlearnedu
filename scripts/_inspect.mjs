// Comprehensive production inspection.
const BASE = "https://globlearnedu.com";
const results = [];
const add = (area, name, ok, detail = "") => {
  results.push({ area, name, ok, detail });
  console.log(`  ${ok ? "PASS" : "FAIL"}  [${area}] ${name}${detail ? " — " + detail : ""}`);
};

console.log("=== PUBLIC SURFACE ===");
{
  const r = await fetch(BASE);
  const html = await r.text();
  add("public", "homepage 200", r.status === 200, r.status);
  add("public", "chat widget present", /Chat with GL Education|gl_chat_token/.test(html));
}

console.log("\n=== AI CHAT ===");
let token = null;
{
  const r = await fetch(`${BASE}/api/public/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "vai language program er fee koto?", token: "" }),
  });
  const j = await r.json();
  token = j.token;
  add("ai", "responds 200", r.status === 200, r.status);
  add("ai", "AI enabled", j.aiEnabled === true);
  add("ai", "reply non-empty", (j.reply ?? "").length > 20, `${(j.reply ?? "").length} chars`);
  add("ai", "cards present", (j.cards ?? []).length > 0, `${(j.cards ?? []).length} cards`);
  add("ai", "fee includes period", /per semester|per year|per month/i.test(j.cards?.[0]?.tuitionLabel ?? ""), j.cards?.[0]?.tuitionLabel ?? "");
  add("ai", "quick replies", (j.quickReplies ?? []).length > 0, `${(j.quickReplies ?? []).length} chips`);
  add("ai", "typingMs bounded", typeof j.typingMs === "number" && j.typingMs >= 0 && j.typingMs <= 14000, `${j.typingMs}ms`);
  add("ai", "no invented fee for unknown", !/tsinghua/i.test(j.reply ?? "") || !/\d{3,}/.test(j.reply ?? ""));
}

console.log("\n=== CONVERSATION CONTINUITY ===");
if (token) {
  const r2 = await fetch(`${BASE}/api/public/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "deadline kobe?", token }),
  });
  const j2 = await r2.json();
  add("chat", "second turn replies", (j2.reply ?? "").length > 10, `${(j2.reply ?? "").length} chars`);
  add("chat", "same conversation", j2.conversationId !== undefined);

  const h = await fetch(`${BASE}/api/public/chat?token=${token}`).then((x) => x.json());
  add("chat", "history restores", h.found === true && (h.messages ?? []).length >= 2, `${(h.messages ?? []).length} msgs`);
}
{
  const h = await fetch(`${BASE}/api/public/chat?token=g_${"0".repeat(32)}`).then((x) => x.json());
  add("chat", "unknown token blocked", (h.messages ?? []).length === 0);
}

console.log("\n=== WEBHOOK & SECURITY ===");
{
  const ok = await fetch(`${BASE}/api/business/webhooks/meta?hub.mode=subscribe&hub.verify_token=gl_edu_wh_2027&hub.challenge=OK`).then((x) => x.text());
  add("webhook", "handshake echoes challenge", ok === "OK", ok.slice(0, 40));

  const bad = await fetch(`${BASE}/api/business/webhooks/meta?hub.mode=subscribe&hub.verify_token=WRONG&hub.challenge=OK`);
  add("webhook", "wrong token rejected", bad.status === 403, bad.status);

  const unsigned = await fetch(`${BASE}/api/business/webhooks/meta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ object: "page", entry: [] }),
  });
  add("webhook", "unsigned POST rejected (401)", unsigned.status === 401, unsigned.status);
  if (unsigned.status === 503) add("webhook", "META_APP_SECRET missing", false, "503 = secret not set");
}

console.log("\n=== PROTECTED AREAS ===");
for (const p of ["/business", "/business/inbox", "/business/leads", "/business/knowledge", "/business/lab", "/business/analytics", "/business/setup"]) {
  const r = await fetch(BASE + p, { redirect: "manual" });
  add("auth", `${p} redirects`, r.status === 307 || r.status === 302, r.status);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
if (failed.length) {
  console.log("\nFAILURES:");
  for (const f of failed) console.log(`  [${f.area}] ${f.name}: ${f.detail}`);
}
process.exit(failed.length === 0 ? 0 : 1);
