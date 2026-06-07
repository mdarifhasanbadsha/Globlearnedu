export interface UniversityProgram {
  name: string;
  slug: string;
}

export interface UniversityFAQ {
  q: string;
  a: string;
}

export interface UniversityData {
  slug: string;
  name: string;
  chineseName: string;
  city: string;
  province: string;
  region: "North" | "East" | "South" | "Central" | "West" | "Northeast";
  tier: "985" | "211" | "Medical" | "Language" | "Business" | "Regular";
  ranking?: string;
  established: number;
  students: string;
  internationalStudents: string;
  campusArea: string;
  tagline: string;
  description: string;
  programs: UniversityProgram[];
  tuitionRMB: string;
  livingCostRMB: string;
  scholarships: string[];
  highlights: string[];
  intakeMonths: string;
  applicationDeadline: string;
  requirements: string[];
  faqs: UniversityFAQ[];
}

export const universitiesData: Record<string, UniversityData> = {
  "tsinghua-university": {
    slug: "tsinghua-university",
    name: "Tsinghua University",
    chineseName: "清华大学",
    city: "Beijing",
    province: "Beijing",
    region: "North",
    tier: "985",
    ranking: "QS Top 25 · Asia #3",
    established: 1911,
    students: "58,000+",
    internationalStudents: "5,500+",
    campusArea: "457 hectares",
    tagline: "China's top-ranked university — where science, engineering, and innovation meet.",
    description:
      "Tsinghua University is consistently ranked among the world's top 25 universities and is China's premier institution for science, engineering, and technology. Founded in 1911, Tsinghua counts among its alumni top Chinese government leaders, Nobel laureates, and CEOs of the world's largest companies. International students at Tsinghua benefit from English-medium programs, world-class research facilities, and direct access to China's tech and innovation ecosystem through partnerships with Baidu, Alibaba, and Huawei.",
    programs: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
      { name: "MBA & Business", slug: "mba-business" },
    ],
    tuitionRMB: "¥26,000 – ¥45,000 / year",
    livingCostRMB: "¥2,500 – ¥4,000 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship) — full tuition + stipend",
      "Tsinghua University Scholarship — 50–100% tuition waiver",
      "Tsinghua Initiative Scholarship for international students",
    ],
    highlights: [
      "QS World University Rankings Top 25",
      "50+ Nobel & Turing Award connections",
      "Industry partnerships: Baidu, Alibaba, Huawei, DJI",
      "100+ English-medium degree programs",
      "World-class research labs and innovation hub",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "March 31, 2026",
    requirements: [
      "Excellent academic record (top 10% of class)",
      "English proficiency: IELTS 6.5+ / TOEFL 95+",
      "Statement of purpose",
      "Two academic recommendation letters",
      "Research proposal for PhD applicants",
      "GRE/GMAT for some graduate programs",
    ],
    faqs: [
      {
        q: "How competitive is Tsinghua for international students?",
        a: "Very competitive. Tsinghua admits students based on academic excellence. CSC scholarship applicants should have a GPA of 3.5+ and strong research potential. Globlearn Education advises on realistic program targeting.",
      },
      {
        q: "Are programs available in English?",
        a: "Yes. Tsinghua offers 100+ English-medium programs at Master's and PhD level. Some Bachelor's programs also have English tracks.",
      },
      {
        q: "What support does Tsinghua offer international students?",
        a: "A dedicated International Students & Scholars Center, on-campus housing, visa assistance, language classes, buddy programs, and career services.",
      },
    ],
  },

  "peking-university": {
    slug: "peking-university",
    name: "Peking University",
    chineseName: "北京大学",
    city: "Beijing",
    province: "Beijing",
    region: "North",
    tier: "985",
    ranking: "QS Top 15 · Asia #2",
    established: 1898,
    students: "55,000+",
    internationalStudents: "6,000+",
    campusArea: "274 hectares",
    tagline: "China's oldest and most prestigious comprehensive university.",
    description:
      "Peking University (PKU) is China's first modern university and one of the world's leading institutions across humanities, sciences, law, and medicine. PKU's international campus in Yanqihu hosts graduate programs attracting students from over 100 countries. Its alumni network spans heads of state, Supreme Court justices, Nobel Prize winners, and tech founders. International students benefit from a vibrant campus culture, extensive scholarship programs, and proximity to Beijing's government and diplomatic community.",
    programs: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "MBA & Business", slug: "mba-business" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
    ],
    tuitionRMB: "¥25,000 – ¥45,000 / year",
    livingCostRMB: "¥2,500 – ¥4,000 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "PKU Excellence Scholarship",
      "PKU President's Scholarship for outstanding international students",
      "Yenching Academy Scholarship (humanities/social sciences)",
    ],
    highlights: [
      "QS World University Rankings Top 15",
      "Oldest modern university in China (est. 1898)",
      "Exceptional humanities, law, and natural sciences programs",
      "6,000+ international students from 100+ countries",
      "Yenching Academy — China's premier scholarship for global scholars",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "March 15, 2026",
    requirements: [
      "Outstanding academic record",
      "English proficiency: IELTS 6.5+ / TOEFL 90+",
      "HSK 5+ for Chinese-taught programs",
      "Strong research proposal for PhD",
      "Two academic references",
      "Portfolio or writing samples (humanities)",
    ],
    faqs: [
      {
        q: "What is the Yenching Academy?",
        a: "The Yenching Academy is PKU's elite, fully funded master's program in China Studies. It accepts ~100 students annually from around the world and is one of the most prestigious scholarships available to international students.",
      },
      {
        q: "Can I do a law or medicine program at PKU?",
        a: "Yes. PKU has a top-ranked Law School and a Medical School (Peking University Health Science Center). Most law programs require Chinese; medical science programs have English tracks.",
      },
    ],
  },

  "fudan-university": {
    slug: "fudan-university",
    name: "Fudan University",
    chineseName: "复旦大学",
    city: "Shanghai",
    province: "Shanghai",
    region: "East",
    tier: "985",
    ranking: "QS Top 50 · Asia Top 10",
    established: 1905,
    students: "45,000+",
    internationalStudents: "5,200+",
    campusArea: "244 hectares",
    tagline: "Shanghai's premier university — gateway to China's global financial capital.",
    description:
      "Fudan University is one of China's most prestigious 985 universities, consistently ranked in the QS top 50. Located in Shanghai, China's financial and cultural hub, Fudan offers exceptional programs in business, international relations, medicine, and science. Its School of International Relations and Public Affairs is the top-ranked in China, drawing diplomats and policy-makers from across Asia and Africa. International students at Fudan have access to Shanghai's vibrant cosmopolitan environment and the university's extensive alumni network across 100+ countries.",
    programs: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "MBA & Business", slug: "mba-business" },
    ],
    tuitionRMB: "¥28,000 – ¥45,000 / year",
    livingCostRMB: "¥2,500 – ¥4,500 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "Fudan University Scholarship",
      "Shanghai Government Scholarship",
      "Fudan International Excellence Scholarship",
    ],
    highlights: [
      "QS World University Rankings Top 50",
      "Top-ranked International Relations program in China",
      "Located in Shanghai — China's global financial capital",
      "Strong alumni network in diplomacy and international business",
      "Exchange partnerships with 300+ universities worldwide",
    ],
    intakeMonths: "September 2026 / March 2027",
    applicationDeadline: "April 30, 2026 (September) / November 30, 2026 (March)",
    requirements: [
      "Strong academic background",
      "English proficiency: IELTS 6.0+ / TOEFL 85+",
      "Statement of purpose",
      "Two recommendation letters",
      "HSK 4+ for Chinese-taught programs",
    ],
    faqs: [
      {
        q: "Is Fudan good for international relations and diplomacy?",
        a: "Yes — Fudan's School of International Relations is ranked #1 in China and top 20 globally. Many African and Middle Eastern government officials and diplomats have studied here.",
      },
      {
        q: "What is living in Shanghai like for international students?",
        a: "Shanghai is one of the world's most international cities. English is widely spoken, there are large African and South Asian communities, and the city offers excellent transport, food, and cultural options.",
      },
    ],
  },

  "shanghai-jiao-tong-university": {
    slug: "shanghai-jiao-tong-university",
    name: "Shanghai Jiao Tong University",
    chineseName: "上海交通大学",
    city: "Shanghai",
    province: "Shanghai",
    region: "East",
    tier: "985",
    ranking: "QS Top 50 · Asia Top 15",
    established: 1896,
    students: "50,000+",
    internationalStudents: "6,000+",
    campusArea: "300 hectares",
    tagline: "China's leading engineering and technology university — training tomorrow's innovators.",
    description:
      "Shanghai Jiao Tong University (SJTU) is one of China's oldest and most respected universities, renowned globally for engineering, medicine, and business. SJTU hosts the Antai College of Economics and Management (ranked top 10 in Asia) and the School of Medicine, one of China's finest. With 6,000+ international students and programs across engineering, AI, biosciences, and management, SJTU is ideal for students targeting careers in China's tech and manufacturing ecosystem.",
    programs: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
      { name: "MBA & Business", slug: "mba-business" },
    ],
    tuitionRMB: "¥24,000 – ¥42,000 / year",
    livingCostRMB: "¥2,500 – ¥4,000 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "SJTU Excellence Scholarship",
      "Shanghai Government Scholarship",
      "SJTU-Sanjin Scholarship for engineering students",
    ],
    highlights: [
      "QS World University Rankings Top 50",
      "Top engineering and bioscience programs",
      "Antai Business School — top 10 in Asia",
      "Partnerships with Boeing, GM, and 200+ multinationals",
      "Zhangjiang Sci-Tech Park — China's Silicon Valley on campus",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "April 30, 2026",
    requirements: [
      "Strong maths and science background",
      "English proficiency: IELTS 6.0+ / TOEFL 85+",
      "Statement of purpose",
      "Two academic references",
      "Research proposal for PhD applicants",
    ],
    faqs: [
      {
        q: "Is SJTU good for AI and computer science?",
        a: "Yes. SJTU has one of China's top AI and CS departments, with research labs sponsored by Intel, Microsoft, and Chinese tech firms. Multiple English-medium AI programs are available.",
      },
      {
        q: "Does SJTU have a medical school?",
        a: "Yes. SJTU School of Medicine (affiliated with Ruijin Hospital) is one of China's top 5 medical schools. Programs are largely in Chinese, though some research programs accept English-speaking PhD students.",
      },
    ],
  },

  "zhejiang-university": {
    slug: "zhejiang-university",
    name: "Zhejiang University",
    chineseName: "浙江大学",
    city: "Hangzhou",
    province: "Zhejiang",
    region: "East",
    tier: "985",
    ranking: "QS Top 100 · C9 League",
    established: 1897,
    students: "62,000+",
    internationalStudents: "8,000+",
    campusArea: "600 hectares",
    tagline: "Home to 8,000+ international students — one of China's most welcoming campuses.",
    description:
      "Zhejiang University (ZJU) is consistently ranked in the QS top 100 and is a member of China's elite C9 League. Located in Hangzhou — home to Alibaba, NetEase, and hundreds of tech startups — ZJU offers unmatched industry exposure alongside rigorous academic programs. With 8,000+ international students making it one of China's most internationally diverse universities, ZJU has dedicated international campuses, English-medium programs, and a strong support infrastructure for students from Africa, Southeast Asia, and the Middle East.",
    programs: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    tuitionRMB: "¥20,000 – ¥38,000 / year",
    livingCostRMB: "¥2,000 – ¥3,500 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "ZJU International Student Scholarship",
      "Zhejiang Province Government Scholarship",
      "ZJU-Alibaba Innovation Scholarship",
    ],
    highlights: [
      "QS Top 100 — C9 League member",
      "8,000+ international students — one of China's most diverse campuses",
      "Located in Hangzhou, home to Alibaba and 2,000+ tech companies",
      "600-hectare campus — one of China's most beautiful",
      "Dedicated International Campus at Haining",
    ],
    intakeMonths: "September 2026 / March 2027",
    applicationDeadline: "May 15, 2026",
    requirements: [
      "Solid academic background",
      "English proficiency: IELTS 6.0+",
      "Statement of purpose",
      "Two references",
    ],
    faqs: [
      {
        q: "What makes Zhejiang University stand out for international students?",
        a: "ZJU has the highest number of international students among China's 985 universities and invests heavily in international support. Hangzhou's booming tech scene offers exceptional internship and career opportunities.",
      },
      {
        q: "Is there an English campus at Zhejiang University?",
        a: "Yes. ZJU's International Campus at Haining hosts joint programs with top universities like Edinburgh, Illinois, and UC Davis — fully in English.",
      },
    ],
  },

  "wuhan-university": {
    slug: "wuhan-university",
    name: "Wuhan University",
    chineseName: "武汉大学",
    city: "Wuhan",
    province: "Hubei",
    region: "Central",
    tier: "985",
    ranking: "Top 10 China · QS Top 250",
    established: 1893,
    students: "65,000+",
    internationalStudents: "7,000+",
    campusArea: "530 hectares",
    tagline: "One of China's most beautiful campuses — excellence in humanities, science, and Chinese language.",
    description:
      "Wuhan University is one of China's oldest and most comprehensive universities, ranked consistently in the top 10 domestically. Famous for its stunning cherry-blossom campus beside East Lake, WHU offers exceptional programs in remote sensing, law, information management, Chinese language, and engineering. Its Chinese Language School is one of the most respected in China, making WHU a top destination for students wanting to learn Mandarin. Wuhan, China's 'Chicago of the East,' offers affordable living and a thriving student culture.",
    programs: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    tuitionRMB: "¥18,000 – ¥32,000 / year",
    livingCostRMB: "¥1,500 – ¥2,500 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "WHU International Student Scholarship",
      "Hubei Province Government Scholarship",
      "WHU President's Scholarship",
    ],
    highlights: [
      "Top 10 China — QS Top 250",
      "Renowned Chinese Language School",
      "Beautiful 530-hectare campus with cherry blossoms",
      "Very affordable living costs in Wuhan",
      "Top-ranked law, remote sensing, and information management",
    ],
    intakeMonths: "September 2026 / March 2027",
    applicationDeadline: "May 31, 2026",
    requirements: [
      "High school diploma or Bachelor's degree",
      "English proficiency: IELTS 5.5+",
      "HSK 4+ for Chinese-taught programs",
      "Statement of purpose",
    ],
    faqs: [
      {
        q: "Is Wuhan University good for learning Chinese?",
        a: "Yes. WHU's Chinese Language School is consistently rated among the top 3 in China for international students. The full-immersion environment in a non-tourist city accelerates language acquisition significantly.",
      },
      {
        q: "How affordable is Wuhan compared to Beijing or Shanghai?",
        a: "Significantly more affordable. Monthly living costs in Wuhan are ¥1,500–¥2,500 versus ¥2,500–¥4,500 in Shanghai. Campus dormitories are excellent quality at ¥400–¥700/month.",
      },
    ],
  },

  "sun-yat-sen-university": {
    slug: "sun-yat-sen-university",
    name: "Sun Yat-sen University",
    chineseName: "中山大学",
    city: "Guangzhou",
    province: "Guangdong",
    region: "South",
    tier: "985",
    ranking: "Top 15 China · QS Top 250",
    established: 1924,
    students: "70,000+",
    internationalStudents: "5,000+",
    campusArea: "780 hectares",
    tagline: "Gateway to Greater Bay Area — excellence in medicine, science, and business.",
    description:
      "Sun Yat-sen University (SYSU) is South China's leading university and a member of the 985 Project. Located in Guangzhou — the capital of Guangdong Province and gateway to the Greater Bay Area (Hong Kong, Shenzhen, Macau) — SYSU offers exceptional programs in medicine, law, business, and natural sciences. Its medical colleges are among China's top 5, and SYSU has one of the largest and most comprehensive university hospital systems in the country. International students in Guangzhou enjoy a subtropical climate, diverse food culture, and one of China's most internationally connected cities.",
    programs: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    tuitionRMB: "¥20,000 – ¥38,000 / year",
    livingCostRMB: "¥2,000 – ¥3,500 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "SYSU International Student Scholarship",
      "Guangdong Province Government Scholarship",
      "Sun Yat-sen University Excellence Award",
    ],
    highlights: [
      "Top 15 China — largest 985 university campus",
      "Top 5 medical colleges nationally",
      "Guangzhou Greater Bay Area location — access to HK, Shenzhen, Macau",
      "Warm climate, diverse food, cosmopolitan city",
      "4 campuses across Guangzhou and Zhuhai",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "April 30, 2026",
    requirements: [
      "Strong academic record",
      "IELTS 6.0+ for English programs",
      "Minimum 60% in biology/chemistry for medical programs",
      "HSK 4+ for Chinese-taught programs",
      "Two reference letters",
    ],
    faqs: [
      {
        q: "Is SYSU medical school WHO-listed for international students?",
        a: "Yes. SYSU medical programs are WHO and FAIMER listed. Graduates can sit FMGE, USMLE, and PLAB licensing exams.",
      },
      {
        q: "What is the Greater Bay Area advantage?",
        a: "Guangzhou's proximity to Hong Kong, Shenzhen, and Macau means exceptional career opportunities. Many SYSU graduates join multinational firms in the Bay Area's tech, finance, and trade sectors.",
      },
    ],
  },

  "jilin-university": {
    slug: "jilin-university",
    name: "Jilin University",
    chineseName: "吉林大学",
    city: "Changchun",
    province: "Jilin",
    region: "Northeast",
    tier: "985",
    ranking: "985 University · Top 30 China",
    established: 1946,
    students: "78,000+",
    internationalStudents: "4,500+",
    campusArea: "600 hectares",
    tagline: "China's largest 985 university — top-tier MBBS and engineering programs at affordable tuition.",
    description:
      "Jilin University is one of China's largest and most comprehensive 985 universities, with particular strength in MBBS/medicine, automotive engineering, chemistry, and geosciences. Its Medical School is WHO and FAIMER listed, with an English-taught MBBS program consistently producing graduates who pass foreign medical licensing exams. Jilin University's location in Changchun offers a very affordable cost of living — one of the lowest among 985 universities — making it ideal for students seeking world-class education without high costs.",
    programs: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    tuitionRMB: "¥14,000 – ¥30,000 / year",
    livingCostRMB: "¥1,200 – ¥2,000 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "Jilin University Scholarship",
      "Jilin Province Government Scholarship",
    ],
    highlights: [
      "985 University — WHO & FAIMER listed Medical School",
      "English-taught MBBS program with strong licensing exam pass rates",
      "Among lowest living costs of any 985 university",
      "China's largest university by enrollment",
      "Strong automotive and chemistry research programs",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "June 30, 2026",
    requirements: [
      "60%+ in Biology, Chemistry, Physics (for MBBS)",
      "High school diploma",
      "Age 17–25 (for MBBS)",
      "English proficiency: IELTS 5.5+ (MBBS in English)",
      "Medical fitness certificate",
    ],
    faqs: [
      {
        q: "Is Jilin University MBBS recognized by my country's medical council?",
        a: "Jilin University Medical School is listed in WHO AVICENNA directory and FAIMER. Graduates are eligible for FMGE (India), USMLE (USA), and PLAB (UK). Recognition depends on your country's specific regulations.",
      },
      {
        q: "How cold is Changchun?",
        a: "Changchun has cold winters (can reach -25°C) but very hot summers. Most university buildings are well-heated. Many students from Africa and South Asia adapt well — Changchun has a large international student community.",
      },
    ],
  },

  "sichuan-university": {
    slug: "sichuan-university",
    name: "Sichuan University",
    chineseName: "四川大学",
    city: "Chengdu",
    province: "Sichuan",
    region: "West",
    tier: "985",
    ranking: "985 University · Top 20 China",
    established: 1896,
    students: "65,000+",
    internationalStudents: "5,800+",
    campusArea: "540 hectares",
    tagline: "Study in Chengdu — China's most liveable city with a world-class 985 university.",
    description:
      "Sichuan University is the leading 985 university in Southwest China, renowned for medicine, engineering, liberal arts, and business. Located in Chengdu — consistently ranked China's most liveable city and a global hotspot for tech and culture — SCU offers a unique combination of academic excellence and exceptional quality of life. The university's MBBS program is English-taught and WHO-listed. Chengdu's affordable cost of living, diverse food scene (famous for Sichuan cuisine), and vibrant international community make it a top destination for international students from Africa and South Asia.",
    programs: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    tuitionRMB: "¥16,000 – ¥30,000 / year",
    livingCostRMB: "¥1,500 – ¥2,500 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "Sichuan University International Student Scholarship",
      "Sichuan Province Government Scholarship",
    ],
    highlights: [
      "985 University in China's most liveable city",
      "WHO-listed English MBBS program",
      "Affordable cost of living — 30% cheaper than Shanghai",
      "5,800+ international students",
      "Giant Panda Research Base 20 minutes from campus",
    ],
    intakeMonths: "September 2026 / March 2027",
    applicationDeadline: "June 30, 2026",
    requirements: [
      "High school diploma or Bachelor's degree",
      "60%+ in sciences (for MBBS)",
      "IELTS 5.5+ for English programs",
      "Statement of purpose",
    ],
    faqs: [
      {
        q: "Why do many students choose Chengdu over Beijing or Shanghai?",
        a: "Chengdu offers similar academic quality at 30–40% lower living costs. The city is safer, cleaner, and has a thriving international community. Many students prefer the relaxed pace and cultural richness.",
      },
      {
        q: "Is SCU MBBS good for Indian/Pakistani medical students?",
        a: "Yes. Sichuan University is a popular destination for South Asian MBBS students. The Medical School is WHO-listed and graduates have good FMGE pass rates.",
      },
    ],
  },

  "dalian-medical-university": {
    slug: "dalian-medical-university",
    name: "Dalian Medical University",
    chineseName: "大连医科大学",
    city: "Dalian",
    province: "Liaoning",
    region: "Northeast",
    tier: "Medical",
    ranking: "Top Medical University · WHO Listed",
    established: 1947,
    students: "15,000+",
    internationalStudents: "2,500+",
    campusArea: "100 hectares",
    tagline: "Affordable WHO-listed MBBS in China's most scenic coastal city.",
    description:
      "Dalian Medical University is one of China's premier medical universities, offering an English-taught MBBS program specifically designed for international students. Located in Dalian — a stunning coastal city with European-influenced architecture — the university combines rigorous medical education with an exceptional quality of life. DMU's MBBS is listed in the WHO AVICENNA directory and FAIMER, and graduates have strong pass rates in FMGE and other international licensing exams. Tuition is among the most affordable at any WHO-listed medical university in China.",
    programs: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    tuitionRMB: "¥14,000 – ¥22,000 / year",
    livingCostRMB: "¥1,200 – ¥2,000 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "DMU International Student Scholarship",
      "Liaoning Province Government Scholarship",
    ],
    highlights: [
      "WHO & FAIMER listed medical university",
      "English-taught MBBS — dedicated for international students",
      "Affordable tuition among all WHO-listed programs",
      "Dalian — scenic coastal city, safe and clean",
      "Modern simulation labs and teaching hospitals",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "July 31, 2026",
    requirements: [
      "60%+ in Biology, Chemistry, and Physics",
      "High school diploma",
      "Age 17–25",
      "English proficiency: IELTS 5.5+ (English MBBS)",
      "Medical fitness certificate",
      "Passport valid 2+ years",
    ],
    faqs: [
      {
        q: "Is DMU MBBS accepted for FMGE in India?",
        a: "Yes. Dalian Medical University is listed in the Medical Council of India's (now NMC's) approved list. Graduates can sit the FMGE/NExT examination.",
      },
      {
        q: "What is clinical training like at DMU?",
        a: "Clinical training takes place at the affiliated hospitals — Dalian Medical University's 1st and 2nd Hospitals — modern facilities with thousands of patient beds providing excellent exposure.",
      },
    ],
  },

  "china-medical-university": {
    slug: "china-medical-university",
    name: "China Medical University",
    chineseName: "中国医科大学",
    city: "Shenyang",
    province: "Liaoning",
    region: "Northeast",
    tier: "Medical",
    ranking: "Top Medical University · WHO Listed",
    established: 1931,
    students: "20,000+",
    internationalStudents: "2,200+",
    campusArea: "130 hectares",
    tagline: "China's oldest medical school — lowest-tuition WHO-listed MBBS program.",
    description:
      "China Medical University (CMU) is one of China's oldest and most respected medical institutions, founded in 1931. Its English-taught MBBS program is among the most affordable in China for international students, with tuition starting at ¥14,000/year — significantly below comparable programs in Europe and North America. CMU is WHO and FAIMER listed, and its graduates consistently perform well in international licensing exams. Shenyang is an affordable, student-friendly city in Northeast China.",
    programs: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    tuitionRMB: "¥14,000 – ¥20,000 / year",
    livingCostRMB: "¥1,000 – ¥1,800 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "CMU International Student Scholarship",
      "Liaoning Province Government Scholarship",
    ],
    highlights: [
      "Lowest tuition of any WHO-listed MBBS in China",
      "Founded 1931 — China's oldest medical school",
      "WHO & FAIMER listed",
      "Very affordable city — among the cheapest in Northeast China",
      "Strong FMGE/NExT pass rates among Indian graduates",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "July 31, 2026",
    requirements: [
      "60%+ in Biology, Chemistry, Physics",
      "High school diploma",
      "Age 17–25",
      "English proficiency: IELTS 5.5+",
      "Medical fitness certificate",
    ],
    faqs: [
      {
        q: "Is CMU the cheapest WHO-listed MBBS in China?",
        a: "CMU offers one of the lowest tuition rates among WHO/FAIMER-listed Chinese medical universities, making it a highly cost-effective option for international students.",
      },
    ],
  },

  "harbin-medical-university": {
    slug: "harbin-medical-university",
    name: "Harbin Medical University",
    chineseName: "哈尔滨医科大学",
    city: "Harbin",
    province: "Heilongjiang",
    region: "Northeast",
    tier: "Medical",
    ranking: "Top Medical University · WHO Listed",
    established: 1926,
    students: "18,000+",
    internationalStudents: "1,800+",
    campusArea: "90 hectares",
    tagline: "WHO-listed MBBS program in China's Ice City — quality education at affordable cost.",
    description:
      "Harbin Medical University is a well-established Chinese medical university with one of the longest histories of training international medical students. Its English-taught MBBS program is WHO and FAIMER listed. Harbin — famous for its winter Ice Festival — is an affordable, safe city with a significant international student community. HMU's teaching hospitals provide extensive clinical training opportunities with large patient volumes across diverse medical conditions.",
    programs: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    tuitionRMB: "¥14,000 – ¥18,000 / year",
    livingCostRMB: "¥1,000 – ¥1,800 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "Heilongjiang Province Government Scholarship",
    ],
    highlights: [
      "WHO & FAIMER listed medical university",
      "English MBBS with decades of international student experience",
      "Very low living costs — one of China's most affordable cities",
      "Harbin Ice Festival — unique cultural experience",
      "Large teaching hospitals with diverse patient base",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "July 31, 2026",
    requirements: [
      "60%+ in Biology, Chemistry, Physics",
      "High school diploma",
      "Age 17–25",
      "IELTS 5.0+ or equivalent",
      "Medical fitness certificate",
    ],
    faqs: [
      {
        q: "How cold is Harbin and can students from warm countries adapt?",
        a: "Harbin winters reach -30°C but campus buildings are well-insulated and heated. Thousands of students from Africa and South Asia study here successfully year after year. Proper clothing and preparation is key.",
      },
    ],
  },

  "nanjing-medical-university": {
    slug: "nanjing-medical-university",
    name: "Nanjing Medical University",
    chineseName: "南京医科大学",
    city: "Nanjing",
    province: "Jiangsu",
    region: "East",
    tier: "Medical",
    ranking: "Top Medical University · WHO Listed",
    established: 1934,
    students: "22,000+",
    internationalStudents: "3,000+",
    campusArea: "170 hectares",
    tagline: "East China's premier medical university — MBBS with Jiangsu scholarship support.",
    description:
      "Nanjing Medical University is one of East China's leading medical universities, located in Nanjing — one of China's historic and culturally rich cities. NMU's English-taught MBBS is WHO and FAIMER listed and offers an excellent balance between academic quality and cost. The Jiangsu Province Government Scholarship makes NMU particularly attractive for international students. Nanjing's location near Shanghai gives students access to one of China's most economically dynamic regions.",
    programs: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    tuitionRMB: "¥24,000 – ¥32,000 / year",
    livingCostRMB: "¥1,500 – ¥2,500 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "NMU International Student Scholarship",
      "Jiangsu Province Government Scholarship",
    ],
    highlights: [
      "WHO & FAIMER listed — strong licensing exam outcomes",
      "Jiangsu Province Scholarship available",
      "Nanjing — historic city, 1 hour from Shanghai by high-speed rail",
      "3,000+ international students",
      "Top-ranked affiliated hospitals for clinical training",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "July 15, 2026",
    requirements: [
      "60%+ in Biology, Chemistry, Physics",
      "High school diploma",
      "Age 17–25",
      "IELTS 5.5+",
      "Medical fitness certificate",
    ],
    faqs: [
      {
        q: "Is the Jiangsu scholarship easy to get?",
        a: "The Jiangsu Province Government Scholarship is available to international students who do not hold other scholarships. It typically covers tuition and accommodation. Globlearn Education guides you through the application.",
      },
    ],
  },

  "beijing-language-culture-university": {
    slug: "beijing-language-culture-university",
    name: "Beijing Language and Culture University",
    chineseName: "北京语言大学",
    city: "Beijing",
    province: "Beijing",
    region: "North",
    tier: "Language",
    ranking: "China's Premier Language University",
    established: 1962,
    students: "14,000+",
    internationalStudents: "8,000+",
    campusArea: "60 hectares",
    tagline: "The world's top university for learning Mandarin Chinese — in the heart of Beijing.",
    description:
      "Beijing Language and Culture University (BLCU) is internationally recognised as the best university in the world for learning Mandarin Chinese. With 8,000+ international students making up nearly 60% of its enrollment, BLCU's campus is uniquely global in character. All study tracks — from beginner HSK 1 to advanced HSK 6 — are available in structured semester programs. BLCU is also the creator and administrator of the official HSK exam. Located in the Haidian university district of Beijing (near Tsinghua and PKU), it offers an unbeatable immersion environment.",
    programs: [
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
    ],
    tuitionRMB: "¥12,000 – ¥18,000 / year",
    livingCostRMB: "¥2,000 – ¥3,500 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship) — Language Track",
      "Confucius Institute Scholarship",
      "BLCU International Scholarship",
    ],
    highlights: [
      "World's top university for learning Mandarin",
      "8,000+ international students — 60% of total enrollment",
      "Official creator and administrator of the HSK exam",
      "Beginner to advanced tracks — HSK 1 through HSK 6",
      "Located in Beijing's university district next to Tsinghua & PKU",
    ],
    intakeMonths: "September 2026 / March 2027",
    applicationDeadline: "June 30, 2026",
    requirements: [
      "High school diploma",
      "No prior Chinese required (beginner tracks available)",
      "Age 18+",
      "Statement of purpose",
      "Passport valid 2+ years",
    ],
    faqs: [
      {
        q: "Can complete beginners study Chinese at BLCU?",
        a: "Absolutely. BLCU accepts students from absolute beginner (HSK 1) all the way to advanced (HSK 6+). There are no prior Chinese language requirements for entry-level programs.",
      },
      {
        q: "Can a language year at BLCU lead to a degree?",
        a: "Yes. Students who complete the language program and reach HSK 4–5 can apply to Chinese-taught Bachelor's or Master's programs at BLCU or other universities.",
      },
    ],
  },

  "northeast-normal-university": {
    slug: "northeast-normal-university",
    name: "Northeast Normal University",
    chineseName: "东北师范大学",
    city: "Changchun",
    province: "Jilin",
    region: "Northeast",
    tier: "211",
    ranking: "211 University · Top CSC Scholarship Host",
    established: 1946,
    students: "29,000+",
    internationalStudents: "2,800+",
    campusArea: "200 hectares",
    tagline: "One of China's top CSC scholarship hosts — affordable 211 university.",
    description:
      "Northeast Normal University (NENU) is a 211 Project university and one of China's most active CSC scholarship hosts, particularly strong in education, humanities, and sciences. NENU is known for its welcoming international office and high success rate in connecting students with CSC scholarships. Located in Changchun alongside Jilin University, NENU offers significantly lower tuition than 985 universities while maintaining excellent academic standards. Its teacher training, natural sciences, and Chinese language programs are nationally recognized.",
    programs: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    tuitionRMB: "¥12,000 – ¥20,000 / year",
    livingCostRMB: "¥1,200 – ¥2,000 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship) — high approval rate",
      "NENU International Student Scholarship",
      "Jilin Province Government Scholarship",
    ],
    highlights: [
      "211 University with one of China's highest CSC approval rates",
      "Very affordable tuition and living costs",
      "Strong teacher training and education programs",
      "Welcoming international student office",
      "Located in Changchun — affordable Northeast China city",
    ],
    intakeMonths: "September 2026 / March 2027",
    applicationDeadline: "July 31, 2026",
    requirements: [
      "High school diploma or Bachelor's degree",
      "IELTS 5.0+ or equivalent",
      "Statement of purpose",
      "Academic transcripts",
    ],
    faqs: [
      {
        q: "Why is NENU popular for CSC scholarship applicants?",
        a: "NENU has a strong track record as a CSC scholarship host university and its international office provides excellent support during the application process. Globlearn Education has guided many students to successful CSC awards at NENU.",
      },
    ],
  },

  "university-international-business-economics": {
    slug: "university-international-business-economics",
    name: "Univ. of International Business & Economics",
    chineseName: "对外经济贸易大学",
    city: "Beijing",
    province: "Beijing",
    region: "North",
    tier: "211",
    ranking: "211 University · Top Business School",
    established: 1951,
    students: "22,000+",
    internationalStudents: "5,000+",
    campusArea: "50 hectares",
    tagline: "China's top-ranked university for international trade, finance, and MBA.",
    description:
      "The University of International Business and Economics (UIBE) is China's premier institution for international economics, trade, law, and business. Located in Beijing near the Diplomatic Quarter, UIBE has the highest concentration of international business-focused faculty of any university in China. Its MBA and Master's in International Business programs are respected by employers across Asia, Africa, and the Middle East. UIBE's small size and international focus create a close-knit community where students build global networks rapidly.",
    programs: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBA & Business", slug: "mba-business" },
    ],
    tuitionRMB: "¥20,000 – ¥45,000 / year",
    livingCostRMB: "¥2,500 – ¥4,000 / month",
    scholarships: [
      "CSC (Chinese Government Scholarship)",
      "UIBE International Excellence Scholarship",
      "Beijing Government Scholarship",
    ],
    highlights: [
      "China's #1 university for international trade and economics",
      "211 University — top business school ranking",
      "MBA with strong China-Africa and China-ME trade focus",
      "Located near Beijing's Diplomatic Quarter",
      "50%+ international student body in business programs",
    ],
    intakeMonths: "September 2026",
    applicationDeadline: "May 31, 2026",
    requirements: [
      "Bachelor's degree for Master's/MBA applicants",
      "2+ years work experience for MBA",
      "GMAT 550+ or GRE equivalent (MBA)",
      "IELTS 6.5+ or TOEFL 90+",
      "Statement of purpose + two references",
    ],
    faqs: [
      {
        q: "Is UIBE MBA good for doing business in China or Africa?",
        a: "UIBE's MBA is specifically designed around China's role in global trade. The curriculum heavily covers China-Africa trade, Belt and Road, and emerging market investment — highly relevant for entrepreneurs targeting these markets.",
      },
    ],
  },
};

export const universitiesList = Object.values(universitiesData);

export const universityTiers = ["All", "985", "211", "Medical", "Language", "Business"];

export const universityRegions = [
  "All",
  "North",
  "East",
  "South",
  "Central",
  "West",
  "Northeast",
];

export const tierColors: Record<string, string> = {
  "985": "#1B3A6B",
  "211": "#29ABE2",
  Medical: "#C8102E",
  Language: "#92610A",
  Business: "#166534",
  Regular: "#6B7280",
};

export const tierBg: Record<string, string> = {
  "985": "#EEF4FF",
  "211": "#E0F2FE",
  Medical: "#FFF0F2",
  Language: "#FFFBEB",
  Business: "#F0FDF4",
  Regular: "#F3F4F6",
};
