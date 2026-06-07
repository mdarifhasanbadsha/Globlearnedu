import type { Metadata } from "next";
import WhatsAppNudge from "~/components/shared/WhatsAppNudge";

export const metadata: Metadata = {
  title: "FAQ — Studying in China",
  description: "Frequently asked questions about studying in China: CSC scholarships, MBBS, admission, visas, costs, and more. Answered by Globlearn Education.",
};

const FAQ_CATEGORIES = [
  {
    title: "Scholarships & Costs",
    faqs: [
      {
        q: "What scholarships are available for international students in China?",
        a: "There are 4 main types: (1) CSC Government Scholarship — full tuition + monthly stipend of ¥2,500–¥3,500. Most competitive but highest value. (2) University Scholarship — 50–100% tuition waiver, less competitive than CSC. (3) Provincial Government Scholarship — full or partial tuition from provinces like Jiangsu, Hubei, and Shandong. (4) Self-Sponsored — you pay your own tuition, which is still dramatically cheaper than UK, USA, or Australian alternatives.",
      },
      {
        q: "Is studying in China expensive?",
        a: "No. Tuition at Chinese universities ranges from ¥14,000–¥35,000 per year (roughly $2,000–$5,000 USD), which is 5–10× cheaper than equivalent Western programs. Living costs in most Chinese university cities run ¥1,200–¥2,500 per month (about $165–$350 USD). With a CSC scholarship, many students study at zero personal cost.",
      },
      {
        q: "Does Globlearn Education charge fees? When do I pay?",
        a: "Yes, Globlearn Education charges a transparent service fee for our full support — application, scholarship applications, visa guidance, and arrival support. Importantly, you pay only after your university admission is confirmed. There are no hidden fees or upfront charges before you have a confirmed offer.",
      },
      {
        q: "What is the CSC scholarship stipend amount?",
        a: "CSC scholarship stipends in 2026 are: Bachelor's students ¥2,500/month, Master's students ¥3,000/month, PhD students ¥3,500/month. This covers basic living expenses in most Chinese university cities. Full tuition is also covered by CSC, plus free university accommodation in most cases.",
      },
    ],
  },
  {
    title: "Admission & Programs",
    faqs: [
      {
        q: "Do I need to know Chinese to study in China?",
        a: "No. Most 985 and 211 universities offer English-medium programs at Bachelor, Master, and PhD level — especially in medicine, engineering, business, and technology. A one-year Chinese language preparatory course is available for students who prefer to study in Mandarin.",
      },
      {
        q: "What grades do I need to apply?",
        a: "Requirements vary by program. Broadly: undergraduate programs typically require 60–70% in secondary school leaving exams; Master's programs require a Bachelor's degree with a good GPA; MBBS requires strong science grades (biology, chemistry, physics). Globlearn Education assesses your profile and matches you to universities where you are most competitive.",
      },
      {
        q: "What documents do I need to apply?",
        a: "Typically: valid passport, academic transcripts, degree certificates, medical examination certificate, police clearance certificate, personal statement/study plan, recommendation letters, and passport-sized photos. Some programs also require IELTS/TOEFL or HSK (Mandarin). Globlearn Education prepares and guides you through the complete checklist.",
      },
      {
        q: "When are the application deadlines for 2026?",
        a: "Most Chinese universities have intake in September (autumn) with CSC scholarship deadlines running March–April 2026. University-direct applications are typically due April–May. Some universities have a February intake with earlier deadlines. Globlearn Education will advise you on the exact deadlines for your target universities.",
      },
      {
        q: "Can I study MBBS in China and practice medicine at home?",
        a: "Yes, with conditions. Chinese MBBS programs are WHO/FAIMER-listed, which means graduates are eligible to sit licensing examinations in most countries — FMGE/NExT in India, MDCN assessment in Nigeria, PMDC exam in Pakistan, BMDC exam in Bangladesh, and equivalents elsewhere. Globlearn Education only places students at universities with the strongest licensing outcomes for their home country.",
      },
    ],
  },
  {
    title: "Visa & Travel",
    faqs: [
      {
        q: "Do you guarantee a visa?",
        a: "No. Visa decisions are made solely by the Chinese Embassy in your country — no agent or consultancy can guarantee a visa. Globlearn Education provides expert guidance to maximise your application strength. Our students have a 99% visa guidance success rate based on historical outcomes.",
      },
      {
        q: "What type of visa do I need to study in China?",
        a: "You need an X1 student visa for study periods longer than 180 days. This is applied for at the Chinese Embassy or Consulate in your home country or country of residence. Globlearn Education prepares all your visa documents and guides you through the embassy process.",
      },
      {
        q: "How long does the visa process take?",
        a: "Standard processing is 5–7 business days at most Chinese Embassies. Express processing (1–3 days) is available at some Consulates for an additional fee. The process starts after you have your university Admission Notice (JW202 form). Globlearn Education advises on timing so your visa is ready well before your departure date.",
      },
    ],
  },
  {
    title: "Life in China",
    faqs: [
      {
        q: "Is China safe for international students?",
        a: "Yes. China consistently ranks as one of the safest countries in the world for international students, with very low crime rates in university cities. Chinese universities have 24/7 campus security, and the large international student communities in cities like Wuhan, Beijing, Chengdu, and Guangzhou provide strong peer support networks.",
      },
      {
        q: "Is halal food available on Chinese campuses?",
        a: "Yes. All major Chinese university campuses have dedicated halal food sections in their canteens. Cities with large Muslim populations — Xi'an, Lanzhou, Urumqi, Beijing, Guangzhou — have extensive halal restaurant options near campuses. This is particularly relevant for students from Africa, the Middle East, and South Asia.",
      },
      {
        q: "What are the best cities for international students in China?",
        a: "Wuhan (medicine and engineering hub, large international community), Beijing (top 985 universities, political capital), Shanghai (business and finance, cosmopolitan), Chengdu (growing tech scene, lower cost), Guangzhou (commercial hub, close to Hong Kong). Globlearn Education recommends cities based on your program, budget, and lifestyle preferences.",
      },
      {
        q: "Can I work while studying in China?",
        a: "International students on X1 visas have limited legal work rights in China. On-campus part-time work (research assistants, language tutoring) is generally permitted. Off-campus work requires additional permits and is restricted. Most students rely on scholarship stipends for living expenses — CSC stipends are designed to cover basic costs.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">FAQ</p>
          <h1 className="text-4xl font-black text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-white/70 text-lg">
            Everything you need to know about studying in China with Globlearn Education.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14">
        {FAQ_CATEGORIES.map((cat) => (
          <div key={cat.title} className="mb-12">
            <h2 className="text-lg font-black text-[#1B3A6B] mb-5 pb-3 border-b border-gray-200">
              {cat.title}
            </h2>
            <div className="space-y-3 mb-2">
              {cat.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 group"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none gap-4">
                    <span className="font-semibold text-[#1B3A6B] text-sm">{faq.q}</span>
                    <span className="text-gray-400 flex-shrink-0 text-lg leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
            <WhatsAppNudge
              message="Hi! 👋 I have a question that wasn't in the FAQ. Can you help me with studying in China?"
              label="Didn't find your answer? Ask us on WhatsApp →"
            />
          </div>
        ))}
      </div>
    </>
  );
}
