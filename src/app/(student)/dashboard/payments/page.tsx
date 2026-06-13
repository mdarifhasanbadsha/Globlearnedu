import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, payments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getPaymentConfig } from "@/lib/payments/manual";
import PaymentSection from "@/components/dashboard/PaymentSection";
import PaymentSlipUpload from "@/components/dashboard/PaymentSlipUpload";
import { CheckCircle2, Clock, AlertCircle, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_STYLES = {
  paid:    { label: "Paid",        color: "#16A34A", bg: "#F0FDF4", icon: CheckCircle2 },
  pending: { label: "Pending",     color: "#D97706", bg: "#FFFBEB", icon: AlertCircle },
  failed:  { label: "Failed",      color: "#C8102E", bg: "#FEF2F2", icon: AlertCircle },
  refunded:{ label: "Refunded",    color: "#94A3B8", bg: "#F8FAFC", icon: Clock },
} as const;

export default async function PaymentsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  const [paymentConfig, app] = await Promise.all([
    getPaymentConfig(),
    userId
      ? db.query.applications.findFirst({
          where: eq(applications.studentId, userId),
          orderBy: [desc(applications.createdAt)],
        })
      : Promise.resolve(null),
  ]);

  const paymentRows = app
    ? await db.select().from(payments).where(eq(payments.applicationId, app.id))
    : [];

  const totalPaid = paymentRows
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalPending = paymentRows
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const appNumber = app?.applicationNumber ?? "—";
  const waHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8615655031556"}?text=${encodeURIComponent(
    `Hi! I need help with payment for my application ${appNumber}.`
  )}`;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>Payments</h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Application {appNumber} — transparent fee breakdown
        </p>
      </div>

      {/* Summary cards */}
      {paymentRows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#F0FDF4", borderColor: "#16A34A30" }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#16A34A" }}>Paid</p>
            </div>
            <p className="text-2xl font-black" style={{ color: "#166534" }}>¥{totalPaid.toLocaleString()}</p>
            <p className="text-xs mt-1" style={{ color: "#166534" }}>Total confirmed payments</p>
          </div>

          {totalPending > 0 && (
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#FFFBEB", borderColor: "#D9770630" }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} style={{ color: "#D97706" }} />
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#D97706" }}>Pending</p>
              </div>
              <p className="text-2xl font-black" style={{ color: "#92400E" }}>¥{totalPending.toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: "#92400E" }}>Awaiting confirmation</p>
            </div>
          )}
        </div>
      )}

      {/* Payment table */}
      {paymentRows.length > 0 ? (
        <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}>
            <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>Payment history</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {["Type", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paymentRows.map((row) => {
                  const style = STATUS_STYLES[row.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.pending;
                  const Icon = style.icon;
                  return (
                    <tr key={row.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold capitalize" style={{ color: "#1B3A6B" }}>
                          {row.type.replace(/_/g, " ")}
                        </p>
                        {row.manualSlipUrl && (
                          <a href={row.manualSlipUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#29ABE2" }}>
                            View slip
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>
                          ¥{Number(row.amount).toLocaleString()} {row.currency}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: style.bg, color: style.color }}>
                          <Icon size={11} />
                          {style.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs" style={{ color: "#64748B" }}>
                          {row.paidAt ? new Date(row.paidAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : new Date(row.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-5 border text-center" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}>
          <p className="text-sm" style={{ color: "#94A3B8" }}>No payment records yet.</p>
        </div>
      )}

      {/* Deposit required CTA (I2) */}
      {app && app.status === "documents_approved" && !app.depositPaid && (
        <div className="rounded-2xl p-5 border-2" style={{ backgroundColor: "#FFFBEB", borderColor: "#FCD34D" }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FDE68A" }}>
              <AlertCircle size={16} style={{ color: "#92400E" }} />
            </div>
            <div>
              <p className="text-sm font-black mb-1" style={{ color: "#92400E" }}>
                Deposit required — ¥500 RMB
              </p>
              <p className="text-xs" style={{ color: "#A16207" }}>
                Your application has been approved! Please pay the Globlearn Education deposit to begin your university submissions.
                Pay using Alipay, WeChat, or bank transfer below, then upload your receipt.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* How to pay */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <PaymentSection paymentConfig={paymentConfig} />
      </div>

      {/* Upload slip */}
      {app && (
        <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Upload payment slip</p>
          <p className="text-xs" style={{ color: "#64748B" }}>
            After paying, upload your receipt or bank screenshot. Your advisor will confirm within 24 hours.
          </p>
          <PaymentSlipUpload applicationId={app.id} />
        </div>
      )}

      {/* Fee breakdown */}
      <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
        <p className="text-xs font-bold mb-2" style={{ color: "#1B3A6B" }}>About service charges</p>
        <ul className="space-y-1.5 text-xs" style={{ color: "#475569" }}>
          <li>• The total Globlearn Education service charge is ¥4,000 RMB, split into two instalments.</li>
          <li>• The 1st instalment (¥2,000) is due after your documents are approved and before submission.</li>
          <li>• The 2nd instalment (¥2,000) is due upon receiving your admission offer letter.</li>
          <li>• University tuition fees are paid directly to the university after enrolment — not to Globlearn Education.</li>
          <li>• The ¥500 application deposit is deducted from the first service charge instalment.</li>
        </ul>
      </div>

      {/* Contact CTA */}
      <div className="rounded-2xl p-5 border text-center" style={{ backgroundColor: "#FEF2F2", borderColor: "#C8102E20" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "#1B3A6B" }}>Need payment help?</p>
        <p className="text-xs mb-4" style={{ color: "#64748B" }}>
          Contact your advisor for payment instructions or to confirm your preferred method.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageSquare size={16} />
          WhatsApp advisor
        </a>
      </div>
    </div>
  );
}
