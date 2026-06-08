export interface ProgramFAQ {
  q: string;
  a: string;
}

export interface ProgramHighlight {
  icon: string;
  title: string;
  value: string;
}

export interface UniversityRow {
  name: string;
  city: string;
  tuitionRMB: string;
  scholarshipAvailable: boolean;
  ranking?: string;
}

export interface ProgramData {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  duration: string;
  tuitionRange: string;
  livingCost: string;
  language: string;
  intakeMonths: string;
  icon: string;
  color: string;
  heroImage: string;
  overview: string;
  highlights: ProgramHighlight[];
  universities: UniversityRow[];
  requirements: string[];
  careerProspects: string[];
  scholarships: string[];
  faqs: ProgramFAQ[];
  relatedSlugs: string[];
}

export const programsData: Record<string, ProgramData> = {
  "mbbs-medicine": {
    slug: "mbbs-medicine",
    name: "MBBS / Medicine",
    tagline: "Become a globally recognised doctor — study medicine in China.",
    category: "Medical",
    duration: "6 years (5 yr + 1 yr internship)",
    tuitionRange: "¥14,000 – ¥35,000 / year",
    livingCost: "¥1,500 – ¥2,500 / month",
    language: "English-taught programs available",
    intakeMonths: "September 2026",
    icon: "Stethoscope",
    color: "#C8102E",
    heroImage: "/images/programs/mbbs.jpg",
    overview:
      "China's medical universities are WHO-listed and globally recognised. An MBBS from China lets graduates sit licensing exams (FMGE/USMLE/PLAB) in 40+ countries. With affordable tuition, modern hospital training, and English-medium programs, China is the top destination for international medical students from Africa, South Asia, and the Middle East.",
    highlights: [
      { icon: "Clock", title: "Duration", value: "6 Years" },
      { icon: "DollarSign", title: "Annual Tuition", value: "¥14,000 – ¥35,000" },
      { icon: "Globe", title: "Medium", value: "English / Bilingual" },
      { icon: "Award", title: "Recognition", value: "WHO & FAIMER Listed" },
    ],
    universities: [
      { name: "Dalian Medical University", city: "Dalian", tuitionRMB: "¥15,000", scholarshipAvailable: true, ranking: "Top Medical" },
      { name: "Jilin University", city: "Changchun", tuitionRMB: "¥25,000", scholarshipAvailable: true, ranking: "985 University" },
      { name: "Nanjing Medical University", city: "Nanjing", tuitionRMB: "¥28,000", scholarshipAvailable: true },
      { name: "China Medical University", city: "Shenyang", tuitionRMB: "¥14,000", scholarshipAvailable: true },
      { name: "Harbin Medical University", city: "Harbin", tuitionRMB: "¥15,000", scholarshipAvailable: false },
      { name: "Guangzhou Medical University", city: "Guangzhou", tuitionRMB: "¥35,000", scholarshipAvailable: true },
    ],
    requirements: [
      "Minimum 60% in Biology, Chemistry, and Physics (or equivalent)",
      "High school diploma / O-Level + A-Level (or equivalent)",
      "Age: 17–25 years at time of enrollment",
      "Passport valid for at least 2 years",
      "English proficiency (IELTS 5.5+ or equivalent)",
      "Medical fitness certificate (HIV/Hepatitis B test required)",
    ],
    careerProspects: [
      "Licensed physician in home country after FMGE / USMLE / PLAB",
      "Specialist residency in China or abroad",
      "Hospital practice in Africa, South Asia, Middle East",
      "Public health & medical research",
      "International medical NGO work",
    ],
    scholarships: [
      "CSC (Chinese Government Scholarship) — full tuition + stipend",
      "University-level scholarship — 50–100% tuition waiver",
      "Provincial government scholarships",
      "Self-sponsored with affordable tuition",
    ],
    faqs: [
      {
        q: "Is a Chinese MBBS degree valid in my country?",
        a: "China's medical universities are WHO and FAIMER listed. Graduates can appear for FMGE (India), USMLE (USA), PLAB (UK), and similar licensing exams. Recognition depends on your country's medical council — Globlearn Education advises based on your nationality.",
      },
      {
        q: "Are there English-medium MBBS programs?",
        a: "Yes. Most universities offer English-taught MBBS for international students. Some also require basic Chinese for clinical rotations.",
      },
      {
        q: "Can I get a CSC scholarship for MBBS?",
        a: "Yes. The CSC scholarship covers full tuition and provides a monthly living stipend. Competition is high — we recommend applying 6 months before the deadline.",
      },
      {
        q: "What is the MBBS pass rate in China?",
        a: "Pass rates vary by university. Top medical universities report 80–90% FMGE pass rates among Indian students. We connect you with universities that have strong track records.",
      },
    ],
    relatedSlugs: ["masters-degree", "phd-program", "chinese-language"],
  },

  "bachelors-degree": {
    slug: "bachelors-degree",
    name: "Bachelor's Degree",
    tagline: "4-year undergraduate programs at China's top universities.",
    category: "Undergraduate",
    duration: "4 years",
    tuitionRange: "¥12,000 – ¥30,000 / year",
    livingCost: "¥1,500 – ¥2,500 / month",
    language: "English & Chinese-taught",
    intakeMonths: "September 2026 / March 2027",
    icon: "GraduationCap",
    color: "#1B3A6B",
    heroImage: "/images/programs/bachelors.jpg",
    overview:
      "China's universities offer undergraduate programs in engineering, business, arts, sciences, law, and more. With tuition far below Western universities and a rapidly globalising economy, a Bachelor's in China opens doors across Asia, Africa, and beyond. International students benefit from bilingual campuses, extensive lab facilities, and strong industry connections.",
    highlights: [
      { icon: "Clock", title: "Duration", value: "4 Years" },
      { icon: "DollarSign", title: "Annual Tuition", value: "¥12,000 – ¥30,000" },
      { icon: "Globe", title: "Medium", value: "English / Chinese" },
      { icon: "Award", title: "Credential", value: "Globally Recognised" },
    ],
    universities: [
      { name: "Tsinghua University", city: "Beijing", tuitionRMB: "¥26,000", scholarshipAvailable: true, ranking: "QS Top 25" },
      { name: "Fudan University", city: "Shanghai", tuitionRMB: "¥28,000", scholarshipAvailable: true, ranking: "QS Top 50" },
      { name: "Zhejiang University", city: "Hangzhou", tuitionRMB: "¥24,000", scholarshipAvailable: true, ranking: "985 University" },
      { name: "Huazhong University of Science", city: "Wuhan", tuitionRMB: "¥20,000", scholarshipAvailable: true },
      { name: "Sichuan University", city: "Chengdu", tuitionRMB: "¥18,000", scholarshipAvailable: true },
      { name: "Xiamen University", city: "Xiamen", tuitionRMB: "¥16,000", scholarshipAvailable: false },
    ],
    requirements: [
      "High school diploma with minimum 60% aggregate",
      "Age: 18–25 years at time of enrollment",
      "Passport valid for at least 2 years",
      "English proficiency (IELTS 5.5+ for English programs)",
      "HSK 4+ for Chinese-taught programs",
      "Academic transcripts (certified translations required)",
    ],
    careerProspects: [
      "Engineering, IT, and technology sectors",
      "International business and trade",
      "Banking, finance, and accounting",
      "Healthcare administration",
      "Diplomacy and international relations",
      "Continue to Master's in China or abroad",
    ],
    scholarships: [
      "CSC (Chinese Government Scholarship) — full tuition + stipend",
      "University-level excellence scholarships",
      "Provincial government programs",
      "Self-sponsored affordable tuition",
    ],
    faqs: [
      {
        q: "Which fields are most popular for international students?",
        a: "Engineering (civil, mechanical, electrical), Computer Science, Business Administration, Medicine, and Chinese Language are the most popular. Chinese tech and engineering programs are world-class.",
      },
      {
        q: "Can I study in English for a Bachelor's?",
        a: "Yes. Most 985 and 211 universities have English-medium Bachelor's programs in engineering, business, and sciences. You do not need Chinese to enroll.",
      },
      {
        q: "What is the tuition compared to UK/USA?",
        a: "Annual tuition in China is ¥12,000–¥30,000 (roughly $1,700–$4,200), compared to $20,000–$50,000+ in the UK and USA. The savings over 4 years are substantial.",
      },
      {
        q: "Will my degree be recognised?",
        a: "Degrees from Chinese 985/211 universities are widely recognised globally. Employers in Africa, South Asia, and the Middle East actively recruit Chinese university graduates.",
      },
    ],
    relatedSlugs: ["masters-degree", "chinese-language", "short-course-exchange"],
  },

  "masters-degree": {
    slug: "masters-degree",
    name: "Master's Degree",
    tagline: "Advance your career with a postgraduate degree from China.",
    category: "Postgraduate",
    duration: "2–3 years",
    tuitionRange: "¥16,000 – ¥40,000 / year",
    livingCost: "¥1,500 – ¥2,500 / month",
    language: "English & Chinese-taught",
    intakeMonths: "September 2026 / March 2027",
    icon: "BookOpen",
    color: "#29ABE2",
    heroImage: "/images/programs/masters.jpg",
    overview:
      "A Master's degree from a Chinese 985 or 211 university is a powerful career accelerator. Programs are available in engineering, business, sciences, arts, public policy, and more. China's research infrastructure, industry partnerships, and scholarship programs make postgraduate study here both affordable and high-impact.",
    highlights: [
      { icon: "Clock", title: "Duration", value: "2–3 Years" },
      { icon: "DollarSign", title: "Annual Tuition", value: "¥16,000 – ¥40,000" },
      { icon: "Globe", title: "Medium", value: "English / Chinese" },
      { icon: "Award", title: "Credential", value: "Globally Recognised" },
    ],
    universities: [
      { name: "Peking University", city: "Beijing", tuitionRMB: "¥35,000", scholarshipAvailable: true, ranking: "QS Top 15" },
      { name: "Shanghai Jiao Tong University", city: "Shanghai", tuitionRMB: "¥30,000", scholarshipAvailable: true, ranking: "QS Top 50" },
      { name: "Wuhan University", city: "Wuhan", tuitionRMB: "¥22,000", scholarshipAvailable: true },
      { name: "Sun Yat-sen University", city: "Guangzhou", tuitionRMB: "¥25,000", scholarshipAvailable: true },
      { name: "Tongji University", city: "Shanghai", tuitionRMB: "¥26,000", scholarshipAvailable: true },
      { name: "Northeast Normal University", city: "Changchun", tuitionRMB: "¥16,000", scholarshipAvailable: true },
    ],
    requirements: [
      "Bachelor's degree (minimum 2nd class / 3.0 GPA)",
      "Age: 35 or younger (for CSC scholarship)",
      "English proficiency (IELTS 6.0+ for English programs)",
      "HSK 5+ for Chinese-taught programs",
      "Research proposal or statement of purpose",
      "Two academic recommendation letters",
    ],
    careerProspects: [
      "Senior engineering and technical roles",
      "Academic and research positions",
      "Management consulting and strategy",
      "International NGOs and development agencies",
      "Government and public policy",
      "Continue to PhD in China or abroad",
    ],
    scholarships: [
      "CSC (Chinese Government Scholarship) — full tuition + ¥3,000/month stipend",
      "University excellence scholarships — 50–100% tuition waiver",
      "Provincial government scholarships (Jiangsu, Shandong, Hunan)",
      "Self-sponsored with affordable tuition",
    ],
    faqs: [
      {
        q: "What GPA do I need to apply?",
        a: "Most universities require a minimum 3.0 GPA (equivalent to 2nd class honours). Top 985 universities like Peking or Tsinghua may require 3.5+. Globlearn Education advises based on your profile.",
      },
      {
        q: "Can I get a scholarship as a Master's student?",
        a: "Yes. The CSC scholarship covers full tuition plus a monthly stipend of ¥3,000 for Master's students. University-level scholarships also offer 50–100% tuition waivers.",
      },
      {
        q: "How long does a Master's degree take?",
        a: "Most Master's programs in China are 2–3 years. Engineering and research-based programs are typically 3 years; coursework-heavy programs can be 2 years.",
      },
      {
        q: "Do I need Chinese to study at Master's level?",
        a: "Not necessarily. Many 985/211 universities offer English-medium Master's programs. If you plan to study in Chinese, HSK 5 (B2) is typically required.",
      },
    ],
    relatedSlugs: ["phd-program", "bachelors-degree", "short-course-exchange"],
  },

  "phd-program": {
    slug: "phd-program",
    name: "PhD Program",
    tagline: "World-class doctoral research with full scholarship opportunities.",
    category: "Doctoral",
    duration: "3–5 years",
    tuitionRange: "¥20,000 – ¥45,000 / year",
    livingCost: "¥1,500 – ¥2,500 / month",
    language: "English & Chinese-taught",
    intakeMonths: "September 2026",
    icon: "Microscope",
    color: "#1B3A6B",
    heroImage: "/images/programs/phd.jpg",
    overview:
      "China's investment in research and innovation is unprecedented. PhD candidates at Chinese universities benefit from state-of-the-art laboratories, world-leading research groups, and generous scholarship packages. The CSC PhD scholarship covers full tuition and a monthly living stipend, making a Chinese doctorate one of the best-funded options for international researchers.",
    highlights: [
      { icon: "Clock", title: "Duration", value: "3–5 Years" },
      { icon: "DollarSign", title: "Annual Tuition", value: "¥20,000 – ¥45,000" },
      { icon: "Globe", title: "Medium", value: "English / Chinese" },
      { icon: "Award", title: "Funding", value: "Full Scholarship Available" },
    ],
    universities: [
      { name: "Tsinghua University", city: "Beijing", tuitionRMB: "¥45,000", scholarshipAvailable: true, ranking: "QS Top 25" },
      { name: "Peking University", city: "Beijing", tuitionRMB: "¥40,000", scholarshipAvailable: true, ranking: "QS Top 15" },
      { name: "University of Science & Technology of China", city: "Hefei", tuitionRMB: "¥30,000", scholarshipAvailable: true, ranking: "C9 League" },
      { name: "Xi'an Jiaotong University", city: "Xi'an", tuitionRMB: "¥28,000", scholarshipAvailable: true },
      { name: "Nankai University", city: "Tianjin", tuitionRMB: "¥22,000", scholarshipAvailable: true },
      { name: "Shandong University", city: "Jinan", tuitionRMB: "¥20,000", scholarshipAvailable: true },
    ],
    requirements: [
      "Master's degree (or exceptional Bachelor's with research publications)",
      "Age: 40 or younger (for CSC scholarship)",
      "English proficiency (IELTS 6.5+ for English programs)",
      "Detailed research proposal (5–10 pages)",
      "Letter of acceptance from a supervisor in China",
      "Two academic reference letters",
      "Publication record preferred (not mandatory)",
    ],
    careerProspects: [
      "Academic faculty positions worldwide",
      "Senior research scientist roles",
      "R&D leadership in tech and pharma companies",
      "Government research institutes and think tanks",
      "International development agencies (UN, World Bank)",
      "Innovation and entrepreneurship",
    ],
    scholarships: [
      "CSC (Chinese Government Scholarship) — full tuition + ¥3,500/month stipend",
      "University president's fellowship — full package",
      "Laboratory and supervisor funding",
      "Provincial government doctoral scholarships",
    ],
    faqs: [
      {
        q: "Do I need a supervisor before applying?",
        a: "For the CSC scholarship, securing a supervisor (professor who agrees to mentor you) before applying significantly increases your chances. Globlearn Education helps connect you with potential supervisors.",
      },
      {
        q: "Can I do a PhD entirely in English?",
        a: "Yes. Many 985 universities have English-medium PhD programs. Some research groups work entirely in English, especially in STEM fields.",
      },
      {
        q: "How competitive is the CSC PhD scholarship?",
        a: "Very competitive. We recommend a strong research proposal, relevant publications if possible, and early contact with potential supervisors. We guide you through the process.",
      },
      {
        q: "Can I bring my family on a PhD visa?",
        a: "Yes. Your spouse and children can apply for a dependent visa (X2) while you hold a student visa (X1) as a PhD student. Family members cannot work on a dependent visa.",
      },
    ],
    relatedSlugs: ["masters-degree", "foundation-pre-university", "bachelors-degree"],
  },

  "chinese-language": {
    slug: "chinese-language",
    name: "Chinese Language",
    tagline: "Learn Mandarin at the source — from beginner to HSK 6.",
    category: "Language",
    duration: "6 months – 2 years",
    tuitionRange: "¥8,000 – ¥16,000 / year",
    livingCost: "¥1,200 – ¥2,000 / month",
    language: "Chinese (Mandarin)",
    intakeMonths: "September 2026 / March 2027",
    icon: "Languages",
    color: "#FFD700",
    heroImage: "/images/programs/language.jpg",
    overview:
      "Mandarin is the world's most spoken language and a key skill in global business and diplomacy. Chinese Language programs in China take students from absolute beginner to HSK 6 (advanced) in the most immersive environment possible. Programs combine intensive classroom instruction with real-world language practice in Chinese cities.",
    highlights: [
      { icon: "Clock", title: "Duration", value: "6 Months – 2 Years" },
      { icon: "DollarSign", title: "Annual Tuition", value: "¥8,000 – ¥16,000" },
      { icon: "Globe", title: "Focus", value: "Mandarin Chinese" },
      { icon: "Award", title: "Credential", value: "HSK Certificate" },
    ],
    universities: [
      { name: "Beijing Language and Culture University", city: "Beijing", tuitionRMB: "¥16,000", scholarshipAvailable: true, ranking: "Top Language Uni" },
      { name: "Fudan University", city: "Shanghai", tuitionRMB: "¥14,000", scholarshipAvailable: true },
      { name: "Wuhan University", city: "Wuhan", tuitionRMB: "¥10,000", scholarshipAvailable: false },
      { name: "Sichuan University", city: "Chengdu", tuitionRMB: "¥8,000", scholarshipAvailable: true },
      { name: "Tianjin Normal University", city: "Tianjin", tuitionRMB: "¥9,000", scholarshipAvailable: false },
      { name: "Yunnan University", city: "Kunming", tuitionRMB: "¥8,000", scholarshipAvailable: false },
    ],
    requirements: [
      "High school diploma or equivalent (minimum)",
      "No prior Chinese required for beginner levels",
      "Age: 18+ years",
      "Passport valid for at least 2 years",
      "Basic English proficiency (for program communication)",
      "Statement of purpose",
    ],
    careerProspects: [
      "International trade and China-Africa / China-ME business",
      "Translation and interpretation",
      "Diplomacy and foreign service",
      "Teaching Chinese as a foreign language",
      "Bridge to full degree programs (Bachelor's/Master's) taught in Chinese",
      "Corporate roles in Chinese multinational companies",
    ],
    scholarships: [
      "CSC Language and Culture scholarships",
      "Confucius Institute scholarships (HSK required)",
      "University-level short-term scholarships",
      "Self-sponsored affordable tuition",
    ],
    faqs: [
      {
        q: "How quickly can I learn Chinese in China?",
        a: "With daily immersion and intensive study, most students reach conversational level (HSK 3) in 6 months and intermediate level (HSK 4) in 12 months. Reaching HSK 6 typically takes 2 years of dedicated study.",
      },
      {
        q: "Can a language program lead to a degree?",
        a: "Yes. Successfully completing a language prep program and reaching HSK 4–5 allows you to apply to Chinese-medium undergraduate or postgraduate programs. Many students use language year as a gateway.",
      },
      {
        q: "What is the HSK exam?",
        a: "HSK (Hanyu Shuiping Kaoshi) is the official Chinese proficiency test for non-native speakers. Levels 1–6 assess listening, reading, and writing. HSK 4 is required for most Chinese-taught university programs.",
      },
      {
        q: "Is Mandarin difficult for African or Arabic speakers?",
        a: "Mandarin is different from any African or Arabic language, but thousands of students from these regions successfully learn it each year. The tonal system and characters are challenging but mastered with consistent practice.",
      },
    ],
    relatedSlugs: ["bachelors-degree", "diploma-vocational", "masters-degree"],
  },

  "diploma-vocational": {
    slug: "diploma-vocational",
    name: "Diploma & Vocational",
    tagline: "Practical skills, recognised diplomas — ready to work in 1–2 years.",
    category: "Vocational",
    duration: "1–2 years",
    tuitionRange: "¥8,000 – ¥18,000 / year",
    livingCost: "¥1,200 – ¥2,000 / month",
    language: "English & Chinese-taught",
    intakeMonths: "September 2026 / March 2027",
    icon: "Award",
    color: "#25D366",
    heroImage: "/images/programs/diploma.jpg",
    overview:
      "Diploma and vocational programs in China offer fast, practical pathways to skilled employment. Programs in nursing, agriculture, engineering technology, hospitality, and information technology combine classroom learning with hands-on workshops. Chinese vocational universities consistently produce job-ready graduates valued across Asia and Africa.",
    highlights: [
      { icon: "Clock", title: "Duration", value: "1–2 Years" },
      { icon: "DollarSign", title: "Annual Tuition", value: "¥8,000 – ¥18,000" },
      { icon: "Globe", title: "Focus", value: "Practical Skills" },
      { icon: "Award", title: "Credential", value: "Diploma Certificate" },
    ],
    universities: [
      { name: "Shenzhen Polytechnic", city: "Shenzhen", tuitionRMB: "¥18,000", scholarshipAvailable: false, ranking: "Top Polytechnic" },
      { name: "Chengdu Vocational and Technical College", city: "Chengdu", tuitionRMB: "¥10,000", scholarshipAvailable: true },
      { name: "Guangdong Polytechnic of Science", city: "Guangzhou", tuitionRMB: "¥12,000", scholarshipAvailable: false },
      { name: "Wuhan Polytechnic University", city: "Wuhan", tuitionRMB: "¥9,000", scholarshipAvailable: true },
      { name: "Hebei Vocational College", city: "Shijiazhuang", tuitionRMB: "¥8,000", scholarshipAvailable: false },
      { name: "Shandong Vocational College of Tourism", city: "Jinan", tuitionRMB: "¥8,500", scholarshipAvailable: false },
    ],
    requirements: [
      "Secondary school certificate / O-Level equivalent",
      "Age: 17–30 years",
      "Passport valid for at least 2 years",
      "Basic English or Chinese proficiency",
      "No prior professional experience required",
    ],
    careerProspects: [
      "Skilled technician in engineering or manufacturing",
      "Healthcare support and nursing",
      "Hospitality, tourism, and hotel management",
      "Agricultural technology and agribusiness",
      "IT support and network administration",
      "Pathway to Bachelor's degree programs",
    ],
    scholarships: [
      "Provincial government vocational scholarships",
      "University-level partial scholarships",
      "Self-sponsored with very affordable tuition",
    ],
    faqs: [
      {
        q: "Is a Chinese diploma recognised in my country?",
        a: "Recognition depends on your country and field. Nursing and engineering diplomas often require equivalency assessment. Globlearn Education advises based on your specific nationality and career goal.",
      },
      {
        q: "Can I upgrade to a Bachelor's after a diploma?",
        a: "Yes. Many students use a diploma program as a pathway — they complete the diploma, improve their Chinese or English proficiency, then apply for a full Bachelor's degree.",
      },
      {
        q: "What are the most popular diploma programs?",
        a: "Nursing, Computer Science, Business Administration, and Hospitality Management are most popular among international students. Agriculture technology is also growing rapidly.",
      },
      {
        q: "How much does accommodation cost?",
        a: "University dormitories typically cost ¥400–¥800/month. Private apartments range from ¥800–¥1,500/month depending on the city. Tier-2 cities like Chengdu and Wuhan are the most affordable.",
      },
    ],
    relatedSlugs: ["chinese-language", "bachelors-degree", "masters-degree"],
  },

  "short-course-exchange": {
    slug: "short-course-exchange",
    name: "Short Course / Exchange",
    tagline: "Flexible duration — experience China without a long-term commitment.",
    category: "Short Course",
    duration: "1 week – 1 year",
    tuitionRange: "¥3,000 – ¥20,000 / program",
    livingCost: "¥1,500 – ¥3,000 / month",
    language: "English / Chinese",
    intakeMonths: "Flexible — multiple start dates",
    icon: "Clock",
    color: "#EA580C",
    heroImage: "/images/programs/short-course.jpg",
    overview:
      "Short courses, summer schools, and exchange programs at Chinese universities offer a flexible way to experience China's world-class higher education system. Ideal for professionals seeking targeted skills, gap-year students exploring options, or those who want to experience a university before committing to a full degree. Programs range from one-week intensive courses to year-long exchanges.",
    highlights: [
      { icon: "Clock", title: "Duration", value: "1 Week – 1 Year" },
      { icon: "DollarSign", title: "Program Fees", value: "¥3,000 – ¥20,000" },
      { icon: "Globe", title: "Language", value: "English / Chinese" },
      { icon: "Award", title: "Commitment", value: "No long-term commitment" },
    ],
    universities: [
      { name: "Tsinghua University", city: "Beijing", tuitionRMB: "¥15,000–¥20,000 / semester", scholarshipAvailable: false, ranking: "QS Top 25" },
      { name: "Wuhan University", city: "Wuhan", tuitionRMB: "¥8,000–¥12,000 / semester", scholarshipAvailable: false },
      { name: "Beijing Language and Culture University", city: "Beijing", tuitionRMB: "¥6,000–¥10,000 / semester", scholarshipAvailable: false },
      { name: "Fudan University", city: "Shanghai", tuitionRMB: "¥12,000–¥18,000 / semester", scholarshipAvailable: true },
      { name: "Zhejiang University", city: "Hangzhou", tuitionRMB: "¥8,000–¥14,000 / semester", scholarshipAvailable: false },
      { name: "Sun Yat-sen University", city: "Guangzhou", tuitionRMB: "¥5,000–¥9,000 / semester", scholarshipAvailable: false },
    ],
    requirements: [
      "Varies by program — contact Globlearn Education for your specific course",
      "High school diploma or equivalent for most programs",
      "Basic English proficiency (no formal test required for many programs)",
      "Passport valid for the duration of study",
      "Health insurance for programs over 6 months",
    ],
    careerProspects: [
      "Gain China experience for your CV before a full degree",
      "Professional development for working adults",
      "Language immersion and cultural competence",
      "University taster before a full application",
      "Exchange credits recognised by home universities",
      "Networking with students from 50+ countries",
    ],
    scholarships: [
      "University Scholarship (select programs)",
      "Self-sponsored — transparent, affordable fees",
    ],
    faqs: [
      {
        q: "Can a short course lead to a full degree?",
        a: "Yes — many students use short courses or exchange programs to experience a university before applying for a full Bachelor's or Master's program. Globlearn Education can help you transition.",
      },
      {
        q: "What is the minimum duration for a short course?",
        a: "Programs can be as short as one week (intensive summer schools) or as long as one academic year (exchange programs). You can choose the duration that fits your schedule and goals.",
      },
      {
        q: "Do I need a student visa for a short course?",
        a: "Programs under 180 days may be eligible for an F (visit/exchange) visa. Programs over 180 days require an X2 student visa. Globlearn Education advises on the correct visa for your program length.",
      },
      {
        q: "Are short course credits transferable to my home university?",
        a: "Many exchange programs are credit-bearing and recognised by home universities, especially under bilateral agreements. Check with your home institution — Globlearn Education can provide supporting documents.",
      },
    ],
    relatedSlugs: ["chinese-language", "bachelors-degree", "foundation-pre-university"],
  },

  "foundation-pre-university": {
    slug: "foundation-pre-university",
    name: "Foundation / Pre-University",
    tagline: "Your bridge to a Bachelor's degree at China's top universities.",
    category: "Foundation",
    duration: "1 semester – 1 year",
    tuitionRange: "¥5,000 – ¥16,000 / year",
    livingCost: "¥1,200 – ¥2,500 / month",
    language: "English",
    intakeMonths: "September 2026 / March 2027",
    icon: "GraduationCap",
    color: "#16A34A",
    heroImage: "/images/programs/foundation.jpg",
    overview:
      "Foundation and pre-university programs prepare students for degree-level study in China. Ideal for students who do not yet meet the direct entry requirements for Bachelor's programs — whether due to lower high school grades, curriculum differences, or age. Most Foundation programs include a guaranteed progression pathway to a Bachelor's degree at the same university.",
    highlights: [
      { icon: "Clock", title: "Duration", value: "1 Semester / 1 Year" },
      { icon: "DollarSign", title: "Annual Tuition", value: "¥5,000 – ¥16,000" },
      { icon: "Globe", title: "Language", value: "English-taught" },
      { icon: "Award", title: "Pathway", value: "Guaranteed Bachelor's entry" },
    ],
    universities: [
      { name: "Wuhan University", city: "Wuhan", tuitionRMB: "¥12,000", scholarshipAvailable: true, ranking: "985 University" },
      { name: "Huazhong University of Science and Technology", city: "Wuhan", tuitionRMB: "¥10,000", scholarshipAvailable: true, ranking: "985 University" },
      { name: "Jilin University", city: "Changchun", tuitionRMB: "¥8,000", scholarshipAvailable: true, ranking: "985 University" },
      { name: "Shandong University", city: "Jinan", tuitionRMB: "¥7,000", scholarshipAvailable: false, ranking: "985 University" },
      { name: "Central South University", city: "Changsha", tuitionRMB: "¥9,000", scholarshipAvailable: true },
      { name: "Nanjing Medical University", city: "Nanjing", tuitionRMB: "¥8,000", scholarshipAvailable: false },
    ],
    requirements: [
      "High school diploma or equivalent — lower grades accepted",
      "English proficiency at secondary level (no formal test required for most programs)",
      "Age 17–22 typically (varies by university)",
      "Passport valid for the duration of study",
      "Academic transcripts from the last 2–3 years of secondary school",
    ],
    careerProspects: [
      "Progression to Bachelor's degree at the same university",
      "Transfer to other 985 / 211 universities after Foundation",
      "Improved academic English and study skills",
      "Basic Chinese language proficiency",
      "Stronger academic profile for future scholarship applications",
      "Entry into MBBS and other competitive degree programs",
    ],
    scholarships: [
      "University Scholarship (select programs)",
      "Self-sponsored — transparent, affordable fees",
    ],
    faqs: [
      {
        q: "Can I go directly to a Bachelor's after Foundation?",
        a: "Yes — most Foundation programs have a guaranteed progression pathway to degree programs at the same university, provided you meet the required grade threshold (typically 60–70%).",
      },
      {
        q: "Is Foundation the same as the first year of a Bachelor's?",
        a: "No. Foundation is a preparatory program that builds academic, language, and study skills. It is not equivalent to a year of your Bachelor's degree, but it prepares you for successful entry into Year 1.",
      },
      {
        q: "What subjects are covered in Foundation programs?",
        a: "Most Foundation programs cover academic English, Mathematics, an introduction to your chosen field (e.g. Sciences for pre-medicine, Business for management), and basic Mandarin Chinese.",
      },
      {
        q: "Can I apply for a scholarship after completing Foundation?",
        a: "Yes. After completing Foundation and entering your Bachelor's program, you become eligible for CSC Government Scholarship and University Scholarship applications. Globlearn Education advises on the process.",
      },
    ],
    relatedSlugs: ["bachelors-degree", "chinese-language", "short-course-exchange"],
  },
};

export const programsList = Object.values(programsData);

export const programCategories = [
  "All",
  "Medical",
  "Undergraduate",
  "Postgraduate",
  "Doctoral",
  "Language",
  "Vocational",
  "Foundation",
  "Short Course",
];
