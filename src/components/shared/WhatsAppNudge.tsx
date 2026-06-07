interface WhatsAppNudgeProps {
  message: string;
  label: string;
}

export default function WhatsAppNudge({ message, label }: WhatsAppNudgeProps) {
  const encoded = encodeURIComponent(message);
  return (
    <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3 my-6">
      <span className="text-2xl flex-shrink-0">💬</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#166534]">{label}</p>
        <p className="text-xs text-[#15803D]">Reply in under 5 minutes · 24/7</p>
      </div>
      <a
        href={`https://wa.me/8615655031556?text=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#1ea952] transition-colors"
      >
        Ask now
      </a>
    </div>
  );
}
