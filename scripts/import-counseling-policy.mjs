// Load the GL Education counselling policy as approved knowledge entries,
// so the rules are visible and editable in /business/knowledge rather
// than buried in code.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const BIZ = "18a043a9-0160-4e2f-800a-413f6ff8de6f";

const entries = [
  {
    program: "Diploma (counselling policy)",
    university: "GL Education policy",
    level: "diploma",
    details: `Diploma: সাধারণত ৩ বছর। ভাষা: English ও Chinese, প্রোগ্রামভেদে। ভর্তির সেশন: September intake (main)। বয়সসীমা: ১৭–২৫ বছর।
Scholarship categories (পোস্টারের প্রাথমিক তথ্য): Type A = tuition + hostel free। Type B = tuition free, hostel আনুমানিক ১,২০০–৩,০০০ RMB। Type C ও Type D ডিপ্লোমার জন্য পোস্টারে উল্লেখ নেই — বিশ্ববিদ্যালয়ভেদে যাচাই করতে হবে।
NEVER mention CSC Scholarship for Diploma — CSC belongs to Master's and PhD.`,
    requirements:
      "ছবি ও পাসপোর্ট; সার্টিফিকেট ও ট্রান্সক্রিপ্ট (মূল + ইংরেজি অনুবাদ); English proficiency certificate; Police clearance (মূল + অনুবাদ); Physical examination form; প্রায় ৩০,০০০ RMB সমপরিমাণ ব্যাংক স্টেটমেন্ট; ৩ মিনিটের English self-introduction video",
    extraCosts:
      "Application fee ৫০০–৮০০ RMB; Health insurance ৬০০–৮০০ RMB/বছর; Residence permit ৪০০ RMB/বছর; Medical checkup ৫০০ RMB একবার। এগুলো আনুমানিক — আবেদনের আগে বিশ্ববিদ্যালয়ের fee breakdown যাচাই করতে হবে।",
  },
  {
    program: "Bachelor (counselling policy)",
    university: "GL Education policy",
    level: "bachelor",
    details: `Bachelor: সাধারণত ৪ বছর। ভাষা: English, প্রোগ্রামভেদে। ভর্তির সেশন: September intake (main)। বয়সসীমা: ১৭–২৫ বছর।
Scholarship categories (পোস্টারের প্রাথমিক তথ্য): Type A = tuition + hostel free। Type B = tuition free, hostel আনুমানিক ১,২০০–৫,০০০ RMB। Type C = tuition + hostel আনুমানিক ৬,০০০–১০,০০০ RMB। Type D = tuition + hostel আনুমানিক ১০,০০০–২০,০০০ RMB (self-funded)।
NEVER mention CSC Scholarship for Bachelor — CSC belongs to Master's and PhD.`,
    requirements:
      "ছবি ও পাসপোর্ট; সার্টিফিকেট ও ট্রান্সক্রিপ্ট (মূল + ইংরেজি অনুবাদ); English proficiency (IELTS/Duolingo/EF-SET — গ্রহণযোগ্যতা বিশ্ববিদ্যালয়ভেদে যাচাই); CSCA certificate (প্রযোজ্য হলে যাচাই); Police clearance (মূল + অনুবাদ); Physical examination form; ২টি recommendation letter; প্রায় ৩০,০০০ RMB ব্যাংক স্টেটমেন্ট; ৩ মিনিটের English self-introduction video",
    extraCosts:
      "Application fee ৫০০–৮০০ RMB; Health insurance ৬০০–৮০০ RMB/বছর; Residence permit ৪০০ RMB/বছর; Medical checkup ৫০০ RMB একবার। আনুমানিক — যাচাই করতে হবে।",
  },
  {
    program: "CSCA guidance (counselling policy)",
    university: "GL Education policy",
    level: "bachelor",
    details: `CSCA = China Scholastic Competency Assessment। মূলত Bachelor/undergraduate ভর্তির সঙ্গে সম্পর্কিত। Diploma, Master's ও PhD-এর জন্য সাধারণ বাধ্যতামূলক নয়।
Subjects: Mathematics (সাধারণত বাধ্যতামূলক), Physics (Engineering/CS/STEM-এ লাগতে পারে), Chemistry (Medicine/Pharmacy/Life Science-এ লাগতে পারে), Professional Chinese (Chinese-taught-এ; fully English-taught-এ সাধারণত ছাড়)।
পরীক্ষার সময়: Math/Physics/Chemistry প্রায় ৬০ মিনিট, Professional Chinese প্রায় ৯০ মিনিট। স্কোর সাধারণত ১০০-এর স্কেলে।
সব Bachelor-এ একই subject লাগবে — এমন সাধারণীকরণ করা যাবে না। official site: csca.cn।
CSCA-এর নামে CSC থাকলেও এটি scholarship route নয় — বিভ্রান্তি তৈরি করবেন না।`,
    requirements: null,
    extraCosts: null,
  },
  {
    program: "Conversation rules (counselling policy)",
    university: "GL Education policy",
    level: null,
    details: `RESPONSE RULES:
1. একবারে সর্বোচ্চ একটাই প্রশ্ন। প্রশ্নের লিস্ট নয়।
2. শিক্ষার্থী যা উত্তর দিয়েছে, সেটা আবার জিজ্ঞেস করবেন না।
3. GPA ৫/৫ ভালো, কিন্তু "দারুণ/চমৎকার/অসাধারণ" বলে তোষামোদ করবেন না। সোজা বলুন ফলাফল কেমন এবং পরের ধাপে যান।
4. Diploma/Bachelor-এ "CSC Scholarship" শব্দটি নিজে থেকে কখনো বলবেন না।
5. Type A/B/C/D সম্ভাব্য ক্যাটাগরি, নিশ্চিত অফার নয়।
6. কোনো কিছু ১০০% নিশ্চিত বলে প্রতিশ্রুতি দেবেন না।
7. উত্তর ২–৪ বাক্য। শিক্ষার্থীকে বুলেট লিস্ট দেবেন না।
8. প্রতিটি উত্তর যেন কথোপকথন এক ধাপ এগিয়ে নেয়।
9. সংখ্যা দেওয়া হলে স্কেল একবার জিজ্ঞেস করবেন, তারপর আর নয়।
10. তথ্য না জানলে বলুন বিশ্ববিদ্যালয়ের শর্ত যাচাই করে জানাতে হবে।`,
    requirements: null,
    extraCosts: null,
  },
];

let inserted = 0;
for (const e of entries) {
  const [existing] = await sql`
    select id from biz_knowledge_entries
    where business_id = ${BIZ} and university_name = ${e.university}
      and program_name = ${e.program} limit 1`;

  if (existing) {
    await sql`
      update biz_knowledge_entries set
        details = ${e.details},
        requirements = ${e.requirements},
        extra_costs = ${e.extraCosts},
        level = ${e.level},
        status = 'approved',
        updated_at = now()
      where id = ${existing.id}`;
    console.log(`  updated: ${e.program}`);
  } else {
    await sql`
      insert into biz_knowledge_entries
        (business_id, university_name, program_name, level, details, requirements,
         extra_costs, status)
      values (${BIZ}, ${e.university}, ${e.program}, ${e.level}, ${e.details},
              ${e.requirements}, ${e.extraCosts}, 'approved')`;
    inserted++;
    console.log(`  inserted: ${e.program}`);
  }
}

const [{ n }] = await sql`
  select count(*)::int n from biz_knowledge_entries
  where business_id=${BIZ} and status='approved'`;
console.log(`\napproved knowledge entries now: ${n} (inserted ${inserted})`);
