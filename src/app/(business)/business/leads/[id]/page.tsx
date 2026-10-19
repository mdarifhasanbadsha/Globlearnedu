import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { bizLeads } from "@/lib/db/schema.business2";
import { bizMessages, bizConversations } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { and, eq, asc } from "drizzle-orm";
import LeadDetailClient from "./_LeadDetailClient";

export const dynamic = "force-dynamic";

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const businessId = getBusinessId();

  const [lead] = await db
    .select()
    .from(bizLeads)
    .where(and(eq(bizLeads.businessId, businessId), eq(bizLeads.id, id)))
    .limit(1);

  if (!lead) notFound();

  const thread = lead.conversationId
    ? await db
        .select({
          id: bizMessages.id,
          direction: bizMessages.direction,
          authorKind: bizMessages.authorKind,
          body: bizMessages.body,
          createdAt: bizMessages.createdAt,
        })
        .from(bizMessages)
        .where(eq(bizMessages.conversationId, lead.conversationId))
        .orderBy(asc(bizMessages.createdAt))
        .limit(60)
    : [];

  return (
    <LeadDetailClient
      lead={{
        id: lead.id,
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        nationality: lead.nationality,
        degreeLevel: lead.degreeLevel,
        subjectInterest: lead.subjectInterest,
        gpaValue: lead.gpaValue,
        gpaScale: lead.gpaScale,
        budgetAmount: lead.budgetAmount,
        budgetCurrency: lead.budgetCurrency,
        intakeTarget: lead.intakeTarget,
        languageTest: lead.languageTest,
        stage: lead.stage,
        stageReason: lead.stageReason,
        consentContact: lead.consentContact,
        source: lead.source,
        conversationId: lead.conversationId,
        createdAt: lead.createdAt.toISOString(),
      }}
      messages={thread.map((m) => ({
        id: m.id,
        direction: m.direction,
        authorKind: m.authorKind,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
