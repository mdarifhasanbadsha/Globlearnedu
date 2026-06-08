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

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `APP-${year}-${random}`;
}

export const PROGRAM_CODES: Record<string, string> = {
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
