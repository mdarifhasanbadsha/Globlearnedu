"use client";
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const WA_HREF = "https://wa.me/8615655031556?text=" + encodeURIComponent("Hi! 👋 I found Globlearn Education and I'm interested in studying in China. Can you help me?");

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShowTooltip(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  function dismiss() {
    setShowTooltip(false);
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 z-50 flex flex-col items-end gap-2">
      {/* Tooltip bubble */}
      {showTooltip && !dismissed && (
        <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-[220px] border border-gray-100">
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X size={12} />
          </button>
          <p className="text-xs font-semibold text-[#1B3A6B] mb-1">💬 Need help choosing?</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our team replies in under 5 minutes on WhatsApp — ask anything!
          </p>
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="mt-2 block text-center text-xs font-bold text-white bg-[#25D366] rounded-lg py-1.5 hover:bg-[#1ea952] transition-colors"
          >
            Chat now →
          </a>
        </div>
      )}

      {/* Main button */}
      <div className="relative">
        <a
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setShowTooltip(false)}
          className="relative z-10 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1ea952] transition-all hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} className="text-white" />
        </a>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
      </div>
    </div>
  );
}
