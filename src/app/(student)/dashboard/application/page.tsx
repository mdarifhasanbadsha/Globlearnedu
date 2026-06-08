import Link from "next/link";
import { ArrowRight, Clock, MessageSquare } from "lucide-react";

const TOTAL_STAGES = 14;
const CURRENT_STAGE = 5;

const APP = {
  appId: "MB20260602001",
  submittedDate: "2 June 2026",
  stageName: "Application submitted to universities",
  stageDesc:
    "Your file has been sent to Wuhan University, Jilin University, and Sichuan University. Admissions offices typically respond within 4–8 weeks.",
};

function Section({
  title,
  waMessage,
  items,
  actionHref,
  actionLabel,
}: {
  title: string;
  waMessage?: string;
  items: { label: string; value: string }[];
  actionHref?: string;
  actionLabel?: string;
}) {
  const action = waMessage ? (
    <a
      href={`https://wa.me/8615655031556?text=${encodeURIComponent(waMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
      style={{ color: "#C8102E", backgroundColor: "#FEF2F2" }}
    >
      <MessageSquare size={12} />
      Request change
    </a>
  ) : actionHref ? (
    <Link
      href={actionHref}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
      style={{ color: "#1B3A6B", backgroundColor: "#EEF4FF" }}
    >
      {actionLabel} <ArrowRight size={12} />
    </Link>
  ) : null;

  return (
    <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}
      >
        <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>
          {title}
        </p>
        {action}
      </div>
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#94A3B8" }}>
              {item.label}
            </p>
            <p className="text-sm font-medium" style={{ color: item.value ? "#1B3A6B" : "#CBD5E1" }}>
              {item.value || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ApplicationPage() {
  const progress = Math.round((CURRENT_STAGE / TOTAL_STAGES) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>
          My Application
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Submitted application — {APP.appId}
        </p>
      </div>

      {/* Status banner */}
      <div
        className="rounded-2xl p-6 mb-8 text-white"
        style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0A1628 100%)" }}
      >
        <div className="flex flex-wrap items-start gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} style={{ opacity: 0.6 }} />
              <span className="text-xs font-semibold" style={{ opacity: 0.6 }}>
                Submitted {APP.submittedDate}
              </span>
            </div>
            <p className="text-base font-black">{APP.appId}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-semibold mb-0.5" style={{ opacity: 0.6 }}>
              Current stage
            </p>
            <p className="text-2xl font-black">
              {CURRENT_STAGE}
              <span className="text-sm font-medium" style={{ opacity: 0.6 }}>
                {" / "}{TOTAL_STAGES}
              </span>
            </p>
          </div>
        </div>

        <div className="h-2 rounded-full mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: "#FFD700" }}
          />
        </div>

        <p className="text-sm font-bold mb-1" style={{ color: "#FFD700" }}>
          Stage {CURRENT_STAGE}: {APP.stageName}
        </p>
        <p className="text-xs leading-relaxed" style={{ opacity: 0.7 }}>
          {APP.stageDesc}
        </p>

        <div className="mt-5">
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            View full 14-stage pipeline <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Data sections */}
      <div className="space-y-4">
        <Section
          title="Program & Universities"
          waMessage="Hi! I'd like to request a change to my program or university selection. My application ID is MB20260602001."
          items={[
            { label: "Funding type", value: "CSC Government Scholarship" },
            { label: "Degree level", value: "MBBS / Medicine" },
            { label: "1st choice", value: "Wuhan University — MBBS (English)" },
            { label: "2nd choice", value: "Jilin University — MBBS (English)" },
            { label: "3rd choice", value: "Sichuan University — Clinical Medicine (MBBS)" },
          ]}
        />

        <Section
          title="Personal Information"
          waMessage="Hi! I'd like to update my personal information. My application ID is MB20260602001."
          items={[
            { label: "Surname", value: "RAHMAN" },
            { label: "Given names", value: "AHMED FARHAN" },
            { label: "Date of birth", value: "15 March 2002" },
            { label: "Gender", value: "Male" },
            { label: "Nationality", value: "Bangladesh" },
            { label: "Passport number", value: "BK1234567" },
            { label: "Passport expiry", value: "20 January 2030" },
            { label: "Marital status", value: "Single" },
          ]}
        />

        <Section
          title="Contact Details"
          waMessage="Hi! I'd like to update my contact details. My application ID is MB20260602001."
          items={[
            { label: "WhatsApp", value: "+880 1712 345678" },
            { label: "Email", value: "ahmed.rahman@gmail.com" },
            { label: "Street address", value: "45 Green Road, Dhaka 1000" },
            { label: "Country of residence", value: "Bangladesh" },
            { label: "Emergency contact", value: "Fatima Rahman (Mother)" },
            { label: "Emergency phone", value: "+880 1987 654321" },
          ]}
        />

        <Section
          title="Family & Sponsor"
          waMessage="Hi! I'd like to update my family or sponsor details. My application ID is MB20260602001."
          items={[
            { label: "Father's name", value: "Mohammed Rahman" },
            { label: "Father's occupation", value: "Government Officer" },
            { label: "Mother's name", value: "Fatima Rahman" },
            { label: "Mother's occupation", value: "Homemaker" },
            { label: "Sponsor", value: "Parent" },
            { label: "Income range", value: "$15,000 – $30,000 USD / year" },
          ]}
        />

        <Section
          title="Academic Background"
          waMessage="Hi! I'd like to update my academic details. My application ID is MB20260602001."
          items={[
            { label: "Qualification", value: "Higher Secondary Certificate (HSC)" },
            { label: "Institution", value: "Dhaka College" },
            { label: "Field of study", value: "Science" },
            { label: "Country", value: "Bangladesh" },
            { label: "Grade / GPA", value: "5.0 / 5.0" },
            { label: "Year completed", value: "2022" },
          ]}
        />

        <Section
          title="Language Proficiency"
          waMessage="Hi! I'd like to update my language proficiency details. My application ID is MB20260602001."
          items={[
            { label: "English test", value: "IELTS" },
            { label: "Score", value: "6.5" },
            { label: "Test date", value: "May 2025" },
            { label: "Chinese proficiency", value: "Not applicable" },
          ]}
        />

        <Section
          title="China Status"
          waMessage="Hi! I need to update my China status information. My application ID is MB20260602001."
          items={[
            { label: "Currently in China", value: "No" },
            { label: "Visa process", value: "Will apply from home country after offer letter" },
          ]}
        />

        {/* Documents card */}
        <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}
          >
            <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>
              Documents
            </p>
            <Link
              href="/dashboard/documents"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ color: "#1B3A6B", backgroundColor: "#EEF4FF" }}
            >
              Manage documents <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-5 py-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                style={{ backgroundColor: "#16A34A" }}
              >
                7
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
                  7 documents uploaded
                </p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>
                  All 7 required documents approved ✓
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help CTA */}
      <div
        className="mt-8 p-5 rounded-2xl border text-center"
        style={{ borderColor: "#25D36630", backgroundColor: "#F0FDF4" }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: "#166534" }}>
          Need to update something in your application?
        </p>
        <a
          href={`https://wa.me/8615655031556?text=${encodeURIComponent(
            "Hi! I'd like to make a change to my application MB20260602001."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageSquare size={16} />
          WhatsApp your advisor
        </a>
      </div>
    </div>
  );
}
