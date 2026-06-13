import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { zipSync, strToU8 } from "fflate";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const DOC_LABELS: Record<string, string> = {
  passport: "01-Passport-Copy",
  photo: "02-Passport-Photo",
  highschool_certificate: "03-Highschool-Certificate",
  highschool_transcript: "04-Highschool-Transcript",
  bachelor_certificate: "05-Bachelor-Certificate",
  bachelor_transcript: "06-Bachelor-Transcript",
  language_certificate: "07-Language-Certificate",
  medical_certificate: "08-Medical-Certificate",
  financial_statement: "09-Financial-Statement",
  recommendation_letter: "10-Recommendation-Letter",
  cv: "11-CV-Resume",
  research_proposal: "12-Research-Proposal",
};

function guessExt(url: string, contentType: string): string {
  if (contentType.includes("pdf")) return ".pdf";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return ".jpg";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  const match = url.split("?")[0].match(/\.(\w+)$/);
  return match ? `.${match[1]}` : ".bin";
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [row] = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      documents: applications.documents,
      passportSurname: applications.passportSurname,
      passportGivenName: applications.passportGivenName,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentEmail: users.email,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const docs = (row.documents ?? {}) as Record<string, string>;
  const docEntries = Object.entries(docs).filter(([, url]) => url);

  if (docEntries.length === 0) {
    return NextResponse.json({ error: "No documents uploaded yet" }, { status: 400 });
  }

  const studentName = (
    [row.passportGivenName, row.passportSurname].filter(Boolean).join(" ")
    || [row.studentFirstName, row.studentLastName].filter(Boolean).join(" ")
    || row.studentEmail || "Student"
  ).replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-");

  // Fetch all documents concurrently (cap at 12)
  const files: Record<string, Uint8Array> = {};

  const results = await Promise.allSettled(
    docEntries.slice(0, 12).map(async ([key, url]) => {
      const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const contentType = resp.headers.get("content-type") ?? "";
      const ext = guessExt(url, contentType);
      const label = DOC_LABELS[key] ?? key.replace(/_/g, "-");
      const filename = `${label}${ext}`;
      const buf = await resp.arrayBuffer();
      return { filename, data: new Uint8Array(buf) };
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      files[result.value.filename] = result.value.data;
    }
  }

  if (Object.keys(files).length === 0) {
    return NextResponse.json({ error: "Could not fetch any documents" }, { status: 500 });
  }

  // Add a README.txt
  const readmeTxt = [
    `Application: ${row.applicationNumber}`,
    `Student: ${studentName}`,
    `Downloaded: ${new Date().toISOString()}`,
    `Documents: ${Object.keys(files).length}`,
    "",
    "Globlearn Education — Confidential",
  ].join("\n");
  files["README.txt"] = strToU8(readmeTxt);

  const zipped = zipSync(files, { level: 6 });

  return new NextResponse(Buffer.from(zipped), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${row.applicationNumber}-${studentName}-Documents.zip"`,
      "Content-Length": String(zipped.length),
    },
  });
}
