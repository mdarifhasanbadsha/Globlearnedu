export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string; variant?: "info" | "tip" | "warning" }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  content: ContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-apply-csc-scholarship-2026",
    title: "How to Apply for the CSC Scholarship in 2026 — Complete Guide",
    excerpt:
      "The Chinese Government Scholarship (CSC) is the most generous funding available for international students in China. This guide walks you through every step of the 2026 application process.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — Admission Advisors",
    date: "2026-01-15",
    readTime: "9 min read",
    category: "Scholarships",
    tags: ["CSC Scholarship", "Funding", "Application Guide"],
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "The Chinese Government Scholarship (CSC) — formally the Chinese Government Scholarship Programme administered by the China Scholarship Council — is a full scholarship covering tuition, accommodation, and a monthly living stipend. For 2026, the CSC is open to students from over 180 countries targeting Bachelor's, Master's, PhD, and language programs at more than 280 designated Chinese universities.",
      },
      {
        type: "callout",
        text: "CSC Scholarship 2026 deadline: Most Chinese universities require your CSC application between January and March 2026. Apply early — later applications rarely succeed.",
        variant: "warning",
      },
      {
        type: "h2",
        text: "What Does the CSC Scholarship Cover?",
      },
      {
        type: "table",
        headers: ["Level", "Tuition", "Accommodation", "Monthly Stipend"],
        rows: [
          ["Bachelor's", "Full waiver", "Provided", "¥2,500 / month"],
          ["Master's", "Full waiver", "Provided", "¥3,000 / month"],
          ["PhD", "Full waiver", "Provided", "¥3,500 / month"],
          ["Language", "Full waiver", "Provided", "¥2,500 / month"],
        ],
      },
      {
        type: "h2",
        text: "Step-by-Step Application Process",
      },
      {
        type: "ul",
        items: [
          "Step 1 — Choose your university and program. CSC requires you to apply to specific designated universities. Not all Chinese universities are CSC hosts.",
          "Step 2 — Register on the CSC Online Application System (studyinchina.csc.edu.cn) and complete your profile.",
          "Step 3 — Prepare your documents: academic transcripts, degree certificates, two recommendation letters, study plan / research proposal, language proficiency certificate, medical certificate, and passport copy.",
          "Step 4 — Submit your online CSC application and download your Application Form.",
          "Step 5 — Send your paper documents to your chosen university's international admissions office.",
          "Step 6 — Your university nominates you for the CSC award. The China Scholarship Council makes the final decision.",
          "Step 7 — Results are announced April–July. Accepted students receive an Admission Notice and Visa Application Form (JW201 or JW202).",
        ],
      },
      {
        type: "h2",
        text: "Documents Required for CSC 2026",
      },
      {
        type: "ul",
        items: [
          "CSC Online Application Form (printed and signed)",
          "Highest academic certificate and transcripts — notarised and translated into Chinese or English",
          "Two recommendation letters from professors or supervisors",
          "Study plan (for Bachelor's/Master's) or research proposal (for PhD) — minimum 800 words",
          "Language proficiency: IELTS 5.5+ for English programs, or HSK 4+ for Chinese programs",
          "Physical examination form (must be completed at a certified medical facility)",
          "Non-criminal background check (some universities require this)",
          "Valid passport copy (6+ months validity)",
        ],
      },
      {
        type: "callout",
        text: "Tip: A strong research proposal or study plan significantly increases your CSC success rate. Globlearn Education's advisors review and improve your documents before submission — this is the single biggest factor we can influence.",
        variant: "tip",
      },
      {
        type: "h2",
        text: "Common Reasons CSC Applications Fail",
      },
      {
        type: "ul",
        items: [
          "Weak or generic study plan / research proposal",
          "Missing or incorrectly notarised documents",
          "Applying too late (past the university's internal deadline)",
          "No prior contact with a supervisor (for PhD applicants)",
          "Low academic scores without any compensating factor",
          "Choosing a university that has already filled its CSC quota",
        ],
      },
      {
        type: "paragraph",
        text: "Globlearn Education has guided hundreds of students through successful CSC applications. Our advisors know which universities still have quota, which review applications favourably for students from your country, and how to present your profile at its strongest. Contact us to start your 2026 CSC application.",
      },
    ],
  },

  {
    slug: "mbbs-china-vs-philippines-vs-russia",
    title: "MBBS in China vs Philippines vs Russia: Which is Better in 2026?",
    excerpt:
      "Three popular low-cost MBBS destinations. But which gives you the best education, licensing exam outcomes, and return on investment? An honest comparison from Globlearn Education.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — Medical Admissions",
    date: "2026-01-22",
    readTime: "11 min read",
    category: "MBBS",
    tags: ["MBBS", "Comparison", "Philippines", "Russia", "China"],
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "China, the Philippines, and Russia are the three most popular destinations for international MBBS students seeking affordable, WHO-listed degrees. Each has real strengths — and real limitations. This article gives you an honest, data-based comparison to help you make the right choice for your situation.",
      },
      {
        type: "h2",
        text: "At a Glance: Key Comparison",
      },
      {
        type: "table",
        headers: ["Factor", "China", "Philippines", "Russia"],
        rows: [
          ["Duration", "6 years (5+1)", "5.5 years (4+1.5)", "6 years"],
          ["Annual Tuition", "¥14,000–¥35,000", "$3,000–$6,000", "$4,000–$7,000"],
          ["Teaching Language", "English available", "English", "English available"],
          ["WHO/FAIMER Listed", "Yes (select unis)", "Yes (select unis)", "Yes (select unis)"],
          ["FMGE Pass Rate (Indian)", "Good at top unis", "Lower average", "Variable"],
          ["Scholarship", "CSC full scholarship", "Limited", "Limited"],
          ["Climate", "4 seasons", "Tropical", "Cold winters"],
          ["Safety", "Very high", "Moderate", "Moderate"],
        ],
      },
      {
        type: "h2",
        text: "MBBS in China: Strengths and Weaknesses",
      },
      {
        type: "ul",
        items: [
          "Strengths: CSC full scholarship available, modern hospital facilities, strong research environment, safe campuses, multiple affordable cities to choose from",
          "Strengths: Best infrastructure — simulation labs, equipment, and clinical exposure match European standards",
          "Strengths: Graduate employability — Chinese medical degree is respected in Middle East, Africa, and parts of Europe",
          "Weaknesses: Cold climate in Northeast China cities (Harbin, Shenyang, Changchun) can be challenging",
          "Weaknesses: Language barrier outside campus — daily life in Chinese can be challenging for the first year",
          "Weaknesses: Competitive CSC scholarship — not everyone gets full funding",
        ],
      },
      {
        type: "h2",
        text: "MBBS in the Philippines: Strengths and Weaknesses",
      },
      {
        type: "ul",
        items: [
          "Strengths: English-only environment — no language barrier",
          "Strengths: US-modelled medical education system",
          "Strengths: Warm, familiar climate for students from Africa, South Asia",
          "Weaknesses: FMGE (India) pass rates at most Philippine universities are below the national average",
          "Weaknesses: Safety concerns in certain cities and areas",
          "Weaknesses: No significant scholarship programs for international students",
          "Weaknesses: Political and economic instability can affect university operations",
        ],
      },
      {
        type: "h2",
        text: "MBBS in Russia: Strengths and Weaknesses",
      },
      {
        type: "ul",
        items: [
          "Strengths: European-style medical education tradition",
          "Strengths: Some universities have strong USMLE preparation",
          "Weaknesses: Very cold winters in most university cities",
          "Weaknesses: Ongoing geopolitical tensions create uncertainty for international students",
          "Weaknesses: FMGE recognition and pass rates vary considerably",
          "Weaknesses: Limited scholarship options for international students",
        ],
      },
      {
        type: "callout",
        text: "Our recommendation: For students from Africa, South Asia, and the Middle East who qualify for the CSC scholarship, China offers the strongest combination of quality, safety, cost, and career outcomes. If you don't qualify for CSC, China's self-sponsored tuition still competes favourably with Philippines and Russia.",
        variant: "info",
      },
      {
        type: "h2",
        text: "Which Should You Choose?",
      },
      {
        type: "ul",
        items: [
          "Choose China if: you want a CSC scholarship, prefer modern facilities and safe campuses, and are comfortable adapting to a new culture",
          "Choose Philippines if: you want a fully English environment and US-modelled curriculum, and are not eligible for CSC",
          "Choose Russia if: you have a specific interest in European medical traditions and plan to practice in countries where Russian degrees are recognised",
          "For Indian students specifically: China's top MBBS universities (Jilin, Dalian, Nanjing Medical) consistently produce better FMGE/NExT results than most Philippine or Russian counterparts",
        ],
      },
      {
        type: "paragraph",
        text: "Globlearn Education specialises in placing students at WHO-listed Chinese medical universities with the highest FMGE and international licensing exam pass rates. We match your budget, country of nationality, and career goal to the right program.",
      },
    ],
  },

  {
    slug: "real-cost-studying-china-2026",
    title: "The Real Cost of Studying in China in 2026 — Full Breakdown",
    excerpt:
      "Tuition is just one cost. This guide breaks down every expense — accommodation, food, transport, health insurance, visa fees, and more — so you can plan your budget with confidence.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — Student Advisors",
    date: "2026-02-03",
    readTime: "8 min read",
    category: "Study Tips",
    tags: ["Cost", "Budget", "Living in China", "Tuition"],
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "One of the most common questions we get is: 'How much will studying in China actually cost me?' Tuition figures are easy to find, but the full picture — including accommodation, food, health insurance, visa fees, and one-off setup costs — is rarely explained honestly. This guide covers everything.",
      },
      {
        type: "h2",
        text: "Tuition: The Variable That Matters Most",
      },
      {
        type: "table",
        headers: ["Program", "Annual Tuition Range (RMB)", "USD Equivalent"],
        rows: [
          ["MBBS / Medicine", "¥14,000 – ¥35,000", "$1,950 – $4,850"],
          ["Bachelor's Degree", "¥12,000 – ¥30,000", "$1,650 – $4,150"],
          ["Master's Degree", "¥16,000 – ¥40,000", "$2,200 – $5,550"],
          ["PhD Program", "¥20,000 – ¥45,000", "$2,750 – $6,250"],
          ["Chinese Language", "¥8,000 – ¥16,000", "$1,100 – $2,200"],
          ["Short Course / Exchange", "¥3,000 – ¥20,000 / program", "$420 – $2,750"],
        ],
      },
      {
        type: "h2",
        text: "Accommodation Costs",
      },
      {
        type: "ul",
        items: [
          "University dormitory (shared, 2–4 students): ¥400–¥800/month — the most affordable and convenient option",
          "University dormitory (single room): ¥800–¥1,500/month — available at most 985 universities",
          "Off-campus shared apartment: ¥800–¥1,500/month depending on city and distance from campus",
          "Off-campus private apartment: ¥1,500–¥3,500/month — much higher in Shanghai and Beijing",
          "Recommendation: Live in university dormitories for at least Year 1. It's cheaper, safer, and helps you build a friend network quickly.",
        ],
      },
      {
        type: "h2",
        text: "Monthly Living Costs by City",
      },
      {
        type: "table",
        headers: ["City", "Food", "Transport", "Misc", "Total / Month"],
        rows: [
          ["Beijing / Shanghai", "¥800–¥1,500", "¥200–¥400", "¥300–¥500", "¥1,500–¥2,500+"],
          ["Wuhan / Nanjing / Xi'an", "¥600–¥1,000", "¥150–¥300", "¥200–¥400", "¥1,000–¥1,800"],
          ["Chengdu / Hangzhou", "¥600–¥1,000", "¥150–¥300", "¥200–¥400", "¥1,000–¥1,700"],
          ["Harbin / Shenyang / Changchun", "¥500–¥800", "¥100–¥200", "¥150–¥300", "¥800–¥1,400"],
        ],
      },
      {
        type: "h2",
        text: "One-Off and Annual Costs",
      },
      {
        type: "ul",
        items: [
          "Visa application fee (X1 student visa): ~$50–$150 depending on your country",
          "Residence permit fee (paid in China): ~¥400–¥600",
          "Health insurance (compulsory for all international students): ¥600–¥800/year",
          "Medical examination (required for visa): $30–$100 depending on country",
          "Flight to China: $400–$1,200 depending on departure country",
          "Initial setup costs (bedding, kitchenware, phone SIM, etc.): ¥1,000–¥2,000",
          "Chinese language classes (if needed): ¥1,000–¥3,000/semester (many universities offer free basic classes)",
        ],
      },
      {
        type: "callout",
        text: "Globlearn Education's service fee is paid only after your admission is confirmed — not upfront. We operate on transparent, fixed fees with no hidden charges. Ask us for a personalised cost estimate based on your target university and program.",
        variant: "tip",
      },
      {
        type: "h2",
        text: "Total Annual Budget Estimate",
      },
      {
        type: "table",
        headers: ["Category", "Budget City", "Mid City", "Tier-1 City"],
        rows: [
          ["Tuition (avg)", "¥15,000", "¥22,000", "¥32,000"],
          ["Accommodation", "¥6,000", "¥9,600", "¥18,000"],
          ["Food & Living", "¥9,600", "¥12,000", "¥18,000"],
          ["Insurance & Visa", "¥1,500", "¥1,500", "¥1,500"],
          ["Total / Year", "~¥32,000 (~$4,450)", "~¥45,000 (~$6,250)", "~¥70,000 (~$9,700)"],
        ],
      },
      {
        type: "paragraph",
        text: "Compared to studying in the UK ($30,000–$50,000/year), USA ($35,000–$60,000/year), or even Malaysia ($10,000–$20,000/year), China offers exceptional value — especially when a CSC scholarship covers tuition and adds a monthly stipend on top.",
      },
    ],
  },

  {
    slug: "top-universities-international-students-2026",
    title: "Top 10 Chinese Universities for International Students in 2026",
    excerpt:
      "Not all Chinese universities are equal for international students. This list ranks the 10 best based on program quality, English availability, scholarship success rate, and overall international student experience.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — University Advisors",
    date: "2026-02-15",
    readTime: "7 min read",
    category: "Universities",
    tags: ["Rankings", "Top Universities", "International Students", "985"],
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "Choosing a Chinese university as an international student requires looking beyond QS rankings. Factors like English-medium program availability, international student support infrastructure, scholarship success rates, and city affordability all matter. Here are our top 10 picks for 2026.",
      },
      {
        type: "h2",
        text: "1. Tsinghua University — Beijing",
      },
      {
        type: "paragraph",
        text: "QS Top 25. China's MIT — exceptional for engineering, AI, computer science, and architecture. 100+ English-medium graduate programs. High CSC quota. Best choice for STEM students targeting research careers.",
      },
      {
        type: "h2",
        text: "2. Peking University — Beijing",
      },
      {
        type: "paragraph",
        text: "QS Top 15. Best for humanities, law, social sciences, medicine, and Chinese language. Home of the Yenching Academy (fully-funded Masters for global scholars). Unmatched prestige in the humanities across Asia and Africa.",
      },
      {
        type: "h2",
        text: "3. Zhejiang University — Hangzhou",
      },
      {
        type: "paragraph",
        text: "QS Top 100. Most international students of any 985 university (8,000+). International Campus at Haining has joint programs with Edinburgh, Illinois, and UC Davis. Excellent value in a tech-driven city.",
      },
      {
        type: "h2",
        text: "4. Fudan University — Shanghai",
      },
      {
        type: "paragraph",
        text: "QS Top 50. Best for international relations, public policy, journalism, and business. Shanghai location adds significant networking and career value. Large, welcoming international community.",
      },
      {
        type: "h2",
        text: "5. Wuhan University — Wuhan",
      },
      {
        type: "paragraph",
        text: "Top 10 China. Best value 985 university for international students — affordable Wuhan city, beautiful campus, excellent Chinese language school. Great for students who want 985 quality at Tier-2 city cost.",
      },
      {
        type: "h2",
        text: "6. Dalian Medical University — Dalian",
      },
      {
        type: "paragraph",
        text: "Best WHO-listed MBBS at lowest cost. English MBBS from ¥14,000/year in one of China's safest and most scenic cities. Consistently strong FMGE outcomes. Top pick for medical students from India, Pakistan, and Bangladesh.",
      },
      {
        type: "h2",
        text: "7. Sichuan University — Chengdu",
      },
      {
        type: "paragraph",
        text: "985 University in China's most liveable city. Best combination of academic quality, affordable living, and quality of life. WHO-listed MBBS, strong engineering, and one of the highest international student satisfaction ratings in surveys.",
      },
      {
        type: "h2",
        text: "8. Beijing Language and Culture University — Beijing",
      },
      {
        type: "paragraph",
        text: "The world's best university for learning Mandarin. 60% of students are international. Perfect for language learners and students using Chinese language as a bridge to a full degree. Official HSK exam creators.",
      },
      {
        type: "h2",
        text: "9. Jilin University — Changchun",
      },
      {
        type: "paragraph",
        text: "China's largest 985 university. Best budget 985 option — lowest living costs of any 985, WHO-listed MBBS, and strong CSC quota. Ideal for students who want 985 prestige without the Beijing or Shanghai price tag.",
      },
      {
        type: "h2",
        text: "10. Northeast Normal University — Changchun",
      },
      {
        type: "paragraph",
        text: "Best 211 university for CSC scholarship success. Friendly international office, high CSC approval rates, very affordable costs. Top choice for students who want guaranteed scholarship placement at a solid university.",
      },
      {
        type: "callout",
        text: "Globlearn Education has placed students at all 10 of these universities. We match your profile, budget, and program to the right institution — not just the most prestigious one available.",
        variant: "info",
      },
    ],
  },

  {
    slug: "chinese-student-visa-guide-2026",
    title: "How to Get a Chinese Student Visa in 2026 — Step-by-Step",
    excerpt:
      "The X1 student visa process confused many in 2025. This updated guide covers every document, every step, and the common mistakes that lead to delays or refusals.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — Visa Guidance Team",
    date: "2026-03-01",
    readTime: "10 min read",
    category: "Visa & Immigration",
    tags: ["Student Visa", "X1 Visa", "China Visa", "Immigration"],
    featured: false,
    content: [
      {
        type: "callout",
        text: "Important: Globlearn Education provides visa guidance — we help you prepare and submit the correct documents. The final visa decision is made by the Chinese Embassy in your country. We do not guarantee visa approval, as this is the sole authority of the Embassy. Our 99% guidance success rate reflects our document preparation quality.",
        variant: "warning",
      },
      {
        type: "paragraph",
        text: "The Chinese student visa (X1) is issued to students enrolled in programs longer than 6 months. It is obtained in your home country before departure and then converted to a Residence Permit within 30 days of arriving in China. This guide covers the full process from admission to landing.",
      },
      {
        type: "h2",
        text: "Step 1: Receive Your JW201/JW202 Form and Admission Notice",
      },
      {
        type: "paragraph",
        text: "After your university confirms your admission, they will issue two documents: the Admission Notice (录取通知书) and the Visa Application Form for Study in China (JW202 for self-funded students; JW201 for CSC scholars). You cannot apply for the X1 visa without both documents.",
      },
      {
        type: "h2",
        text: "Step 2: Prepare Your Visa Application Documents",
      },
      {
        type: "ul",
        items: [
          "Valid passport (must be valid for at least 6 months beyond your intended stay)",
          "Completed visa application form (available from the Chinese Embassy or consulate website)",
          "One recent passport photo (white background, taken within 6 months)",
          "Original Admission Notice from the Chinese university",
          "JW201 or JW202 Visa Application Form for Foreign Students",
          "Physical Examination Record for Foreigners (completed at a government-approved hospital in your country)",
          "Academic transcripts and highest degree certificate",
          "Non-criminal record certificate (required by some embassies)",
          "Proof of financial support (bank statement showing sufficient funds)",
        ],
      },
      {
        type: "h2",
        text: "Step 3: Submit at the Chinese Embassy or Consulate",
      },
      {
        type: "paragraph",
        text: "Submit your application in person at the Chinese Embassy or consulate in your home country. Processing time is typically 4–5 business days for standard applications and 2–3 days for express. Some embassies allow postal submission — check your specific embassy's requirements.",
      },
      {
        type: "h2",
        text: "Step 4: Arrive in China and Apply for Your Residence Permit",
      },
      {
        type: "ul",
        items: [
          "You have 30 days from arrival to convert your X1 visa to a Residence Permit",
          "Visit the local Public Security Bureau (PSB) Exit-Entry Administration",
          "Documents required: passport, X1 visa, admission notice, JW form, physical exam record, accommodation registration (from your university), and passport photos",
          "Processing time: 5–15 business days depending on the city",
          "The Residence Permit is usually issued for 1 year initially, then renewed annually",
        ],
      },
      {
        type: "h2",
        text: "Common Visa Mistakes to Avoid",
      },
      {
        type: "ul",
        items: [
          "Using an expired physical examination form (must be completed within 6 months of visa application)",
          "Submitting photos that don't meet specifications (Chinese embassies are strict about photo standards)",
          "Missing the JW form — without this, the X1 visa cannot be issued",
          "Not registering at the local PSB within 24 hours of arrival (even before the Residence Permit)",
          "Letting your Residence Permit expire — overstaying results in fines and potential deportation",
        ],
      },
      {
        type: "callout",
        text: "Globlearn Education's visa guidance team reviews all your documents before submission, advises on embassy-specific requirements for your country, and prepares you for the Residence Permit process after arrival. Contact us to start.",
        variant: "tip",
      },
    ],
  },

  {
    slug: "csc-vs-university-vs-provincial-scholarship",
    title: "CSC vs University vs Provincial Scholarship: Which Should You Apply For?",
    excerpt:
      "China offers 4 types of scholarships for international students. Knowing which ones match your profile — and applying to all of them simultaneously — dramatically improves your chances of getting funded.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — Scholarship Advisors",
    date: "2026-03-10",
    readTime: "8 min read",
    category: "Scholarships",
    tags: ["CSC", "University Scholarship", "Provincial Scholarship", "Funding"],
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "Most students know about the CSC (Chinese Government Scholarship) — but fewer know that there are actually 4 types of scholarships available for international students in China. Applying to all relevant scholarships simultaneously, as Globlearn Education advises, significantly increases your chance of receiving funding.",
      },
      {
        type: "h2",
        text: "The 4 Types of Scholarships Compared",
      },
      {
        type: "table",
        headers: ["Scholarship", "Covers", "Stipend", "Competition Level", "Who Should Apply"],
        rows: [
          [
            "CSC (Chinese Government)",
            "Full tuition + accommodation",
            "¥2,500–¥3,500/month",
            "Very high",
            "Strong academic students with GPA 3.0+",
          ],
          [
            "University-level",
            "50–100% tuition waiver",
            "Sometimes ¥1,000–¥2,000/month",
            "Medium",
            "Good academic students — apply at your target university",
          ],
          [
            "Provincial Government",
            "Full or partial tuition",
            "¥1,000–¥2,500/month",
            "Medium",
            "Students applying to universities in scholarship-active provinces",
          ],
          [
            "Self-Sponsored",
            "N/A",
            "N/A",
            "N/A",
            "Students who prefer flexibility or do not meet scholarship criteria",
          ],
        ],
      },
      {
        type: "h2",
        text: "CSC (Chinese Government Scholarship)",
      },
      {
        type: "ul",
        items: [
          "Administered by the China Scholarship Council (CSC)",
          "Covers full tuition, university dormitory, and monthly living stipend",
          "Available for Bachelor's (4 years), Master's (2–3 years), PhD (3–5 years), and language programs",
          "Requires strong academic record, compelling study plan, and professor recommendation",
          "Application opens January–March each year for September intake",
          "Result announced April–July",
        ],
      },
      {
        type: "h2",
        text: "University-Level Scholarships",
      },
      {
        type: "ul",
        items: [
          "Each 985 and 211 university has its own international student scholarship fund",
          "Typically covers 50%, 75%, or 100% of tuition",
          "Some universities (Tsinghua, PKU, ZJU) also include a monthly stipend",
          "Applied for directly with the university at the time of admission application",
          "Less competitive than CSC — good students with GPA 3.0+ usually qualify",
          "Can be combined with provincial scholarships (but NOT with CSC)",
        ],
      },
      {
        type: "h2",
        text: "Provincial Government Scholarships",
      },
      {
        type: "ul",
        items: [
          "Offered by individual Chinese provinces (Jiangsu, Shandong, Hubei, Hunan, Sichuan, etc.)",
          "Covers full or partial tuition + sometimes accommodation",
          "Applied for through universities located in the relevant province",
          "Less well-known than CSC but significant numbers of international students receive these awards",
          "Jiangsu, Shandong, and Hubei provinces have among the most generous provincial programs",
        ],
      },
      {
        type: "callout",
        text: "Globlearn Education's approach: We apply to CSC + University + Provincial scholarships simultaneously on your behalf, maximising your chances. If you receive CSC, the others are declined. If CSC is unsuccessful, you may still receive university or provincial funding. You should never apply to only one scholarship type.",
        variant: "tip",
      },
      {
        type: "h2",
        text: "Which Scholarship is Right for You?",
      },
      {
        type: "ul",
        items: [
          "GPA 3.5+ with strong research background → Target CSC as primary, university as backup",
          "GPA 3.0–3.5 with good references → Target university scholarship as primary, provincial as backup",
          "GPA below 3.0 or fresh diploma → Self-sponsored with provincial/university applications as opportunistic",
          "MBBS students → CSC MBBS quota is very competitive; apply early through your national selection authority",
        ],
      },
    ],
  },

  {
    slug: "living-in-china-international-student",
    title: "Living in China as an International Student: Honest Advice for 2026",
    excerpt:
      "What is daily life in China really like? Food, safety, socialising, language barriers, racism concerns, internet access — an honest guide from students who've been there.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — Student Experience Team",
    date: "2026-03-20",
    readTime: "9 min read",
    category: "Student Life",
    tags: ["China Life", "International Students", "Student Experience", "Culture"],
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "One of the most common questions we get from prospective students isn't about scholarships or admissions — it's about what life will actually be like in China. This guide is our honest, unfiltered answer, drawing from the experiences of thousands of students we've placed at Chinese universities since 2018.",
      },
      {
        type: "h2",
        text: "Safety",
      },
      {
        type: "paragraph",
        text: "China is one of the safest countries in the world for international students. Street crime is extremely rare, campuses have security around the clock, and violent crime against foreigners is virtually unheard of. The main safety issue students encounter is traffic — Chinese cities have heavy scooter and bicycle traffic that takes getting used to.",
      },
      {
        type: "h2",
        text: "Food",
      },
      {
        type: "paragraph",
        text: "Chinese food is varied, delicious, and very affordable. University canteens serve hot meals for ¥5–¥15. Most campuses have a range of canteen options including halal sections, which is important for Muslim students. Finding familiar food from home can require more effort in smaller cities — but in Beijing, Shanghai, and Guangzhou, African, Middle Eastern, and South Asian restaurants are easy to find.",
      },
      {
        type: "h2",
        text: "Language Barrier",
      },
      {
        type: "ul",
        items: [
          "On campus: manageable. International offices have English-speaking staff, and fellow international students create a shared language environment.",
          "Off campus: harder, especially in smaller Tier-2 cities. Most shop staff, taxi drivers, and locals speak only Chinese.",
          "Translation apps (Google Translate, Microsoft Translator) have excellent Chinese-to-English features and work offline.",
          "Most universities provide free or low-cost Chinese language classes for international students — take them from Day 1.",
          "After 3–6 months, most students have enough functional Chinese to handle daily life independently.",
        ],
      },
      {
        type: "h2",
        text: "Internet and Social Media",
      },
      {
        type: "callout",
        text: "Important: Google, YouTube, WhatsApp, Instagram, Facebook, and most Western platforms are blocked in China. You need a VPN to access them. VPNs are technically restricted but widely used by students. Invest in a reliable paid VPN before you arrive.",
        variant: "warning",
      },
      {
        type: "ul",
        items: [
          "WeChat is essential — it is how everyone in China communicates, pays for things, and organises events",
          "Alipay (Chinese digital payment) — get this set up as soon as possible, as cash usage is declining rapidly",
          "Campus Wi-Fi is generally good; 5G is widely available in Chinese cities",
          "Several paid VPN services work reliably in China — research and purchase before you travel",
        ],
      },
      {
        type: "h2",
        text: "Racial Diversity and Inclusion",
      },
      {
        type: "paragraph",
        text: "Most international students from Africa, South Asia, and the Middle East report positive experiences in Chinese universities. International student communities are large and active. Occasional staring or curiosity from local Chinese students and citizens is common — especially in smaller cities — but actual discrimination or hostility is rare. Chinese 985 universities actively recruit diverse international cohorts and take international student welfare seriously.",
      },
      {
        type: "h2",
        text: "Making the Most of Your Time",
      },
      {
        type: "ul",
        items: [
          "Join international student associations and clubs from Week 1 — this is where lasting friendships form",
          "Learn WeChat and Alipay as your first priority — they unlock everything from food delivery to event tickets",
          "Travel within China — high-speed rail makes it cheap and easy to visit multiple cities",
          "Take basic Chinese seriously — even HSK 2 proficiency transforms your daily life experience",
          "Connect with the local Chinese student buddy programs most universities offer",
        ],
      },
    ],
  },

  {
    slug: "china-scholarship-timeline-2026",
    title: "China Scholarship Timeline 2026: Month-by-Month Application Calendar",
    excerpt:
      "Miss the CSC deadline and you wait a full year. This month-by-month calendar shows exactly when to act — from choosing your university in September to receiving your Admission Notice in July.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — Scholarship Advisors",
    date: "2026-03-28",
    readTime: "6 min read",
    category: "Scholarships",
    tags: ["CSC Scholarship", "Timeline", "Application Calendar", "Deadlines"],
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "The single biggest reason students miss the CSC scholarship is not poor grades or weak documents — it is timing. The application window opens and closes within a narrow few months, and universities process applications on a rolling basis. This calendar gives you every critical date for the 2026–2027 intake cycle.",
      },
      {
        type: "callout",
        text: "This calendar covers the September 2027 intake. If you are targeting September 2026, you are very late — contact Globlearn Education immediately to assess your options for late-cycle applications.",
        variant: "warning",
      },
      {
        type: "h2",
        text: "Full Application Calendar: September 2026 → September 2027",
      },
      {
        type: "table",
        headers: ["Month", "What to Do", "Deadline Risk"],
        rows: [
          ["Sep – Oct 2026", "Research programs, shortlist 3–5 universities, contact potential PhD supervisors", "Low — preparation phase"],
          ["Nov 2026", "Request academic transcripts, arrange notarisation and certified translations", "Low — but takes 4–8 weeks"],
          ["Dec 2026", "Draft study plan / research proposal; request recommendation letters from professors", "Medium — references take time"],
          ["Jan 2027", "CSC Online Application System opens (studyinchina.csc.edu.cn) — register and begin", "HIGH — act now"],
          ["Feb 2027", "Complete medical examination at certified hospital; get police clearance if required", "HIGH — 2–4 weeks processing"],
          ["Mar 2027", "Submit CSC online application; post documents to university international office", "CRITICAL — most uni deadlines"],
          ["Apr 2027", "University internal review; follow up with international admissions office", "Critical — respond to requests fast"],
          ["May 2027", "Last chance for late university scholarship applications; provincial scholarship window", "High — last opportunity"],
          ["Jun – Jul 2027", "CSC results announced; Admission Notice and JW form issued to successful applicants", "Waiting phase"],
          ["Aug 2027", "Apply for X1 student visa at Chinese Embassy in your country", "Act within 1–2 weeks of receiving Notice"],
          ["Sep 2027", "Arrive in China; register at university; apply for Residence Permit within 30 days", "CRITICAL — 30-day legal requirement"],
        ],
      },
      {
        type: "h2",
        text: "Key Deadlines You Cannot Miss",
      },
      {
        type: "ul",
        items: [
          "January 2027: CSC application system opens — start your profile immediately",
          "March 15–31, 2027: Most 985 universities close their CSC nomination window",
          "March 31, 2027: Hard CSC submission deadline for most institutions",
          "May 31, 2027: Last date for most provincial scholarship applications",
          "Within 30 days of arrival: Residence Permit application — this is a legal requirement, not optional",
        ],
      },
      {
        type: "h2",
        text: "What Globlearn Education Does at Each Stage",
      },
      {
        type: "ul",
        items: [
          "Sep–Nov: University and program matching based on your profile, budget, and career goal",
          "Dec–Jan: Study plan and research proposal writing support; document checklist and review",
          "Feb–Mar: Full CSC application submission support; university, provincial, and university scholarship simultaneous applications",
          "Apr–May: Follow-up with universities; respond to admission queries; prepare for visa",
          "Jun–Jul: Visa document preparation; pre-departure guidance",
          "Aug–Sep: Arrival support, Residence Permit guidance, settlement assistance",
        ],
      },
      {
        type: "callout",
        text: "Start in September — not January. Students who contact us in September consistently have stronger applications, more time to polish their documents, and higher scholarship success rates than students who contact us in February.",
        variant: "tip",
      },
    ],
  },

  {
    slug: "bachelors-degree-china-worth-it-2026",
    title: "Bachelor's Degree in China: Is It Worth It for International Students in 2026?",
    excerpt:
      "With tuition as low as ¥12,000/year and globally recognised degrees, the case for studying a Bachelor's in China has never been stronger. But it is not for everyone. Here is the honest answer.",
    author: "GloblearnEdu Team",
    authorRole: "Globlearn Education — Admissions Team",
    date: "2026-04-01",
    readTime: "7 min read",
    category: "Study Tips",
    tags: ["Bachelor's Degree", "Undergraduate", "Cost", "Career"],
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "More international students are choosing China for their undergraduate degree than ever before — over 500,000 international students enrolled in Chinese universities in 2024, and that number is growing. But is a Chinese Bachelor's degree the right choice for you? This article gives you the honest answer.",
      },
      {
        type: "h2",
        text: "The Case FOR a Chinese Bachelor's Degree",
      },
      {
        type: "ul",
        items: [
          "Cost: Annual tuition of ¥12,000–¥30,000 (~$1,700–$4,200) vs $20,000–$50,000 in UK/USA. Over 4 years, the savings are $60,000–$185,000.",
          "Scholarship: The CSC scholarship covers full tuition plus a monthly stipend — effectively a free education.",
          "Recognition: Degrees from 985/211 universities are recognised globally. Employers in Africa, Middle East, South Asia, and Europe actively recruit Chinese graduates.",
          "Language acquisition: 4 years in China produces B2–C1 Mandarin proficiency — a genuinely valuable career asset.",
          "China network: 4 years builds a network in the world's second-largest economy, which increasingly drives global trade.",
          "English programs: Most 985/211 universities have English-medium programs — no Chinese required to enrol.",
        ],
      },
      {
        type: "h2",
        text: "The Case AGAINST (or: Who Should Think Carefully)",
      },
      {
        type: "ul",
        items: [
          "If your goal is to work in the US or UK long-term, a degree from a Western university may have stronger direct hiring advantages in those markets.",
          "If you struggle with cultural adaptation, 4 years is a long commitment — consider doing a 1-year language program first.",
          "Some professional fields (medicine specifically) have complex recognition rules — research your home country's medical council requirements before enrolling.",
          "Internet restrictions (VPN needed for most Western services) can feel limiting initially.",
        ],
      },
      {
        type: "callout",
        text: "Our view: For most students from Africa, South Asia, and the Middle East, a Bachelor's degree from a Chinese 985 or 211 university represents exceptional value and career upside. The China connection — language, network, cultural competency — becomes increasingly valuable as Chinese investment grows in these regions.",
        variant: "info",
      },
      {
        type: "h2",
        text: "Which Fields Are Best for a Chinese Bachelor's?",
      },
      {
        type: "table",
        headers: ["Field", "Why China Excels", "Top Universities"],
        rows: [
          ["Engineering", "World-class facilities, strong R&D ecosystem", "Tsinghua, SJTU, Zhejiang"],
          ["Computer Science / AI", "China is a global AI leader", "Tsinghua, PKU, SJTU, UESTC"],
          ["Medicine (MBBS)", "WHO-listed, affordable, strong clinical training", "Jilin, Dalian Medical, Sichuan"],
          ["Business / Economics", "China-focused curriculum with global relevance", "UIBE, Fudan, Wuhan"],
          ["Chinese Language", "Full immersion — fastest route to fluency", "BLCU, Wuhan, Fudan"],
        ],
      },
      {
        type: "paragraph",
        text: "Globlearn Education guides you from program selection to graduation — not just the application. We advise on which degree programs have the strongest recognition in your home country, which universities best match your academic profile and budget, and how to build a Chinese career network from your first year.",
      },
    ],
  },
];

export const blogCategories = [
  "All",
  "Scholarships",
  "MBBS",
  "Universities",
  "Study Tips",
  "Visa & Immigration",
  "Student Life",
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, category: string): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== slug && p.category === category)
    .slice(0, 3);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
