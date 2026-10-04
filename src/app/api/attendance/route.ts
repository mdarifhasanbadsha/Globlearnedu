import { NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { cscAttendanceRecords, cscAttendanceStudents } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ATTENDANCE_ADMIN_PASSWORD || "112233";
const TZ = process.env.ATTENDANCE_TIMEZONE || "Asia/Dhaka";
let attendanceSchemaReady: Promise<void> | null = null;
async function ensureAttendanceSchema() {
  if (!attendanceSchemaReady) {
    attendanceSchemaReady = (async () => {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS csc_attendance_students (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(120) NOT NULL, phone varchar(30) NOT NULL UNIQUE, phone_last4 varchar(4) NOT NULL, is_active boolean NOT NULL DEFAULT true, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now())`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS csc_attendance_student_name_idx ON csc_attendance_students(name)`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS csc_attendance_records (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES csc_attendance_students(id) ON DELETE CASCADE, attendance_at timestamp NOT NULL DEFAULT now(), attendance_day varchar(10) NOT NULL, created_at timestamp NOT NULL DEFAULT now(), CONSTRAINT csc_attendance_student_day_uq UNIQUE(student_id, attendance_day))`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS csc_attendance_at_idx ON csc_attendance_records(attendance_at)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS csc_attendance_student_idx ON csc_attendance_records(student_id)`);
    })().catch(err => { attendanceSchemaReady = null; throw err; });
  }
  return attendanceSchemaReady;
}

