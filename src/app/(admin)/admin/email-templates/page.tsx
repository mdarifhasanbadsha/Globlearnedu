import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Edit2, Mail, Zap, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import SeedButton from "./_SeedButton";

export const dynamic = "force-dynamic";

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  Auth:        { bg: "#EEF4FF", color: "#1B3A6B" },
  Application: { bg: "#DCFCE7", color: "#166534" },
  Admission:   { bg: "#FEF9C3", color: "#854D0E" },
  Payment:     { bg: "#DBEAFE", color: "#1E40AF" },
  Partner:     { bg: "#F5F3FF", color: "#5B21B6" },
  Visa:        { bg: "#FFEDD5", color: "#9A3412" },
};

export default async function EmailTemplatesPage() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    redirect("/sign-in");
  }

  const templates = await db
    .select()
    .from(emailTemplates)
    .orderBy(desc(emailTemplates.updatedAt));

  const activeCount = templates.filter(t => t.isActive).length;

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Email Templates</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {templates.length} templates · {activeCount} active
          </p>
        </div>
        {templates.length === 0 && (
          <form action="/api/admin/email-templates" method="POST">
            <button
              formAction="/api/admin/email-templates"
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              <RefreshCw size={14} />
              Load default templates
            </button>
          </form>
        )}
      </div>

      {/* Seed notice */}
      {templates.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: "#E2E8F0" }}>
          <Mail size={40} className="mx-auto mb-4" style={{ color: "#CBD5E1" }} />
          <p className="text-base font-bold mb-2" style={{ color: "#1B3A6B" }}>No email templates yet</p>
          <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>
            Seed the 13 default templates to get started. You can then edit any template to customise the copy.
          </p>
          {/* Client-side seed button */}
          <SeedButton />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                  {["Template name", "Trigger event", "Category", "Recipients", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {templates.map((t, i) => {
                  const cat = CAT_COLORS[t.category ?? ""] ?? { bg: "#F1F5F9", color: "#64748B" };
                  return (
                    <tr
                      key={t.id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: i < templates.length - 1 ? "1px solid #F8FAFC" : "none" }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EEF4FF" }}>
                            <Mail size={13} style={{ color: "#1B3A6B" }} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: "#0A1628" }}>{t.name}</p>
                            <p className="text-[11px] truncate max-w-[220px]" style={{ color: "#94A3B8" }}>{t.subject}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <code className="text-[11px] px-2 py-0.5 rounded" style={{ backgroundColor: "#F1F5F9", color: "#475569" }}>
                          {t.triggerEvent ?? "—"}
                        </code>
                        {t.isAutoTrigger && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#FEF9C3", color: "#854D0E" }}>
                            <Zap size={9} />auto
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {t.category ? (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: cat.bg, color: cat.color }}>
                            {t.category}
                          </span>
                        ) : <span style={{ color: "#CBD5E1" }}>—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-[11px]" style={{ color: "#64748B" }}>
                        {[t.sendToStudent && "Student", t.sendToPartner && "Partner"].filter(Boolean).join(" + ") || "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        {t.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: "#166534" }}>
                            <CheckCircle2 size={12} />Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: "#94A3B8" }}>
                            <XCircle size={12} />Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/email-templates/${t.id}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 size={13} style={{ color: "#64748B" }} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3" style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              {templates.length} templates loaded · Changes take effect immediately
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

