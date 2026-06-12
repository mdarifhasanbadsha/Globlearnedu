import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatCurrency(amount: number, currency = "CNY"): string {
  if (currency === "CNY") return `¥${amount.toLocaleString()}`;
  return `$${amount.toLocaleString()}`;
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export const PROGRAM_CODES: Record<string, string> = {
  "mbbs": "MD",
  "bachelor": "B",
  "master": "M",
  "phd": "P",
  "language": "L",
  "diploma": "D",
  "foundation": "F",
  "short_course": "S",
  // legacy slug keys kept for public page compatibility
  "mbbs-medicine": "MD",
  "bachelors-degree": "B",
  "masters-degree": "M",
  "phd-program": "P",
  "chinese-language": "L",
  "diploma-vocational": "D",
  "foundation-pre-university": "F",
  "short-course-exchange": "S",
  "default": "G",
};

// ── University description cleaner ──────────────────────────────────────────

function generateDescriptionFallback(d: {
  nameEn: string;
  nameCn?: string | null;
  city?: string | null;
  province?: string | null;
  tier?: string;
}): string {
  const tier = d.tier || "leading";
  const location = [d.city, d.province].filter(Boolean).join(", ");
  return `${d.nameEn}${d.nameCn ? ` (${d.nameCn})` : ""} is a ${tier} university located in ${location || "China"}. International students can apply for various degree programs with scholarship opportunities including CSC, university, and provincial scholarships. Contact Globlearn Education to learn about admission requirements, tuition fees, and available English-taught programs.`;
}

export function cleanDescription(
  desc: string | null | undefined,
  fallbackData: { nameEn: string; nameCn?: string | null; city?: string | null; province?: string | null; tier?: string }
): string {
  if (!desc) return generateDescriptionFallback(fallbackData);
  // Strip long runs of CJK characters (20+ consecutive = scraped Chinese text)
  const cjkBlockRegex = /[一-鿿　-〿＀-￯]{20,}/g;
  let cleaned = desc.replace(cjkBlockRegex, "").trim();
  // Clean up multiple spaces and orphaned punctuation left by CJK removal
  cleaned = cleaned.replace(/\s+/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();
  if (cleaned.length < 80) return generateDescriptionFallback(fallbackData);
  return cleaned;
}

export async function generateApplicationNumber(programLevel?: string): Promise<string> {
  const code = programLevel
    ? (PROGRAM_CODES[programLevel] ?? PROGRAM_CODES["default"])
    : PROGRAM_CODES["default"];
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const prefix = `${code}${year}${month}${day}`;
  const { getNextSerial } = await import("@/lib/db/sequences");
  const serial = String(await getNextSerial(prefix)).padStart(3, "0");
  return `${prefix}${serial}`;
}