function normalizePhone(value: string) {
  return value.replace(/[^0-9+]/g, "").replace(/^00/, "+");
}
function digits(value: string) { return value.replace(/\D/g, ""); }
function maskPhone(value: string) { const d=digits(value); return d.length <= 4 ? "••••" : d.slice(0,-4) + "••••"; }
function dayKey(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
}
function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).format(d);
}
function isClassAttendanceWindow(d = new Date()) { const hour = Number(new Intl.DateTimeFormat("en-US",{timeZone:TZ,hour:"2-digit",hour12:false}).format(d)); return hour >= 22 && hour < 23; }
function csvCell(value: unknown) {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function csv(rows: string[][]) {
  return rows.map(r => r.map(csvCell).join(",")).join("\r\n");
}
function error(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action") || "students";
  try {
    await ensureAttendanceSchema();
    if (action === "students") {
      const students = await db.select().from(cscAttendanceStudents)
        .where(eq(cscAttendanceStudents.isActive, true))
        .orderBy(asc(cscAttendanceStudents.name));
      const records = await db.select({
        studentId: cscAttendanceRecords.studentId,
        attendanceAt: cscAttendanceRecords.attendanceAt,
        attendanceDay: cscAttendanceRecords.attendanceDay,
      }).from(cscAttendanceRecords)
        .where(gte(cscAttendanceRecords.attendanceAt, new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)))
        .orderBy(asc(cscAttendanceRecords.attendanceAt));
      return NextResponse.json({
        ok: true,
        students: students.map((s, i) => ({
          serial: i + 1, id: s.id, name: s.name, phoneMasked: maskPhone(s.phone), 
        })),
        records: records.map(r => ({
          studentId: r.studentId,
          attendanceAt: r.attendanceAt.toISOString(),
          attendanceDay: r.attendanceDay,
        })),
        timezone: TZ,
      });
    }

    if (action === "live") {
      const password = req.nextUrl.searchParams.get("password") || "";
      if (password !== ADMIN_PASSWORD) return error("Invalid admin password.", 401);
      const today = dayKey();
      const students = await db.select().from(cscAttendanceStudents).orderBy(asc(cscAttendanceStudents.name));
      const records = await db.select({studentId:cscAttendanceRecords.studentId,attendanceAt:cscAttendanceRecords.attendanceAt})
        .from(cscAttendanceRecords).where(eq(cscAttendanceRecords.attendanceDay,today)).orderBy(asc(cscAttendanceRecords.attendanceAt));
      return NextResponse.json({ok:true,date:today,classOpen:isClassAttendanceWindow(),timezone:TZ,
        students:students.map((s,i)=>({serial:i+1,id:s.id,name:s.name,phoneMasked:maskPhone(s.phone),active:s.isActive})),
        records:records.map(r=>({studentId:r.studentId,attendanceAt:r.attendanceAt.toISOString()}))});
    }

    if (action === "report") {
      const password = req.nextUrl.searchParams.get("password") || "";
      if (password !== ADMIN_PASSWORD) return error("Invalid admin password.", 401);
      const type = req.nextUrl.searchParams.get("type") || "full";
      const date = req.nextUrl.searchParams.get("date") || dayKey();
      const students = await db.select().from(cscAttendanceStudents)
        .where(eq(cscAttendanceStudents.isActive, true)).orderBy(asc(cscAttendanceStudents.name));

      if (type === "daily") {
        const records = await db.select({
          attendanceAt: cscAttendanceRecords.attendanceAt,
          attendanceDay: cscAttendanceRecords.attendanceDay,
          studentId: cscAttendanceRecords.studentId,
        }).from(cscAttendanceRecords)
          .where(eq(cscAttendanceRecords.attendanceDay, date))
          .orderBy(asc(cscAttendanceRecords.attendanceAt));
        const map = new Map(students.map(s => [s.id, s]));
        const rows = [["Serial","Name","Phone","Date","Attendance Time"]];
        records.forEach((r) => {
          const s = map.get(r.studentId);
          if (s) rows.push([String(students.findIndex(x => x.id === s.id)+1), s.name, s.phone, r.attendanceDay, formatDateTime(r.attendanceAt)]);
        });
        return new NextResponse("\uFEFF" + csv(rows), {
          headers: {"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="attendance-${date}.csv"`},
        });
      }

      if (type === "matrix") {
        const start = new Date(date + "T00:00:00");
        const days = Array.from({length:90},(_,i)=> {
          const d = new Date(start); d.setDate(d.getDate()+i);
          return dayKey(d);
        });
        const from = new Date(start); const to = new Date(start); to.setDate(to.getDate()+90);
        const records = await db.select().from(cscAttendanceRecords)
          .where(and(gte(cscAttendanceRecords.attendanceAt, from), lte(cscAttendanceRecords.attendanceAt, to)))
          .orderBy(asc(cscAttendanceRecords.attendanceAt));
        const byStudentDay = new Map<string,string>();
        records.forEach(r => byStudentDay.set(r.studentId+"|"+r.attendanceDay, formatDateTime(r.attendanceAt)));
        const rows = [["Serial","Name","Phone",...days]];
        students.forEach((s,i)=>rows.push([
          String(i+1),s.name,s.phone,
          ...days.map(d=>byStudentDay.get(s.id+"|"+d)||"")
        ]));
        return new NextResponse("\uFEFF" + csv(rows), {
          headers: {"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="attendance-90-days-from-${date}.csv"`},
        });
      }

      const records = await db.select({
        attendanceAt: cscAttendanceRecords.attendanceAt,
        attendanceDay: cscAttendanceRecords.attendanceDay,
        studentId: cscAttendanceRecords.studentId,
      }).from(cscAttendanceRecords).orderBy(asc(cscAttendanceRecords.attendanceAt));
      const map = new Map(students.map(s => [s.id, s]));
      const rows = [["Serial","Name","Phone","Date","Attendance Time"]];
      records.forEach(r => {
        const s=map.get(r.studentId);
        if(s) rows.push([String(students.findIndex(x=>x.id===s.id)+1),s.name,s.phone,r.attendanceDay,formatDateTime(r.attendanceAt)]);
      });
      return new NextResponse("\uFEFF" + csv(rows), {
        headers: {"Content-Type":"text/csv; charset=utf-8","Content-Disposition":'attachment; filename="attendance-full-history.csv"'},
      });
    }
    return error("Unknown action.", 404);
  } catch (e) {
    console.error(e);
    return error("Something went wrong. Please try again.", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureAttendanceSchema();
    const body = await req.json();
    const action = String(body?.action || "");
    if (action === "register") {
      const name = String(body?.name || "").trim().replace(/\s+/g, " ");
      const phone = normalizePhone(String(body?.phone || ""));
      const phoneDigits = digits(phone);
      if (name.length < 2 || name.length > 120) return error("Please enter a valid name.");
      if (phoneDigits.length < 7 || phoneDigits.length > 20) return error("Please enter a valid phone number.");
      const existing = await db.select().from(cscAttendanceStudents).where(eq(cscAttendanceStudents.phone, phone)).limit(1);
      if (existing[0]) return NextResponse.json({ok:true,student:{id:existing[0].id,name:existing[0].name},existing:true});
      const inserted = await db.insert(cscAttendanceStudents).values({
        name, phone, phoneLast4:phoneDigits.slice(-4)
      }).returning();
      const s=inserted[0];
      return NextResponse.json({ok:true,student:{id:s.id,name:s.name},existing:false});
    }

    if (action === "setStudentStatus") {
      const password = String(body?.password || "");
      const studentId = String(body?.studentId || "");
      const active = Boolean(body?.active);
      if (password !== ADMIN_PASSWORD) return error("Invalid admin password.", 401);
      if (!studentId) return error("Student ID is required.");
      const student = await db.select().from(cscAttendanceStudents).where(eq(cscAttendanceStudents.id, studentId)).limit(1);
      if (!student[0]) return error("Student not found.",404);
      await db.update(cscAttendanceStudents).set({isActive: active, updatedAt: new Date()}).where(eq(cscAttendanceStudents.id, studentId));
      return NextResponse.json({ok:true,message:active?"Student activated.":"Student deactivated."});
    }

    if (action === "deleteStudent") {
      const password = String(body?.password || "");
      const studentId = String(body?.studentId || "");
      if (password !== ADMIN_PASSWORD) return error("Invalid admin password.", 401);
      if (!studentId) return error("Student ID is required.");
      const student = await db.select().from(cscAttendanceStudents).where(eq(cscAttendanceStudents.id, studentId)).limit(1);
      if (!student[0]) return error("Student not found.",404);
      await db.delete(cscAttendanceStudents).where(eq(cscAttendanceStudents.id, studentId));
      return NextResponse.json({ok:true,message:"Student and all attendance history permanently deleted."});
    }

    if (action === "attend" || action === "manualAttend") {
      const studentId = String(body?.studentId || "");
      const last4 = digits(String(body?.last4 || ""));
      const isManual = action === "manualAttend";
      if (isManual) {
        if (String(body?.password || "") !== ADMIN_PASSWORD) return error("Invalid admin password.",401);
      } else {
        if (!isClassAttendanceWindow()) return error("Please wait for the class to start at 10 PM Bangladesh time.",403);
        if (last4.length !== 4) return error("Enter the last 4 digits of your registered phone number.");
      }
      if (!studentId) return error("Student ID is required.");
      const student = await db.select().from(cscAttendanceStudents)
        .where(and(eq(cscAttendanceStudents.id,studentId),eq(cscAttendanceStudents.isActive,true))).limit(1);
      const s=student[0];
      if(!s) return error("Student not found.",404);
      if (!isManual && s.phoneLast4 !== last4) return error("Incorrect last 4 digits. Please try again.",401);
      const now=new Date(), day=dayKey(now);
      const existingToday=await db.select().from(cscAttendanceRecords)
        .where(and(eq(cscAttendanceRecords.studentId,s.id),eq(cscAttendanceRecords.attendanceDay,day))).limit(1);
      if(existingToday[0]) return NextResponse.json({ok:false,message:"Attendance already recorded for today.",attendanceAt:existingToday[0].attendanceAt.toISOString()},{status:409});
      const last=await db.select().from(cscAttendanceRecords).where(eq(cscAttendanceRecords.studentId,s.id))
        .orderBy(desc(cscAttendanceRecords.attendanceAt)).limit(1);
      if(last[0] && now.getTime()-last[0].attendanceAt.getTime() < 24*60*60*1000)
        return NextResponse.json({ok:false,message:"Attendance already recorded within the last 24 hours."},{status:409});
      try {
        const inserted=await db.insert(cscAttendanceRecords).values({studentId:s.id,attendanceAt:now,attendanceDay:day}).returning();
        return NextResponse.json({ok:true,message:isManual?"Attendance marked manually.":"Attendance recorded successfully.",attendanceAt:inserted[0].attendanceAt.toISOString(),attendanceDay:day});
      } catch(e:any) {
        if(String(e?.message||"").toLowerCase().includes("csc_attendance_student_day_uq"))
          return NextResponse.json({ok:false,message:"Attendance has already been recorded for today."},{status:409});
        throw e;
      }
    }
    return error("Unknown action.",404);
  } catch (e) {
    console.error(e);
    return error("Something went wrong. Please try again.",500);
  }
}
