"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Guide {
  id: string;
  summary: string | null;
  tone: string[];
  greetingPatterns: string[];
  pricingPhrases: string[];
  followupPhrases: string[];
  avoidPhrases: string[];
  languageMix: string | null;
  customRules: string | null;
  sampleCount: number;
  status: string;
  version: number;
  editedByOwner: boolean;
  updatedAt: string;
}

const LIST_FIELDS = [
  { key: "tone", label: "Tone", hint: "Short observations, e.g. “warm but brief”" },
  { key: "greetingPatterns", label: "Openings we use", hint: "Real phrases your team starts with" },
  { key: "pricingPhrases", label: "How we talk about fees", hint: "Real phrasing about tuition" },
  { key: "followupPhrases", label: "Asking for documents", hint: "How you ask for results / passport" },
  { key: "avoidPhrases", label: "Things to avoid", hint: "e.g. “never use emoji walls”" },
] as const;

export default function StyleClient({
  guide,
  samples,
}: {
  guide: Guide | null;
  samples: { body: string; channel: string }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [summary, setSummary] = useState(guide?.summary ?? "");
  const [languageMix, setLanguageMix] = useState(guide?.languageMix ?? "");
  const [customRules, setCustomRules] = useState(guide?.customRules ?? "");
  const [lists, setLists] = useState<Record<string, string[]>>({
    tone: guide?.tone ?? [],
    greetingPatterns: guide?.greetingPatterns ?? [],
    pricingPhrases: guide?.pricingPhrases ?? [],
    followupPhrases: guide?.followupPhrases ?? [],
    avoidPhrases: guide?.avoidPhrases ?? [],
  });

  async function save() {
    if (!guide) return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/business/style", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: guide.id,
          action: "edit",
          fields: { summary, languageMix, customRules, ...lists },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Save failed");
      setMsg(
        json.live
          ? "Saved. Your voice is live — the AI uses it on the next reply."
          : "Saved as draft. Approve it to make it live."
      );
      setEditing(false);
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function act(action: "approve" | "reject" | "create") {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/business/style", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: guide?.id, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      setMsg(
        action === "approve"
          ? "Approved. New replies follow this voice."
          : action === "create"
            ? "Blank voice created — edit it to write your own."
            : "Voice retired."
      );
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  function updateItem(key: string, idx: number, value: string) {
    setLists((l) => ({ ...l, [key]: l[key].map((v, i) => (i === idx ? value : v)) }));
  }
  function removeItem(key: string, idx: number) {
    setLists((l) => ({ ...l, [key]: l[key].filter((_, i) => i !== idx) }));
  }
  function addItem(key: string) {
    setLists((l) => ({ ...l, [key]: [...l[key], ""] }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A52]">Brand voice</h1>
        <p className="text-sm text-slate-600 mt-1">
          How your AI writes. Edit anything here — your changes go live immediately once approved.
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {msg}
        </div>
      )}

      {!guide ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <p className="text-sm text-slate-600">No brand voice yet.</p>
          <button
            onClick={() => void act("create")}
            disabled={busy}
            className="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-40"
          >
            Create one and write it myself
          </button>
        </div>
      ) : (
        <section className="bg-white rounded-xl border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2 justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#0F2A52] text-sm">Current voice</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  guide.status === "approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {guide.status}
              </span>
              <span className="text-[11px] text-slate-500">v{guide.version}</span>
              {guide.editedByOwner && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  hand-edited
                </span>
              )}
              <span className="text-[11px] text-slate-400">
                learned from {guide.sampleCount} replies
              </span>
            </div>
            <div className="flex gap-2">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0F2A52] text-white hover:bg-[#1B3A6B]"
                >
                  Edit
                </button>
              )}
              {guide.status !== "approved" ? (
                <button
                  onClick={() => void act("approve")}
                  disabled={busy}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
                >
                  Approve &amp; use
                </button>
              ) : (
                <button
                  onClick={() => void act("reject")}
                  disabled={busy}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  Stop using
                </button>
              )}
            </div>
          </div>

          {!editing ? (
            <div className="p-4 space-y-4">
              {guide.summary && <p className="text-sm text-slate-800">{guide.summary}</p>}
              {guide.languageMix && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Language
                  </h3>
                  <p className="text-sm text-slate-800 bg-slate-50 rounded px-2 py-1">
                    {guide.languageMix}
                  </p>
                </div>
              )}
              {LIST_FIELDS.map((f) => {
                const items = (guide as any)[f.key] as string[];
                if (!items || items.length === 0) return null;
                return (
                  <div key={f.key}>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                      {f.label}
                    </h3>
                    <ul className="space-y-1">
                      {items.map((i, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-800 bg-slate-50 rounded px-2 py-1"
                        >
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              {guide.customRules && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#C8102E] mb-1">
                    Your own instructions (highest priority)
                  </h3>
                  <pre className="text-sm text-slate-800 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 whitespace-pre-wrap font-sans">
                    {guide.customRules}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Your own instructions — highest priority
                </span>
                <p className="text-[11px] text-slate-500 mb-1">
                  Written in plain language. The AI follows this over everything else. Example:
                  &ldquo;Always greet with Assalamualaikum. Never quote a fee without saying per
                  semester. If unsure, ask for HSC result first.&rdquo;
                </p>
                <textarea
                  value={customRules}
                  onChange={(e) => setCustomRules(e.target.value)}
                  rows={5}
                  placeholder="Type how you want the AI to behave…"
                  className="w-full rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Overall summary
                </span>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Language mix
                </span>
                <textarea
                  value={languageMix}
                  onChange={(e) => setLanguageMix(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
                />
              </label>

              {LIST_FIELDS.map((f) => (
                <div key={f.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {f.label}
                    </span>
                    <button
                      onClick={() => addItem(f.key)}
                      className="text-[11px] font-medium text-[#29ABE2] hover:underline"
                    >
                      + Add
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-1">{f.hint}</p>
                  <div className="space-y-1.5">
                    {lists[f.key].length === 0 && (
                      <p className="text-[11px] text-slate-400 italic">None yet.</p>
                    )}
                    {lists[f.key].map((v, idx) => (
                      <div key={idx} className="flex gap-1.5">
                        <input
                          value={v}
                          onChange={(e) => updateItem(f.key, idx, e.target.value)}
                          className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-[#29ABE2]"
                        />
                        <button
                          onClick={() => removeItem(f.key, idx)}
                          aria-label="Remove"
                          className="px-2 text-slate-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setEditing(false)}
                  className="text-sm px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void save()}
                  disabled={busy}
                  className="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
                >
                  {busy ? "Saving…" : "Save voice"}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="bg-white rounded-xl border border-slate-200">
        <h2 className="font-semibold text-[#0F2A52] text-sm px-4 py-3 border-b border-slate-200">
          Sample real replies it learned from
        </h2>
        {samples.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No staff replies imported yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {samples.map((s, i) => (
              <li key={i} className="px-4 py-2">
                <div className="text-[10px] uppercase tracking-wide text-slate-400">{s.channel}</div>
                <div className="text-sm text-slate-800">{s.body}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
