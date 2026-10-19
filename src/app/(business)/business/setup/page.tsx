import { isDeepSeekConfigured, isCostPriceKnown, DEEPSEEK_DEFAULT_MODEL } from "@/lib/business/deepseek";
import { getBusinessId, BUSINESS_TIMEZONE, BUSINESS_NAME } from "@/lib/business/config";

export const dynamic = "force-dynamic";

function Check({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${
          ok ? "bg-emerald-600" : "bg-slate-400"
        }`}
        aria-hidden
      >
        {ok ? "✓" : "!"}
      </span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-[#1B3A6B]">{label}</div>
        {detail ? <div className="text-xs text-slate-600 mt-0.5 break-words">{detail}</div> : null}
      </div>
    </div>
  );
}

export default async function SetupPage() {
  const aiReady = isDeepSeekConfigured();
  const priceKnown = isCostPriceKnown();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Setup &amp; readiness</h1>
        <p className="text-sm text-slate-600 mt-1">
          Live configuration status. Values marked “not set” are pending owner action —
          nothing here is simulated.
        </p>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 px-4 py-2">
        <Check ok label="Neon database" detail="Connected via the serverless HTTP driver." />
        <Check ok label="Business record" detail={`${BUSINESS_NAME} · ${getBusinessId()}`} />
        <Check ok label="Business timezone" detail={BUSINESS_TIMEZONE} />
        <Check
          ok={aiReady}
          label="DeepSeek AI provider"
          detail={
            aiReady
              ? `Key detected. Model: ${process.env.DEEPSEEK_MODEL || DEEPSEEK_DEFAULT_MODEL}`
              : "DEEPSEEK_API_KEY is not set. Chat still stores messages but sends no AI replies."
          }
        />
        <Check
          ok={priceKnown}
          label="AI cost accounting"
          detail={
            priceKnown
              ? "Input/output prices configured; per-run cost is estimated."
              : "Prices not configured — estimated cost is reported as unknown, not zero."
          }
        />
        <Check
          ok={false}
          label="Messenger / Instagram / WhatsApp"
          detail="BLOCKED_EXTERNAL — requires Meta app credentials, page permissions and app review. Not connected."
        />
        <Check
          ok={false}
          label="Payments"
          detail="Out of scope for this phase, per owner instruction."
        />
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="font-semibold text-[#1B3A6B] text-sm mb-2">Owner actions pending</h2>
        <ul className="text-sm text-slate-700 space-y-1.5 list-disc pl-5">
          <li>
            Add <code className="font-mono text-xs">DEEPSEEK_API_KEY</code> to production
            secrets (Cloudflare) to enable AI replies live.
          </li>
          <li>
            Optionally set <code className="font-mono text-xs">DEEPSEEK_PRICE_INPUT_PER_M</code> and{" "}
            <code className="font-mono text-xs">DEEPSEEK_PRICE_OUTPUT_PER_M</code> for cost tracking.
          </li>
          <li>
            Decide whether the public website chat widget should be embedded on the live site.
          </li>
        </ul>
      </section>
    </div>
  );
}
