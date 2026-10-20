import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// Small shared UI kit for /business. Server-safe (no hooks).
// ─────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-[#0F2A52]">{title}</h1>
        {subtitle && <p className="text-sm text-slate-600 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const TONES = {
  good: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warn: "bg-amber-50 text-amber-900 border-amber-200",
  bad: "bg-red-50 text-red-800 border-red-200",
  info: "bg-sky-50 text-sky-900 border-sky-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
} as const;

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: keyof typeof TONES;
}) {
  const body = (
    <div className="bg-white rounded-xl border border-slate-200 p-4 h-full hover:border-[#29ABE2] transition-colors">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-[#0F2A52] mt-1 tabular-nums">{value}</div>
      {hint && (
        <div className="mt-1.5">
          <Pill tone={tone}>{hint}</Pill>
        </div>
      )}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function Card({
  title,
  action,
  children,
  padded = true,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {(title || action) && (
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
          {title && <h2 className="font-semibold text-[#0F2A52] text-sm">{title}</h2>}
          {action}
        </div>
      )}
      <div className={padded ? "p-4" : ""}>{children}</div>
    </section>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="p-10 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {hint && <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{hint}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Alert({
  tone = "warn",
  children,
}: {
  tone?: "good" | "warn" | "bad" | "info";
  children: React.ReactNode;
}) {
  const map = {
    good: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    bad: "border-red-200 bg-red-50 text-red-800",
    info: "border-sky-200 bg-sky-50 text-sky-900",
  } as const;
  return (
    <div className={`rounded-lg border px-3.5 py-2.5 text-sm ${map[tone]}`} role="status">
      {children}
    </div>
  );
}
