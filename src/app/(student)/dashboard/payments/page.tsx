import { CheckCircle2, Clock, AlertCircle, MessageSquare } from "lucide-react";

const PAYMENT_ROWS = [
  {
    description: "Application deposit",
    amount: "¥500",
    status: "paid",
    date: "2 June 2026",
    method: "Bank transfer",
    ref: "DEP-MB20260602001",
  },
  {
    description: "Service charge — 1st instalment",
    amount: "¥2,000",
    status: "due",
    date: "Due 30 June 2026",
    method: "—",
    ref: "SVC-MB20260602001-A",
  },
  {
    description: "Service charge — 2nd instalment",
    amount: "¥2,000",
    status: "pending",
    date: "On admission confirmation",
    method: "—",
    ref: "SVC-MB20260602001-B",
  },
];

const STATUS_STYLES = {
  paid: { label: "Paid", color: "#16A34A", bg: "#F0FDF4", icon: CheckCircle2 },
  due: { label: "Due soon", color: "#D97706", bg: "#FFFBEB", icon: AlertCircle },
  pending: { label: "Not yet due", color: "#94A3B8", bg: "#F8FAFC", icon: Clock },
};

export default function PaymentsPage() {
  const waHref = `https://wa.me/8615655031556?text=${encodeURIComponent(
    "Hi! I need help with payment for my application MB20260602001."
  )}`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>
          Payments
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Application MB20260602001 — transparent fee breakdown
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#F0FDF4", borderColor: "#16A34A30" }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#16A34A" }}>
              Paid
            </p>
          </div>
          <p className="text-2xl font-black" style={{ color: "#166534" }}>
            ¥500
          </p>
          <p className="text-xs mt-1" style={{ color: "#166534" }}>
            Application deposit — confirmed
          </p>
        </div>

        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#FFFBEB", borderColor: "#D9770630" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} style={{ color: "#D97706" }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#D97706" }}>
              Due soon
            </p>
          </div>
          <p className="text-2xl font-black" style={{ color: "#92400E" }}>
            ¥2,000
          </p>
          <p className="text-xs mt-1" style={{ color: "#92400E" }}>
            Service charge 1st instalment — due 30 June 2026
          </p>
        </div>

        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} style={{ color: "#94A3B8" }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
              On admission
            </p>
          </div>
          <p className="text-2xl font-black" style={{ color: "#475569" }}>
            ¥2,000
          </p>
          <p className="text-xs mt-1" style={{ color: "#64748B" }}>
            Service charge 2nd instalment — due after offer letter
          </p>
        </div>
      </div>

      {/* Payment table */}
      <div className="bg-white border rounded-2xl overflow-hidden mb-6" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}>
          <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>
            Payment history &amp; schedule
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                {["Description", "Amount", "Status", "Date", "Reference"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "#94A3B8" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENT_ROWS.map((row) => {
                const style = STATUS_STYLES[row.status as keyof typeof STATUS_STYLES];
                const StatusIcon = style.icon;
                return (
                  <tr key={row.ref} style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold" style={{ color: "#1B3A6B" }}>
                        {row.description}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>
                        {row.amount}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        <StatusIcon size={11} />
                        {style.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs" style={{ color: "#64748B" }}>
                        {row.date}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-mono" style={{ color: "#94A3B8" }}>
                        {row.ref}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-2xl p-5 border mb-6" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
        <p className="text-xs font-bold mb-2" style={{ color: "#1B3A6B" }}>
          About service charges
        </p>
        <ul className="space-y-1.5 text-xs" style={{ color: "#475569" }}>
          <li>• The total Globlearn Education service charge is ¥4,000 RMB, split into two instalments.</li>
          <li>• The 1st instalment (¥2,000) is due after your documents are approved and before submission.</li>
          <li>• The 2nd instalment (¥2,000) is due upon receiving your admission offer letter.</li>
          <li>• University tuition fees are paid directly to the university after enrolment — not to Globlearn Education.</li>
          <li>• The ¥500 application deposit is deducted from the first service charge instalment.</li>
        </ul>
      </div>

      {/* Pay now CTA */}
      <div className="rounded-2xl p-5 border text-center" style={{ backgroundColor: "#FEF2F2", borderColor: "#C8102E20" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "#1B3A6B" }}>
          Ready to pay the service charge?
        </p>
        <p className="text-xs mb-4" style={{ color: "#64748B" }}>
          Contact your advisor to receive payment instructions and confirm your preferred method.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageSquare size={16} />
          WhatsApp to pay
        </a>
      </div>
    </div>
  );
}
