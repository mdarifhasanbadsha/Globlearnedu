import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, staff, applications } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import PerformanceClient from "./_PerformanceClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Staff Performance — Globlearn Admin" };

export default async function StaffPerformancePage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user?.id || !["admin", "staff"].includes(role)) redirect("/sign-in");

  const staffRows = await db
    .select({
      staffId: staff.id,
      userId: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      staffRole: staff.staffRole,
      isActive: staff.isActive,
      joinedAt: staff.createdAt,
    })
    .from(staff)
    .innerJoin(users, eq(staff.userId, users.id))
    .orderBy(desc(staff.createdAt));

  const appStats = await db.execute(sql`
    SELECT
      assigned_staff_id::text            AS staff_id,
      COUNT(*)::int                       AS total,
      COUNT(*) FILTER (WHERE status = 'complete')::int                           AS completed,
      COUNT(*) FILTER (WHERE status IN ('withdrawn','cancelled'))::int             AS withdrawn,
      COUNT(*) FILTER (WHERE is_urgent = TRUE)::int                               AS urgent,
      COUNT(*) FILTER (WHERE status NOT IN ('complete','withdrawn','cancelled'))::int AS active,
      COUNT(*) FILTER (WHERE updated_at >= NOW() - INTERVAL '7 days')::int         AS recent_activity
    FROM applications
    WHERE assigned_staff_id IS NOT NULL
    GROUP BY assigned_staff_id
  `);

  const notesStats = await db.execute(sql`
    SELECT
      assigned_staff_id::text AS staff_id,
      SUM(jsonb_array_length(COALESCE(internal_notes, '[]')))::int AS total_notes
    FROM applications
    WHERE assigned_staff_id IS NOT NULL
    GROUP BY assigned_staff_id
  `);

  const statsMap: Record<string, {
    total: number; completed: number; withdrawn: number;
    urgent: number; active: number; recentActivity: number;
  }> = {};
  for (const r of appStats.rows as any[]) {
    statsMap[r.staff_id] = {
      total: r.total ?? 0,
      completed: r.completed ?? 0,
      withdrawn: r.withdrawn ?? 0,
      urgent: r.urgent ?? 0,
      active: r.active ?? 0,
      recentActivity: r.recent_activity ?? 0,
    };
  }

  const notesMap: Record<string, number> = {};
  for (const r of notesStats.rows as any[]) {
    notesMap[r.staff_id] = r.total_notes ?? 0;
  }

  const members = staffRows.map(s => {
    const stats = statsMap[s.userId] ?? {
      total: 0, completed: 0, withdrawn: 0, urgent: 0, active: 0, recentActivity: 0,
    };
    return {
      staffId: s.staffId,
      userId: s.userId,
      email: s.email ?? "",
      firstName: s.firstName ?? "",
      lastName: s.lastName ?? "",
      staffRole: s.staffRole,
      isActive: s.isActive,
      joinedAt: s.joinedAt?.toISOString() ?? null,
      ...stats,
      notesAdded: notesMap[s.userId] ?? 0,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    };
  });

  const team = members.reduce(
    (acc, m) => ({
      total: acc.total + m.total,
      completed: acc.completed + m.completed,
      active: acc.active + m.active,
      urgent: acc.urgent + m.urgent,
      recentActivity: acc.recentActivity + m.recentActivity,
    }),
    { total: 0, completed: 0, active: 0, urgent: 0, recentActivity: 0 },
  );

  const teamSummary = {
    ...team,
    completionRate: team.total > 0 ? Math.round((team.completed / team.total) * 100) : 0,
    activeStaff: members.filter(m => m.isActive).length,
    totalStaff: members.length,
  };

  return <PerformanceClient members={members} team={teamSummary} />;
}
