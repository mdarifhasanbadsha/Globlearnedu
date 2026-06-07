import { MessageCircle } from "lucide-react";

export const WA_NUMBER = "8615655031556";

export function buildWALink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface WhatsAppButtonProps {
  message?: string;
  label?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function WhatsAppButton({
  message = "Hello, I want to know about studying in China with Globlearn Education.",
  label = "WhatsApp us — 24/7",
  fullWidth,
  size = "md",
}: WhatsAppButtonProps) {
  const href = buildWALink(message);
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 ${sizes[size]} font-semibold text-white bg-[#25D366] hover:bg-[#1ea952] rounded-lg transition-colors ${fullWidth ? "w-full" : ""}`}
    >
      <MessageCircle size={16} />
      {label}
    </a>
  );
}
