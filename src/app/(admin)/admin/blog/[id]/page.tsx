"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Star } from "lucide-react";
import { blogPosts } from "~/lib/data/blog";

const inputClass = "w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors";
const inputStyle = { borderColor: "#E2E8F0" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function EditBlogPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const post = blogPosts.find((p) => p.slug === id);

  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [authorRole, setAuthorRole] = useState(post?.authorRole ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [readTime, setReadTime] = useState(post?.readTime ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [featured, setFeatured] = useState(post?.featured ?? false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/blog" className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ borderColor: "#E2E8F0" }}>
            <ArrowLeft size={15} style={{ color: "#64748B" }} />
          </Link>
          <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>Edit Post</h1>
        </div>
        <div className="flex items-center gap-3 p-5 rounded-xl" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle size={18} style={{ color: "#C8102E" }} />
          <p className="text-sm font-semibold" style={{ color: "#991B1B" }}>
            Blog post &quot;{id}&quot; not found.
          </p>
        </div>
      </div>
    );
  }

  const CATEGORIES = ["Scholarships", "Visa", "Admissions", "Student Life", "Programs", "Universities", "News"];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
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
            Edit Post
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            slug: {post.slug}
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#DCFCE7", border: "1px solid #86EFAC" }}>
          <CheckCircle2 size={18} style={{ color: "#166534" }} />
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>
            Post metadata saved. Connect to CMS to persist content changes.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
            Post Metadata
          </p>
          <Field label="Title">
            <input className={inputClass} style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Excerpt / Summary">
            <textarea
              className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors resize-none"
              style={{ borderColor: "#E2E8F0" }}
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </Field>
          <div className="grid gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Author Name">
              <input className={inputClass} style={inputStyle} value={author} onChange={(e) => setAuthor(e.target.value)} />
            </Field>
            <Field label="Author Role">
              <input className={inputClass} style={inputStyle} value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} />
            </Field>
            <Field label="Category">
              <select className={inputClass} style={{ ...inputStyle, color: "#475569" }} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Reading Time">
              <input className={inputClass} style={inputStyle} value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="e.g. 8 min read" />
            </Field>
          </div>
          <Field label="Tags (comma-separated)">
            <input className={inputClass} style={inputStyle} value={tags} onChange={(e) => setTags(e.target.value)} />
          </Field>

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFeatured((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
              style={
                featured
                  ? { borderColor: "#F59E0B", backgroundColor: "#FFFBEB", color: "#92400E" }
                  : { borderColor: "#E2E8F0", backgroundColor: "white", color: "#64748B" }
              }
            >
              <Star size={14} style={{ color: featured ? "#F59E0B" : "#94A3B8" }} fill={featured ? "#F59E0B" : "none"} />
              {featured ? "Featured post" : "Mark as featured"}
            </button>
            {featured && (
              <p className="text-xs" style={{ color: "#92400E" }}>
                This post will appear prominently on the blog homepage.
              </p>
            )}
          </div>
        </section>

        {/* Content note */}
        <section className="bg-white rounded-2xl border p-6" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold pb-3 mb-4" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
            Post Content
          </p>
          <div className="p-5 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <p className="text-sm font-semibold mb-2" style={{ color: "#475569" }}>
              Content blocks: {post.content.length} sections
            </p>
            <div className="space-y-1">
              {post.content.slice(0, 6).map((block, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                    style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}
                  >
                    {block.type}
                  </span>
                  <span className="text-xs truncate" style={{ color: "#94A3B8" }}>
                    {"text" in block ? block.text.slice(0, 60) + "…" : "items" in block ? `${block.items.length} items` : "table"}
                  </span>
                </div>
              ))}
              {post.content.length > 6 && (
                <p className="text-xs" style={{ color: "#CBD5E1" }}>
                  + {post.content.length - 6} more blocks
                </p>
              )}
            </div>
            <p className="text-xs mt-3" style={{ color: "#94A3B8" }}>
              Full content editing requires a rich-text CMS integration.
            </p>
          </div>
        </section>

        <div className="flex justify-between items-center pb-4">
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="text-xs font-semibold"
            style={{ color: "#29ABE2" }}
          >
            View live post →
          </Link>
          <div className="flex gap-3">
            <Link
              href="/admin/blog"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "#E2E8F0", color: "#64748B", backgroundColor: "white" }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#C8102E" }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
