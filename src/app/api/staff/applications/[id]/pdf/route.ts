import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users, applicationUniversities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const NAVY  = rgb(0.106, 0.227, 0.420);  // #1B3A6B
const GREY  = rgb(0.392, 0.455, 0.545);  // #647087
const LGREY = rgb(0.933, 0.945, 0.960);  // #EEF1F5
const RED   = rgb(0.784, 0.063, 0.180);  // #C8102E
const BLACK = rgb(0.039, 0.086, 0.157);  // #0A1628

function clean(v: unknown): string {
  if (!v) return "—";
  return String(v).trim() || "—";
}

// Draw a labelled field pair
function drawField(
  page: ReturnType<PDFDocument["addPage"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  boldFont: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  x: number, y: number, label: string, value: string, width = 240
): void {
  page.drawText(label.toUpperCase(), {
    x, y: y + 13, size: 7, font, color: GREY,
  });
  const text = value.length > 55 ? value.substring(0, 52) + "…" : value;
  page.drawText(text, {
    x, y, size: 9, font: boldFont, color: BLACK,
  });
}

// Draw a section header bar
function drawSectionHeader(
  page: ReturnType<PDFDocument["addPage"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  y: number, title: string, pageWidth: number, margin: number
): void {
  page.drawRectangle({
    x: margin, y: y - 4, width: pageWidth - margin * 2, height: 18,
    color: LGREY,
  });
  page.drawText(title, {
    x: margin + 8, y: y + 1, size: 8, font, color: NAVY,
  });
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Fetch application + student
  const [row] = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      programLevel: applications.programLevel,
      scholarshipType: applications.scholarshipType,
      nationality: applications.nationality,
      passportSurname: applications.passportSurname,
      passportGivenName: applications.passportGivenName,
      dateOfBirth: applications.dateOfBirth,
      gender: applications.gender,
      passportNumber: applications.passportNumber,
      passportExpiry: applications.passportExpiry,
      email: applications.email,
      phone: applications.phone,
      addressCity: applications.addressCity,
      addressCountry: applications.addressCountry,
      academicHistory: applications.academicHistory,
      workExperience: applications.workExperience,
      englishProficiency: applications.englishProficiency,
      chineseProficiency: applications.chineseProficiency,
      documents: applications.documents,
      depositPaid: applications.depositPaid,
      serviceChargePaid: applications.serviceChargePaid,
      createdAt: applications.createdAt,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentEmail: users.email,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const targets = await db
    .select({
      universityName: applicationUniversities.universityName,
      programName: applicationUniversities.programName,
      expectedMajor: applicationUniversities.expectedMajor,
      targetStatus: applicationUniversities.targetStatus,
      priority: applicationUniversities.priority,
    })
    .from(applicationUniversities)
    .where(eq(applicationUniversities.applicationId, id))
    .orderBy(applicationUniversities.priority);

  // ── Build PDF ──────────────────────────────────────────────
  const pdfDoc = await PDFDocument.create();
  const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page       = pdfDoc.addPage([595, 842]); // A4
  const { width }  = page.getSize();
  const margin     = 40;
  const colW       = (width - margin * 2) / 2 - 10;
  let y            = 802;

  const studentName = [row.passportGivenName, row.passportSurname].filter(Boolean).join(" ")
    || [row.studentFirstName, row.studentLastName].filter(Boolean).join(" ")
    || row.studentEmail || "Unknown";

  // ── Header ───────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 807, width, height: 35, color: NAVY });
  page.drawText("GLOBLEARN EDUCATION", { x: margin, y: 819, size: 12, font: boldFont, color: rgb(1, 1, 1) });
  page.drawText("Staff Application Summary", { x: margin, y: 809, size: 7, font, color: rgb(0.7, 0.8, 0.9) });
  page.drawText(`Generated: ${new Date().toLocaleDateString("en-GB")}`, {
    x: width - margin - 80, y: 819, size: 7, font, color: rgb(0.7, 0.8, 0.9),
  });

  y = 770;

  // App Number + Status bar
  page.drawText(row.applicationNumber, { x: margin, y, size: 16, font: boldFont, color: NAVY });
  const statusText = (row.status ?? "").replace(/_/g, " ").toUpperCase();
  page.drawText(statusText, { x: margin, y: y - 16, size: 9, font, color: GREY });
  y -= 36;

  // ── Personal Information ─────────────────────────────────
  drawSectionHeader(page, boldFont, y, "PERSONAL INFORMATION", width, margin);
  y -= 26;
  drawField(page, font, boldFont, margin, y, "Full Name (Passport)", studentName, colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Nationality", clean(row.nationality), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "Date of Birth", clean(row.dateOfBirth), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Gender", clean(row.gender), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "Passport Number", clean(row.passportNumber), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Passport Expiry", clean(row.passportExpiry), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "Email", clean(row.email ?? row.studentEmail), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Phone", clean(row.phone), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "City", clean(row.addressCity), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Country", clean(row.addressCountry), colW);
  y -= 24;

  // ── Programme ───────────────────────────────────────────
  drawSectionHeader(page, boldFont, y, "PROGRAMME", width, margin);
  y -= 26;
  drawField(page, font, boldFont, margin, y, "Programme Level", clean(row.programLevel), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Scholarship", clean(row.scholarshipType), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "Deposit Paid", row.depositPaid ? "YES" : "PENDING", colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Service Charge", row.serviceChargePaid ? "YES" : "PENDING", colW);
  y -= 24;

  // ── University Targets ───────────────────────────────────
  drawSectionHeader(page, boldFont, y, "UNIVERSITY TARGETS", width, margin);
  y -= 22;
  if (targets.length === 0) {
    page.drawText("No university targets.", { x: margin + 8, y, size: 9, font, color: GREY });
    y -= 20;
  } else {
    for (const t of targets) {
      page.drawText(`${t.priority}. ${clean(t.universityName)}`, {
        x: margin + 8, y, size: 9, font: boldFont, color: BLACK,
      });
      const sub = [t.programName, t.expectedMajor, t.targetStatus?.replace(/_/g, " ")].filter(Boolean).join(" · ");
      if (sub) {
        page.drawText(sub, { x: margin + 8, y: y - 11, size: 7.5, font, color: GREY });
        y -= 22;
      } else {
        y -= 14;
      }
    }
  }
  y -= 10;

  // ── Academic History ────────────────────────────────────
  const academic = (row.academicHistory ?? []) as Array<Record<string, string>>;
  if (academic.length > 0) {
    drawSectionHeader(page, boldFont, y, "ACADEMIC HISTORY", width, margin);
    y -= 22;
    for (const h of academic.slice(0, 3)) {
      const school = h.schoolName ?? h.institution ?? "Unknown";
      const degree = h.degree ?? h.level ?? "";
      const years = [h.startYear ?? h.startDate, h.endYear ?? h.endDate].filter(Boolean).join("–");
      page.drawText(`${school}${degree ? ` — ${degree}` : ""}${years ? ` (${years})` : ""}`, {
        x: margin + 8, y, size: 9, font: boldFont, color: BLACK,
      });
      const grade = h.grade ?? h.gpa;
      if (grade) {
        page.drawText(`GPA/Grade: ${grade}`, { x: margin + 8, y: y - 11, size: 7.5, font, color: GREY });
        y -= 22;
      } else {
        y -= 14;
      }
    }
    y -= 8;
  }

  // ── Documents ───────────────────────────────────────────
  const docs = (row.documents ?? {}) as Record<string, string>;
  const docKeys = Object.keys(docs).filter(k => docs[k]);
  if (docKeys.length > 0) {
    drawSectionHeader(page, boldFont, y, "DOCUMENTS UPLOADED", width, margin);
    y -= 22;
    const docLabels: Record<string, string> = {
      passport: "Passport Copy", photo: "Passport Photo",
      highschool_certificate: "High School Certificate", highschool_transcript: "High School Transcript",
      bachelor_certificate: "Bachelor Certificate", bachelor_transcript: "Bachelor Transcript",
      medical_certificate: "Medical Certificate", financial_statement: "Financial Statement",
      recommendation_letter: "Recommendation Letter", cv: "CV / Resume",
      research_proposal: "Research Proposal", language_certificate: "Language Certificate",
    };
    const perRow = 3;
    for (let i = 0; i < docKeys.length; i += perRow) {
      const rowDocs = docKeys.slice(i, i + perRow);
      rowDocs.forEach((k, j) => {
        const xPos = margin + 8 + j * ((width - margin * 2) / perRow);
        page.drawText("✓ " + (docLabels[k] ?? k.replace(/_/g, " ")), {
          x: xPos, y, size: 8, font: boldFont, color: rgb(0.024, 0.373, 0.290),
        });
      });
      y -= 14;
    }
    y -= 6;
  }

  // ── Footer ──────────────────────────────────────────────
  page.drawLine({
    start: { x: margin, y: 30 }, end: { x: width - margin, y: 30 }, thickness: 0.5, color: LGREY,
  });
  page.drawText("Globlearn Education — Confidential Staff Document — Not for Distribution", {
    x: margin, y: 18, size: 7, font, color: GREY,
  });
  page.drawText(row.applicationNumber, {
    x: width - margin - 80, y: 18, size: 7, font: boldFont, color: GREY,
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="application-${row.applicationNumber}.pdf"`,
      "Content-Length": String(pdfBytes.length),
    },
  });
}
