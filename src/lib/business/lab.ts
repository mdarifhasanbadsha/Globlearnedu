// ─────────────────────────────────────────────────────────────
// Test lab: talk to the counselling AI as a student would, without
// creating a real conversation.
//
// Deliberately isolated from production chat:
//   - writes only to biz_test_* tables
//   - never creates a biz_conversation or biz_lead
//   - mode controls which layers are active, so you can see whether a
//     bad answer comes from missing knowledge, missing voice, or the model
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizTestSessions, bizTestMessages } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { buildCounselingMessages, loadApprovedKnowledge, parseCounselingReply } from "@/lib/business/counseling";
import { loadActiveStyleGuide, formatStyleGuide } from "@/lib/business/style";
import { deepseekChatWithRetry, isDeepSeekConfigured, estimateCostMicros } from "@/lib/business/deepseek";
import { and, eq, asc } from "drizzle-orm";

export type LabMode = "live" | "no_knowledge" | "no_style" | "bare";

export const LAB_MODES: { key: LabMode; label: string; detail: string }[] = [
  {
    key: "live",
    label: "Live (what students get)",
    detail: "Approved universities + your brand voice, exactly as production.",
  },
  {
    key: "no_knowledge",
    label: "Without university data",
    detail: "Shows what the AI says when it cannot find a program.",
  },
  {
    key: "no_style",
    label: "Without brand voice",
    detail: "Shows the generic tone, to compare against your team's.",
  },
  {
    key: "bare",
    label: "Model only",
    detail: "Neither data nor voice — the raw model baseline.",
  },
];

export const PERSONAS: { key: string; label: string; opener: string }[] = [
  {
    key: "student_bangla",
    label: "Bangla student",
    opener: "আমি চীনে পড়তে চাই, কি কি লাগবে?",
  },
  {
    key: "student_banglish",
    label: "Banglish student",
    opener: "vai language program e koto taka lage?",
  },
  {
    key: "student_english",
    label: "English student",
    opener: "How much is tuition for a language program in China?",
  },
  {
    key: "budget_concern",
    label: "Budget-conscious parent",
    opener: "Cheapest option kothay paoa jabe? Amar budget onek kom.",
  },
  {
    key: "doubtful",
    label: "Skeptical student",
    opener: "Are you a real consultancy? How do I know this is not a scam?",
  },
];

export interface LabReply {
  ok: boolean;
  reply: string;
  error?: string;
  knowledgeUsed: number;
  styleUsed: boolean;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
}

/** Run one turn inside the sandbox. Never touches production tables. */
export async function runLabTurn(args: {
  sessionId: string;
  businessId: string;
  mode: LabMode;
  message: string;
}): Promise<LabReply> {
  const { sessionId, businessId, mode, message } = args;

  if (!isDeepSeekConfigured()) {
    return {
      ok: false,
      reply: "",
      error:
        "The AI key is not set on the server. Run: node scripts/set-worker-secrets.mjs",
      knowledgeUsed: 0,
      styleUsed: false,
      promptTokens: 0,
      completionTokens: 0,
      latencyMs: 0,
    };
  }

  const history = await db
    .select({ role: bizTestMessages.role, body: bizTestMessages.body })
    .from(bizTestMessages)
    .where(eq(bizTestMessages.sessionId, sessionId))
    .orderBy(asc(bizTestMessages.createdAt))
    .limit(40);

  const knowledge =
    mode === "no_knowledge" || mode === "bare"
      ? []
      : await loadApprovedKnowledge(businessId, message);

  const style = mode === "no_style" || mode === "bare" ? null : await loadActiveStyleGuide(businessId);

  const messages = buildCounselingMessages({
    history: history.map((h) => ({
      direction: h.role === "assistant" ? "out" : "in",
      body: h.body,
    })),
    latestMessage: message,
    knowledge,
    styleGuide: style ? formatStyleGuide(style) : null,
  });

  const started = Date.now();
  const result = await deepseekChatWithRetry({
    messages,
    maxTokens: 2500,
    timeoutMs: 30_000,
    jsonMode: false,
    temperature: 0.4,
  });

  let reply = "";
  if (result.ok && result.content) {
    reply = parseCounselingReply(result.content, message).reply;
  }

  return {
    ok: reply.length > 0,
    reply,
    error: reply.length > 0 ? undefined : (result.error ?? "The AI returned an empty reply."),
    knowledgeUsed: knowledge.length,
    styleUsed: !!style,
    promptTokens: result.promptTokens,
    completionTokens: result.completionTokens,
    latencyMs: Date.now() - started || result.latencyMs,
  };
}
