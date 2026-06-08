"use client";

import { useState } from "react";
import { Bell, CheckCircle2, CreditCard, FileText, Info } from "lucide-react";

type Category = "Application" | "Payments" | "Documents";
type Filter = "All" | "Unread" | Category;

type Notice = {
  id: number;
  category: Category;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
  color: string;
  bg: string;
};

const INITIAL_NOTICES: Notice[] = [
  {
    id: 1,
    category: "Documents",
    title: "All documents approved ✓",
    message:
      "All required documents have been verified and approved by the Globlearn Education team. Your file is ready for submission.",
    time: "2 days ago",
    read: false,
    icon: CheckCircle2,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    id: 2,
    category: "Application",
    title: "Application submitted to Wuhan University",
    message:
      "Your application has been formally submitted to Wuhan University. The admissions office is now processing your file.",
    time: "5 days ago",
    read: false,
    icon: CheckCircle2,
    color: "#29ABE2",
    bg: "#E0F2FE",
  },
  {
    id: 3,
    category: "Application",
    title: "Application submitted to Jilin University",
    message: "Your application has been formally submitted to Jilin University as your 2nd choice.",
    time: "5 days ago",
    read: false,
    icon: CheckCircle2,
    color: "#29ABE2",
    bg: "#E0F2FE",
  },
  {
    id: 4,
    category: "Payments",
    title: "Service charge invoice ready",
    message:
      "Your service charge invoice of ¥4,000 RMB is ready. The first instalment of ¥2,000 is due by 30 June 2026. Please contact your advisor for payment details.",
    time: "7 days ago",
    read: false,
    icon: CreditCard,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: 5,
    category: "Documents",
    title: "Bank statement under review",
    message:
      "Your bank statement has been received and is currently under review. We will notify you once verification is complete.",
    time: "10 days ago",
    read: true,
    icon: FileText,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: 6,
    category: "Application",
    title: "Application submitted to Sichuan University",
    message: "Your application has been formally submitted to Sichuan University as your 3rd choice.",
    time: "5 days ago",
    read: true,
    icon: CheckCircle2,
    color: "#29ABE2",
    bg: "#E0F2FE",
  },
  {
    id: 7,
    category: "Documents",
    title: "Passport photo approved",
    message: "Your passport-size photo has been reviewed and approved. No further action needed.",
    time: "12 days ago",
    read: true,
    icon: CheckCircle2,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    id: 8,
    category: "Payments",
    title: "Application deposit confirmed — ¥500",
    message:
      "Your application deposit of ¥500 RMB has been confirmed. Your application is now active and being processed.",
    time: "14 days ago",
    read: true,
    icon: CreditCard,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    id: 9,
    category: "Application",
    title: "Your advisor has been assigned",
    message:
      "Your dedicated Globlearn Education advisor is ready to assist you. Reply to this message or WhatsApp us any time.",
    time: "14 days ago",
    read: true,
    icon: Info,
    color: "#1B3A6B",
    bg: "#EEF4FF",
  },
  {
    id: 10,
    category: "Application",
    title: "Welcome to Globlearn Education!",
    message:
      "Thank you for choosing Globlearn Education for your China study journey. Your application (MB20260602001) has been created. We will guide you every step of the way.",
    time: "14 days ago",
    read: true,
    icon: Bell,
    color: "#1B3A6B",
    bg: "#EEF4FF",
  },
];

const FILTERS: Filter[] = ["All", "Unread", "Application", "Payments", "Documents"];

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const unreadCount = notices.filter((n) => !n.read).length;

  function markAllRead() {
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const filtered = notices.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.category === activeFilter;
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>
            Notices
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up ✓"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            style={{ color: "#1B3A6B", backgroundColor: "#EEF4FF" }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => {
          const count = f === "Unread" ? unreadCount : null;
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{
                backgroundColor: active ? "#1B3A6B" : "white",
                color: active ? "white" : "#64748B",
                border: `1px solid ${active ? "#1B3A6B" : "#E2E8F0"}`,
              }}
            >
              {f}
              {count !== null && count > 0 && (
                <span
                  className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={{ backgroundColor: active ? "rgba(255,255,255,0.25)" : "#C8102E", color: "white" }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notices list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={32} className="mx-auto mb-3" style={{ color: "#CBD5E1" }} />
          <p className="text-sm font-semibold" style={{ color: "#94A3B8" }}>
            No notices in this category
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notice) => {
            const Icon = notice.icon;
            return (
              <div
                key={notice.id}
                onClick={() => markRead(notice.id)}
                className="flex gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: notice.read ? "#E2E8F0" : notice.color + "40",
                  backgroundColor: notice.read ? "white" : notice.bg,
                }}
              >
                {/* Unread dot */}
                <div className="flex-shrink-0 mt-1 relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: notice.color + "20" }}
                  >
                    <Icon size={16} style={{ color: notice.color }} />
                  </div>
                  {!notice.read && (
                    <div
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ backgroundColor: "#C8102E" }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className="text-sm leading-snug"
                      style={{ color: "#1B3A6B", fontWeight: notice.read ? 600 : 800 }}
                    >
                      {notice.title}
                    </p>
                    <span className="text-[11px] flex-shrink-0 mt-0.5" style={{ color: "#94A3B8" }}>
                      {notice.time}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
                    {notice.message}
                  </p>
                  <span
                    className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: notice.color + "20", color: notice.color }}
                  >
                    {notice.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
