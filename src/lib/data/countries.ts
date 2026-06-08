export interface CountryProgram {
  name: string;
  slug: string;
}

export interface CountryData {
  slug: string;
  name: string;
  flag: string;
  continent: string;
  region: string;
  embassyCity: string;
  studentsInChina: string;
  tagline: string;
  description: string;
  topPrograms: CountryProgram[];
  popularCities: string[];
  highlights: string[];
  visaNotes: string[];
  faqs: { q: string; a: string }[];
}

export const countriesData: Record<string, CountryData> = {
  nigeria: {
    slug: "nigeria",
    name: "Nigeria",
    flag: "🇳🇬",
    continent: "Africa",
    region: "West Africa",
    embassyCity: "Abuja",
    studentsInChina: "12,000+",
    tagline: "Nigeria's largest student population abroad — and China is the top destination.",
    description:
      "Nigeria sends more students to China than any other African country. With over 12,000 Nigerians enrolled at Chinese universities, a strong community already exists across Beijing, Shanghai, Wuhan, Chengdu, and Guangzhou. Nigerian students are drawn to MBBS programs (which offer a path to MDCN registration), engineering, and information technology. The CSC scholarship is competitive but achievable — several hundred Nigerian students receive it each year.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Wuhan", "Beijing", "Guangzhou", "Chengdu"],
    highlights: [
      "Largest African student community in China — strong support network",
      "MBBS recognised for MDCN (Medical and Dental Council of Nigeria) registration process",
      "Direct flights from Lagos (LOS) and Abuja (ABV) to multiple Chinese cities",
      "CSC scholarship accepts Nigerian applicants through the Embassy channel",
      "Growing China-Nigeria trade creates career opportunities for graduates",
    ],
    visaNotes: [
      "Apply for X1 visa at the Chinese Embassy in Abuja or Consulate in Lagos",
      "Medical examination must be done at an approved hospital in Nigeria before visa application",
      "Processing time typically 5–7 business days; express processing available",
    ],
    faqs: [
      {
        q: "Is a Chinese MBBS accepted for MDCN registration in Nigeria?",
        a: "Yes, with conditions. The MDCN accepts degrees from WHO-listed universities. Graduates must pass the MDCN assessment examination. Globlearn Education advises specifically on which Chinese universities have the strongest MDCN outcomes for Nigerian graduates.",
      },
      {
        q: "How large is the Nigerian student community in China?",
        a: "With over 12,000 Nigerian students, you will find a strong, established community in most major university cities. Nigerian student associations are active in Wuhan, Beijing, Guangzhou, and Chengdu.",
      },
    ],
  },

  kenya: {
    slug: "kenya",
    name: "Kenya",
    flag: "🇰🇪",
    continent: "Africa",
    region: "East Africa",
    embassyCity: "Nairobi",
    studentsInChina: "5,000+",
    tagline: "Kenya's growing student presence in China — business, tech, and medicine leading the way.",
    description:
      "Kenya has a rapidly growing student presence in China, driven by the strong China-Kenya relationship under the Belt and Road Initiative. Kenyan students in China predominantly study business administration, information technology, engineering, and medicine. Nairobi's direct connection to Chinese infrastructure investment creates practical career advantages for graduates with Chinese university credentials. The CSC scholarship is available through the Kenyan Embassy channel and through university direct applications.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Guangzhou"],
    highlights: [
      "Strong Belt and Road Initiative connection — Chinese firms hiring Kenyan Chinese-trained graduates",
      "Kenyan Government and Chinese Embassy scholarship channels available",
      "Rapidly growing Kenyan student community in Beijing and Wuhan",
      "East African hub advantage — graduates work across Kenya, Uganda, Tanzania",
      "Direct Kenya Airways flights to Guangzhou (frequent China-Kenya route)",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Nairobi",
      "Medical examination required — use approved facilities in Nairobi",
      "Standard processing 4–5 business days",
    ],
    faqs: [
      {
        q: "Are there Chinese government scholarships specifically for Kenyan students?",
        a: "Yes. Kenya has a bilateral scholarship agreement with China. Kenyan students can apply through both the Embassy channel (allocated by the Kenyan government) and the university-direct CSC channel.",
      },
      {
        q: "Is a Chinese degree recognised by employers in Kenya?",
        a: "Yes. Kenyan employers increasingly value Chinese university graduates, particularly in tech, engineering, and business. Kenya Revenue Authority, Safaricom, and firms linked to China's SGR and infrastructure projects actively recruit graduates.",
      },
    ],
  },

  ghana: {
    slug: "ghana",
    name: "Ghana",
    flag: "🇬🇭",
    continent: "Africa",
    region: "West Africa",
    embassyCity: "Accra",
    studentsInChina: "3,500+",
    tagline: "Ghana's bright students are choosing China — medicine, engineering, and business first.",
    description:
      "Ghana has a well-established presence at Chinese universities, with over 3,500 students enrolled across programs. Ghanaian students are noted for their strong academic preparation and high scholarship success rates. MBBS programs are especially popular — Chinese medical degrees are accepted for the Ghana Medical and Dental Council licensing process. Engineering and computer science graduates benefit from Ghana's growing tech sector and the 'Ghana Beyond Aid' agenda's emphasis on technical skills.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Wuhan", "Chengdu", "Guangzhou"],
    highlights: [
      "High CSC scholarship success rate among Ghanaian applicants",
      "Chinese MBBS accepted for Ghana Medical and Dental Council licensing",
      "Strong academic reputation — Ghanaian students well-regarded at Chinese universities",
      "Growing Accra-Beijing diplomatic and trade relationship",
      "Ghanaian student associations active at most major Chinese universities",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Accra",
      "Medical examination at approved facilities in Accra or Kumasi",
      "Standard processing 5 business days",
    ],
    faqs: [
      {
        q: "Will a Chinese MBBS allow me to practice medicine in Ghana?",
        a: "Yes. Chinese MBBS graduates from WHO-listed universities can apply to the Ghana Medical and Dental Council (GMDC) for registration. You will need to pass the GMDC licensing exam. Globlearn Education advises on which universities have the strongest outcomes for Ghanaian MBBS graduates.",
      },
    ],
  },

  ethiopia: {
    slug: "ethiopia",
    name: "Ethiopia",
    flag: "🇪🇹",
    continent: "Africa",
    region: "East Africa",
    embassyCity: "Addis Ababa",
    studentsInChina: "3,000+",
    tagline: "Ethiopia's fastest-growing student export market — engineering and infrastructure leading.",
    description:
      "Ethiopia is one of China's most strategically important partners in Africa, with billions of dollars of Chinese investment in infrastructure including the Addis-Djibouti railway and the African Union headquarters. This unique relationship makes Chinese university degrees particularly valuable for Ethiopian graduates — many go on to work directly on Chinese-Ethiopian infrastructure projects. Engineering, civil construction, and computer science are the most popular programs. The CSC scholarship is strongly supported through bilateral agreements.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Wuhan", "Xi'an", "Chengdu"],
    highlights: [
      "Strong bilateral China-Ethiopia relationship with dedicated scholarship quotas",
      "Engineering graduates directly employable on Chinese-funded Ethiopian infrastructure",
      "One of Africa's fastest-growing economies — degree outcomes are strong",
      "Ethiopian students highly successful in CSC scholarship applications",
      "Addis Ababa to multiple Chinese cities via Ethiopian Airlines (direct)",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Addis Ababa",
      "Ethiopia has a streamlined visa process for student applicants",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Are there special scholarships for Ethiopian students?",
        a: "Yes. China and Ethiopia have a bilateral scholarship agreement. Ethiopian students can apply through the Ministry of Education channel, the Embassy channel, and directly through universities. The CSC quota for Ethiopia is significant.",
      },
    ],
  },

  tanzania: {
    slug: "tanzania",
    name: "Tanzania",
    flag: "🇹🇿",
    continent: "Africa",
    region: "East Africa",
    embassyCity: "Dar es Salaam",
    studentsInChina: "2,000+",
    tagline: "Tanzania's next generation choosing China for world-class education at African-friendly costs.",
    description:
      "Tanzania's student presence in China has grown significantly as Tanzania-China trade and investment has deepened. Medicine, engineering, and business are the dominant fields. Tanzanian students benefit from the East African community's mutual recognition frameworks for professional qualifications, meaning Chinese degrees have broad utility across Kenya, Uganda, and Rwanda as well. Dar es Salaam's direct air connections to several Chinese cities make travel convenient.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Wuhan", "Chengdu", "Guangzhou"],
    highlights: [
      "Growing Tanzania-China economic ties increasing graduate employment demand",
      "East African Community frameworks — degree useful across Tanzania, Kenya, Uganda",
      "CSC scholarship available through Embassy and university channels",
      "Affordable Chinese cities match Tanzanian student budgets well",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Dar es Salaam",
      "Medical examination required before visa application",
      "Standard processing 5 business days",
    ],
    faqs: [
      {
        q: "Is the cost of living in China manageable for Tanzanian students?",
        a: "Yes. Cities like Wuhan, Changchun, and Chengdu have living costs of ¥1,000–¥1,800/month, which many Tanzanian families find comparable to or lower than studying in Nairobi or Cape Town.",
      },
    ],
  },

  uganda: {
    slug: "uganda",
    name: "Uganda",
    flag: "🇺🇬",
    continent: "Africa",
    region: "East Africa",
    embassyCity: "Kampala",
    studentsInChina: "2,500+",
    tagline: "Uganda's rising scholars are choosing China — medicine and business opening new doors.",
    description:
      "Uganda has a growing and enthusiastic student community in China, with particular strength in medicine, business administration, and agriculture. The Ugandan government actively supports study in China through its Ministry of Education scholarship channels. Ugandan MBBS graduates from Chinese universities can sit the Medical Council of Uganda licensing examination. The China-Uganda relationship has strengthened significantly with infrastructure investment, creating strong graduate career prospects.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "Ugandan Ministry of Education supports China scholarship applications",
      "MBBS graduates eligible for Medical Council of Uganda licensing",
      "Growing Ugandan student community in Wuhan and Beijing",
      "China-Uganda infrastructure investment creating graduate demand",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Kampala",
      "Medical examination at approved Kampala facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can a Ugandan MBBS graduate from China practice in Uganda?",
        a: "Yes. Graduates from WHO-listed Chinese medical universities can apply to the Medical Council of Uganda. You must pass the MCU licensing examination. Globlearn Education will advise on the best universities for Ugandan MBBS students.",
      },
    ],
  },

  zimbabwe: {
    slug: "zimbabwe",
    name: "Zimbabwe",
    flag: "🇿🇼",
    continent: "Africa",
    region: "Southern Africa",
    embassyCity: "Harare",
    studentsInChina: "1,800+",
    tagline: "Zimbabwe's academically strong students are finding China's universities a perfect fit.",
    description:
      "Zimbabwean students are recognised at Chinese universities for their strong academic preparation and English proficiency, which comes from Zimbabwe's British-modelled education system. This makes Zimbabwean students well-positioned for English-medium programs at 985 universities. Medicine, engineering, mining, and agriculture are popular fields, aligning with Zimbabwe's own economic priorities. The CSC scholarship is competitive and Zimbabwean students have consistently strong success rates.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Wuhan", "Chengdu", "Xi'an"],
    highlights: [
      "Strong English-medium academic background — well-prepared for 985 university programs",
      "High CSC scholarship success rate relative to enrollment size",
      "Zimbabwe-China mining and agriculture sector creating graduate demand",
      "SADC recognition frameworks support professional qualification portability",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Harare",
      "Standard processing 5–7 business days",
      "Medical examination required at approved Harare facilities",
    ],
    faqs: [
      {
        q: "Are Zimbabwean 'A-Level' qualifications accepted for Chinese university admission?",
        a: "Yes. Zimbabwean Cambridge A-Level qualifications are accepted at all Chinese universities for undergraduate admission. Strong A-Level grades (B or above in relevant subjects) significantly strengthen scholarship applications.",
      },
    ],
  },

  cameroon: {
    slug: "cameroon",
    name: "Cameroon",
    flag: "🇨🇲",
    continent: "Africa",
    region: "Central Africa",
    embassyCity: "Yaoundé",
    studentsInChina: "2,200+",
    tagline: "Cameroon's bilingual students are uniquely positioned for China's international programs.",
    description:
      "Cameroon's unique bilingual (French and English) education system gives Cameroonian students a significant advantage — they qualify for both English-medium and French-speaking international programs. Over 2,200 Cameroonian students study in China, predominantly in MBBS, engineering, and economics programs. Yaoundé and Beijing have a strong diplomatic relationship, and the CSC scholarship quota for Cameroonian students is generous. The growing community in Wuhan, Guangzhou, and Chengdu provides excellent peer support.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Wuhan", "Guangzhou", "Chengdu", "Beijing"],
    highlights: [
      "Bilingual advantage — eligible for English-medium programs at 985 universities",
      "Strong CSC scholarship quota through bilateral Cameroon-China agreement",
      "Large and supportive Cameroonian student community in Wuhan",
      "CEMAC regional recognition — degree useful across Central African states",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Yaoundé or Consulate in Douala",
      "Both Embassy and university-direct CSC channels available",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can Cameroonian students study in English at Chinese universities?",
        a: "Yes. All 985 and 211 universities have English-medium programs. Cameroonian students do not need French or Chinese to enrol in undergraduate or graduate programs in engineering, medicine, or business.",
      },
    ],
  },

  sudan: {
    slug: "sudan",
    name: "Sudan",
    flag: "🇸🇩",
    continent: "Africa",
    region: "Northeast Africa",
    embassyCity: "Khartoum",
    studentsInChina: "4,500+",
    tagline: "Sudan's long relationship with China — thousands of graduates now leading their fields.",
    description:
      "Sudan has one of the longest-standing student exchange relationships with China in Africa, with over 4,500 Sudanese students currently enrolled. Arabic-speaking students benefit from dedicated Arabic-Chinese language bridge programs at several universities, and many Chinese universities have Arabic-speaking support staff. Engineering, petroleum science, medicine, and Arabic-Chinese translation are among the most popular fields. The CSC scholarship is very accessible to Sudanese applicants.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Wuhan", "Xi'an", "Changsha"],
    highlights: [
      "One of Africa's longest bilateral scholarship relationships with China",
      "Arabic support staff and communities at major Chinese universities",
      "Petroleum and engineering programs align with Sudan's energy sector",
      "Very high CSC scholarship success rate for Sudanese applicants",
      "Large, established Sudanese student community providing peer support",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Khartoum",
      "Sudan has one of the most streamlined student visa processes",
      "Standard processing 5 business days",
    ],
    faqs: [
      {
        q: "Do I need to know Chinese to study in China as a Sudanese student?",
        a: "No. Most medical and engineering programs at universities with large Arabic-speaking student populations have English-medium options. Chinese language classes are available (and recommended) after arrival.",
      },
    ],
  },

  egypt: {
    slug: "egypt",
    name: "Egypt",
    flag: "🇪🇬",
    continent: "Africa",
    region: "North Africa",
    embassyCity: "Cairo",
    studentsInChina: "6,000+",
    tagline: "Egypt's scholars in China — one of Africa's largest and most established student communities.",
    description:
      "Egypt is one of the largest sources of international students for China, with over 6,000 Egyptian students enrolled. The Egyptian-Chinese relationship is deep and long-standing, reflected in generous CSC scholarship quotas and dedicated bilateral programs. Egyptian students are distributed across MBBS, engineering, economics, and Chinese language programs. Al-Azhar University's cooperation with Chinese institutions has also opened religious studies and Arabic-Chinese translation pathways. Cairo to Beijing and Guangzhou are well-served by direct flights.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Guangzhou", "Wuhan", "Shanghai"],
    highlights: [
      "One of the largest African student communities in China",
      "Strong bilateral scholarship agreement with generous quotas",
      "Cairo-Beijing and Cairo-Guangzhou direct flight connections",
      "Arabic-language support available at many Chinese universities",
      "Egypt-China trade and Suez Canal logistics creating graduate demand",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Cairo or Consulate in Alexandria",
      "Egypt has a dedicated CSC Embassy channel with annual allocations",
      "Standard processing 5–7 business days; express available",
    ],
    faqs: [
      {
        q: "How many Egyptian students are in China?",
        a: "Over 6,000 Egyptian students are currently enrolled at Chinese universities, making Egypt one of the top-5 source countries in Africa. The Egyptian community is well-established in Beijing, Guangzhou, and Wuhan.",
      },
    ],
  },

  india: {
    slug: "india",
    name: "India",
    flag: "🇮🇳",
    continent: "Asia",
    region: "South Asia",
    embassyCity: "New Delhi",
    studentsInChina: "23,000+",
    tagline: "India sends the most MBBS students to China — with good reason.",
    description:
      "India is the largest source of international MBBS students studying in China, with over 23,000 Indian students enrolled, the vast majority in medicine. Chinese MBBS programs offer Indian students WHO-listed degrees at a fraction of the cost of private medical colleges in India, with English-medium instruction and strong FMGE/NExT pass rates at the top institutions. The combination of affordable tuition, WHO listing, and English instruction makes China the top choice for Indian medical aspirants who cannot secure a government MBBS seat.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
    ],
    popularCities: ["Dalian", "Wuhan", "Chengdu", "Shenyang", "Changchun"],
    highlights: [
      "Largest international MBBS student community in China with 23,000+ enrolled",
      "Dalian, Shenyang, and Wuhan medical universities have top FMGE/NExT outcomes",
      "English-medium MBBS programs — no Mandarin required to enroll",
      "Cost: ¥14,000–¥28,000/year vs ₹15–25 lakh/year at Indian private colleges",
      "Indian student associations active at every major medical university",
    ],
    visaNotes: [
      "Apply at Chinese Embassy in New Delhi or Consulates in Mumbai, Kolkata, Chennai, or Guangzhou",
      "Medical examination at approved hospitals — list available from Chinese Embassy India",
      "Processing time typically 5–7 business days",
      "Note: As of 2024–2025, Indian students should verify current bilateral student travel arrangements",
    ],
    faqs: [
      {
        q: "Which Chinese universities are best for Indian MBBS students?",
        a: "Dalian Medical University, China Medical University (Shenyang), Jilin University, and Sichuan University consistently produce the highest FMGE/NExT pass rates for Indian graduates. Globlearn Education advises specifically on which universities match your budget and score.",
      },
      {
        q: "Is a Chinese MBBS recognised by the National Medical Commission (NMC) in India?",
        a: "Chinese MBBS graduates from WHO/FAIMER-listed universities can sit the NExT (National Exit Test), which replaced FMGE. The NMC has a list of approved foreign medical universities — all universities Globlearn Education places students at are on this list.",
      },
    ],
  },

  pakistan: {
    slug: "pakistan",
    name: "Pakistan",
    flag: "🇵🇰",
    continent: "Asia",
    region: "South Asia",
    embassyCity: "Islamabad",
    studentsInChina: "30,000+",
    tagline: "Pakistan sends more students to China than any other country — CPEC is just one reason.",
    description:
      "Pakistan has the largest number of students in China of any country in the world, with over 30,000 Pakistani students enrolled. This extraordinary figure reflects the depth of the China-Pakistan Economic Corridor (CPEC) relationship and generous scholarship programs. MBBS, engineering, computer science, and business are the dominant fields. The Pakistan-China Higher Education Commission maintains dedicated scholarship channels, and the CSC scholarship quota for Pakistan is among the largest allocated globally.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Wuhan", "Chengdu", "Xi'an", "Dalian"],
    highlights: [
      "Largest Pakistani diaspora in any single country — 30,000+ students",
      "CPEC relationship creates direct job opportunities for Chinese-trained engineers",
      "HEC Pakistan and CSC combined scholarship channels",
      "PMDC (Pakistan Medical and Dental Council) recognises Chinese WHO-listed universities",
      "Pakistani student associations established at every major Chinese university",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Islamabad or Consulates in Karachi and Lahore",
      "HEC Pakistan has a dedicated scholarship portal linked to CSC",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is a Chinese MBBS recognised by the PMDC?",
        a: "Yes. Pakistani graduates from WHO-listed Chinese universities can appear in the PMDC licensing examination. The PMDC maintains a list of recognised foreign medical institutions — Globlearn Education only places students at PMDC-compatible universities.",
      },
      {
        q: "Can I apply for the CSC scholarship from Pakistan through HEC?",
        a: "Yes. Pakistan has two CSC application channels: the HEC Pakistan channel (for students selected by the Higher Education Commission) and the university-direct channel. Globlearn Education advises on which channel gives you the best chance based on your profile.",
      },
    ],
  },

  bangladesh: {
    slug: "bangladesh",
    name: "Bangladesh",
    flag: "🇧🇩",
    continent: "Asia",
    region: "South Asia",
    embassyCity: "Dhaka",
    studentsInChina: "7,000+",
    tagline: "Bangladesh's future doctors and engineers are choosing China in growing numbers.",
    description:
      "Bangladesh is a rapidly growing source market for Chinese universities, with over 7,000 students enrolled and numbers increasing year on year. MBBS programs (driven by the difficulty of securing medical seats in Bangladesh) and engineering programs are the most popular. The Bangladesh Medical and Dental Council (BMDC) recognises Chinese WHO-listed universities. Chinese investment in Bangladesh's garment, textile, and infrastructure sectors creates strong post-graduation career links for engineering and business graduates.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Wuhan", "Chengdu", "Dalian", "Beijing"],
    highlights: [
      "BMDC recognises Chinese WHO-listed medical universities for licensing",
      "Rapidly growing student community — peer support well-established",
      "China-Bangladesh textile and infrastructure investment creating career links",
      "Affordable tuition well-suited to Bangladeshi student budgets",
      "CSC scholarship available through Embassy and university channels",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Dhaka",
      "Medical examination at approved Dhaka hospitals",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is a Chinese MBBS accepted for BMDC registration in Bangladesh?",
        a: "Yes. The Bangladesh Medical and Dental Council (BMDC) accepts degrees from WHO-listed foreign medical universities. Graduates must pass the BMDC licensing examination. Globlearn Education advises specifically on BMDC-compatible Chinese universities.",
      },
    ],
  },

  "saudi-arabia": {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Riyadh",
    studentsInChina: "4,000+",
    tagline: "Saudi Arabia's Vision 2030 generation — choosing China for technology and business.",
    description:
      "Saudi Arabia's Vision 2030 agenda has dramatically increased the country's international education partnerships, with China emerging as a key destination. Saudi students in China predominantly study engineering, computer science, artificial intelligence, and business — all priority fields under Vision 2030. The Saudi Cultural Mission actively supports students studying in China, and Chinese universities have dedicated Saudi student programs. Saudi Arabia's 30+ million population and oil-funded education budgets make it a significant and growing market.",
    topPrograms: [
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Shanghai", "Shenzhen", "Hangzhou"],
    highlights: [
      "Vision 2030 alignment — AI, engineering, and business programs highly relevant",
      "Saudi Cultural Mission supports students in China",
      "Direct Saudi Airlines and Saudia flights Riyadh–Beijing and Riyadh–Shanghai",
      "Halal food widely available on Chinese university campuses",
      "Growing China-Saudi Aramco and tech partnership creating graduate demand",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Riyadh or Consulate in Jeddah",
      "Saudi students generally experience straightforward visa processing",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is halal food available at Chinese universities?",
        a: "Yes. All major Chinese universities have dedicated halal food sections in their canteens. Cities like Beijing, Xi'an, Lanzhou, and Urumqi have large Muslim populations and extensive halal restaurant options near campuses.",
      },
      {
        q: "Does the Saudi Cultural Mission (SACM) fund study in China?",
        a: "The SACM supports Saudi students studying abroad and has information about approved Chinese institutions. Students may also apply for Chinese CSC scholarships directly. Globlearn Education advises on the best path for Saudi applicants.",
      },
    ],
  },

  uae: {
    slug: "uae",
    name: "UAE",
    flag: "🇦🇪",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Abu Dhabi",
    studentsInChina: "2,500+",
    tagline: "The UAE hub meets China's innovation economy — business and tech students thriving.",
    description:
      "The UAE sends a growing number of students to China each year, drawn primarily by business, technology, and MBA programs at China's top universities. The UAE's position as a global trade and logistics hub — with Jebel Ali Port being China's largest port partner outside Asia — creates unique career synergies for graduates with Chinese university credentials and language skills. Emirati, Egyptian, Indian, Pakistani, and other Arab students based in the UAE all access Chinese universities through UAE-based channels.",
    topPrograms: [
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
    ],
    popularCities: ["Shanghai", "Beijing", "Hangzhou", "Shenzhen"],
    highlights: [
      "UAE-China bilateral trade — graduates highly employable in logistics and trade sectors",
      "Emirates direct flights Dubai–Beijing, Dubai–Shanghai (daily)",
      "Large international student community in Shanghai aligns with UAE students' cosmopolitan expectations",
      "Halal food available on Chinese university campuses",
      "Mandarin skills from China study open doors in UAE-China trade",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Abu Dhabi or Consulate-General in Dubai",
      "Standard processing 5–7 business days; express available in Dubai",
      "UAE residents of all nationalities can apply through the UAE Chinese Embassy",
    ],
    faqs: [
      {
        q: "Can I apply from Dubai as a non-UAE-national resident?",
        a: "Yes. Residents of the UAE (regardless of nationality) can apply for their Chinese student visa at the Chinese Embassy in Abu Dhabi or Consulate in Dubai. You apply based on your residency, not your nationality.",
      },
      {
        q: "Is Shanghai better than Beijing for UAE business students?",
        a: "For business and MBA students, Shanghai is generally preferred — it is China's financial capital with the most international business environment. Fudan's business school and CEIBS are both in Shanghai.",
      },
    ],
  },

  // ── Africa Batch ──────────────────────────────────────────────

  "south-africa": {
    slug: "south-africa",
    name: "South Africa",
    flag: "🇿🇦",
    continent: "Africa",
    region: "Southern Africa",
    embassyCity: "Pretoria",
    studentsInChina: "4,000+",
    tagline: "South Africa's scholars in China — MBA, medicine, and engineering leading the way.",
    description:
      "South Africa sends over 4,000 students to Chinese universities, drawn by world-ranked 985 programs, affordable tuition compared to South African private institutions, and the growing China-South Africa trade relationship under BRICS. MBBS, MBA, mining engineering, and artificial intelligence are the most popular fields. The CSC scholarship is available through the Embassy channel in Pretoria, and several South African provincial governments have bilateral education agreements with Chinese provinces.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Guangzhou"],
    highlights: [
      "BRICS partnership — China and South Africa have deep bilateral education agreements",
      "CSC scholarship available through Embassy channel in Pretoria",
      "Mining engineering graduates highly employable in SA-China mineral sector",
      "Direct SAA and China Southern flights Johannesburg–Guangzhou",
      "South African degrees and Chinese degrees mutually recognised under bilateral frameworks",
    ],
    visaNotes: [
      "Apply for X1 student visa at the Chinese Embassy in Pretoria",
      "Medical examination at approved Pretoria or Johannesburg facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can South African MBBS graduates from China practice in South Africa?",
        a: "Chinese MBBS graduates from WHO-listed universities can apply to the Health Professions Council of South Africa (HPCSA). You must pass the required board exams. Globlearn Education advises on the best universities for South African MBBS applicants.",
      },
    ],
  },

  morocco: {
    slug: "morocco",
    name: "Morocco",
    flag: "🇲🇦",
    continent: "Africa",
    region: "North Africa",
    embassyCity: "Rabat",
    studentsInChina: "4,500+",
    tagline: "Morocco's rising scholars are choosing China — engineering, business, and medicine in demand.",
    description:
      "Morocco has one of the largest student communities in China among North African countries, with over 4,500 students enrolled. The Morocco-China relationship has strengthened significantly under the Belt and Road Initiative, with Chinese investment in Morocco's automotive, aerospace, and infrastructure sectors creating strong career pathways for graduates. Engineering, business administration, and MBBS are the most popular programs. The CSC scholarship is available through the Moroccan Ministry of Education and Embassy channels in Rabat.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Guangzhou"],
    highlights: [
      "Belt and Road Initiative — Chinese investment in Morocco creating graduate demand",
      "Moroccan Ministry of Education runs dedicated CSC scholarship selection",
      "Arabic and French speakers have language advantages at Chinese universities",
      "Morocco's automotive and aerospace sectors employ Chinese-trained engineers",
      "Direct Royal Air Maroc flights Casablanca–Beijing and Casablanca–Shanghai",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Rabat",
      "Medical examination at approved facilities in Rabat or Casablanca",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is French useful for studying in China as a Moroccan student?",
        a: "French is not widely used in Chinese universities, but your bilingual (Arabic-French) education makes you a strong candidate for programs taught in English. Most 985 and 211 universities offer engineering, medicine, and business programs in English.",
      },
    ],
  },

  tunisia: {
    slug: "tunisia",
    name: "Tunisia",
    flag: "🇹🇳",
    continent: "Africa",
    region: "North Africa",
    embassyCity: "Tunis",
    studentsInChina: "1,500+",
    tagline: "Tunisia's tech-savvy graduates are choosing China's top engineering and IT programs.",
    description:
      "Tunisia has a well-educated student population and a growing presence at Chinese universities, with over 1,500 students enrolled. Tunisian students are strong performers in mathematics and sciences, making them competitive for CSC scholarships in engineering, computer science, and information technology. The Tunisia-China relationship has grown steadily with trade and investment links. Tunis-based students can access the Chinese Embassy for visa processing and scholarship applications.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Wuhan", "Shanghai", "Xi'an"],
    highlights: [
      "Strong maths and science education system — competitive for CSC engineering scholarships",
      "Growing Tunisia-China trade and technology partnership",
      "CSC scholarship accessible through Embassy channel in Tunis",
      "Affordable Chinese tuition compared to European alternatives",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Tunis",
      "Medical examination at approved Tunis facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Are Tunisian engineering qualifications recognised after studying in China?",
        a: "Yes. Chinese engineering degrees from 985 and 211 universities are internationally recognised. Tunisian graduates can have their Chinese degree validated by the Tunisian Ministry of Higher Education. Globlearn Education guides students through the degree equivalency process.",
      },
    ],
  },

  algeria: {
    slug: "algeria",
    name: "Algeria",
    flag: "🇩🇿",
    continent: "Africa",
    region: "North Africa",
    embassyCity: "Algiers",
    studentsInChina: "2,000+",
    tagline: "Algeria's students in China — engineering, petroleum science, and medicine opening doors.",
    description:
      "Algeria sends over 2,000 students to Chinese universities, with engineering, petroleum science, medicine, and economics being the dominant programs. Algeria's energy sector — the largest in Africa — creates strong career synergies for Chinese-trained petroleum and chemical engineers. The Algerian government actively supports study in China through the Ministry of Higher Education scholarship channel. Arabic-speaking students benefit from dedicated Arabic-Chinese support programs at many Chinese universities.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Guangzhou"],
    highlights: [
      "Algeria's energy sector creates strong demand for petroleum-trained graduates",
      "Algerian Ministry of Higher Education runs dedicated China scholarship channel",
      "Arabic language support available at major Chinese universities",
      "Growing Algeria-China infrastructure and trade investment",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Algiers",
      "Medical examination at approved Algiers facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can Algerian students apply for CSC scholarships?",
        a: "Yes. Algeria has a dedicated bilateral scholarship channel with China, managed through the Ministry of Higher Education. Algerian students can also apply through the university-direct CSC channel. Globlearn Education advises on the best channel for your academic profile.",
      },
    ],
  },

  mozambique: {
    slug: "mozambique",
    name: "Mozambique",
    flag: "🇲🇿",
    continent: "Africa",
    region: "Southern Africa",
    embassyCity: "Maputo",
    studentsInChina: "800+",
    tagline: "Mozambique's next generation doctors and engineers are training in China.",
    description:
      "Mozambique has a growing student community in China, with over 800 students enrolled in programs spanning medicine, engineering, agriculture, and Chinese language. China is Mozambique's largest trade partner and a major investor in infrastructure, energy, and mining — creating direct career pathways for Chinese-trained graduates. The CSC scholarship is available through the Embassy channel in Maputo, and Portuguese-speaking students can access dedicated language support programs.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "China is Mozambique's largest trade partner — graduates in demand",
      "CSC scholarship accessible via Embassy in Maputo",
      "Portuguese-speaking students: language bridge programs available",
      "Chinese investment in Mozambique's energy and mining sector creating jobs",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Maputo",
      "Medical examination at approved Maputo facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Do I need to speak Chinese or English to study in China from Mozambique?",
        a: "English proficiency (IELTS or equivalent) is required for English-medium programs. Chinese language programs are available for students who prefer to study in Mandarin after a one-year language preparatory course. Globlearn Education matches you to the right program based on your language background.",
      },
    ],
  },

  zambia: {
    slug: "zambia",
    name: "Zambia",
    flag: "🇿🇲",
    continent: "Africa",
    region: "Southern Africa",
    embassyCity: "Lusaka",
    studentsInChina: "1,200+",
    tagline: "Zambia's copper economy meets China's universities — mining, medicine, and business thriving.",
    description:
      "Zambia has over 1,200 students at Chinese universities, with particularly strong representation in mining engineering, medicine, and business. China is Zambia's largest investor — particularly in the copper mining sector — and Chinese-trained engineers are directly employable on Chinese-funded Zambian infrastructure projects. The CSC scholarship is accessible through the Embassy in Lusaka, and Zambia has a bilateral scholarship agreement with China.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Wuhan", "Chengdu", "Guangzhou"],
    highlights: [
      "China-Zambia copper mining investment — engineers highly employable",
      "CSC scholarship via bilateral agreement through Embassy in Lusaka",
      "Zambia's English-medium education system prepares students for Chinese 985 programs",
      "Growing Zambia-China trade creating business graduate demand",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Lusaka",
      "Medical examination at approved Lusaka facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Are there Chinese scholarships specifically for Zambian students?",
        a: "Yes. Zambia has a bilateral scholarship agreement with China. The CSC quota for Zambian students is allocated through the Embassy in Lusaka. Globlearn Education helps you prepare a competitive application for both Embassy and university-direct channels.",
      },
    ],
  },

  malawi: {
    slug: "malawi",
    name: "Malawi",
    flag: "🇲🇼",
    continent: "Africa",
    region: "Southern Africa",
    embassyCity: "Lilongwe",
    studentsInChina: "600+",
    tagline: "Malawi's bright students are turning to China for medicine, agriculture, and engineering.",
    description:
      "Malawi has a growing student community in China, with over 600 students enrolled in programs aligned with Malawi's development priorities — medicine, agriculture, engineering, and water resources management. China has invested significantly in Malawi's infrastructure, and Chinese-trained graduates find strong employment opportunities in China-funded projects. The CSC scholarship is accessible through the Embassy in Lilongwe, and Malawi's English-medium education system gives students a competitive edge.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "English-medium education system — well-prepared for Chinese university programs",
      "CSC scholarship accessible via Embassy in Lilongwe",
      "China investing in Malawi's infrastructure — graduates in demand",
      "Medicine and agriculture programs align with Malawi's national priorities",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Lilongwe",
      "Medical examination at approved Lilongwe facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What programs are most popular for Malawian students in China?",
        a: "MBBS (medicine), agricultural science, civil engineering, and computer science are the most popular. Malawian students also access Chinese language programs as a gateway to broader Chinese university enrollment. Globlearn Education advises based on your academic background and career goals.",
      },
    ],
  },

  rwanda: {
    slug: "rwanda",
    name: "Rwanda",
    flag: "🇷🇼",
    continent: "Africa",
    region: "East Africa",
    embassyCity: "Kigali",
    studentsInChina: "800+",
    tagline: "Rwanda's Vision 2050 generation — ICT, medicine, and engineering students choosing China.",
    description:
      "Rwanda's rapid economic development and Vision 2050 strategy have made international education a national priority, with China emerging as a key destination. Over 800 Rwandan students study in China, with a strong focus on ICT, engineering, medicine, and business — all priority sectors under Rwanda's development agenda. The Rwanda-China relationship is close, with Chinese investment in Rwanda's tech parks and infrastructure. The CSC scholarship is available through the Embassy in Kigali.",
    topPrograms: [
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Chengdu"],
    highlights: [
      "Rwanda Vision 2050 — ICT and engineering aligned with China's top programs",
      "CSC scholarship available through Embassy in Kigali",
      "English-medium education — smooth transition to Chinese 985 programs",
      "China investing in Rwanda's Kigali Special Economic Zone",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Kigali",
      "Medical examination at approved Kigali facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is a Chinese degree recognised in Rwanda?",
        a: "Yes. The Higher Education Council of Rwanda (HEC) recognises degrees from accredited Chinese universities. Engineering, medicine, and IT graduates from Chinese 985 universities are highly regarded by Rwandan employers and government agencies.",
      },
    ],
  },

  senegal: {
    slug: "senegal",
    name: "Senegal",
    flag: "🇸🇳",
    continent: "Africa",
    region: "West Africa",
    embassyCity: "Dakar",
    studentsInChina: "1,500+",
    tagline: "Senegal's ambitious students are choosing China for business, engineering, and medicine.",
    description:
      "Senegal has over 1,500 students studying in China, with business administration, engineering, Chinese language, and medicine being the most popular fields. The Senegal-China relationship has deepened significantly with the Belt and Road Initiative and Chinese investment in Senegal's infrastructure. French and Wolof-speaking students benefit from dedicated language support programs, and the Chinese Embassy in Dakar actively supports scholarship applications through bilateral channels.",
    topPrograms: [
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
    ],
    popularCities: ["Beijing", "Guangzhou", "Wuhan", "Shanghai"],
    highlights: [
      "Belt and Road investment in Senegal — Chinese-trained graduates in demand",
      "CSC scholarship via Embassy bilateral channel in Dakar",
      "Growing Senegalese student community in Guangzhou (West Africa trade hub)",
      "ECOWAS recognition frameworks extend degree utility across West Africa",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Dakar",
      "Medical examination at approved Dakar facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can Senegalese students who speak only French study in China?",
        a: "French-speaking students can access Chinese language preparatory programs (one year) before entering their main program. Most 985 universities also offer English-medium programs in engineering, business, and medicine that require only IELTS or equivalent English proficiency.",
      },
    ],
  },

  "ivory-coast": {
    slug: "ivory-coast",
    name: "Ivory Coast",
    flag: "🇨🇮",
    continent: "Africa",
    region: "West Africa",
    embassyCity: "Abidjan",
    studentsInChina: "1,000+",
    tagline: "Ivory Coast's cocoa economy meets China's universities — business and engineering thriving.",
    description:
      "Ivory Coast (Côte d'Ivoire) has over 1,000 students at Chinese universities, with strong representation in business, engineering, and medicine. As West Africa's largest economy and a major commodity exporter, Ivory Coast-China trade relations create career opportunities for Chinese-trained business and economics graduates. The Chinese Embassy in Abidjan supports CSC scholarship applications, and French-speaking students can access dedicated language programs.",
    topPrograms: [
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Guangzhou", "Shanghai", "Wuhan"],
    highlights: [
      "West Africa's largest economy — China trade ties create graduate employment",
      "CSC scholarship via Embassy in Abidjan",
      "ECOWAS community degree recognition extends across West Africa",
      "Ivory Coast-China cocoa and commodity trade creating business opportunities",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Abidjan",
      "Medical examination at approved Abidjan facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What scholarship options exist for Ivory Coast students in China?",
        a: "Ivory Coast students can apply through the CSC Embassy channel in Abidjan, the university-direct CSC channel, and some provincial scholarships. Globlearn Education applies to all eligible channels simultaneously to maximise your chances.",
      },
    ],
  },

  "dr-congo": {
    slug: "dr-congo",
    name: "DR Congo",
    flag: "🇨🇩",
    continent: "Africa",
    region: "Central Africa",
    embassyCity: "Kinshasa",
    studentsInChina: "1,500+",
    tagline: "DR Congo's students in China — medicine, mining, and engineering building Africa's future.",
    description:
      "The Democratic Republic of Congo sends over 1,500 students to Chinese universities, with medicine, mining engineering, and civil engineering being the dominant programs. China is DR Congo's largest trading partner and a major investor in its vast mineral resources — creating direct career opportunities for Chinese-trained engineers and geologists. The CSC scholarship is available through the Embassy in Kinshasa, and French-speaking students can access language bridge programs.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "China-DRC mineral investment — mining engineers highly employable",
      "CSC scholarship via Embassy in Kinshasa",
      "Africa's most mineral-rich country — Chinese-trained graduates in demand",
      "French-speaking students: language preparatory programs available",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Kinshasa",
      "Medical examination at approved Kinshasa facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is there demand for Chinese-trained engineers in DR Congo?",
        a: "Yes. With China's extensive mining and infrastructure investment in DRC, graduates in mining engineering, civil engineering, and geology are directly employable on Chinese-funded projects. Mandarin language skills are an additional advantage.",
      },
    ],
  },

  angola: {
    slug: "angola",
    name: "Angola",
    flag: "🇦🇴",
    continent: "Africa",
    region: "Southern Africa",
    embassyCity: "Luanda",
    studentsInChina: "800+",
    tagline: "Angola's oil economy and China's universities — engineering and business students thriving.",
    description:
      "Angola has over 800 students at Chinese universities, with petroleum engineering, civil engineering, and business administration being the most popular programs. China-Angola relations are among the strongest in Africa, with China being Angola's largest trading partner and a major oil customer. Chinese-trained engineers and business graduates are highly employable in Angola's energy sector and the many Chinese-funded infrastructure projects. The CSC scholarship is available through the Embassy in Luanda.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Wuhan"],
    highlights: [
      "China is Angola's largest trading partner — strong career synergies",
      "CSC scholarship via Embassy in Luanda",
      "Petroleum engineering aligned with Angola's oil export economy",
      "Portuguese speakers: language bridge programs at major Chinese universities",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Luanda",
      "Medical examination at approved Luanda facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What programs do Angolan students most commonly study in China?",
        a: "Petroleum engineering, civil engineering, business administration, and medicine are the most common choices among Angolan students in China. These align directly with Angola's economic development priorities and Chinese investment sectors.",
      },
    ],
  },

  madagascar: {
    slug: "madagascar",
    name: "Madagascar",
    flag: "🇲🇬",
    continent: "Africa",
    region: "East Africa",
    embassyCity: "Antananarivo",
    studentsInChina: "500+",
    tagline: "Madagascar's students choosing China for medicine, agriculture, and sustainable development.",
    description:
      "Madagascar has over 500 students at Chinese universities, with a focus on medicine, agriculture, marine science, and environmental engineering. China has invested significantly in Madagascar's infrastructure and natural resources, creating career pathways for Chinese-trained graduates. The CSC scholarship is accessible through the Embassy in Antananarivo, and French-speaking Malagasy students can access language preparatory programs before entering their main program.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "China investing in Madagascar's infrastructure — graduates in demand",
      "CSC scholarship via Embassy in Antananarivo",
      "Agriculture and marine science programs relevant to Madagascar's economy",
      "French-speaking students: preparatory language programs available",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Antananarivo",
      "Medical examination at approved Antananarivo facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is Chinese study accessible for Malagasy students who don't speak English?",
        a: "Yes. Chinese universities offer one-year Mandarin preparatory courses for students without English proficiency. After the language year, students can enrol in their main program. Globlearn Education helps you plan the right language pathway.",
      },
    ],
  },

  eritrea: {
    slug: "eritrea",
    name: "Eritrea",
    flag: "🇪🇷",
    continent: "Africa",
    region: "Northeast Africa",
    embassyCity: "Asmara",
    studentsInChina: "800+",
    tagline: "Eritrea's dedicated students in China — medicine and engineering opening national doors.",
    description:
      "Eritrea has a long-standing scholarship relationship with China, with over 800 students enrolled primarily in medicine, engineering, and natural resources. The Eritrean government actively supports study in China as part of its national human capital development strategy, with dedicated government scholarship channels to Chinese universities. Eritrean students are highly motivated and academically disciplined, with strong outcomes in medical and engineering programs at Chinese universities.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Wuhan", "Xi'an", "Chengdu"],
    highlights: [
      "Eritrean government actively sponsors students to study in China",
      "CSC scholarship via Embassy in Asmara",
      "Strong government-backed scholarship program for medicine and engineering",
      "Eritrean student community established in Beijing and Wuhan",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Asmara",
      "Medical examination at approved Asmara facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Does the Eritrean government support study in China?",
        a: "Yes. Eritrea has a bilateral education agreement with China. The government nominates candidates for CSC scholarships each year. Students can also apply independently through the university-direct CSC channel. Globlearn Education advises on both pathways.",
      },
    ],
  },

  "sierra-leone": {
    slug: "sierra-leone",
    name: "Sierra Leone",
    flag: "🇸🇱",
    continent: "Africa",
    region: "West Africa",
    embassyCity: "Freetown",
    studentsInChina: "600+",
    tagline: "Sierra Leone's ambitious students choosing China for medicine, engineering, and opportunity.",
    description:
      "Sierra Leone has over 600 students at Chinese universities, with medicine, engineering, and business administration being the primary fields. China's significant investment in Sierra Leone's mining and infrastructure sectors creates tangible career pathways for Chinese-trained graduates. The CSC scholarship is accessible through the Embassy in Freetown, and Sierra Leone's English-medium education system gives students a strong foundation for English-taught programs at Chinese universities.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "English-medium education — smooth entry to Chinese 985 English programs",
      "CSC scholarship via Embassy in Freetown",
      "China investing in Sierra Leone mining sector — engineers in demand",
      "Growing Sierra Leonean student community in Wuhan and Beijing",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Freetown",
      "Medical examination at approved Freetown facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What is the CSC scholarship success rate for Sierra Leonean students?",
        a: "Sierra Leonean students with strong academic records and relevant extracurricular profiles have competitive CSC success rates. Globlearn Education's guided application process significantly improves your chances by ensuring your application is complete and properly targeted.",
      },
    ],
  },

  "south-sudan": {
    slug: "south-sudan",
    name: "South Sudan",
    flag: "🇸🇸",
    continent: "Africa",
    region: "East Africa",
    embassyCity: "Juba",
    studentsInChina: "400+",
    tagline: "South Sudan's next generation building national capacity through Chinese university education.",
    description:
      "South Sudan has over 400 students at Chinese universities, with medicine, engineering, and Chinese language being the primary areas of study. China plays a major role in South Sudan's oil sector and infrastructure development, making Chinese-trained graduates directly relevant to the country's national development needs. The CSC scholarship is available through the Embassy in Juba, and South Sudan's English-medium education system facilitates entry to English-taught programs.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Chengdu", "Guangzhou"],
    highlights: [
      "China's oil sector investment in South Sudan — graduates in direct demand",
      "CSC scholarship via Embassy in Juba",
      "English-medium schooling — compatible with Chinese 985 English programs",
      "South Sudan government supports study-in-China as national capacity strategy",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Juba",
      "Medical examination at approved Juba facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Are there Chinese government scholarships for South Sudanese students?",
        a: "Yes. South Sudan has a CSC scholarship allocation through the Embassy in Juba. The government also nominates candidates for bilateral scholarships. Globlearn Education advises South Sudanese applicants on the full range of funding available.",
      },
    ],
  },

  burundi: {
    slug: "burundi",
    name: "Burundi",
    flag: "🇧🇮",
    continent: "Africa",
    region: "East Africa",
    embassyCity: "Bujumbura",
    studentsInChina: "400+",
    tagline: "Burundi's scholars choosing China — medicine and agriculture leading national development.",
    description:
      "Burundi has over 400 students at Chinese universities, with a focus on medicine, agriculture, and engineering. China has invested in Burundi's infrastructure and agricultural development, creating career pathways for Chinese-trained graduates. The CSC scholarship is accessible through the Embassy in Bujumbura, and students can access French-language preparatory programs before transitioning to English or Chinese-medium main programs.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "CSC scholarship via Embassy in Bujumbura",
      "Agriculture and medicine programs aligned with Burundi's development priorities",
      "China-Burundi infrastructure investment creating graduate employment",
      "French-speaking students can access language bridge programs",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Bujumbura",
      "Medical examination at approved facilities in Bujumbura",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What funding options are available for Burundian students in China?",
        a: "Burundian students can access the CSC Embassy channel, the university-direct CSC scholarship, and some provincial scholarships. Globlearn Education helps you identify and apply to all options simultaneously.",
      },
    ],
  },

  namibia: {
    slug: "namibia",
    name: "Namibia",
    flag: "🇳🇦",
    continent: "Africa",
    region: "Southern Africa",
    embassyCity: "Windhoek",
    studentsInChina: "500+",
    tagline: "Namibia's students in China — mining, medicine, and marine science aligned with national needs.",
    description:
      "Namibia has over 500 students at Chinese universities, with mining engineering, marine science, medicine, and business being the most relevant fields for Namibia's economy. China is a major investor in Namibia's uranium, diamonds, and fishing sectors, creating strong career pathways for Chinese-trained graduates. The CSC scholarship is available through the Embassy in Windhoek, and Namibia's English-medium education system gives students a competitive advantage for English-taught programs.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Shanghai"],
    highlights: [
      "China investing in Namibia's mining and fishing sectors — graduates in demand",
      "CSC scholarship via Embassy in Windhoek",
      "English-medium education — strong preparation for Chinese 985 programs",
      "SADC mutual recognition frameworks extend degree utility",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Windhoek",
      "Medical examination at approved Windhoek facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is a Chinese degree recognised in Namibia?",
        a: "Yes. The Namibia Qualifications Authority (NQA) recognises degrees from accredited Chinese universities. Graduates from 985 and 211 universities have strong outcomes in Namibia's government and private sector.",
      },
    ],
  },

  botswana: {
    slug: "botswana",
    name: "Botswana",
    flag: "🇧🇼",
    continent: "Africa",
    region: "Southern Africa",
    embassyCity: "Gaborone",
    studentsInChina: "400+",
    tagline: "Botswana's diamond economy meets China's world-class universities — a perfect pairing.",
    description:
      "Botswana has over 400 students at Chinese universities, attracted by the quality of programs in engineering, medicine, and business at a cost far below UK or Australian alternatives. Botswana's strong English-medium education system produces students who compete effectively for CSC scholarships at top Chinese universities. China-Botswana trade and diamond sector investment create career pathways for Chinese-trained graduates. The CSC scholarship is accessible through the Embassy in Gaborone.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Wuhan", "Shanghai", "Guangzhou"],
    highlights: [
      "Strong English-medium education — competitive for CSC scholarship applications",
      "CSC scholarship via Embassy in Gaborone",
      "Botswana's high per-capita income — self-sponsored study also accessible",
      "SADC recognition frameworks extend degree utility across Southern Africa",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Gaborone",
      "Medical examination at approved Gaborone facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can Botswana students self-fund study in China?",
        a: "Yes. Botswana has one of Africa's highest per-capita incomes, and many families can manage Chinese tuition costs of ¥14,000–¥28,000/year. Self-sponsored students still benefit from Globlearn Education's application guidance, university selection, and visa support.",
      },
    ],
  },

  gambia: {
    slug: "gambia",
    name: "Gambia",
    flag: "🇬🇲",
    continent: "Africa",
    region: "West Africa",
    embassyCity: "Banjul",
    studentsInChina: "300+",
    tagline: "The Gambia's students choosing China — medicine and engineering for West Africa's future.",
    description:
      "The Gambia has over 300 students studying in China, with medicine, engineering, and Chinese language being the primary fields. The Gambia-China relationship is strong, with Chinese investment in infrastructure, health, and agriculture. The CSC scholarship is available through the Embassy in Banjul, and The Gambia's English-medium education system prepares students well for English-taught programs at Chinese universities.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "CSC scholarship via Embassy in Banjul",
      "English-medium education — strong foundation for Chinese 985 programs",
      "China investing in Gambia's health and infrastructure sectors",
      "Growing Gambian student community in Wuhan and Beijing",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Banjul",
      "Medical examination at approved Banjul facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What scholarships can Gambian students apply for in China?",
        a: "Gambian students can apply for the CSC Embassy scholarship through the Embassy in Banjul, the CSC university-direct scholarship, and some university-level scholarships. Globlearn Education manages the full application process across all channels.",
      },
    ],
  },

  liberia: {
    slug: "liberia",
    name: "Liberia",
    flag: "🇱🇷",
    continent: "Africa",
    region: "West Africa",
    embassyCity: "Monrovia",
    studentsInChina: "400+",
    tagline: "Liberia's English-speaking students thriving in China's top medicine and engineering programs.",
    description:
      "Liberia has over 400 students at Chinese universities, with medicine, engineering, and business being the primary programs. Liberia's unique position as one of only two African countries with English as a native language gives Liberian students a strong competitive advantage for English-medium programs. The China-Liberia relationship has grown with Chinese investment in infrastructure and mining. The CSC scholarship is accessible through the Embassy in Monrovia.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "Native English speakers — exceptional advantage for 985 English programs",
      "CSC scholarship via Embassy in Monrovia",
      "China-Liberia mining and infrastructure investment creating graduate demand",
      "Medicine graduates eligible for Medical Board of Liberia licensing",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Monrovia",
      "Medical examination at approved Monrovia facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Do Liberian students need IELTS to study in China?",
        a: "Some programs require IELTS 6.0 or equivalent, but many universities accept Liberian students' native English proficiency as sufficient. Globlearn Education advises on which universities accept English-medium secondary school certificates without IELTS.",
      },
    ],
  },

  guinea: {
    slug: "guinea",
    name: "Guinea",
    flag: "🇬🇳",
    continent: "Africa",
    region: "West Africa",
    embassyCity: "Conakry",
    studentsInChina: "600+",
    tagline: "Guinea's mineral wealth meets China's universities — mining, medicine, and engineering students thriving.",
    description:
      "Guinea has over 600 students at Chinese universities, with mining engineering, medicine, and business being the most popular programs. Guinea holds the world's largest bauxite reserves and significant iron ore deposits — and China is its largest investor and trading partner. This creates exceptional career pathways for Chinese-trained mining and geological engineers. The CSC scholarship is accessible through the Embassy in Conakry, and French-speaking students can access language preparatory programs.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "China is Guinea's largest investor in bauxite and mining sectors",
      "CSC scholarship via Embassy in Conakry",
      "Mining and geological engineering graduates in strong demand",
      "French-speaking students: language bridge programs at Chinese universities",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Conakry",
      "Medical examination at approved Conakry facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is there demand for Chinese-trained engineers in Guinea?",
        a: "Yes. With Chinese companies operating Guinea's largest mining projects — including the Simandou iron ore project — graduates in mining engineering, geology, and civil engineering are in strong demand. Mandarin language skills add further employability.",
      },
    ],
  },

  // ── Middle East Batch ──────────────────────────────────────────────

  jordan: {
    slug: "jordan",
    name: "Jordan",
    flag: "🇯🇴",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Amman",
    studentsInChina: "2,000+",
    tagline: "Jordan's educated graduates choosing China — medicine, engineering, and business leading.",
    description:
      "Jordan has over 2,000 students at Chinese universities, drawn by the quality of programs, affordable tuition, and the growing China-Jordan economic relationship under the Belt and Road Initiative. Engineering, medicine, business, and Chinese language are the most popular fields. Arabic-speaking Jordanian students benefit from Arabic language support at major Chinese universities, and the CSC scholarship is accessible through the Embassy in Amman with a consistent annual quota.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Xi'an"],
    highlights: [
      "Jordan-China Belt and Road Initiative — bilateral scholarship channel active",
      "Arabic language support available at major Chinese universities",
      "Halal food widely available on Chinese campuses",
      "CSC scholarship via Embassy in Amman",
      "Jordan's well-educated graduates competitive for top 985 programs",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Amman",
      "Medical examination at approved Amman facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is halal food available for Jordanian Muslim students in China?",
        a: "Yes. All major Chinese university campuses have halal food sections. Cities like Xi'an, Lanzhou, Beijing, and Urumqi have large Muslim communities and extensive halal restaurant options near campuses.",
      },
    ],
  },

  iraq: {
    slug: "iraq",
    name: "Iraq",
    flag: "🇮🇶",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Baghdad",
    studentsInChina: "3,000+",
    tagline: "Iraq's students in China — petroleum, engineering, and medicine for national rebuilding.",
    description:
      "Iraq has over 3,000 students at Chinese universities, with petroleum engineering, civil engineering, medicine, and economics being the dominant programs. China is Iraq's largest oil customer and a major investor in reconstruction — creating direct career opportunities for Chinese-trained graduates. Arabic-speaking Iraqi students benefit from Arabic support staff and communities at major Chinese universities. The CSC scholarship is available through the Embassy in Baghdad, and the Iraqi Ministry of Higher Education runs dedicated scholarship channels.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Xi'an", "Wuhan", "Shanghai"],
    highlights: [
      "China is Iraq's largest oil customer — petroleum graduates in direct demand",
      "Iraqi Ministry of Higher Education runs dedicated China scholarship channel",
      "Arabic support available at major Chinese universities",
      "Halal food widely accessible on Chinese university campuses",
      "CSC scholarship via Embassy in Baghdad",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Baghdad",
      "Medical examination at approved Baghdad facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can Iraqi students get scholarships to study in China?",
        a: "Yes. Iraq has a bilateral scholarship agreement with China, and the Iraqi Ministry of Higher Education nominates students for CSC scholarships each year. Students can also apply independently through the university-direct CSC channel. Globlearn Education guides Iraqi students through both pathways.",
      },
    ],
  },

  lebanon: {
    slug: "lebanon",
    name: "Lebanon",
    flag: "🇱🇧",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Beirut",
    studentsInChina: "1,200+",
    tagline: "Lebanon's academically strong students are finding opportunity in China's world-class universities.",
    description:
      "Lebanon has over 1,200 students at Chinese universities, drawn by world-class programs at a fraction of the cost of European or American alternatives. Lebanese students are noted for their strong multilingual backgrounds (Arabic, French, English) which makes them excellent candidates for competitive CSC scholarships. Medicine, engineering, and business are the most popular fields. The CSC scholarship is accessible through the Embassy in Beirut, and the growing Lebanon-China relationship has strengthened bilateral education ties.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Wuhan"],
    highlights: [
      "Multilingual Lebanese students (Arabic, French, English) competitive for CSC scholarships",
      "CSC scholarship via Embassy in Beirut",
      "China study offers world-class education at affordable cost vs. Western alternatives",
      "Lebanese graduates with Chinese degrees competitive across Middle East job market",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Beirut",
      "Medical examination at approved Beirut facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is China study a good option for Lebanese students given the economic situation?",
        a: "Yes. Chinese university tuition (¥14,000–¥35,000/year) and living costs (¥1,200–¥2,500/month) are dramatically lower than Western alternatives. CSC scholarships cover full tuition and provide monthly stipends — making them particularly valuable for Lebanese students seeking quality international education.",
      },
    ],
  },

  yemen: {
    slug: "yemen",
    name: "Yemen",
    flag: "🇾🇪",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Sana'a",
    studentsInChina: "1,500+",
    tagline: "Yemen's students in China — building skills and futures through world-class education.",
    description:
      "Yemen has over 1,500 students at Chinese universities, with medicine, engineering, and Chinese language being the primary programs. Chinese universities offer Yemeni students access to world-class education with Arabic language support and halal food — making the transition manageable. The CSC scholarship is particularly valuable for Yemeni students given the economic challenges at home. The Embassy in Sana'a handles visa applications, and many students also coordinate through consular channels.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Xi'an", "Guangzhou"],
    highlights: [
      "CSC scholarship covers full tuition and living costs — critical for Yemeni students",
      "Arabic language support at major Chinese universities",
      "Halal food available on Chinese campuses",
      "Yemeni student community established in Beijing, Wuhan, and Xi'an",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Sana'a or coordinate through alternative consular channels",
      "Medical examination at approved facilities",
      "Processing times vary — Globlearn Education advises on current procedures",
    ],
    faqs: [
      {
        q: "Is the CSC scholarship available for Yemeni students in 2026?",
        a: "Yes. Yemeni students remain eligible for CSC scholarships through both the Embassy channel and the university-direct channel. Globlearn Education assists with the full application process and advises on the most accessible pathway for Yemeni applicants.",
      },
    ],
  },

  oman: {
    slug: "oman",
    name: "Oman",
    flag: "🇴🇲",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Muscat",
    studentsInChina: "800+",
    tagline: "Oman's Vision 2040 generation — engineering, business, and technology students choosing China.",
    description:
      "Oman has over 800 students at Chinese universities, with engineering, business, and technology programs aligned with Oman's Vision 2040 economic diversification agenda. The Oman-China relationship is strong through trade and the Port of Duqm's role in Belt and Road logistics. Omani students benefit from Muscat's direct connections to Chinese cities and the Chinese Embassy in Muscat's dedicated CSC scholarship channel. Halal food and Muslim prayer facilities are standard on Chinese campuses.",
    topPrograms: [
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Guangzhou"],
    highlights: [
      "Oman Vision 2040 — engineering and tech programs align with national strategy",
      "CSC scholarship via Embassy in Muscat",
      "Belt and Road Initiative connecting Oman-China trade and investment",
      "Halal food and Muslim facilities standard on Chinese campuses",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Muscat",
      "Medical examination at approved Muscat facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What programs are recommended for Omani students in China?",
        a: "Engineering, business administration, and artificial intelligence are highly recommended — these align directly with Oman Vision 2040 priorities. Chinese MBA programs from 985 universities are also popular for Omani professionals seeking postgraduate qualifications.",
      },
    ],
  },

  kuwait: {
    slug: "kuwait",
    name: "Kuwait",
    flag: "🇰🇼",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Kuwait City",
    studentsInChina: "600+",
    tagline: "Kuwait's students choosing China's top universities for business, medicine, and technology.",
    description:
      "Kuwait has over 600 students at Chinese universities, with business, medicine, and engineering being the primary programs. Kuwait's oil-funded education system means many Kuwaiti students are self-sponsored, while others access the CSC scholarship through the Embassy in Kuwait City. The Kuwait-China relationship has strengthened with China being one of Kuwait's largest oil customers and trade partners. Halal food and Islamic prayer facilities are widely available on Chinese campuses.",
    topPrograms: [
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Hangzhou"],
    highlights: [
      "Kuwait-China oil trade relationship — business graduates in demand",
      "CSC scholarship via Embassy in Kuwait City",
      "Halal food and Islamic facilities standard on Chinese campuses",
      "Kuwaiti government scholarship programs support study abroad including China",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Kuwait City",
      "Medical examination at approved Kuwait City facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Does the Kuwaiti government support study in China?",
        a: "Yes. The Kuwait Cultural Office offers scholarships for study abroad, including at approved Chinese universities. Students can also apply for the CSC scholarship directly. Globlearn Education advises on all funding channels available to Kuwaiti students.",
      },
    ],
  },

  bahrain: {
    slug: "bahrain",
    name: "Bahrain",
    flag: "🇧🇭",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Manama",
    studentsInChina: "400+",
    tagline: "Bahrain's finance and business students discovering China's world-class MBA programs.",
    description:
      "Bahrain has over 400 students at Chinese universities, with a strong concentration in business, finance, and engineering programs. As a major Gulf financial hub, Bahrain's graduates with Chinese MBA credentials and Mandarin skills have unique career advantages in the growing China-Gulf business corridor. The CSC scholarship is available through the Embassy in Manama, and halal food and Islamic facilities are readily accessible on Chinese campuses.",
    topPrograms: [
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"],
    highlights: [
      "Bahrain-China financial sector ties — MBA graduates competitive in Gulf-China business",
      "CSC scholarship via Embassy in Manama",
      "Halal food and Islamic facilities standard on Chinese university campuses",
      "Bahrain's open economy values internationally qualified graduates",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Manama",
      "Medical examination at approved Manama facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is a Chinese MBA recognised by Bahraini employers?",
        a: "Yes. Chinese MBA programs from Fudan, Tongji, Tsinghua, and other top universities are internationally recognised. Bahraini employers in finance, logistics, and trade value the combination of an MBA from a Chinese 985 university with Mandarin language skills.",
      },
    ],
  },

  qatar: {
    slug: "qatar",
    name: "Qatar",
    flag: "🇶🇦",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Doha",
    studentsInChina: "500+",
    tagline: "Qatar's ambitious students choosing China's elite universities for business and AI programs.",
    description:
      "Qatar has over 500 students at Chinese universities, with AI, business, and engineering being dominant fields aligned with Qatar's National Vision 2030 and its ambitions to become a knowledge economy. China is one of Qatar's largest LNG customers and trade partners, and the Qatar-China relationship has strengthened significantly. The CSC scholarship is accessible through the Embassy in Doha, and halal food and Islamic prayer facilities are standard on Chinese campuses.",
    topPrograms: [
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
    ],
    popularCities: ["Beijing", "Shanghai", "Shenzhen", "Hangzhou"],
    highlights: [
      "Qatar National Vision 2030 — AI and business programs aligned with national goals",
      "CSC scholarship via Embassy in Doha",
      "China is Qatar's largest LNG customer — strong bilateral ties",
      "Halal food and Islamic facilities standard on Chinese campuses",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Doha",
      "Medical examination at approved Doha facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What are the best programs for Qatari students in China?",
        a: "Artificial intelligence, data science, business administration, and engineering at China's top 985 universities align best with Qatar's Vision 2030 knowledge economy strategy. Globlearn Education advises on the specific universities with the strongest programs in these areas.",
      },
    ],
  },

  iran: {
    slug: "iran",
    name: "Iran",
    flag: "🇮🇷",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Tehran",
    studentsInChina: "8,000+",
    tagline: "Iran sends thousands to China — engineering, medicine, and sciences at the top universities.",
    description:
      "Iran has one of the largest student communities in China among Middle Eastern countries, with over 8,000 students enrolled at Chinese universities. The China-Iran comprehensive strategic partnership — including trade, energy, and technology cooperation — has created strong bilateral education ties. Engineering, computer science, medicine, and physics are the dominant programs, matching Iran's strong tradition in STEM education. The CSC scholarship is accessible through the Embassy in Tehran, and Persian-speaking students find China's supportive international environment welcoming.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "PhD Program", slug: "phd-program" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Xi'an"],
    highlights: [
      "China-Iran strategic partnership — strong bilateral education relationship",
      "CSC scholarship via Embassy in Tehran with consistent annual allocations",
      "Iran's STEM tradition — students competitive for top engineering and science programs",
      "Large Iranian student community across Beijing, Wuhan, and Shanghai",
      "Engineering graduates in demand for joint China-Iran energy projects",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Tehran",
      "Medical examination at approved Tehran facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is the CSC scholarship available for Iranian students in 2026?",
        a: "Yes. Iran has a significant CSC scholarship allocation through the Embassy in Tehran. The China-Iran comprehensive strategic partnership ensures continued bilateral education access. Globlearn Education advises Iranian students on both Embassy and university-direct application channels.",
      },
    ],
  },

  turkey: {
    slug: "turkey",
    name: "Turkey",
    flag: "🇹🇷",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Ankara",
    studentsInChina: "5,000+",
    tagline: "Turkey bridges East and West — and thousands are choosing China's elite universities.",
    description:
      "Turkey has over 5,000 students at Chinese universities, making it one of the largest source countries from the broader Middle East and Asia region. The Turkey-China relationship has deepened through trade, tourism, and the Belt and Road Initiative. Turkish students are drawn to engineering, business, and Chinese language programs. Istanbul and Ankara are served by direct flights to Beijing and Shanghai, and the Turkish government's Türkiye Scholarships program complements CSC funding. The Embassy in Ankara processes CSC applications with annual allocations.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Guangzhou"],
    highlights: [
      "Turkey-China Belt and Road Initiative — bilateral education and trade ties",
      "CSC scholarship via Embassy in Ankara",
      "Direct Turkish Airlines flights Istanbul–Beijing and Istanbul–Shanghai",
      "Turkish students bring strong multilingual backgrounds to Chinese universities",
      "Large Turkish student community across major Chinese university cities",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Ankara or Consulate in Istanbul",
      "Medical examination at approved Ankara or Istanbul facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can Turkish students use Türkiye Scholarships while studying in China?",
        a: "Türkiye Scholarships typically fund study at Turkish institutions. For study in China, the CSC scholarship is the primary government funding mechanism. However, some Turkish universities have exchange partnerships with Chinese institutions. Globlearn Education advises on the best funding strategy for Turkish applicants.",
      },
    ],
  },

  palestine: {
    slug: "palestine",
    name: "Palestine",
    flag: "🇵🇸",
    continent: "Asia",
    region: "Middle East",
    embassyCity: "Ramallah",
    studentsInChina: "500+",
    tagline: "Palestine's students in China — building futures through world-class education.",
    description:
      "Palestine has over 500 students at Chinese universities, accessing high-quality education in medicine, engineering, and Chinese language. China has consistently supported Palestinian access to education through dedicated CSC scholarship allocations. Arabic-speaking Palestinian students find Arabic language support and Muslim-friendly environments at Chinese universities. The Palestinian Mission in Beijing coordinates scholarship access, and the growing China-Palestine relationship ensures continued educational opportunities.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Xi'an", "Guangzhou"],
    highlights: [
      "China consistently supports Palestinian students through CSC scholarship allocations",
      "Arabic language support and Muslim-friendly campuses",
      "Halal food widely available at major Chinese universities",
      "Palestinian Mission in Beijing assists with scholarship coordination",
    ],
    visaNotes: [
      "Apply through the Palestinian Mission in Beijing or coordinate through Chinese Embassy channels",
      "Medical examination at approved facilities",
      "Globlearn Education advises on current visa procedures for Palestinian applicants",
    ],
    faqs: [
      {
        q: "How can Palestinian students access CSC scholarships?",
        a: "Palestinian students can apply through the university-direct CSC channel. The Palestinian Mission in Beijing also coordinates with Chinese universities on scholarship access. Globlearn Education assists Palestinian students with the full application process.",
      },
    ],
  },

  // ── Asia Batch ──────────────────────────────────────────────

  "sri-lanka": {
    slug: "sri-lanka",
    name: "Sri Lanka",
    flag: "🇱🇰",
    continent: "Asia",
    region: "South Asia",
    embassyCity: "Colombo",
    studentsInChina: "3,000+",
    tagline: "Sri Lanka's bright students choosing China for medicine, engineering, and business — at a fraction of the cost.",
    description:
      "Sri Lanka has over 3,000 students at Chinese universities, with medicine, engineering, and business being the primary programs. Sri Lanka-China relations are close, with Chinese investment in the Hambantota Port, Colombo Port City, and extensive infrastructure. This creates direct career pathways for Chinese-trained engineers and business graduates. The CSC scholarship is available through the Embassy in Colombo, and Sri Lanka's English-medium education system gives students a strong foundation for English-taught programs.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Wuhan", "Guangzhou", "Chengdu"],
    highlights: [
      "Sri Lanka-China Belt and Road investment — engineers and business grads in demand",
      "CSC scholarship via Embassy in Colombo",
      "Sri Lanka Medical Council recognises WHO-listed Chinese medical universities",
      "English-medium education system — strong foundation for 985 programs",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Colombo",
      "Medical examination at approved Colombo facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is a Chinese MBBS accepted for Sri Lanka Medical Council registration?",
        a: "Yes. Sri Lanka Medical Council (SLMC) accepts degrees from WHO-listed foreign medical universities including Chinese institutions. Graduates must pass the SLMC qualifying exam. Globlearn Education advises on the best Chinese medical universities for Sri Lankan MBBS aspirants.",
      },
    ],
  },

  nepal: {
    slug: "nepal",
    name: "Nepal",
    flag: "🇳🇵",
    continent: "Asia",
    region: "South Asia",
    embassyCity: "Kathmandu",
    studentsInChina: "9,000+",
    tagline: "Nepal sends thousands to China — the fastest-growing South Asian student community in 2026.",
    description:
      "Nepal is one of the fastest-growing sources of international students for Chinese universities, with over 9,000 Nepali students enrolled — a number that has grown dramatically over the past five years. MBBS, engineering, business, and Chinese language are the most popular programs. The China-Nepal relationship has deepened through the Trans-Himalayan Multi-Dimensional Connectivity Network, and the CSC scholarship is one of the most accessible for Nepali students. Nepal's government actively encourages study in China through bilateral agreements.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Wuhan", "Chengdu", "Beijing", "Guangzhou"],
    highlights: [
      "9,000+ Nepali students — one of South Asia's largest communities in China",
      "CSC scholarship via Embassy in Kathmandu — very accessible for Nepali students",
      "Nepal Medical Council recognises WHO-listed Chinese medical universities",
      "China-Nepal connectivity investment creating engineering graduate demand",
      "Large and supportive Nepali student associations at most Chinese universities",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Kathmandu",
      "Medical examination at approved Kathmandu facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is Nepal's CSC scholarship quota large?",
        a: "Yes. Nepal consistently receives one of the larger CSC scholarship allocations in South Asia. Globlearn Education has extensive experience helping Nepali students prepare competitive CSC applications across both Embassy and university-direct channels.",
      },
    ],
  },

  myanmar: {
    slug: "myanmar",
    name: "Myanmar",
    flag: "🇲🇲",
    continent: "Asia",
    region: "Southeast Asia",
    embassyCity: "Yangon",
    studentsInChina: "4,000+",
    tagline: "Myanmar's students choosing China for medicine, engineering, and language across the border.",
    description:
      "Myanmar has over 4,000 students at Chinese universities — a natural flow given the two countries share a long border and close economic ties. Medicine, engineering, computer science, and Chinese language are the most popular programs. The China-Myanmar Economic Corridor (CMEC) and Chinese investment in Myanmar's infrastructure create strong career pathways for Chinese-trained graduates. The CSC scholarship is available through the Embassy in Yangon, and some students from Yunnan-border regions may have existing Mandarin language skills.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Yunnan (Kunming)", "Guangzhou", "Beijing", "Wuhan"],
    highlights: [
      "Shared border with Yunnan — geographic proximity makes travel convenient",
      "China-Myanmar Economic Corridor — engineers and business grads in demand",
      "CSC scholarship via Embassy in Yangon",
      "Myanmar Medical Council recognises WHO-listed Chinese medical universities",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Yangon",
      "Medical examination at approved Yangon facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is Chinese language knowledge required to study in Myanmar?",
        a: "No prior Chinese language knowledge is required. Most programs are available in English at Chinese universities. A one-year Chinese language preparatory course is available for students who prefer to study in Mandarin. Globlearn Education matches you to the right program.",
      },
    ],
  },

  thailand: {
    slug: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    continent: "Asia",
    region: "Southeast Asia",
    embassyCity: "Bangkok",
    studentsInChina: "4,000+",
    tagline: "Thailand's students thriving in China — business, Chinese language, and engineering leading.",
    description:
      "Thailand has over 4,000 students at Chinese universities, driven by the deep Thai-Chinese cultural relationship and the large Thai-Chinese community. Business, Chinese language, tourism management, and engineering are the most popular programs. The Thailand-China High Speed Railway and extensive bilateral trade create strong career pathways for graduates with Chinese language skills and business qualifications. The CSC scholarship is available through the Embassy in Bangkok, and direct Thai Airways flights to multiple Chinese cities make travel convenient.",
    topPrograms: [
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Yunnan (Kunming)"],
    highlights: [
      "Deep Thai-Chinese cultural ties — large Thai-Chinese community in Thailand",
      "CSC scholarship via Embassy in Bangkok",
      "Thailand-China High Speed Railway creating engineering graduate demand",
      "Direct flights Bangkok–Beijing, Bangkok–Shanghai, Bangkok–Guangzhou",
      "Chinese language skills add major career value in Thailand's business sector",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Bangkok",
      "Medical examination at approved Bangkok facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Why are Thai students choosing China over Western countries for university?",
        a: "The combination of world-class programs, dramatically lower tuition costs, geographic proximity, cultural familiarity (large Thai-Chinese community), and China's growing global economic importance make Chinese universities an increasingly preferred choice for Thai students.",
      },
    ],
  },

  vietnam: {
    slug: "vietnam",
    name: "Vietnam",
    flag: "🇻🇳",
    continent: "Asia",
    region: "Southeast Asia",
    embassyCity: "Hanoi",
    studentsInChina: "6,000+",
    tagline: "Vietnam's students in China — engineering, Chinese language, and business thriving.",
    description:
      "Vietnam has over 6,000 students at Chinese universities, making it one of Southeast Asia's largest student communities in China. The shared border and cultural ties make China a natural destination. Engineering, Chinese language, business, and medicine are the most popular programs. Vietnam's manufacturing boom and deep integration with China's supply chains create strong career demand for graduates with Chinese language skills and technical qualifications. The CSC scholarship is available through the Embassy in Hanoi, and direct flights from Hanoi and Ho Chi Minh City to multiple Chinese cities are frequent.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Nanning"],
    highlights: [
      "Shared border and cultural ties — Vietnam-China relationship deeply integrated",
      "CSC scholarship via Embassy in Hanoi",
      "Vietnam-China supply chain — engineers and business grads highly employable",
      "Nanning (Guangxi) serves as a gateway city for Vietnamese students",
      "Large Vietnamese student community with strong peer support networks",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Hanoi or Consulate in Ho Chi Minh City",
      "Medical examination at approved Hanoi or HCMC facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is Chinese language study a good investment for Vietnamese graduates?",
        a: "Absolutely. Vietnam's economy is deeply integrated with China through manufacturing, trade, and supply chains. Vietnamese graduates with Chinese language skills and technical qualifications are among the most sought-after in the job market. Many Chinese companies operating in Vietnam actively recruit Chinese-university graduates.",
      },
    ],
  },

  indonesia: {
    slug: "indonesia",
    name: "Indonesia",
    flag: "🇮🇩",
    continent: "Asia",
    region: "Southeast Asia",
    embassyCity: "Jakarta",
    studentsInChina: "14,000+",
    tagline: "Indonesia's largest overseas student community — China is the top destination in 2026.",
    description:
      "Indonesia sends over 14,000 students to Chinese universities, making it one of the largest source countries in Asia. Medicine, engineering, business, and Chinese language are the dominant programs. The Indonesia-China relationship is driven by massive bilateral trade (China is Indonesia's largest trading partner), significant Chinese investment in nickel processing, and infrastructure projects. The large Indonesian-Chinese (Peranakan) community creates cultural familiarity. The CSC scholarship is available through the Embassy in Jakarta, and Indonesian universities actively run exchange programs with Chinese institutions.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Shanghai", "Wuhan", "Guangzhou"],
    highlights: [
      "14,000+ students — one of Asia's largest Chinese university student communities",
      "CSC scholarship via Embassy in Jakarta",
      "China-Indonesia nickel and infrastructure investment creating engineering demand",
      "Large Peranakan Indonesian-Chinese community provides cultural familiarity",
      "Direct Garuda and China Southern flights Jakarta–Beijing, Jakarta–Guangzhou",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Jakarta or Consulates in Surabaya and Medan",
      "Medical examination at approved Jakarta facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is there a dedicated scholarship for Indonesian students in China?",
        a: "Yes. Indonesia has a large CSC scholarship allocation through the Embassy in Jakarta. The Indonesian government's LPDP scholarship program also funds postgraduate study at approved Chinese universities. Globlearn Education advises Indonesian students on all available funding channels.",
      },
    ],
  },

  malaysia: {
    slug: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    continent: "Asia",
    region: "Southeast Asia",
    embassyCity: "Kuala Lumpur",
    studentsInChina: "8,000+",
    tagline: "Malaysia's students in China — business, engineering, and Chinese language at world-class institutions.",
    description:
      "Malaysia has over 8,000 students at Chinese universities — driven by Malaysia's large Chinese-Malaysian community, cultural ties, and the practical value of Mandarin in Malaysia's business environment. Business, engineering, medicine, and Chinese language are the most popular programs. Malaysia-China bilateral trade exceeds US$100 billion annually, and Chinese investment in Malaysia's East Coast Rail Link and industrial zones creates strong career pathways. The CSC scholarship is available through the Embassy in Kuala Lumpur, and direct Malaysia Airlines and AirAsia flights connect Malaysia to multiple Chinese cities.",
    topPrograms: [
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Foundation / Pre-University", slug: "foundation-pre-university" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Xiamen"],
    highlights: [
      "Large Chinese-Malaysian community — cultural and linguistic familiarity",
      "CSC scholarship via Embassy in Kuala Lumpur",
      "Malaysia-China trade at US$100B+ — business graduates highly employable",
      "Direct AirAsia and Malaysia Airlines flights KL–Beijing, KL–Guangzhou, KL–Xiamen",
      "Mandarin proficiency adds major career value in Malaysia's bilingual business sector",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Kuala Lumpur",
      "Medical examination at approved KL facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Should Malaysian Chinese-Malaysians choose China for further study?",
        a: "Many Chinese-Malaysians find China ideal — they may already have some Mandarin proficiency, cultural familiarity, and family connections. Chinese universities offer excellent programs in business, technology, and medicine at a fraction of UK or Australian costs. Globlearn Education helps you identify the best university match.",
      },
    ],
  },

  philippines: {
    slug: "philippines",
    name: "Philippines",
    flag: "🇵🇭",
    continent: "Asia",
    region: "Southeast Asia",
    embassyCity: "Manila",
    studentsInChina: "3,500+",
    tagline: "Filipino students choosing China for medicine, nursing, and engineering — excellent value in 2026.",
    description:
      "The Philippines has over 3,500 students at Chinese universities, with MBBS, nursing, engineering, and business being the primary programs. The Philippines-China relationship, while politically complex, maintains strong people-to-people ties — particularly for education. Filipino students are highly regarded for their English proficiency and professional work ethic. The CSC scholarship is accessible through the Embassy in Manila, and China's recognition of Filipino academic credentials makes the transition smooth.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Chengdu"],
    highlights: [
      "Filipino students' strong English proficiency — competitive for 985 English programs",
      "CSC scholarship via Embassy in Manila",
      "Philippine Regulation Commission (PRC) recognises WHO-listed Chinese medical degrees",
      "Growing Filipino student community in Shanghai and Guangzhou",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Manila",
      "Medical examination at approved Manila facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Can Filipino MBBS graduates from China practice medicine in the Philippines?",
        a: "Yes. The Philippine Regulation Commission (PRC) allows graduates from WHO-listed foreign medical universities to sit the Philippine Medical Licensure Examination (PMLE). Globlearn Education advises specifically on which Chinese medical universities have the best outcomes for Filipino graduates.",
      },
    ],
  },

  cambodia: {
    slug: "cambodia",
    name: "Cambodia",
    flag: "🇰🇭",
    continent: "Asia",
    region: "Southeast Asia",
    embassyCity: "Phnom Penh",
    studentsInChina: "2,500+",
    tagline: "Cambodia's students thriving in China — engineering, Chinese language, and business building ASEAN futures.",
    description:
      "Cambodia has over 2,500 students at Chinese universities, driven by the very close Cambodia-China relationship — China is Cambodia's largest investor and top trading partner. Engineering, Chinese language, business, and medicine are the most popular programs. Cambodian students with Chinese university credentials and Mandarin skills are highly employable in Cambodia's growing economy, which relies heavily on Chinese investment in garments, construction, and tourism. The CSC scholarship is accessible through the Embassy in Phnom Penh.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
    ],
    popularCities: ["Beijing", "Guangzhou", "Wuhan", "Shanghai"],
    highlights: [
      "China is Cambodia's largest investor — graduates with Mandarin highly employable",
      "CSC scholarship via Embassy in Phnom Penh",
      "Chinese language skills essential for Cambodia's Chinese-investment-driven economy",
      "Large and growing Cambodian student community in Guangzhou",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Phnom Penh",
      "Medical examination at approved Phnom Penh facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Why is China the top destination for Cambodian students studying abroad?",
        a: "China's role as Cambodia's largest economic partner, accessible scholarships, affordable living costs, and cultural familiarity make it the most practical international education destination for Cambodian students. Mandarin language skills gained in China are directly monetisable in Cambodia's economy.",
      },
    ],
  },

  mongolia: {
    slug: "mongolia",
    name: "Mongolia",
    flag: "🇲🇳",
    continent: "Asia",
    region: "East Asia",
    embassyCity: "Ulaanbaatar",
    studentsInChina: "7,000+",
    tagline: "Mongolia shares a border with China — and 7,000+ students are studying there right now.",
    description:
      "Mongolia has over 7,000 students at Chinese universities — one of the highest ratios of overseas students to population in Asia. The shared 4,000km border and deep economic ties (China buys over 90% of Mongolia's exports) make China the natural education destination. Engineering, business, Chinese language, and medicine are the most popular programs. Many Mongolian students already have basic Mandarin skills from border communities. The CSC scholarship is one of the most accessible for Mongolian applicants through the Embassy in Ulaanbaatar.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
    ],
    popularCities: ["Beijing", "Inner Mongolia (Hohhot)", "Wuhan", "Tianjin"],
    highlights: [
      "4,000km shared border — geographic proximity and cultural ties",
      "China buys 90% of Mongolia's exports — graduates in strong demand",
      "CSC scholarship among most accessible for Mongolian applicants",
      "Inner Mongolia (Hohhot) has large Mongolian-speaking population",
      "7,000+ students — very large peer support community",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Ulaanbaatar",
      "Medical examination at approved Ulaanbaatar facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Do Mongolian students need to learn Chinese before going to China?",
        a: "Not necessarily. Many programs are available in English. However, students from border regions may already have basic Mandarin. A one-year Chinese language preparatory course is available for those who want to study in Mandarin. Globlearn Education advises on the right pathway for each student.",
      },
    ],
  },

  kazakhstan: {
    slug: "kazakhstan",
    name: "Kazakhstan",
    flag: "🇰🇿",
    continent: "Asia",
    region: "Central Asia",
    embassyCity: "Astana",
    studentsInChina: "12,000+",
    tagline: "Kazakhstan leads Central Asia — 12,000+ students in China's top universities in 2026.",
    description:
      "Kazakhstan has the largest student community in China of all Central Asian countries, with over 12,000 students enrolled. The China-Kazakhstan relationship is driven by the Belt and Road Initiative, massive Chinese investment in Kazakhstan's energy sector, and the shared SCO framework. Engineering, medicine, business, and Chinese language are the dominant programs. The CSC scholarship is very accessible for Kazakh students through the Embassy in Astana, and direct Air Astana flights connect Nur-Sultan and Almaty to Beijing and other Chinese cities.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "PhD Program", slug: "phd-program" },
    ],
    popularCities: ["Beijing", "Shanghai", "Xi'an", "Urumqi"],
    highlights: [
      "Largest Central Asian student community in China — 12,000+ enrolled",
      "CSC scholarship very accessible via Embassy in Astana",
      "Belt and Road Initiative — Chinese investment across Kazakhstan creating jobs",
      "Urumqi is a gateway city with large Kazakh-speaking community",
      "Kazakhstan's energy sector creates demand for Chinese-trained engineers",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Astana or Consulate in Almaty",
      "Medical examination at approved Astana or Almaty facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is the CSC scholarship competitive for Kazakh students?",
        a: "Kazakhstan receives one of the larger CSC quotas in Central Asia. Kazakh students with strong academic records have good scholarship success rates. Globlearn Education helps you optimise your application for both the Embassy channel (in Astana) and the university-direct channel.",
      },
    ],
  },

  uzbekistan: {
    slug: "uzbekistan",
    name: "Uzbekistan",
    flag: "🇺🇿",
    continent: "Asia",
    region: "Central Asia",
    embassyCity: "Tashkent",
    studentsInChina: "8,000+",
    tagline: "Uzbekistan's ambitious students leading Central Asia's education push into China.",
    description:
      "Uzbekistan has over 8,000 students at Chinese universities, making it one of the top source countries from Central Asia. The Uzbekistan-China relationship has deepened rapidly with Chinese investment in Uzbekistan's textile, energy, and logistics sectors under the Belt and Road Initiative. Engineering, Chinese language, medicine, and business are the most popular programs. Tashkent is connected to Beijing by direct flights, and the CSC scholarship is very accessible for Uzbek students through the Embassy in Tashkent.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
    ],
    popularCities: ["Beijing", "Xi'an", "Wuhan", "Urumqi"],
    highlights: [
      "CSC scholarship highly accessible via Embassy in Tashkent",
      "Chinese investment in Uzbekistan's textile and energy sectors",
      "Direct Uzbekistan Airways flights Tashkent–Beijing",
      "Xi'an and Urumqi have large Central Asian student communities",
      "Uzbek government supports China study as part of education modernisation",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Tashkent",
      "Medical examination at approved Tashkent facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What is the best city in China for Uzbek students?",
        a: "Xi'an and Urumqi have large Central Asian communities and cultural familiarity. Beijing and Wuhan offer the widest range of top-ranked programs. Globlearn Education matches you to the city and university best suited to your program choice and budget.",
      },
    ],
  },

  afghanistan: {
    slug: "afghanistan",
    name: "Afghanistan",
    flag: "🇦🇫",
    continent: "Asia",
    region: "South Asia",
    embassyCity: "Kabul",
    studentsInChina: "2,000+",
    tagline: "Afghanistan's students building futures through China's world-class university system.",
    description:
      "Afghanistan has over 2,000 students at Chinese universities, accessing education opportunities in engineering, medicine, agriculture, and Chinese language. China shares a border with Afghanistan and has expressed commitment to supporting Afghan education and development. Chinese universities offer Afghan students affordable, high-quality education with Arabic and Dari language support available at some institutions. The CSC scholarship is accessible for Afghan students, and Globlearn Education assists with the full application and visa process.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Wuhan", "Xi'an", "Urumqi"],
    highlights: [
      "CSC scholarship accessible for Afghan students — university-direct channel available",
      "China shares a border with Afghanistan — geographic proximity",
      "Medicine and engineering programs aligned with Afghanistan's development needs",
      "Afghan student community established in Beijing and Wuhan",
    ],
    visaNotes: [
      "Coordinate through Globlearn Education for current visa application procedures",
      "Medical examination at approved facilities",
      "Globlearn Education advises on current documentation requirements for Afghan applicants",
    ],
    faqs: [
      {
        q: "Can Afghan students access CSC scholarships in 2026?",
        a: "Yes. Afghan students can apply for CSC scholarships through the university-direct channel. Globlearn Education has experience assisting Afghan applicants with the documentation process and university selection. Contact us for current guidance on procedures.",
      },
    ],
  },

  maldives: {
    slug: "maldives",
    name: "Maldives",
    flag: "🇲🇻",
    continent: "Asia",
    region: "South Asia",
    embassyCity: "Malé",
    studentsInChina: "300+",
    tagline: "Maldives' students choosing China for marine engineering, tourism, and medicine.",
    description:
      "The Maldives has over 300 students at Chinese universities, with marine engineering, tourism management, medicine, and environmental science being uniquely relevant programs for the island nation. China is the Maldives' top tourist source and a major infrastructure investor — including the iconic China-Maldives Friendship Bridge. Maldivian students are eligible for CSC scholarships through the Embassy in Malé, and the small but growing community benefits from strong personal support.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
    ],
    popularCities: ["Beijing", "Shanghai", "Guangzhou", "Wuhan"],
    highlights: [
      "China is Maldives' top tourist source — Chinese language skills highly valuable",
      "CSC scholarship via Embassy in Malé",
      "China-Maldives Friendship Bridge — a symbol of the close bilateral relationship",
      "Marine engineering and tourism management programs uniquely relevant",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Malé",
      "Medical examination at approved Malé facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What programs are most relevant for Maldivian students in China?",
        a: "Marine engineering, tourism and hospitality management, environmental science, and medicine are the most relevant programs for Maldivian students given their country's ocean-dependent economy. Chinese language study is also highly valuable given China's importance as Maldives' top tourist market.",
      },
    ],
  },

  tajikistan: {
    slug: "tajikistan",
    name: "Tajikistan",
    flag: "🇹🇯",
    continent: "Asia",
    region: "Central Asia",
    embassyCity: "Dushanbe",
    studentsInChina: "3,000+",
    tagline: "Tajikistan's students in China — engineering, Chinese language, and medicine for Central Asia's future.",
    description:
      "Tajikistan has over 3,000 students at Chinese universities, a significant number for its population size. The Tajikistan-China relationship includes a long shared border, significant Chinese infrastructure investment, and strong SCO ties. Engineering, Chinese language, medicine, and business are the most popular programs. The CSC scholarship is very accessible for Tajik students through the Embassy in Dushanbe, and Xi'an and Urumqi are gateway cities with established Central Asian communities.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Xi'an", "Wuhan", "Urumqi"],
    highlights: [
      "CSC scholarship accessible via Embassy in Dushanbe",
      "Shared border with China — geographic proximity and established ties",
      "Xi'an and Urumqi have large Tajik and Central Asian student communities",
      "Chinese investment in Tajikistan's infrastructure creating graduate demand",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Dushanbe",
      "Medical examination at approved Dushanbe facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "Is the CSC scholarship easy to access for Tajik students?",
        a: "Yes. Tajikistan has a bilateral scholarship agreement with China, and the Embassy in Dushanbe processes CSC applications each year. Globlearn Education has experience assisting Tajik students with the full application — from university selection to visa.",
      },
    ],
  },

  kyrgyzstan: {
    slug: "kyrgyzstan",
    name: "Kyrgyzstan",
    flag: "🇰🇬",
    continent: "Asia",
    region: "Central Asia",
    embassyCity: "Bishkek",
    studentsInChina: "2,500+",
    tagline: "Kyrgyzstan's students choosing China — engineering, medicine, and language for Central Asia's new era.",
    description:
      "Kyrgyzstan has over 2,500 students at Chinese universities, supported by strong bilateral ties and the SCO framework. China shares a border with Kyrgyzstan and is a major investor in the country's infrastructure. Engineering, Chinese language, medicine, and business are the most popular programs. The CSC scholarship is accessible through the Embassy in Bishkek, and Xi'an and Urumqi have established Kyrgyz student communities. Kyrgyz students benefit from competitive scholarship access as part of China's Central Asia engagement.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Master's Degree", slug: "masters-degree" },
    ],
    popularCities: ["Beijing", "Xi'an", "Wuhan", "Urumqi"],
    highlights: [
      "CSC scholarship accessible via Embassy in Bishkek",
      "Shared border with China — strong bilateral SCO framework",
      "Established Kyrgyz student communities in Xi'an and Urumqi",
      "Chinese investment in Kyrgyzstan's infrastructure creating graduate demand",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Bishkek",
      "Medical examination at approved Bishkek facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "What scholarship channels are available for Kyrgyz students in China?",
        a: "Kyrgyz students can access the CSC Embassy channel through the Embassy in Bishkek and the university-direct CSC channel. Globlearn Education advises on which channel is most competitive for your academic profile.",
      },
    ],
  },

  laos: {
    slug: "laos",
    name: "Laos",
    flag: "🇱🇦",
    continent: "Asia",
    region: "Southeast Asia",
    embassyCity: "Vientiane",
    studentsInChina: "3,000+",
    tagline: "Laos connects to China by high-speed rail — and thousands of students are following.",
    description:
      "Laos has over 3,000 students at Chinese universities, a number growing rapidly following the opening of the China-Laos Railway in 2021. Engineering, Chinese language, business, and medicine are the most popular programs. The China-Laos Railway has transformed connectivity and created enormous demand for Lao graduates with Chinese language skills and technical qualifications. The CSC scholarship is very accessible for Lao students through the Embassy in Vientiane, and Yunnan's Kunming is a natural gateway city for Lao students.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "Short Course / Exchange", slug: "short-course-exchange" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
    ],
    popularCities: ["Yunnan (Kunming)", "Beijing", "Guangzhou", "Wuhan"],
    highlights: [
      "China-Laos Railway opened 2021 — Chinese language skills in massive demand",
      "CSC scholarship accessible via Embassy in Vientiane",
      "Kunming (Yunnan) serves as gateway city — just hours by rail from Vientiane",
      "Lao government actively supports China study as national development strategy",
      "Engineering and business graduates highly employable in Laos's Chinese-funded economy",
    ],
    visaNotes: [
      "Apply at the Chinese Embassy in Vientiane",
      "Medical examination at approved Vientiane facilities",
      "Standard processing 5–7 business days",
    ],
    faqs: [
      {
        q: "How does the China-Laos Railway affect Lao students' career prospects?",
        a: "The railway has dramatically increased Chinese business presence in Laos and demand for bilingual (Lao-Mandarin) staff across logistics, tourism, trade, and construction. Lao graduates from Chinese universities with Mandarin skills are among the most employable in the country's current job market.",
      },
    ],
  },
};

export const countriesList = Object.values(countriesData);

export const countryRegions = [
  "All",
  "West Africa",
  "East Africa",
  "Southern Africa",
  "Central Africa",
  "Northeast Africa",
  "North Africa",
  "South Asia",
  "Southeast Asia",
  "East Asia",
  "Central Asia",
  "Middle East",
];
