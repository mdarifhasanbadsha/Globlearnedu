import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizLeads, bizLeadNotes, bizLeadActivity, bizFollowups, bizTasks } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { logActivity } from "@/lib/business/activity";
import { and, eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const STAGES = [
  "new",
  "profile_pending",
  "qualified",
  "counseling_booked",
  "counseling_completed",
  "considering",
  "closed",
];

/** Everything about one lead: fields, notes, timeline, followups, tasks. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const businessId = getBusinessId();

  const [lead] = await db
    .select()
    .from(bizLeads)
    .where(and(eq(bizLeads.businessId, businessId), eq(bizLeads.id, id)))
    .limit(1);

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const notes = await db
    .select()
    .from(bizLeadNotes)
    .where(eq(bizLeadNotes.leadId, id))
    .orderBy(desc(bizLeadNotes.createdAt))
    .limit(100);

  const timeline = await db
    .select()
    .from(bizLeadActivity)
    .where(eq(bizLeadActivity.leadId, id))
    .orderBy(desc(bizLeadActivity.createdAt))
    .limit(100);

  const followups = await db
    .select()
    .from(bizFollowups)
    .where(eq(bizFollowups.leadId, id))
    .orderBy(desc(bizFollowups.dueAt))
    .limit(50);

  const tasks = await db
    .select()
    .from(bizTasks)
    .where(eq(bizTasks.leadId, id))
    .orderBy(desc(bizTasks.dueAt))
    .limit(50);

  return NextResponse.json({
    lead,
    notes,
    timeline,
    followups,
    tasks,
  });
}

/**
 * One endpoint for every lead action, because they all need the same
 * validation and all must write to the timeline.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const businessId = getBusinessId();

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const [lead] = await db
    .select()
    .from(bizLeads)
    .where(and(eq(bizLeads.businessId, businessId), eq(bizLeads.id, id)))
    .limit(1);

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const action = payload?.action;

  // ── Add a note ──
  if (action === "note") {
    const body = typeof payload?.body === "string" ? payload.body.trim() : "";
    if (body.length === 0 || body.length > 2000) {
      return NextResponse.json({ error: "Note must be 1-2000 characters" }, { status: 400 });
    }
    const kind = ["note", "call", "whatsapp", "messenger", "email"].includes(payload?.kind)
      ? payload.kind
      : "note";

    await db.insert(bizLeadNotes).values({
      businessId,
      leadId: id,
      body,
      kind,
      outcome: typeof payload?.outcome === "string" ? payload.outcome.slice(0, 40) : null,
      authorId: guard.userId,
    });

    await logActivity({
      businessId,
      leadId: id,
      kind: "note_added",
      summary: `${kind === "note" ? "Note" : kind} added: ${body.slice(0, 120)}`,
      actorId: guard.userId,
      actorKind: "staff",
    });

    return NextResponse.json({ ok: true });
  }

  // ── Change stage ──
  if (action === "stage") {
    const stage = typeof payload?.stage === "string" ? payload.stage : "";
    if (!STAGES.includes(stage)) {
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    }
    if (stage === lead.stage) {
      return NextResponse.json({ ok: true, unchanged: true });
    }

    await db
      .update(bizLeads)
      .set({
        stage,
        stageReason:
          typeof payload?.reason === "string" ? payload.reason.slice(0, 1000) : lead.stageReason,
        updatedAt: new Date(),
      })
      .where(eq(bizLeads.id, id));

    await logActivity({
      businessId,
      leadId: id,
      kind: "stage_changed",
      summary: `Stage: ${lead.stage} → ${stage}${payload?.reason ? ` (${String(payload.reason).slice(0, 80)})` : ""}`,
      detail: { from: lead.stage, to: stage },
      actorId: guard.userId,
      actorKind: "staff",
    });

    return NextResponse.json({ ok: true, stage });
  }

  // ── Assign to a staff member ──
  if (action === "assign") {
    const to = typeof payload?.staffId === "string" ? payload.staffId : null;
    await db
      .update(bizLeads)
      .set({ assignedStaffId: to, updatedAt: new Date() })
      .where(eq(bizLeads.id, id));

    await logActivity({
      businessId,
      leadId: id,
      kind: "assigned",
      summary: to ? "Assigned to a staff member" : "Unassigned",
      actorId: guard.userId,
      actorKind: "staff",
    });

    return NextResponse.json({ ok: true });
  }

  // ── Schedule a followup ──
  if (action === "followup") {
    const body = typeof payload?.body === "string" ? payload.body.trim() : "";
    if (body.length === 0) {
      return NextResponse.json({ error: "Say what the followup is about" }, { status: 400 });
    }
    const days = Number(payload?.days);
    const dueAt = new Date(Date.now() + (Number.isFinite(days) && days > 0 ? days : 1) * 86_400_000);

    await db.insert(bizFollowups).values({
      businessId,
      leadId: id,
      conversationId: lead.conversationId,
      channel: "in_app",
      body: body.slice(0, 2000),
      dueAt,
      createdBy: guard.userId,
    });

    // A scheduled followup is the lead's next action.
    await db
      .update(bizLeads)
      .set({ nextAction: body.slice(0, 200), nextActionAt: dueAt, updatedAt: new Date() })
      .where(eq(bizLeads.id, id));

    await logActivity({
      businessId,
      leadId: id,
      kind: "followup_scheduled",
      summary: `Followup scheduled for ${dueAt.toISOString().slice(0, 10)}: ${body.slice(0, 100)}`,
      actorId: guard.userId,
      actorKind: "staff",
    });

    return NextResponse.json({ ok: true, dueAt: dueAt.toISOString() });
  }

  // ── Create a task ──
  if (action === "task") {
    const title = typeof payload?.title === "string" ? payload.title.trim() : "";
    if (title.length === 0) {
      return NextResponse.json({ error: "Task title required" }, { status: 400 });
    }
    const days = Number(payload?.days);
    const dueAt = Number.isFinite(days) && days >= 0
      ? new Date(Date.now() + days * 86_400_000)
      : null;

    await db.insert(bizTasks).values({
      businessId,
      leadId: id,
      title: title.slice(0, 300),
      notes: typeof payload?.notes === "string" ? payload.notes.slice(0, 2000) : null,
      dueAt,
      assignedTo: typeof payload?.staffId === "string" ? payload.staffId : guard.userId,
      priority: ["low", "normal", "high"].includes(payload?.priority) ? payload.priority : "normal",
      createdBy: guard.userId,
    });

    await logActivity({
      businessId,
      leadId: id,
      kind: "note_added",
      summary: `Task created: ${title.slice(0, 120)}`,
      actorId: guard.userId,
      actorKind: "staff",
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "action must be note, stage, assign, followup or task" },
    { status: 400 }
  );
}
