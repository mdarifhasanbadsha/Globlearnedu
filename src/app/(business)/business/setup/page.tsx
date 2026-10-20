import {
  isDeepSeekConfigured,
  isCostPriceKnown,
  DEEPSEEK_DEFAULT_MODEL,
} from "@/lib/business/deepseek";
import { getBusinessId, BUSINESS_TIMEZONE, BUSINESS_NAME } from "@/lib/business/config";
import { isEncryptionConfigured } from "@/lib/business/crypto";
import { PageHeader, Card, Pill, Alert } from "../_ui";

export const dynamic = "force-dynamic";

/** Presence check only — never renders a value. */
function hasEnv(name: string): boolean {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length > 0;
}

function Row({
  ok,
  label,
  detail,
  fix,
}: {
  ok: boolean;
  label: string;
  detail: string;
  fix?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${
          ok ? "bg-emerald-600" : "bg-red-500"
        }`}
        aria-hidden
      >
        {ok ? "✓" : "!"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[#0F2A52]">{label}</span>
          {ok ? <Pill tone="good">set</Pill> : <Pill tone="bad">missing</Pill>}
        </div>
        <div className="text-xs text-slate-600 mt-0.5 break-words">{detail}</div>
        {!ok && fix && (
          <div className="text-xs text-red-700 mt-1 font-mono bg-red-50 border border-red-200 rounded px-2 py-1">
            {fix}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function SetupPage() {
  const aiReady = isDeepSeekConfigured();
  const priceKnown = isCostPriceKnown();
  const encryptReady = isEncryptionConfigured();

  const envRows = [
    {
      ok: aiReady,
      label: "AI provider key (DEEPSEEK_API_KEY)",
      detail: aiReady
        ? `Detected. Model: ${process.env.DEEPSEEK_MODEL || DEEPSEEK_DEFAULT_MODEL}`
        : "Without this, students get no automatic reply at all.",
      fix: "npx wrangler secret put DEEPSEEK_API_KEY --name globlearnedu",
    },
    {
      ok: hasEnv("DATABASE_URL"),
      label: "Database connection (DATABASE_URL)",
      detail: hasEnv("DATABASE_URL")
        ? "Present. If pages load at all, this is working."
        : "Required for every part of the panel.",
      fix: "npx wrangler secret put DATABASE_URL --name globlearnedu",
    },
    {
      ok: hasEnv("NEXTAUTH_SECRET"),
      label: "Login secret (NEXTAUTH_SECRET)",
      detail: hasEnv("NEXTAUTH_SECRET")
        ? "Present — staff login is signed."
        : "Login will fail without it.",
      fix: "npx wrangler secret put NEXTAUTH_SECRET --name globlearnedu",
    },
    {
      ok: encryptReady,
      label: "Credential encryption (CREDENTIALS_ENCRYPTION_KEY)",
      detail: encryptReady
        ? "Present — channel tokens can be stored encrypted."
        : "Channel credentials cannot be stored safely without it.",
      fix: "npx wrangler secret put CREDENTIALS_ENCRYPTION_KEY --name globlearnedu",
    },
    {
      ok: hasEnv("META_VERIFY_TOKEN"),
      label: "Meta verify token (META_VERIFY_TOKEN)",
      detail: hasEnv("META_VERIFY_TOKEN")
        ? "Present — the Messenger webhook can be verified."
        : "Meta's Verify button will fail.",
      fix: "Declared in wrangler.jsonc already; redeploy if this is missing.",
    },
    {
      ok: hasEnv("META_APP_SECRET"),
      label: "Meta app secret (META_APP_SECRET)",
      detail: hasEnv("META_APP_SECRET")
        ? "Present — incoming Messenger events are signature-checked."
        : "Incoming Messenger events will be rejected with 401.",
      fix: "npx wrangler secret put META_APP_SECRET --name globlearnedu",
    },
    {
      ok: hasEnv("META_PAGE_ACCESS_TOKEN"),
      label: "Page access token (META_PAGE_ACCESS_TOKEN)",
      detail: hasEnv("META_PAGE_ACCESS_TOKEN")
        ? "Present — the Page can be read and replied to."
        : "Needed to read or send Messenger messages.",
      fix: "npx wrangler secret put META_PAGE_ACCESS_TOKEN --name globlearnedu",
    },
  ];

  const missing = envRows.filter((r) => !r.ok).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health"
        subtitle="Live configuration status. Only presence is shown — no secret value is ever displayed."
      />

      {missing === 0 ? (
        <Alert tone="good">All required settings are present.</Alert>
      ) : (
        <Alert tone="bad">
          {missing} required setting{missing > 1 ? "s are" : " is"} missing. Each fix command below
          is safe to run from the project folder.
        </Alert>
      )}

      <Card title="Environment" padded={false}>
        <div className="px-4 py-1">
          {envRows.map((r) => (
            <Row key={r.label} {...r} />
          ))}
        </div>
      </Card>

      <Card title="Business">
        <ul className="text-sm space-y-2">
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Name</span>
            <span className="text-slate-900">{BUSINESS_NAME}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Business ID</span>
            <span className="text-slate-900 font-mono text-xs">{getBusinessId()}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Timezone</span>
            <span className="text-slate-900">{BUSINESS_TIMEZONE}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Cost tracking</span>
            {priceKnown ? (
              <Pill tone="good">prices configured</Pill>
            ) : (
              <Pill tone="warn">estimated cost unknown</Pill>
            )}
          </li>
        </ul>
      </Card>

      <Card title="Channels">
        <ul className="text-sm space-y-2">
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Website chat</span>
            <Pill tone="good">live</Pill>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Messenger</span>
            <Pill tone="warn">awaiting Meta app publish</Pill>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Instagram / WhatsApp</span>
            <Pill tone="neutral">not connected</Pill>
          </li>
        </ul>
        <p className="text-xs text-slate-500 mt-3">
          Meta delivers real messages only after the app is published (App Review + Business
          Verification). The webhook is already verified and ready.
        </p>
      </Card>
    </div>
  );
}
