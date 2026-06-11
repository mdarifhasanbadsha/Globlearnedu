import { db } from "../src/lib/db";
import { universities, programs } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function importUniversities() {
  const filePath = path.join(process.cwd(), "data", "universities.json");
  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found: data/universities.json");
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  console.log(`Found ${data.length} universities`);
  const results = { imported: 0, updated: 0, failed: 0, errors: [] as string[] };
  for (const uni of data) {
    try {
      const [existing] = await db.select({ id: universities.id }).from(universities).where(eq(universities.slug, uni.slug)).limit(1);
      const uniData = {
        slug: uni.slug,
        nameEn: uni.nameEn || uni.name_en || "",
        nameCn: uni.nameCn || uni.name_cn || null,
        city: uni.city || null,
        province: uni.province || null,
        country: "China",
        tier985: uni.tier985 || false,
        tier211: uni.tier211 || false,
        qsRanking: uni.qsRanking2025 || uni.qsRanking || null,
        founded: uni.founded || null,
        totalStudents: uni.totalStudents || null,
        internationalStudents: uni.internationalStudents || null,
        website: uni.website || null,
        description: uni.description || null,
        isPartner: uni.isPartner || false,
        isActive: true,
        dataConfidence: uni.dataConfidence || "medium",
        cscAgencyNumber: uni.cscAgencyNumber || null,
        metaTitle: uni.metaTitle || null,
        metaDescription: uni.metaDescription || null,
      };
      let universityId: string;
      if (existing) {
        await db.update(universities).set(uniData).where(eq(universities.id, existing.id));
        universityId = existing.id;
        results.updated++;
      } else {
        const [newUni] = await db.insert(universities).values(uniData).returning({ id: universities.id });
        universityId = newUni.id;
        results.imported++;
      }
      if (uni.programs && Array.isArray(uni.programs)) {
        for (const prog of uni.programs) {
          await db.insert(programs).values({
            universityId,
            name: prog.name,
            level: (prog.level || "bachelor") as any,
            duration: prog.durationYears ? `${prog.durationYears} years` : null,
            teachingLanguage: prog.teachingLanguage || "English",
            tuitionFee: prog.tuitionPerYear?.toString() || null,
            applicationDeadline: prog.applicationDeadlineFall || null,
            intakeMonths: prog.intakeMonths || [],
            scholarshipsAvailable: prog.scholarshipsAvailable || [],
            requirements: prog.requirements || {},
            isActive: true,
          }).onConflictDoNothing();
        }
      }
      if ((results.imported + results.updated) % 100 === 0) {
        console.log(`Progress: ${results.imported + results.updated} done...`);
      }
    } catch (error: any) {
      results.failed++;
      results.errors.push(`${uni.slug}: ${error.message}`);
    }
  }
  console.log(`\n✅ Done: ${results.imported} new, ${results.updated} updated, ${results.failed} failed`);
  if (results.errors.length > 0) results.errors.slice(0, 10).forEach(e => console.log(" -", e));
}

importUniversities().catch(console.error);
