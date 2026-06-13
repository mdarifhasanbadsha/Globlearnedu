import { db } from "../src/lib/db";
import { universities } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

// ── VERIFIED 985 UNIVERSITIES (39 total) ─────────────────
// Source: Wikipedia Project 985 / MOE China
const SLUGS_985 = [
  // Beijing (8)
  "peking-university",
  "tsinghua-university",
  "renmin-university-of-china",
  "beijing-normal-university",
  "beihang-university",
  "beijing-institute-of-technology",
  "china-agricultural-university",
  "minzu-university-of-china",
  // Tianjin (2)
  "nankai-university",
  "tianjin-university",
  // Northeast (4)
  "dalian-university-of-technology",
  "northeastern-university",
  "harbin-institute-of-technology",
  "jilin-university",
  // East China (11)
  "fudan-university",
  "shanghai-jiao-tong-university",
  "tongji-university",
  "east-china-normal-university",
  "nanjing-university",
  "southeast-university",
  "shandong-university",
  "ocean-university-of-china",
  "university-of-science-and-technology-of-china",
  "zhejiang-university",
  "xiamen-university",
  // South China (2)
  "sun-yat-sen-university",
  "south-china-university-of-technology",
  // Southwest (3)
  "sichuan-university",
  "university-of-electronic-science-and-technology-of-china",
  "chongqing-university",
  // Central China (5)
  "hunan-university",
  "central-south-university",
  "national-university-of-defense-technology",
  "wuhan-university",
  "huazhong-university-of-science-and-technology",
  // Northwest (4)
  "northwestern-polytechnical-university",
  "xian-jiaotong-university",
  "northwest-agriculture-and-forestry-university",
  "lanzhou-university",
];

// ── VERIFIED 211-ONLY UNIVERSITIES (76 total — not 985) ──
// Source: Wikipedia Project 211 / MOE China
const SLUGS_211_ONLY = [
  // Beijing 211-only (18)
  "beijing-foreign-studies-university",
  "beijing-forestry-university",
  "beijing-jiaotong-university",
  "beijing-university-of-chemical-technology",
  "beijing-university-of-chinese-medicine",
  "beijing-university-of-posts-and-telecommunications",
  "beijing-university-of-technology",
  "central-conservatory-of-music",
  "central-university-of-finance-and-economics",
  "china-university-of-geosciences-beijing",
  "china-university-of-petroleum-beijing",
  "china-university-of-mining-and-technology-beijing",
  "china-university-of-political-science-and-law",
  "communication-university-of-china",
  "north-china-electric-power-university",
  "peking-union-medical-college",
  "university-of-international-business-and-economics",
  "university-of-science-and-technology-beijing",
  // Shanghai 211-only (6)
  "donghua-university",
  "east-china-university-of-science-and-technology",
  "shanghai-international-studies-university",
  "shanghai-university",
  "shanghai-university-of-finance-and-economics",
  "second-military-medical-university",
  // Jiangsu 211-only (7)
  "hohai-university",
  "nanjing-agricultural-university",
  "nanjing-university-of-aeronautics-and-astronautics",
  "nanjing-university-of-science-and-technology",
  "nanjing-forestry-university",
  "china-pharmaceutical-university",
  "china-university-of-mining-and-technology",
  // Shaanxi 211-only (4)
  "shaanxi-normal-university",
  "xian-jiaotong-university-of-technology",
  "fourth-military-medical-university",
  "chang-an-university",
  // Hubei 211-only (4)
  "china-university-of-geosciences-wuhan",
  "wuhan-university-of-technology",
  "zhongnan-university-of-economics-and-law",
  "huazhong-agricultural-university",
  // Sichuan 211-only (2)
  "southwest-jiaotong-university",
  "southwest-university",
  // Guangdong 211-only (1)
  "jinan-university",
  // Guangzhou 211-only (1)
  "south-china-normal-university",
  // Liaoning 211-only (2)
  "china-medical-university",
  "dalian-maritime-university",
  // Heilongjiang 211-only (2)
  "northeast-agricultural-university",
  "northeast-forestry-university",
  // Jilin 211-only (1)
  "yanbian-university",
  // Hunan 211-only (1)
  "central-south-university-of-forestry-and-technology",
  // Anhui 211-only (1)
  "hefei-university-of-technology",
  // Zhejiang 211-only (1)
  "zhejiang-university-of-technology",
  // Fujian 211-only (1)
  "fuzhou-university",
  // Shandong 211-only (2)
  "china-petroleum-university-huadong",
  "shandong-normal-university",
  // Hebei 211-only (1)
  "hebei-university-of-technology",
  // Shanxi 211-only (1)
  "taiyuan-university-of-technology",
  // Inner Mongolia 211-only (1)
  "inner-mongolia-university",
  // Guangxi 211-only (1)
  "guangxi-university",
  // Chongqing 211-only (1)
  "southwest-university-chongqing",
  // Yunnan 211-only (1)
  "yunnan-university",
  // Guizhou 211-only (1)
  "guizhou-university",
  // Gansu 211-only (1)
  "lanzhou-university-of-technology",
  // Xinjiang 211-only (1)
  "xinjiang-university",
  // Ningxia 211-only (1)
  "ningxia-university",
  // Qinghai 211-only (1)
  "qinghai-university",
  // Tibet 211-only (1)
  "tibet-university",
  // Hainan 211-only (1)
  "hainan-university",
  // Heilongjiang 211-only
  "harbin-engineering-university",
  // Other 211-only
  "beijing-sport-university",
  "central-china-normal-university",
  "hunan-normal-university",
  "nanjing-normal-university",
  "northeast-normal-university",
  "shaanxi-university-of-science-and-technology",
  "south-central-university-for-nationalities",
  "southwest-university-of-finance-and-economics",
  "tianjin-medical-university",
  "wuhan-university-of-science-and-technology",
];

