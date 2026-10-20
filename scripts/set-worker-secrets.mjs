#!/usr/bin/env node
/**
 * Set the Worker's secrets permanently.
 *
 * Why this exists: this project deploys with `wrangler deploy`, so
 * wrangler.jsonc is the source of truth. Variables added only in the
 * dashboard can disappear on the next deploy. Secrets set with
 * `wrangler secret put` are stored on the Worker itself and survive.
 *
 * Usage (run from the repo root, in your own terminal):
 *   node scripts/set-worker-secrets.mjs
 *
 * You will be prompted for each value; nothing is written to disk.
 */

import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const WORKER = "globlearnedu";

const SECRETS = [
  { name: "META_PAGE_ACCESS_TOKEN", hint: "Meta > Messenger > Settings > Generate Token (EAAP...)" },
  { name: "META_APP_SECRET", hint: "Meta > Settings > Basic > App Secret" },
  { name: "DEEPSEEK_API_KEY", hint: "sk-... (leave blank to keep the existing one)" },
  { name: "CREDENTIALS_ENCRYPTION_KEY", hint: "64-char hex, run once and never change" },
  { name: "NEXTAUTH_SECRET", hint: "64-char hex (leave blank to keep existing)" },
];

const rl = createInterface({ input: stdin, output: stdout });

console.log(`Setting secrets on Worker "${WORKER}".`);
console.log("Press Enter to skip any value you want to leave unchanged.\n");

for (const s of SECRETS) {
  const value = (await rl.question(`${s.name}\n  (${s.hint})\n> `)).trim();
  if (!value) {
    console.log(`  skipped ${s.name}\n`);
    continue;
  }
  try {
    execFileSync(
      "npx",
      ["wrangler", "secret", "put", s.name, "--name", WORKER],
      { input: value, stdio: ["pipe", "inherit", "inherit"], shell: true }
    );
    console.log(`  set ${s.name}\n`);
  } catch {
    console.log(`  FAILED ${s.name} - run manually: npx wrangler secret put ${s.name} --name ${WORKER}\n`);
  }
}

rl.close();
console.log("Done. Verify with: npx wrangler secret list --name " + WORKER);
