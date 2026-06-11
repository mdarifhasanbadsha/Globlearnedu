import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users, staff, applications, partners, universities } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // KPI counts
  const [kpi] = await db.execute(sql`
    SELECT
      COUNT(*)::int                                                                                          AS total,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::int                                 AS this_month,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()) - INTERVAL '1 month'
                         AND created_at < date_trunc('month', NOW()))::int                                  AS last_month,
      COUNT(*) FILTER (WHERE status IN ('final_admission','student_accepts','service_charge_payment','jw202_issued','complete'))::int AS admitted
    FROM applications
  `).then(r => r.rows as any[]);

  const [partnerCount] = await db.execute(sql`
    SELECT COUNT(*)::int AS count FROM partners WHERE is_approved = TRUE
  `).then(r => r.rows as any[]);

  const [uniCount] = await db.execute(sql`
    SELECT COUNT(*)::int AS count FROM universities WHERE is_active = TRUE
  `).then(r => r.rows as any[]);

  // Status breakdown
  const statusRows = await db.execute(sql`
    SELECT status::text, COUNT(*)::int AS count
    FROM applications
    GROUP BY status
  `).then(r => r.rows as any[]);

  const statusMap: Record<string, number> = {};
  for (const r of statusRows) statusMap[r.status] = r.count;

  // Program breakdown
  const programRows = await db.execute(sql`
    SELECT program_level::text AS level, COUNT(*)::int AS count
    FROM applications
    WHERE program_level IS NOT NULL
    GROUP BY program_level
    ORDER BY count DESC
  `).then(r => r.rows as any[]);

  // Recent 8 applications
  const recentRows = await db.execute(sql`
    SELECT
      a.id,
      a.application_number,
      a.status::text,
      a.program_level::text,
      a.nationality,
      a.created_at,
      u.first_name,
      u.last_name,
      u.email
    FROM applications a
    JOIN users u ON u.id = a.student_id
    ORDER BY a.created_at DESC
    LIMIT 8
  `).then(r => r.rows as any[]);

  // Top 5 partners by student count
  const topPartners = await db.execute(sql`
    SELECT
      p.id,
      p.agency_name,
      p.agency_country,
      u.first_name,
      u.last_name,
      COUNT(a.id)::int AS student_count,
      COUNT(a.id) FILTER (WHERE a.status IN ('final_admission','student_accepts','service_charge_payment','jw202_issued','complete'))::int AS admitted_count
    FROM partners p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN applications a ON a.partner_id = p.id
    WHERE p.is_approved = TRUE
    GROUP BY p.id, p.agency_name, p.agency_country, u.first_name, u.last_name
    ORDER BY student_count DESC
    LIMIT 5
  `).then(r => r.rows as any[]);

  return NextResponse.json({
    kpi: {
      total: kpi?.total ?? 0,
      thisMonth: kpi?.this_month ?? 0,
      lastMonth: kpi?.last_month ?? 0,
      admitted: kpi?.admitted ?? 0,
      activePartners: partnerCount?.count ?? 0,
      universities: uniCount?.count ?? 0,
    },
    statusBreakdown: statusMap,
    programBreakdown: programRows.map((r: any) => ({ level: r.level, count: r.count })),
    recentApplications: recentRows.map((r: any) => ({
      id: r.id,
      applicationNumber: r.application_number,
      status: r.status,
      programLevel: r.program_level,
      nationality: r.nationality,
      createdAt: r.created_at,
      studentName: [r.first_name, r.last_name].filter(Boolean).join(" ") || r.email,
      studentEmail: r.email,
    })),
    topPartners: topPartners.map((r: any) => ({
      id: r.id,
      agencyName: r.agency_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "Unknown",
      agencyCountry: r.agency_country,
      studentCount: r.student_count,
      admittedCount: r.admitted_count,
    })),
  });
}