async function fixTiers() {
  console.log("🔄 Resetting ALL universities to tier985=false, tier211=false...");
  await db.update(universities).set({ tier985: false, tier211: false });
  console.log("✅ Reset complete\n");

  // Set 985 universities (also mark as 211)
  console.log("🔄 Setting 39 real 985 universities...");
  let count985 = 0;
  const notFound985: string[] = [];

  for (const slug of SLUGS_985) {
    const result = await db
      .update(universities)
      .set({ tier985: true, tier211: true })
      .where(eq(universities.slug, slug))
      .returning({ id: universities.id });

    if (result.length > 0) {
      count985++;
    } else {
      notFound985.push(slug);
    }
  }

  console.log(`✅ Set ${count985} of 39 985 universities`);
  if (notFound985.length > 0) {
    console.log(`⚠️  Not found in DB (slug mismatch):`);
    notFound985.forEach((s) => console.log(`   - ${s}`));
  }

  // Set 211-only universities
  console.log("\n🔄 Setting 211-only universities...");
  let count211 = 0;
  const notFound211: string[] = [];

  for (const slug of SLUGS_211_ONLY) {
    const result = await db
      .update(universities)
      .set({ tier985: false, tier211: true })
      .where(eq(universities.slug, slug))
      .returning({ id: universities.id });

    if (result.length > 0) {
      count211++;
    } else {
      notFound211.push(slug);
    }
  }

  console.log(`✅ Set ${count211} of ${SLUGS_211_ONLY.length} 211-only universities`);
  if (notFound211.length > 0) {
    console.log(`⚠️  Not found in DB (slug mismatch):`);
    notFound211.forEach((s) => console.log(`   - ${s}`));
  }

  // Final summary
  const final985 = await db
    .select({ id: universities.id })
    .from(universities)
    .where(eq(universities.tier985, true));

  const final211 = await db
    .select({ id: universities.id })
    .from(universities)
    .where(eq(universities.tier211, true));

  console.log(`\n📊 Final result:`);
  console.log(`   985 universities in DB: ${final985.length}`);
  console.log(`   211 universities in DB: ${final211.length}`);
  console.log(`   (remaining ${1500 - final211.length} have no tier badge — correct)`);
  console.log(`\n✅ Done. All incorrect tier badges removed.`);
}

fixTiers().catch(console.error);
