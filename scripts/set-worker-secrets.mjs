#!/usr/bin/env node
/**
 * One-time setup: put every runtime secret on the deployed Worker.
 *
 * Why this is needed: this project deploys with `wrangler deploy`, and
 * wrangler.jsonc is the source of truth for vars. Values added only in
 * the Cloudflare dashboard are not carried by a deploy and can vanish.
 * `wrangler secret put` writes to the Worker itself and survives.
 *
 * Usage:  node scripts/set-worker-secrets.mjs
 *   (prompts for each value; press Enter to skip one you already have)
 */

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFileSync, existsSync } from "node:fs";

const WORKER = "globlearnedu";

const SECRETS = [
  {
    name: "DEEPSEEK_API_KEY",
    hint: "sk-...  (the AI replies stop working without this)",
    required: true,
  },
  { name: "META_PAGE_ACCESS_TOKEN", hint: "EAAP... from Messenger > Settings > Generate Token" },
  { name: "META_APP_SECRET", hint: "Meta > Settings > Basic > App Secret" },
  {
    name: "CREDENTIALS_ENCRYPTION_KEY",
    hint: "64 hex chars; set once, never change",
  },
  { name: "NEXTAUTH_SECRET", hint: "64 hex chars; leave blank if login already works" },
  { name: "DATABASE_URL", hint: "Neon connection string; leave blank if the DB already works" },
];

function fromEnvLocal(name) {
  if (!existsSync(".env.local")) return null;
  const line = readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(name + "="));
  return line ? line.slice(name.length + 1).trim() : null;
}

const rl = createInterface({ input: stdin, output: stdout });

console.log(`\nSetting secrets on Worker "${WORKER}".`);
console.log("Press Enter to skip a value.\n");

let failed = 0;

for (const s of SECRETS) {
  const local = fromEnvLocal(s.name);
  const offered = local ? `  (found in .env.local — press Enter to use it)` : "";
  const answer = (
    await rl.question(`${s.name}${offered}\n  ${s.hint}\n> `)
  ).trim();

  const value = answer || local;
  if (!value) {
    if (s.required) {
      console.log(`  SKIPPED ${s.name} — this one is required!\n`);
    } else {
      console.log(`  skipped ${s.name}\n`);
    }
    continue;
  }

  const res = spawnSync(
    "npx",
    ["wrangler", "secret", "put", s.name, "--name", WORKER],
    { input: value + "\n", encoding: "utf8", shell: true, stdio: ["pipe", "pipe", "pipe"] }
  );

  if (res.status === 0) {
    console.log(`  set ${s.name}\n`);
  } else {
    failed++;
    console.log(`  FAILED ${s.name}`);
    console.log(`    ${(res.stderr || res.stdout || "").split("\n")[0]}`);
    console.log(`    run manually: npx wrangler secret put ${s.name} --name ${WORKER}\n`);
  }
}

rl.close();

console.log("Verify with:  npx wrangler secret list --name " + WORKER);
if (failed) console.log(`${failed} secret(s) need manual setup.`);
