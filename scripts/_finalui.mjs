import { chromium } from "playwright-core";
const CHROME = "C:\\Users\\mdari\\Documents\\deepseek-harness\\default-workspace\\.pw-browsers\\chromium-1243\\chrome-win64\\chrome.exe";
const BASE = "https://globlearnedu.com";

const ctx = await chromium.launchPersistentContext(
  `C:\\Users\\mdari\\Documents\\deepseek-harness\\default-workspace\\_cp_final_${Date.now()}`,
  { executablePath: CHROME, viewport: { width: 1440, height: 1000 } }
);
const page = ctx.pages()[0] ?? (await ctx.newPage());
const errors = [];
const failedReqs = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 500) failedReqs.push(`${r.status()} ${r.url().replace(BASE, "")}`);
});

await page.goto(`${BASE}/sign-in`, { waitUntil: "networkidle" });
await page.fill('input[type="email"]', "business@globlearnedu.com");
await page.fill('input[type="password"]', "Badsha@1234");
await page.click('button[type="submit"]');
await page.waitForTimeout(8000);
console.log("login ->", page.url());

const pages = [
  ["/business", "Dashboard"],
  ["/business/inbox", "Inbox"],
  ["/business/leads", "Leads"],
  ["/business/analytics", "Statistics"],
  ["/business/knowledge", "Universities"],
  ["/business/style", "Brand voice"],
  ["/business/lab", "Test & Train"],
  ["/business/connections", "Channels"],
  ["/business/setup", "Health"],
];

for (const [path, expect] of pages) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const body = await page.locator("body").innerText();
  const ok = body.includes(expect);
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${path.padEnd(22)} (${expect})`);
}

// Health page specifics
await page.goto(`${BASE}/business/setup`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const health = await page.locator("body").innerText();
const missing = health.match(/(\d+) required setting/);
console.log("\nHealth summary:", missing ? `${missing[1]} missing` : "all present");
console.log("lists DEEPSEEK_API_KEY:", /DEEPSEEK_API_KEY/.test(health));
const okCount = (health.match(/\bset\b/gi) ?? []).length;
const missCount = (health.match(/\bmissing\b/gi) ?? []).length;
console.log(`health badges: ${okCount} set, ${missCount} missing`);
await page.screenshot({ path: "final_health.png", fullPage: false });

console.log("\njs errors:", errors.length ? errors.slice(0, 3) : "none");
console.log("5xx responses:", failedReqs.length ? failedReqs.slice(0, 5) : "none");
await ctx.close();
