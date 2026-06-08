import { db } from "./db";
import { settings } from "./db/schema";
import { eq } from "drizzle-orm";

let cache: Record<string, string> = {};
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function getSetting(key: string): Promise<string | null> {
  await refreshCacheIfNeeded();
  return cache[key] ?? null;
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  await refreshCacheIfNeeded();
  return Object.fromEntries(keys.map((k) => [k, cache[k] ?? ""]));
}

export async function updateSetting(key: string, value: string, userId: string): Promise<void> {
  await db
    .update(settings)
    .set({ value, updatedAt: new Date(), updatedBy: userId })
    .where(eq(settings.key, key));
  cache[key] = value;
}

async function refreshCacheIfNeeded() {
  if (Date.now() - cacheTime < CACHE_TTL) return;
  const all = await db.select({ key: settings.key, value: settings.value }).from(settings);
  cache = Object.fromEntries(all.map((s) => [s.key, s.value ?? ""]));
  cacheTime = Date.now();
}
