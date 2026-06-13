"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Mail, MessageSquare, Info, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

type Notice = {
  id: string;
  title: string;
  message: string;
  channel: string;
  isRead: boolean | null;
  applicationId?: string | null;
  createdAt: Date | string;
};

type Props = { notices: Notice[] };

type Filter = "all" | "unread";

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function dateGroup(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff <= 7) return "This Week";
  if (diff <= 30) return "This Month";
  return "Earlier";
}

function iconAndColor(channel: string) {
  switch (channel) {
    case "email":     return { icon: Mail,         color: "#1E40AF", bg: "#DBEAFE" };
    case "whatsapp":  return { icon: MessageSquare, color: "#166534", bg: "#F0FDF4" };
    case "in_portal": return { icon: Bell,          color: "#1B3A6B", bg: "#EEF4FF" };
    default:          return { icon: Info,           color: "#1B3A6B", bg: "#EEF4FF" };
  }
}

export default function NoticesClient({ notices }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(notices.filter((n) => n.isRead).map((n) => n.id))
  );
  const [markingAll, setMarkingAll] = useState(false);

  // Auto-mark all as read when page is opened, then refresh layout to clear sidebar badge
  useEffect(() => {
    const hasUnread = notices.some((n) => !n.isRead);
    if (!hasUnread) return;
    setReadIds(new Set(notices.map((n) => n.id)));
    fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    }).then(() => router.refresh()).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadCount = notices.filter((n) => !readIds.has(n.id)).length;

  const displayed = filter === "unread"
    ? notices.filter((n) => !readIds.has(n.id))
    : notices;

  async function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
    } catch { /* ignore — optimistic update already applied */ }
  }

  async function markAllRead() {
    setMarkingAll(true);
    const unread = notices.filter((n) => !readIds.has(n.id)).map((n) => n.id);
    setReadIds(new Set(notices.map((n) => n.id)));
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: unread }),
      });
    } catch { /* ignore */ }
    setMarkingAll(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#1B3A6B" }}>Notices</h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"} · {notices.length} total
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "unread"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-bold capitalize border-2 transition-all"
              style={{
                borderColor: filter === f ? "#1B3A6B" : "#E2E8F0",
                backgroundColor: filter === f ? "#1B3A6B" : "white",
                color: filter === f ? "white" : "#64748B",
              }}
            >
              {f === "all" ? `All (${notices.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
              style={{ borderColor: "#BBF7D0", backgroundColor: "#F0FDF4", color: "#166534" }}
            >
              <Check size={11} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notices list */}
      {displayed.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: "#E2E8F0" }}>
          <Bell size={36} className="mx-auto mb-3" style={{ color: "#CBD5E1" }} />
          <p className="text-base font-bold" style={{ color: "#1B3A6B" }}>
            {filter === "unread" ? "No unread notices" : "No notices yet"}
          </p>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            {filter === "unread"
              ? "You're all caught up! Switch to All to see previous notices."
              : "Application updates and important messages will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {(["Today", "This Week", "This Month", "Earlier"] as const).map(group => {
            const groupItems = displayed.filter(n => dateGroup(n.createdAt) === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3 px-1" style={{ color: "#94A3B8" }}>{group}</p>
                <div className="space-y-2.5">
                  {groupItems.map((notice) => {
                    const isRead = readIds.has(notice.id);
                    const { icon: Icon, color, bg } = iconAndColor(notice.channel);
                    return (
                      <div
                        key={notice.id}
                        className="bg-white rounded-2xl border p-5 transition-all"
                        style={{ borderColor: isRead ? "#E2E8F0" : "#1B3A6B30", backgroundColor: isRead ? "white" : "#F8FAFF" }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                            <Icon size={18} style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-bold leading-snug" style={{ color: "#1B3A6B" }}>
                                {!isRead && (
                                  <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle" style={{ backgroundColor: "#C8102E" }} />
                                )}
                                {notice.title}
                              </p>
                              <span className="text-[11px] flex-shrink-0" style={{ color: "#94A3B8" }}>
                                {timeAgo(notice.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#475569" }}>{notice.message}</p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {notice.applicationId && (
                                <Link
                                  href="/dashboard/application"
                                  className="flex items-center gap-1 text-xs font-semibold"
                                  style={{ color: "#1B3A6B" }}
                                >
                                  <ExternalLink size={10} />View application
                                </Link>
                              )}
                              {!isRead && (
                                <button
                                  onClick={() => markRead(notice.id)}
                                  className="flex items-center gap-1 text-xs font-semibold"
                                  style={{ color: "#64748B" }}
                                >
                                  <Check size={11} />Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
