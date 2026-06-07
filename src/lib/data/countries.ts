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
    studentsInChina: "12,000+",
    tagline: "Nigeria's largest student population abroad — and China is the top destination.",
    description:
      "Nigeria sends more students to China than any other African country. With over 12,000 Nigerians enrolled at Chinese universities, a strong community already exists across Beijing, Shanghai, Wuhan, Chengdu, and Guangzhou. Nigerian students are drawn to MBBS programs (which offer a path to MDCN registration), engineering, and information technology. The CSC scholarship is competitive but achievable — several hundred Nigerian students receive it each year.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
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
    studentsInChina: "5,000+",
    tagline: "Kenya's growing student presence in China — business, tech, and medicine leading the way.",
    description:
      "Kenya has a rapidly growing student presence in China, driven by the strong China-Kenya relationship under the Belt and Road Initiative. Kenyan students in China predominantly study business administration, information technology, engineering, and medicine. Nairobi's direct connection to Chinese infrastructure investment creates practical career advantages for graduates with Chinese university credentials. The CSC scholarship is available through the Kenyan Embassy channel and through university direct applications.",
    topPrograms: [
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "MBA & Business", slug: "mba-business" },
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
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
    studentsInChina: "2,500+",
    tagline: "Uganda's rising scholars are choosing China — medicine and business opening new doors.",
    description:
      "Uganda has a growing and enthusiastic student community in China, with particular strength in medicine, business administration, and agriculture. The Ugandan government actively supports study in China through its Ministry of Education scholarship channels. Ugandan MBBS graduates from Chinese universities can sit the Medical Council of Uganda licensing examination. The China-Uganda relationship has strengthened significantly with infrastructure investment, creating strong graduate career prospects.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "MBA & Business", slug: "mba-business" },
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
    studentsInChina: "6,000+",
    tagline: "Egypt's scholars in China — one of Africa's largest and most established student communities.",
    description:
      "Egypt is one of the largest sources of international students for China, with over 6,000 Egyptian students enrolled. The Egyptian-Chinese relationship is deep and long-standing, reflected in generous CSC scholarship quotas and dedicated bilateral programs. Egyptian students are distributed across MBBS, engineering, economics, and Chinese language programs. Al-Azhar University's cooperation with Chinese institutions has also opened religious studies and Arabic-Chinese translation pathways. Cairo to Beijing and Guangzhou are well-served by direct flights.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Chinese Language", slug: "chinese-language" },
      { name: "MBA & Business", slug: "mba-business" },
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
    studentsInChina: "30,000+",
    tagline: "Pakistan sends more students to China than any other country — CPEC is just one reason.",
    description:
      "Pakistan has the largest number of students in China of any country in the world, with over 30,000 Pakistani students enrolled. This extraordinary figure reflects the depth of the China-Pakistan Economic Corridor (CPEC) relationship and generous scholarship programs. MBBS, engineering, computer science, and business are the dominant fields. The Pakistan-China Higher Education Commission maintains dedicated scholarship channels, and the CSC scholarship quota for Pakistan is among the largest allocated globally.",
    topPrograms: [
      { name: "MBBS / Medicine", slug: "mbbs-medicine" },
      { name: "Bachelor's Degree", slug: "bachelors-degree" },
      { name: "Master's Degree", slug: "masters-degree" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
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
    studentsInChina: "4,000+",
    tagline: "Saudi Arabia's Vision 2030 generation — choosing China for technology and business.",
    description:
      "Saudi Arabia's Vision 2030 agenda has dramatically increased the country's international education partnerships, with China emerging as a key destination. Saudi students in China predominantly study engineering, computer science, artificial intelligence, and business — all priority fields under Vision 2030. The Saudi Cultural Mission actively supports students studying in China, and Chinese universities have dedicated Saudi student programs. Saudi Arabia's 30+ million population and oil-funded education budgets make it a significant and growing market.",
    topPrograms: [
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
      { name: "MBA & Business", slug: "mba-business" },
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
    studentsInChina: "2,500+",
    tagline: "The UAE hub meets China's innovation economy — business and tech students thriving.",
    description:
      "The UAE sends a growing number of students to China each year, drawn primarily by business, technology, and MBA programs at China's top universities. The UAE's position as a global trade and logistics hub — with Jebel Ali Port being China's largest port partner outside Asia — creates unique career synergies for graduates with Chinese university credentials and language skills. Emirati, Egyptian, Indian, Pakistani, and other Arab students based in the UAE all access Chinese universities through UAE-based channels.",
    topPrograms: [
      { name: "MBA & Business", slug: "mba-business" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
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
  "Middle East",
];
