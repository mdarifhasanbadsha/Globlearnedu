import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizKnowledgeSources, bizKnowledgeEntries } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { checkEntry } from "@/lib/business/sanity";
import { correctDeadline } from "@/lib/business/deadline-fix";
import { deepseekChat, isDeepSeekConfigured } from "@/lib/business/deepseek";
import { parseExtraction, buildVisionMessages } from "@/lib/business/knowledge";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  const sources = await db
    .select()
    .from(bizKnowledgeSources)
    .where(eq(bizKnowledgeSources.businessId, businessId))
    .orderBy(desc(bizKnowledgeSources.createdAt))
    .limit(50);

  const entries = await db
    .select()
    .from(bizKnowledgeEntries)
    .where(eq(bizKnowledgeEntries.businessId, businessId))
    .orderBy(desc(bizKnowledgeEntries.createdAt))
    .limit(200);

  return NextResponse.json({
    sources: sources.map((s) => ({
      id: s.id,
      title: s.title,
      status: s.status,
      error: s.extractionError,
      createdAt: s.createdAt.toISOString(),
    })),
    entries: entries.map((e) => ({
      id: e.id,
      sourceId: e.sourceId,
      universityName: e.universityName,
      city: e.city,
      programName: e.programName,
      level: e.level,
      tuitionAmount: e.tuitionAmount,
      tuitionCurrency: e.tuitionCurrency,
      tuitionPeriod: e.tuitionPeriod,
      hostelAmount: e.hostelAmount,
      hostelPeriod: e.hostelPeriod,
      applicationFee: e.applicationFee,
      insuranceFee: e.insuranceFee,
      intakeText: e.intakeText,
      intakeMonths: e.intakeMonths,
      applicationDeadline: e.applicationDeadline,
      sourcePage: e.sourcePage,
      status: e.status,
      issues: checkEntry({
        intakeText: e.intakeText,
        applicationDeadline: e.applicationDeadline,
        tuitionAmount: e.tuitionAmount,
        tuitionPeriod: e.tuitionPeriod,
      }).map((i) => i.message),
    })),
  });
}

/**
 * Upload one or more brochure images. Each is sent to the vision model and
 * the result stored as DRAFT knowledge entries for human approval.
 */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  if (!isDeepSeekConfigured()) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY is not configured, so extraction is unavailable." },
      { status: 503 }
    );
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });

  const file = form.get("file");
  const title =
    (typeof form.get("title") === "string" ? (form.get("title") as string).trim() : "") ||
    "Untitled brochure";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported type ${file.type || "unknown"}. Use JPEG, PNG, WebP or GIF.` },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 413 });
  }

  const businessId = getBusinessId();

  const [source] = await db
    .insert(bizKnowledgeSources)
    .values({
      businessId,
      title: title.slice(0, 255),
      kind: "image",
      mimeType: file.type,
      sizeBytes: file.size,
      status: "extracting",
      uploadedBy: guard.userId,
    })
    .returning({ id: bizKnowledgeSources.id });

  // Encode as a data URL for the vision model.
  const buf = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buf.toString("base64")}`;

  const result = await deepseekChat({
    messages: buildVisionMessages(dataUrl, title),
    // Vision reasoning can consume thousands of tokens before the JSON body,
    // so this ceiling must be generous or the output truncates mid-object.
    maxTokens: 8000,
    temperature: 0,
    timeoutMs: 90_000,
  });

  if (!result.ok || !result.content) {
    await db
      .update(bizKnowledgeSources)
      .set({
        status: "failed",
        extractionError: result.error ?? "No output from the vision model",
        updatedAt: new Date(),
      })
      .where(eq(bizKnowledgeSources.id, source.id));

    return NextResponse.json(
      { error: result.error ?? "Extraction failed", sourceId: source.id },
      { status: 502 }
    );
  }

  const extracted = parseExtraction(result.content);

  if (extracted.programs.length === 0) {
    await db
      .update(bizKnowledgeSources)
      .set({
        status: "needs_review",
        rawText: result.content.slice(0, 20_000),
        extractionError:
          extracted.uncertain.join("; ") || "No programs detected in this image.",
        updatedAt: new Date(),
      })
      .where(eq(bizKnowledgeSources.id, source.id));

    return NextResponse.json({
      sourceId: source.id,
      created: 0,
      uncertain: extracted.uncertain,
      warning: "No programs were detected. Check the image, or enter details manually.",
    });
  }

  const rows = extracted.programs.map((p) => {
    // Brochures in circulation are often printed for a previous year.
    // Roll any stale deadline forward so we never store a past date.
    const fix = correctDeadline(p.application_deadline ?? null);

    return {
      businessId,
      sourceId: source.id,
      universityName: extracted.university_name,
      universityNameCn: extracted.university_name_cn,
      city: extracted.city,
      province: extracted.province,
      universityType: extracted.university_type,
      programName: p.program_name,
      level: p.level,
      duration: p.duration,
      teachingLanguage: p.teaching_language,
      tuitionAmount: p.tuition_amount,
      tuitionCurrency: p.tuition_currency,
      tuitionPeriod: p.tuition_period,
      combinedFeeAmount: p.combined_fee_amount,
      combinedFeePeriod: p.combined_fee_period,
      combinedFeeIncludes: p.combined_fee_includes,
      hostelAmount: p.hostel_amount,
      hostelPeriod: p.hostel_period,
      applicationFee: p.application_fee,
      insuranceFee: p.insurance_fee,
      intakeText: p.intake_text,
      intakeMonths: p.intake_months ?? [],
      applicationDeadline: fix.corrected || null,
      tVisaAfterOneSemester: p.t_visa_after_one_semester,
      languageToDegree: p.language_to_degree,
      feePaymentNote: p.fee_payment_note,
      feeNoteRaw: fix.changed ? `${fix.original} (printed on brochure)` : null,
      requirements: p.requirements ?? {},
      notes: p.notes,
      brochureName: title.slice(0, 255),
      sourcePage: null,
      confidence: "extracted",
      dataCompleteness: "partial",
      status: "draft",
    };
  });

  const inserted = await db
    .insert(bizKnowledgeEntries)
    .values(rows)
    .returning({ id: bizKnowledgeEntries.id });

  await db
    .update(bizKnowledgeSources)
    .set({
      status: "needs_review",
      rawText: result.content.slice(0, 20_000),
      extractionError: extracted.uncertain.length > 0 ? extracted.uncertain.join("; ") : null,
      updatedAt: new Date(),
    })
    .where(eq(bizKnowledgeSources.id, source.id));

  return NextResponse.json({
    sourceId: source.id,
    created: inserted.length,
    uncertain: extracted.uncertain,
  });
}
