"use client";

import { useState } from "react";

interface ManualField {
  key: string;
  label: string;
  placeholder: string;
  secret: boolean;
}

interface Channel {
  key: string;
  label: string;
  icon: string;
  description: string;
  docsUrl: string;
  blocker: string | null;
  manualFields: ManualField[];
  envReady: boolean;
  status: string;
  displayName: string | null;
  lastError: string | null;
  lastCheckedAt: string | null;
}

const BADGE: Record<string, string> = {
  connected: "bg-emerald-100 text-emerald-800",
  disconnected: "bg-slate-200 text-slate-600",
  needs_reconnect: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
};

export default function ConnectionsClient({ channels }: { channels: Channel[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<Record<string, string>>({});
  const [err, setErr] = useState<Record<string, string>>({});

  async function save(channelKey: string) {
    setBusy(channelKey);
    setErr((e) => ({ ...e, [channelKey]: "" }));
    setMsg((m) => ({ ...m, [channelKey]: "" }));
    try {
      const res = await fetch("/api/business/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: channelKey, credentials: values[channelKey] ?? {} }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to save");
      setMsg((m) => ({
        ...m,
        [channelKey]: json.verified
          ? "Saved and verified live."
          : `Saved. ${json.note ?? "Not verified."}`,
      }));
    } catch (e: any) {
      setErr((x) => ({ ...x, [channelKey]: e.message }));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Connections</h1>
        <p className="text-sm text-slate-600 mt-1">
          Connect the channels students use. Website chat works now; social channels need
          credentials from Meta and will show as disconnected until a real check passes.
        </p>
      </div>

      <div className="space-y-3">
        {channels.map((c) => {
          const open = expanded === c.key;
          return (
            <section key={c.key} className="bg-white rounded-xl border border-slate-200">
              <div className="p-4 flex items-start gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg bg-[#1B3A6B] text-white flex items-center justify-center text-lg font-bold"
                  aria-hidden
                >
                  {c.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-[#1B3A6B] text-sm">{c.label}</h2>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        BADGE[c.status] ?? BADGE.disconnected
                      }`}
                    >
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{c.description}</p>

                  {c.blocker && c.status !== "connected" && (
                    <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                      {c.blocker}
                    </p>
                  )}
                  {c.lastError && (
                    <p className="text-xs text-red-800 mt-2">{c.lastError}</p>
                  )}
                  {err[c.key] && (
                    <p className="text-xs text-red-800 mt-2">{err[c.key]}</p>
                  )}
                  {msg[c.key] && (
                    <p className="text-xs text-emerald-800 mt-2">{msg[c.key]}</p>
                  )}
                </div>

                {c.manualFields.length > 0 && (
                  <button
                    onClick={() => setExpanded(open ? null : c.key)}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                    aria-expanded={open}
                  >
                    {open ? "Close" : "Connect manually"}
                  </button>
                )}
              </div>

              {open && (
                <div className="border-t border-slate-200 p-4 space-y-2 bg-slate-50 rounded-b-xl">
                  <p className="text-xs text-slate-600">
                    Paste credentials from your Meta app. They are stored encrypted and
                    never sent to the browser again.
                    {c.docsUrl && (
                      <>
                        {" "}
                        <a
                          href={c.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#29ABE2] hover:underline"
                        >
                          Meta docs
                        </a>
                      </>
                    )}
                  </p>
                  {c.manualFields.map((f) => (
                    <label key={f.key} className="block">
                      <span className="text-xs font-medium text-slate-700">{f.label}</span>
                      <input
                        type={f.secret ? "password" : "text"}
                        placeholder={f.placeholder}
                        autoComplete="off"
                        onChange={(e) =>
                          setValues((v) => ({
                            ...v,
                            [c.key]: { ...(v[c.key] ?? {}), [f.key]: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2] bg-white"
                      />
                    </label>
                  ))}
                  <button
                    onClick={() => void save(c.key)}
                    disabled={busy === c.key}
                    className="mt-1 bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
                  >
                    {busy === c.key ? "Saving…" : "Save credentials"}
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="font-semibold text-[#1B3A6B] text-sm mb-2">How to enable social channels</h2>
        <ol className="text-sm text-slate-700 space-y-1.5 list-decimal pl-5">
          <li>Create a Meta app of type <em>Business</em> at developers.facebook.com.</li>
          <li>Add the Messenger, Instagram and WhatsApp products to it.</li>
          <li>Verify GL Education as a business in Meta Business Suite.</li>
          <li>Submit for App Review requesting pages_messaging and whatsapp_business_messaging.</li>
          <li>Send the App ID and App Secret — then use Connect above.</li>
        </ol>
        <p className="text-xs text-slate-500 mt-2">
          Steps 1–4 must be done by the account owner; Meta does not grant these permissions
          to a third party. Timelines vary and are outside our control.
        </p>
      </section>
    </div>
  );
}
