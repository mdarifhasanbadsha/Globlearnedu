import { db } from "@/lib/db";
import { bizTestSessions, bizTestFindings } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { isDeepSeekConfigured } from "@/lib/business/deepseek";
import { LAB_MODES, PERSONAS } from "@/lib/business/lab";
import { eq, desc } from "drizzle-orm";
import LabClient from "./_LabClient";

export const dynamic = "force-dynamic";

export default async function LabPage() {
  const businessId = getBusinessId();

  const sessions = await db
    .select()
    .from(bizTestSessions)
    .where(eq(bizTestSessions.businessId, businessId))
    .orderBy(desc(bizTestSessions.createdAt))
    .limit(50);

  const findings = await db
    .select()
    .from(bizTestFindings)
    .where(eq(bizTestFindings.businessId, businessId))
    .orderBy(desc(bizTestFindings.createdAt))
    .limit(100);

  return (
    <LabClient
      aiReady={isDeepSeekConfigured()}
      modes={LAB_MODES.map((m) => ({ key: m.key, label: m.label, detail: m.detail }))}
      personas={PERSONAS.map((p) => ({ key: p.key, label: p.label, opener: p.opener }))}
      initialSessions={sessions.map((s) => ({
        id: s.id,
        title: s.title,
        persona: s.persona,
        mode: s.mode,
        createdAt: s.createdAt.toISOString(),
      }))}
      initialFindings={findings.map((f) => ({
        id: f.id,
        sessionId: f.sessionId,
        verdict: f.verdict,
        question: f.question,
        answer: f.answer,
        expected: f.expected,
        note: f.note,
        createdAt: f.createdAt.toISOString(),
      }))}
    />
  );
}
