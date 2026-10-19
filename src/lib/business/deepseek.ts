// ─────────────────────────────────────────────────────────────
// DeepSeek client — lazy singleton (Cloudflare Pages rule)
// Never initialize at module level; crashes build time.
// ─────────────────────────────────────────────────────────────

export const DEEPSEEK_DEFAULT_MODEL = "deepseek-chat";

export type DeepSeekContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string | DeepSeekContentPart[];
}

export interface DeepSeekResult {
  ok: boolean;
  content?: string;
  model?: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  error?: string;
  /** true when the failure is retryable (429, 5xx, timeout) */
  retryable: boolean;
}

interface CallOptions {
  messages: DeepSeekMessage[];
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

function getKey(): string | null {
  const k = process.env.DEEPSEEK_API_KEY;
  return k && k.trim().length > 0 ? k.trim() : null;
}

function getModel(): string {
  return process.env.DEEPSEEK_MODEL?.trim() || DEEPSEEK_DEFAULT_MODEL;
}

function getBaseUrl(): string {
  return (process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com").replace(/\/+$/, "");
}

export function isDeepSeekConfigured(): boolean {
  return getKey() !== null;
}

/**
 * Single completion call with timeout, token ceiling and
 * classified error handling. Never throws — returns a result object
 * so callers can fail safely (spec: no infinite loops, no silent
 * provider switching).
 */
export async function deepseekChat(opts: CallOptions): Promise<DeepSeekResult> {
  const started = Date.now();
  const key = getKey();
  if (!key) {
    return {
      ok: false,
      promptTokens: 0,
      completionTokens: 0,
      latencyMs: 0,
      error: "DEEPSEEK_API_KEY is not configured",
      retryable: false,
    };
  }

  const timeoutMs = Math.min(opts.timeoutMs ?? 30_000, 60_000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Honour an outer abort signal (e.g. staff takeover / request cancel).
  const onOuterAbort = () => controller.abort();
  opts.signal?.addEventListener("abort", onOuterAbort);

  try {
    const res = await fetch(`${getBaseUrl()}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: getModel(),
        messages: opts.messages,
        max_tokens: Math.min(opts.maxTokens ?? 600, 16000),
        temperature: opts.temperature ?? 0.3,
        stream: false,
      }),
      signal: controller.signal,
      // Cache-free: authentication differs per call.
      cache: "no-store",
    });

    const latencyMs = Date.now() - started;

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const retryable = res.status === 429 || res.status >= 500;
      let msg = `DeepSeek HTTP ${res.status}`;
      if (res.status === 401) msg = "DeepSeek API key rejected (401)";
      else if (res.status === 402) msg = "DeepSeek balance exhausted (402)";
      else if (body) msg += `: ${body.slice(0, 300)}`;
      return {
        ok: false,
        promptTokens: 0,
        completionTokens: 0,
        latencyMs,
        error: msg,
        retryable,
      };
    }

    const json: any = await res.json();
    const content = json?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || content.trim().length === 0) {
      return {
        ok: false,
        promptTokens: json?.usage?.prompt_tokens ?? 0,
        completionTokens: json?.usage?.completion_tokens ?? 0,
        latencyMs,
        error: "DeepSeek returned an empty or malformed response",
        retryable: true,
      };
    }

    return {
      ok: true,
      content: content.trim(),
      model: json?.model ?? getModel(),
      promptTokens: json?.usage?.prompt_tokens ?? 0,
      completionTokens: json?.usage?.completion_tokens ?? 0,
      latencyMs,
      retryable: false,
    };
  } catch (e: any) {
    const latencyMs = Date.now() - started;
    const aborted = e?.name === "AbortError";
    return {
      ok: false,
      promptTokens: 0,
      completionTokens: 0,
      latencyMs,
      error: aborted ? "DeepSeek request timed out" : `DeepSeek request failed: ${e?.message ?? "unknown"}`,
      retryable: true,
    };
  } finally {
    clearTimeout(timer);
    opts.signal?.removeEventListener("abort", onOuterAbort);
  }
}

/**
 * Rough cost estimate. Pricing is configurable and dated — an unknown
 * price must be reported as unknown, never silently zero (spec §7).
 */
export function estimateCostMicros(promptTokens: number, completionTokens: number): number {
  const inPerM = Number(process.env.DEEPSEEK_PRICE_INPUT_PER_M ?? "");
  const outPerM = Number(process.env.DEEPSEEK_PRICE_OUTPUT_PER_M ?? "");
  if (!Number.isFinite(inPerM) || !Number.isFinite(outPerM)) return 0;
  return Math.round((promptTokens / 1_000_000) * inPerM * 1_000_000
                + (completionTokens / 1_000_000) * outPerM * 1_000_000);
}

export function isCostPriceKnown(): boolean {
  return (
    Number.isFinite(Number(process.env.DEEPSEEK_PRICE_INPUT_PER_M)) &&
    Number.isFinite(Number(process.env.DEEPSEEK_PRICE_OUTPUT_PER_M))
  );
}
