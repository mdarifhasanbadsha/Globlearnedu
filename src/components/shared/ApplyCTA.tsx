import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";

interface ApplyCTAProps {
  title?: string;
  subtitle?: string;
  program?: string;
}

export default function ApplyCTA({
  title = "Ready to apply?",
  subtitle =
    "Globlearn Education guides you from application to arrival — scholarships, visa, and beyond.",
  program,
}: ApplyCTAProps) {
  return (
    <section className="bg-[#0A1628] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
          Globlearn Education
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{title}</h2>
        <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={program ? `/dashboard/apply?program=${program}` : "/dashboard/apply"}
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
          >
            Start my application — Affordable Cost
          </Link>
          <WhatsAppButton size="lg" label="Ask us on WhatsApp" />
        </div>
        <p className="text-white/40 text-xs mt-6">
          Service charge paid only after successful admission · Transparent fees · No hidden charges
        </p>
      </div>
    </section>
  );
}
