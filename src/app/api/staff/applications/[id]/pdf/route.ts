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
      religion: applications.religion,
      passportNumber: applications.passportNumber,
      passportExpiry: applications.passportExpiry,
      email: applications.email,
      phone: applications.phone,
      addressCity: applications.addressCity,
      addressCountry: applications.addressCountry,
      addressDetailed: applications.addressDetailed,
      addressPostcode: applications.addressPostcode,
      academicHistory: applications.academicHistory,
      workExperience: applications.workExperience,
      englishProficiency: applications.englishProficiency,
      chineseProficiency: applications.chineseProficiency,
      parentInfo: applications.parentInfo,
      sponsorInfo: applications.sponsorInfo,
      isCurrentlyInChina: applications.isCurrentlyInChina,
      chinaStatus: applications.chinaStatus,
      selectedUniversities: applications.selectedUniversities,
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
  drawField(page, font, boldFont, margin, y, "Religion", clean(row.religion), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Passport Number", clean(row.passportNumber), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "Passport Expiry", clean(row.passportExpiry), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Email", clean(row.email ?? row.studentEmail), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "Phone", clean(row.phone), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "City", clean(row.addressCity), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "Country", clean(row.addressCountry), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Postcode", clean(row.addressPostcode), colW);
  if (row.addressDetailed) {
    y -= 32;
    drawField(page, font, boldFont, margin, y, "Address", String(row.addressDetailed).substring(0, 55), width - margin * 2);
  }
  y -= 24;

  // ── Programme ───────────────────────────────────────────
  drawSectionHeader(page, boldFont, y, "PROGRAMME & PAYMENTS", width, margin);
  y -= 26;
  drawField(page, font, boldFont, margin, y, "Programme Level", clean(row.programLevel), colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Scholarship", clean(row.scholarshipType), colW);
  y -= 32;
  drawField(page, font, boldFont, margin, y, "Deposit Paid", row.depositPaid ? "YES" : "PENDING", colW);
  drawField(page, font, boldFont, margin + colW + 20, y, "Service Charge", row.serviceChargePaid ? "YES" : "PENDING", colW);
  y -= 24;

  // ── University Targets ───────────────────────────────────
  const selectedUnivs = (row.selectedUniversities ?? []) as Array<{ universityName?: string; programName?: string; expectedMajor?: string }>;
  const allTargets = targets.length > 0 ? targets : selectedUnivs;
  drawSectionHeader(page, boldFont, y, "UNIVERSITY SELECTIONS", width, margin);
  y -= 22;
  if (allTargets.length === 0) {
    page.drawText("No universities selected.", { x: margin + 8, y, size: 9, font, color: GREY });
    y -= 20;
  } else {
    for (let ti = 0; ti < allTargets.length; ti++) {
      const t = allTargets[ti] as Record<string, unknown>;
      const uName = clean(t.universityName);
      const prog = t.programName ? String(t.programName) : null;
      const major = t.expectedMajor ? String(t.expectedMajor) : null;
      const tStatus = t.targetStatus ? String(t.targetStatus).replace(/_/g, " ") : null;
      const priority = t.priority ? String(t.priority) : String(ti + 1);
      page.drawText(`${priority}. ${uName}`, { x: margin + 8, y, size: 9, font: boldFont, color: BLACK });
      const sub = [prog, major, tStatus].filter(Boolean).join(" · ");
      if (sub) {
        page.drawText(sub, { x: margin + 8, y: y - 11, size: 7.5, font, color: GREY });
        y -= 22;
      } else {
        y -= 14;
      }
      if (y < 100) break;
    }
  }
  y -= 10;

  // ── Academic History ────────────────────────────────────
  const academic = (row.academicHistory ?? []) as Array<Record<string, string>>;
  if (academic.length > 0 && y > 120) {
    drawSectionHeader(page, boldFont, y, "ACADEMIC HISTORY", width, margin);
    y -= 22;
    for (const h of academic.slice(0, 4)) {
      // Use correct DB field names: institution, qualification, fieldOfStudy
      const school = h.institution ?? h.schoolName ?? "Unknown";
      const degree = h.qualification ?? h.degree ?? h.level ?? "";
      const field = h.fieldOfStudy ?? h.major ?? h.subject ?? "";
      const years = [h.startYear, h.endYear].filter(Boolean).join("–");
      const label = [school, degree, field].filter(Boolean).join(" — ");
      page.drawText(label.substring(0, 75), { x: margin + 8, y, size: 9, font: boldFont, color: BLACK });
      const sub = [h.country, years, h.grade ? `Grade: ${h.grade}` : null].filter(Boolean).join(" · ");
      if (sub) {
        page.drawText(sub, { x: margin + 8, y: y - 11, size: 7.5, font, color: GREY });
        y -= 22;
      } else {
        y -= 14;
      }
      if (y < 100) break;
    }
    y -= 8;
  }

  // ── Work Experience ─────────────────────────────────────
  const workExp = (row.workExperience ?? []) as Array<Record<string, string>>;
  if (workExp.length > 0 && y > 120) {
    drawSectionHeader(page, boldFont, y, "WORK EXPERIENCE", width, margin);
    y -= 22;
    for (const w of workExp.slice(0, 3)) {
      const title = w.jobTitle ?? w.position ?? w.role ?? "Unknown";
      const employer = w.employer ?? "";
      page.drawText(`${title}${employer ? ` — ${employer}` : ""}`.substring(0, 75), { x: margin + 8, y, size: 9, font: boldFont, color: BLACK });
      const sub = [w.country, [w.startDate, w.endDate || "Present"].filter(Boolean).join("–")].filter(Boolean).join(" · ");
      if (sub) {
        page.drawText(sub, { x: margin + 8, y: y - 11, size: 7.5, font, color: GREY });
        y -= 22;
      } else {
        y -= 14;
      }
      if (y < 100) break;
    }
    y -= 8;
  }

  // ── Language Proficiency ────────────────────────────────
  const engProf = (row.englishProficiency ?? {}) as Record<string, string>;
  const chnProf = (row.chineseProficiency ?? {}) as Record<string, string | boolean>;
  if ((engProf.testType || chnProf.hasHSK) && y > 120) {
    drawSectionHeader(page, boldFont, y, "LANGUAGE PROFICIENCY", width, margin);
    y -= 26;
    if (engProf.testType) {
      const engText = `English: ${engProf.testType} — Score: ${engProf.score ?? "—"} (${engProf.testDate ?? "—"})`;
      drawField(page, font, boldFont, margin, y, "English", engText, colW * 2 + 20);
      y -= 32;
    }
    if (chnProf.hasHSK) {
      const hskText = `HSK Level ${chnProf.hskLevel ?? "—"}, Score ${chnProf.hskScore ?? "—"}`;
      drawField(page, font, boldFont, margin, y, "Chinese (HSK)", hskText, colW);
      y -= 32;
    }
    y -= 4;
  }

  // ── Parent & Sponsor ────────────────────────────────────
  const parentInfo = (row.parentInfo ?? {}) as Record<string, string>;
  const sponsorInfo = (row.sponsorInfo ?? {}) as Record<string, string | boolean>;
  if ((parentInfo.fatherName || parentInfo.motherName) && y > 120) {
    drawSectionHeader(page, boldFont, y, "PARENT / SPONSOR INFORMATION", width, margin);
    y -= 26;
    if (parentInfo.fatherName) {
      drawField(page, font, boldFont, margin, y, "Father", `${parentInfo.fatherName} · ${parentInfo.fatherOccupation ?? "—"} · ${parentInfo.fatherPhone ?? "—"}`, colW * 2 + 20);
      y -= 32;
    }
    if (parentInfo.motherName) {
      drawField(page, font, boldFont, margin, y, "Mother", `${parentInfo.motherName} · ${parentInfo.motherOccupation ?? "—"} · ${parentInfo.motherPhone ?? "—"}`, colW * 2 + 20);
      y -= 32;
    }
    if (sponsorInfo.sponsorName) {
      drawField(page, font, boldFont, margin, y, "Sponsor", `${sponsorInfo.sponsorName} · ${sponsorInfo.sponsorRelationship ?? "—"} · Income: ${sponsorInfo.annualIncomeRange ?? "—"}`, colW * 2 + 20);
      y -= 32;
    }
    y -= 4;
  }

  // ── Documents ───────────────────────────────────────────
  const docs = (row.documents ?? {}) as Record<string, string>;
  const docKeys = Object.keys(docs).filter(k => docs[k]);
  if (docKeys.length > 0 && y > 80) {
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
        page.drawText("+ " + (docLabels[k] ?? k.replace(/_/g, " ")), {
          x: xPos, y, size: 8, font: boldFont, color: rgb(0.024, 0.373, 0.290),
        });
      });
      y -= 14;
      if (y < 60) break;
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
