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

export function generateApplicationNumber(programLevel?: string): string {
  const code = programLevel
    ? (PROGRAM_CODES[programLevel] ?? PROGRAM_CODES["default"])
    : PROGRAM_CODES["default"];
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const serial = String(Math.floor(Math.random() * 900) + 1).padStart(3, "0");
  return `${code}${year}${month}${day}${serial}`;
}
