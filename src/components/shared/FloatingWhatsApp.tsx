"use client";

import { MessageCircle } from "lucide-react";

const WA_HREF =
  "https://wa.me/8615655031556?text=" +
  encodeURIComponent(
    "Hi! 👋 I found Globlearn Education and I'm interested in studying in China. Can you help me?",
  );

export default function FloatingWhatsApp() {
  return (
    <div
      data-floating-whatsapp
      className="csca-floating-whatsapp fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2 md:bottom-8"
    >
      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all hover:scale-110 hover:bg-[#1ea952]"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="text-white" />
      </a>
      <span className="pointer-events-none absolute inset-0 h-14 w-14 rounded-full bg-[#25D366] opacity-30 animate-ping" />
    </div>
  );
}
