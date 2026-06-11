"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Globe, Trash2, Loader2, CheckCircle2, AlertCircle,
  ChevronDown, ChevronUp, Eye
} from "lucide-react";

type Status = "draft" | "in_review" | "published" | "scheduled";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featuredImageUrl: string | null;
  category: string | null;
  tags: unknown;
  status: Status;
  readingTimeMinutes: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
};

type Props = {
  post?: Post;
};

const CATEGORIES = ["Scholarships", "Admissions", "Visa", "Universities", "Programs", "Student Life", "News", "MBBS", "Scholarships Guide"];

const INPUT = "w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors";
const STYLE = { borderColor: "#E2E8F0" };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 200);
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>{label}</label>
      {children}
      {hint && <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>{hint}</p>}
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full px-6 py-4 text-left"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <span className="text-sm font-bold" style={{ color: "#0A1628" }}>{title}</span>
        {open ? <ChevronUp size={15} style={{ color: "#94A3B8" }} /> : <ChevronDown size={15} style={{ color: "#94A3B8" }} />}
      </button>
      {open && <div className="p-6 space-y-4">{children}</div>}
    </div>
  );
}

export default function BlogPostEditor({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featuredImageUrl ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tags, setTags] = useState(Array.isArray(post?.tags) ? (post.tags as string[]).join(", ") : "");
  const [status, setStatus] = useState<Status>(post?.status ?? "draft");
  const [readingTime, setReadingTime] = useState(String(post?.readingTimeMinutes ?? ""));
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(post?.metaDescription ?? "");
  const [focusKw, setFocusKw] = useState(post?.focusKeyword ?? "");

  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  // Auto-slug from title for new posts
  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  // Auto reading time from content word count
  useEffect(() => {
    if (content && !readingTime) {
      const words = content.trim().split(/\s+/).length;
      setReadingTime(String(Math.max(1, Math.round(words / 200))));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function buildPayload(overrideStatus?: Status) {
    return {
      title,
      slug,
      excerpt,
      content,
      featuredImageUrl,
      category,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      status: overrideStatus ?? status,
      readingTimeMinutes: readingTime ? Number(readingTime) : null,
      metaTitle,
      metaDescription: metaDesc,
      focusKeyword: focusKw,
    };
  }

  async function save(overrideStatus?: Status) {
    if (!title.trim()) { showToast("error", "Title is required."); return; }
    setSaving(true);
    try {
      const payload = buildPayload(overrideStatus);
      const res = await fetch(
        isEdit ? `/api/admin/blog/${post.id}` : "/api/admin/blog",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error ?? "Save failed"); return; }

      if (overrideStatus) setStatus(overrideStatus);
      showToast("success", overrideStatus === "published" ? "Post published!" : "Saved.");
      if (!isEdit && data.post?.id) {
        router.push(`/admin/blog/${data.post.id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/blog/${post!.id}`, { method: "DELETE" });
      router.push("/admin/blog");
    } finally {
      setDeleting(false);
    }
  }

  const statusBadge: Record<Status, { label: string; bg: string; color: string }> = {
    draft:      { label: "Draft",     bg: "#F1F5F9", color: "#64748B" },
    in_review:  { label: "In Review", bg: "#FEF9C3", color: "#854D0E" },
    published:  { label: "Published", bg: "#DCFCE7", color: "#166534" },
    scheduled:  { label: "Scheduled", bg: "#DBEAFE", color: "#1E40AF" },
  };
  const badge = statusBadge[status];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-50"
            style={{ borderColor: "#E2E8F0" }}
          >
            <ArrowLeft size={15} style={{ color: "#64748B" }} />
          </Link>
          <div>
            <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>
              {isEdit ? "Edit post" : "New post"}
            </h1>
            {isEdit && (
              <p className="text-xs mt-0.5 font-mono" style={{ color: "#94A3B8" }}>
                {post.slug}
              </p>
            )}
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {isEdit && status === "published" && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-gray-50"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}
            >
              <Eye size={13} />
              View live
            </Link>
          )}
          {isEdit && (
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors"
              style={{ borderColor: "#FECACA", backgroundColor: "#FEF2F2", color: "#C8102E" }}
            >
              <Trash2 size={13} />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => save()}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-colors"
            style={{ borderColor: "#1B3A6B", backgroundColor: "white", color: "#1B3A6B" }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save draft
          </button>
          {status !== "published" && (
            <button
              type="button"
              onClick={() => save("published")}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors"
              style={{ backgroundColor: "#C8102E" }}
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
              Publish
            </button>
          )}
          {status === "published" && (
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-colors"
              style={{ borderColor: "#E2E8F0", backgroundColor: "white", color: "#64748B" }}
            >
              Unpublish
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-semibold"
          style={
            toast.type === "success"
              ? { backgroundColor: "#DCFCE7", borderColor: "#86EFAC", color: "#166534" }
              : { backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }
          }
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Core fields */}
      <Section title="Post Details">
        <Field label="Title *">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={INPUT}
            style={STYLE}
            placeholder="e.g. How to Apply for CSC Scholarship in 2026"
          />
        </Field>
        <Field label="Slug (URL path)" hint="Auto-generated from title. Edit to customise.">
          <div className="flex gap-2">
            <span className="flex items-center px-3 text-xs rounded-l-xl border border-r-0" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0", color: "#94A3B8" }}>
              /blog/
            </span>
            <input
              type="text"
              value={slug}
              onChange={e => { setSlugManual(true); setSlug(slugify(e.target.value)); }}
              className="flex-1 border rounded-r-xl px-4 py-2.5 text-sm font-mono bg-white focus:outline-none focus:border-[#29ABE2]"
              style={{ borderColor: "#E2E8F0" }}
              placeholder="my-post-slug"
            />
          </div>
        </Field>
        <Field label="Excerpt / Summary" hint="Shown on blog list and in search results. 150–200 characters.">
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            className={`${INPUT} resize-none`}
            style={STYLE}
            rows={3}
            placeholder="Brief summary of the post…"
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category">
            <select value={category} onChange={e => setCategory(e.target.value)} className={INPUT} style={{ ...STYLE, color: "#475569" }}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Reading time (minutes)">
            <input
              type="number"
              min={1}
              max={60}
              value={readingTime}
              onChange={e => setReadingTime(e.target.value)}
              className={INPUT}
              style={STYLE}
              placeholder="e.g. 8"
            />
          </Field>
        </div>
        <Field label="Tags" hint="Comma-separated, e.g. CSC Scholarship, MBBS, Visa Guide">
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className={INPUT}
            style={STYLE}
            placeholder="CSC Scholarship, MBBS, Visa, China 2026"
          />
        </Field>
        <Field label="Featured image URL" hint="Paste a direct image URL (https://...). Leave blank if no image.">
          <input
            type="url"
            value={featuredImageUrl}
            onChange={e => setFeaturedImageUrl(e.target.value)}
            className={INPUT}
            style={STYLE}
            placeholder="https://example.com/image.jpg"
          />
        </Field>
      </Section>

      {/* Content */}
      <Section title="Post Content">
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>Body</label>
          <p className="text-[11px] mb-2" style={{ color: "#94A3B8" }}>
            Write plain text or HTML. Use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a href=""&gt;, etc.
          </p>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className={`${INPUT} resize-y font-mono text-xs leading-relaxed`}
            style={{ ...STYLE, minHeight: "400px" }}
            placeholder={`<h2>Introduction</h2>\n<p>Your opening paragraph here...</p>\n\n<h2>Section Title</h2>\n<p>Section content...</p>`}
          />
          {content && (
            <p className="text-[11px] mt-1.5" style={{ color: "#94A3B8" }}>
              ~{content.trim().split(/\s+/).length} words · ~{Math.max(1, Math.round(content.trim().split(/\s+/).length / 200))} min read
            </p>
          )}
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO & Meta" defaultOpen={false}>
        <Field label="Meta title" hint="Leave blank to use the post title. Max 60 characters.">
          <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className={INPUT} style={STYLE} placeholder={title || "Post title"} maxLength={60} />
          <p className="text-[11px] mt-1" style={{ color: metaTitle.length > 55 ? "#C8102E" : "#94A3B8" }}>{metaTitle.length}/60</p>
        </Field>
        <Field label="Meta description" hint="Shown in Google results. Max 160 characters.">
          <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} className={`${INPUT} resize-none`} style={STYLE} rows={2} placeholder={excerpt || "Short description for search engines…"} maxLength={160} />
          <p className="text-[11px] mt-1" style={{ color: metaDesc.length > 150 ? "#C8102E" : "#94A3B8" }}>{metaDesc.length}/160</p>
        </Field>
        <Field label="Focus keyword" hint="The primary keyword this post targets.">
          <input type="text" value={focusKw} onChange={e => setFocusKw(e.target.value)} className={INPUT} style={STYLE} placeholder="e.g. CSC scholarship 2026" />
        </Field>
      </Section>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl">
            <h3 className="text-lg font-black mb-2" style={{ color: "#0A1628" }}>Delete this post?</h3>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
              This will permanently delete &ldquo;{post?.title}&rdquo;. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: "#E2E8F0", color: "#64748B" }}
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: "#C8102E" }}
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
