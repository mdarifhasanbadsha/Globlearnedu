"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Calculator, Atom, FlaskConical, ArrowRight, ClipboardCheck, ShieldCheck,
  Clock3, CheckCircle2, MonitorCheck, FileQuestion, BookOpen, Target,
  GraduationCap, Info, Sparkles, ExternalLink, ChevronLeft, ChevronRight
} from "lucide-react";
import { MOCK_SUBJECTS, RELEASED_MOCKS } from "@/lib/csca/mocktest-public";

const faqs = [
  {
    q: "What is the CSCA exam?",
    a: "CSCA stands for China Scholastic Competency Assessment. It is an academic assessment used in pathways for international students applying to undergraduate study in China. Check the official CSCA website and each target university for current requirements."
  },
  {
    q: "Where can I take a free CSCA mock test online?",
    a: "GL Education is building a 20-test series for each of Mathematics, Physics and Chemistry. Released tests can be started from the subject pages; availability updates automatically as complete question sets are added and checked. Each released core-subject paper uses 48 questions, a 60-minute limit and a result out of 100 marks."
  },
  {
    q: "Is this an official CSCA mock test or a real past paper?",
    a: "No. The released Mathematics mock tests are original practice papers prepared for this collection. It is not an official CSCA paper, a past paper released by the exam organiser, or endorsed by the China Scholarship Council. It is designed for independent exam-style practice."
  },
  {
    q: "How many questions and how much time are in Mathematics Mock Test 1?",
    a: "Each released GL Education Mathematics practice paper contains 48 single-answer multiple-choice questions, a 60-minute timer and a maximum score of 100 marks. Always confirm the current official format and requirements on csca.cn."
  },
  {
    q: "Are the CSCA practice questions free?",
    a: "The released GL Education mock test is free to attempt. You will be asked to enter your name, phone number and email address before starting so that the attempt can be recorded and your result can be sent to you."
  },
  {
    q: "Which CSCA subjects can I practise here?",
    a: "This page lists a planned series of 20 mock tests each for Mathematics, Physics and Chemistry. The availability count on each subject page shows which complete sets can be started now. New sets appear when their full question papers and answer keys are added and validated."
  },
  {
    q: "Can I take the CSCA Mathematics mock test on my phone?",
    a: "The pages use a responsive layout, but a timed 48-question test is easier to navigate on a larger screen. You can use a modern phone, tablet or computer browser. Avoid switching tabs during the test because departures from the exam screen are recorded by this practice simulation."
  },
  {
    q: "Do I get my CSCA mock test result immediately?",
    a: "After you submit a released mock test, the result page shows your score, percentage, test details and recorded screen departures. The result can be printed or saved as a PDF, and a result email is sent if the site's email service is configured and delivery succeeds."
  },
  {
    q: "Will this mock test result count as my official CSCA score?",
    a: "No. This is a GL Education practice result only. It cannot replace an official CSCA registration, test sitting, transcript or score report."
  },
  {
    q: "Are these official CSCA exam questions?",
    a: "No. The released Mathematics mock tests are original practice papers for this collection. It is written to support preparation and should not be represented as a leaked, official or recalled CSCA paper."
  },
  {
    q: "How should I prepare with a CSCA practice test?",
    a: "Take the mock under the stated time limit, answer independently, submit once you have reviewed your choices, then revisit the topics you found difficult. Use official syllabus and university requirement information alongside practice."
  },
  {
    q: "Do I need to register on the official CSCA website to use this practice test?",
    a: "The GL Education practice page is separate from official registration. You do not register for the official exam here. Use csca.cn for official exam announcements, registration and exam-related information."
  },
  {
    q: "Can I retake a CSCA mock test?",
    a: "The site uses your 11-digit phone number to find earlier attempts. Every submission is kept as a separate history entry, so you can review results from each attempt later."
  },
  {
    q: "What should I do if I need help with CSCA preparation or studying in China?",
    a: "Read the CSCA guide on GL Education, review your result, and contact the team through the Study in China WhatsApp link on the result page. For official exam rules, always rely on the official CSCA portal and your target university."
  }
];

const pageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://globlearnedu.com/csca/mocktest#webpage",
      "url": "https://globlearnedu.com/csca/mocktest",
      "name": "Free CSCA Mock Test Online | Mathematics, Physics & Chemistry",
      "description": "Explore GL Education’s 20-test CSCA-style practice series for Mathematics, Physics and Chemistry. Released tests include a timed 48-question paper, scoring and answer review; additional sets are published as complete question banks are added and validated.",
      "isPartOf": { "@type": "WebSite", "@id": "https://globlearnedu.com/#website", "url": "https://globlearnedu.com/", "name": "Globlearn Education" },
      "inLanguage": "en",
      "breadcrumb": { "@id": "https://globlearnedu.com/csca/mocktest#breadcrumb" },
      "about": { "@type": "Thing", "name": "China Scholastic Competency Assessment (CSCA)" }
    },
    {
      "@type": "WebApplication",
      "@id": "https://globlearnedu.com/csca/mocktest#application",
      "name": "GL Education Free CSCA Mock Test",
      "url": "https://globlearnedu.com/csca/mocktest",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any modern web browser",
      "description": "An independent CSCA-style practice platform planning 20 mock tests for each core subject. Released tests provide timed practice and results; this is not an official CSCA examination.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://globlearnedu.com/csca/mocktest#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://globlearnedu.com/" },
        { "@type": "ListItem", "position": 2, "name": "CSCA Exam Guide", "item": "https://globlearnedu.com/csca" },
        { "@type": "ListItem", "position": 3, "name": "Free CSCA Mock Tests", "item": "https://globlearnedu.com/csca/mocktest" }
      ]
    }
  ]
};

const commonSubjectStats = [["48", "Questions"], ["60", "Minutes"], ["100", "Marks"]];

const featureSlides = [
  {
    eyebrow: `MATHEMATICS · ${RELEASED_MOCKS.mathematics.length} OF 20 MOCK TESTS RELEASED`,
    title: "Official Mathematics syllabus",
    description: "The official syllabus covers Sets & Inequalities; Functions; Geometry & Algebra; and Probability & Statistics. Topics include set operations and quadratic/rational inequalities; function properties and elementary functions; arithmetic/geometric sequences and introductory calculus; analytic geometry, vectors, complex numbers, space geometry, probability, mean, variance and normal distribution.",
    stats: commonSubjectStats,
    detail: `Based on the official 2025 CSCA Mathematics syllabus. ${RELEASED_MOCKS.mathematics.length} of 20 planned Mathematics practice sets are currently released. All GL Education papers are independent practice resources, not official or past CSCA papers.`
  },
  {
    eyebrow: "PHYSICS · NO MOCK TEST RELEASED YET",
    title: "Official Physics syllabus",
    description: "The official syllabus covers Mechanics; Electromagnetism; Thermodynamics; Optics; and Modern Physics. Topics include kinematics, Newton’s laws, momentum, work and energy, circular motion, oscillations and waves; electrostatics, circuits, magnetic forces and induction; gas kinetic theory and the first law; reflection/refraction, interference/diffraction; photoelectric effect, atomic structure and nuclear physics.",
    stats: commonSubjectStats,
    detail: "Based on the official 2025 CSCA Physics syllabus. GL Education Physics mock tests are still being prepared; no test is available yet."
  },
  {
    eyebrow: "CHEMISTRY · NO MOCK TEST RELEASED YET",
    title: "Official Chemistry syllabus",
    description: "The official syllabus covers Basic Chemical Concepts & Calculations; Properties & Reactions of Substances; Chemical Theories & Laws; and Chemical Experiments & Applications. Topics include matter, equations, concentration, pH and ideal-gas calculations; inorganic/organic substances, redox and ionic reactions; atomic structure, periodic law, bonding, kinetics/equilibrium and electrolyte solutions; laboratory methods, gases, purification and industrial processes.",
    stats: commonSubjectStats,
    detail: "Based on the official 2025 CSCA Chemistry syllabus. GL Education Chemistry mock tests are still being prepared; no test is available yet."
  },
  {
    eyebrow: "HOW MOCK TESTS WORK",
    title: "Practise, score and learn",
    description: "Choose a subject and a released test, complete the timed single-answer questions, submit your paper, then use the result page to review your selected options and read explanations.",
    stats: [["Choose", "A subject"], ["Take", "A timed test"], ["Review", "Your answers"]],
    detail: "These are independent GL Education practice resources and do not register you for the official CSCA examination."
  }
];

export default function FreeMockTestsPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = featureSlides[activeSlide];

  // Auto-advance the carousel; manual controls reset the interval.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveSlide(current => (current + 1) % featureSlides.length);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [activeSlide]);
  const browseSubjects = () => document.getElementById("subjects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <main className="min-h-screen bg-slate-50 text-[#0A1628]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }} />
      <section className="overflow-hidden bg-gradient-to-br from-[#071A35] via-[#103B5C] to-[#1B3A6B] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="text-sm font-bold text-slate-300">
              <Link href="/csca" className="hover:text-white">CSCA Exam Guide</Link><span className="mx-2">/</span><span aria-current="page">Free Mock Tests</span>
            </nav>
          </div>
          <div className="mt-9 grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-[#FFD700]"><ClipboardCheck className="h-4 w-4" /> Free online CSCA exam practice · 2026–2027</span>
              <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Free CSCA Mock Test Online</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">Prepare for the China Scholastic Competency Assessment with a planned series of 20 mock tests for each of Mathematics, Physics and Chemistry. Released papers provide timed, exam-style practice, scoring and answer review. Availability updates as complete question sets are added and checked.</p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">Independent preparation resource by GL Education. This is not the official CSCA exam and the released paper is not an official or past CSCA paper.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={browseSubjects} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-4 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-800">Browse Exam Subjects <ArrowRight className="h-4 w-4" /></button>
                <Link href="/csca" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-black text-white transition hover:bg-white/10">CSCA Exam Guide <BookOpen className="h-4 w-4" /></Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
                {["Free CSCA practice questions","Timed exam simulation","Instant result report"].map(label => <span key={label} className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{label}</span>)}
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <div aria-hidden="true" className="absolute -inset-4 rounded-[2.5rem] bg-[#29ABE2]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#0A1628]/90 p-6 shadow-2xl md:p-7">
                <div className="flex items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-[.14em] text-[#FFD700]">Exam topics & details</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-slate-300">{String(activeSlide+1).padStart(2,"0")} / {String(featureSlides.length).padStart(2,"0")}</span></div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="mt-5 min-h-[245px]" aria-live="off">
                      <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#29ABE2]">{slide.eyebrow}</p>
                      <h2 className="mt-3 text-2xl font-black leading-tight">{slide.title}</h2>
                      <p className="mt-4 text-sm leading-7 text-slate-300">{slide.description}</p>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2">{slide.stats.map(([value,label])=><div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"><b className="block text-lg md:text-xl">{value}</b><span className="mt-1 block text-[10px] leading-4 text-slate-400">{label}</span></div>)}</div>
                    <p className="mt-4 min-h-[64px] rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-slate-300">{slide.detail} <a href="https://csca.cn/testprep/" target="_blank" rel="noreferrer" className="ml-1 inline-flex font-black text-[#29ABE2] underline underline-offset-2 hover:text-white">Official syllabus ↗</a></p>
                  </motion.div>
                </AnimatePresence>
                <button type="button" onClick={browseSubjects} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3.5 font-black text-white transition hover:bg-red-800">Browse Exam Subjects <ArrowRight className="h-4 w-4" /></button>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => setActiveSlide(v => (v - 1 + featureSlides.length) % featureSlides.length)} aria-label="Previous exam topic slide" className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/10"><ChevronLeft className="h-4 w-4" /> Previous</button>
                  <div className="flex items-center gap-2" aria-label="Choose slide">{featureSlides.map((item,i)=><button key={item.eyebrow} type="button" aria-label={"Go to slide "+(i+1)} aria-current={i===activeSlide?"step":undefined} onClick={()=>setActiveSlide(i)} className={"h-2.5 rounded-full transition-all "+(i===activeSlide?"w-7 bg-[#FFD700]":"w-2.5 bg-white/30 hover:bg-white/60")}/>)}</div>
                  <button type="button" onClick={() => setActiveSlide(v => (v + 1) % featureSlides.length)} aria-label="Next exam topic slide" className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/10">Next <ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="subjects" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-12 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">Choose a subject</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Free CSCA Mock Tests by Subject</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600">Select a category to see its 20 planned mock-test slots and check which practice sets are available. Only released tests can be started.</p></div>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-[#1B3A6B] md:self-auto"><ShieldCheck className="h-4 w-4" /> Independent practice simulation</div>
        </div>
        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {MOCK_SUBJECTS.map((s,i) => {
            const Icon = i === 0 ? Calculator : i === 1 ? Atom : FlaskConical;
            const count = RELEASED_MOCKS[s.slug].length;
            const available = count > 0;
            return <article key={s.slug} className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:p-7">
              <div className="flex items-start justify-between gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{background:s.accent+"14",color:s.accent}}><Icon className="h-7 w-7" /></div><span className={"rounded-full px-3 py-1 text-xs font-black "+(available?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-500")}>{count} / 20 released</span></div>
              <h3 className="mt-5 text-2xl font-black">{s.title} CSCA Practice</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{s.description}</p>
              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-500"><FileQuestion className="h-4 w-4" /> 20 planned mock-test slots</div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5"><span className="text-sm font-bold text-slate-500">{available?"Practice now":"Coming soon"}</span><Link href={"/csca/mocktest/"+s.slug} className="inline-flex items-center gap-2 font-black text-[#C8102E]">View tests <ArrowRight className="h-4 w-4" /></Link></div>
            </article>;
          })}
        </div>
        <div className="mt-7 rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-slate-700"><b>Practice rules:</b> Stay in the active exam tab and do not refresh or close the exam window. Leaving the tab or exiting full-screen may pause the timer and add to the screen-departure count. This browser-based practice monitor is not official proctoring.</div>
      </section>

      <section id="free-csca-mock-test" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_.85fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#C8102E]"><Sparkles className="h-4 w-4" /> Free CSCA practice</span>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">Free CSCA Practice Questions and Realistic Mock Exams</h2>
              <p className="mt-5 leading-8 text-slate-600">Searching for <strong>CSCA exam practice</strong>, <strong>free CSCA mock tests</strong> or <strong>CSCA Mathematics questions</strong>? Use this page to practise in a structured online exam environment before your official test. The aim is to help you work under time pressure, review your performance and become familiar with a computer-based test flow.</p>
              <p className="mt-4 leading-8 text-slate-600">Each released core-subject mock is designed around 48 single-answer questions, a 60-minute time limit and a 100-mark scoring scale. GL Education creates independent CSCA-style practice resources; they are not the real official exam or released past papers. Check the subject cards above for the live release count in the 20-test series.</p>
              <p className="mt-4 leading-8 text-slate-600">Each subject has 20 planned mock-test slots. A slot becomes available when its complete question set and answer key are added to the exam bank and pass basic structural checks. Until then, the page clearly marks it as not released; we do not invent questions or advertise incomplete exams as live.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/csca/mocktest/mathematics/1" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3.5 font-black text-white">Start Free CSCA Math Mock <ArrowRight className="h-4 w-4" /></Link><Link href="/csca" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3.5 font-black text-[#1B3A6B]">Read the CSCA Exam Guide</Link></div>
            </div>
            <aside className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 md:p-7">
              <h3 className="text-xl font-black">What you get from a released mock</h3>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                {[
                  ["Timed test flow","Answer one question at a time and move between questions."],
                  ["Instant scoring","See your result after you submit the answer sheet."],
                  ["Personal result report","Review your score, percentage, duration and test details."],
                  ["Share and save","Print or save the result as a PDF and send it to your teacher on WhatsApp."],
                  ["Email updates","Enter a valid email to receive the result message when email delivery is available."]
                ].map(([title,desc])=><li key={title} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><b className="text-[#0A1628]">{title}</b><p className="mt-1">{desc}</p></div></li>)}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">Understand your options</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Official CSCA Exam vs. GL Education Mock Test</h2><p className="mt-3 leading-7 text-slate-600">Both have different purposes. Use an independent practice test to prepare, and use the official CSCA portal for the actual examination process.</p></div>
        <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-[#0A1628] text-white"><tr><th scope="col" className="px-5 py-4 font-black">Feature</th><th scope="col" className="px-5 py-4 font-black">Official CSCA exam</th><th scope="col" className="px-5 py-4 font-black">GL Education practice</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-600">
          {[
            ["Purpose","Official assessment for the applicable admissions route","Independent exam-preparation practice"],
            ["Registration and score","Use official CSCA systems and rules","Practice record and result page only"],
            ["Available questions","Follow the official exam organiser's materials and policies",`${RELEASED_MOCKS.mathematics.length} Mathematics practice set(s) released; each subject is planned for 20 sets`],
            ["Cost to attempt this mock","Official exam fees may apply; check the official portal","The released practice mock is free"],
            ["Recognition","Official CSCA result, subject to official rules","Not an official score, transcript or admission result"]
          ].map(([feature,official,gl])=><tr key={feature}><th scope="row" className="px-5 py-4 align-top font-black text-[#0A1628]">{feature}</th><td className="px-5 py-4 align-top">{official}</td><td className="px-5 py-4 align-top">{gl}</td></tr>)}
          </tbody></table></div>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">For the latest official examination schedule, subject requirements and registration steps, verify information on <a className="font-bold text-[#1B3A6B] underline" href="https://csca.cn/" target="_blank" rel="noreferrer">csca.cn</a> and with your target university.</p>
      </section>

      <section className="bg-[#0A1628] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="flex items-center gap-3"><Target className="h-7 w-7 text-[#FFD700]" /><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#FFD700]">A simple study workflow</p><h2 className="mt-2 text-3xl font-black md:text-4xl">How to use a CSCA practice test</h2></div></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["01","Choose a released mock","Choose any available test shown on the subject page and read its instructions before starting. New tests appear as complete sets are released."],
              ["02","Practise under time pressure","Work independently, manage your time and avoid switching away from the test screen."],
              ["03","Review and plan","Check your result, note weak topics and return to your CSCA preparation materials."]
            ].map(([n,title,desc])=><article key={n} className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-3xl font-black text-[#FFD700]">{n}</span><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p></article>)}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/csca/mocktest/mathematics/1" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3.5 font-black text-white">Try the Free CSCA Mock Test <ArrowRight className="h-4 w-4" /></Link><a href="https://csca.cn/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 font-black text-white">Official CSCA Website <ExternalLink className="h-4 w-4" /></a></div>
        </div>
      </section>

      <section id="mocktest-learning-hub" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-16">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">CSCA practice guide</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Looking for a Real CSCA Mock Test or Free CSCA Practice?</h2>
            <p className="mt-5 leading-8 text-slate-600">If you searched for a “real CSCA mock test”, distinguish an independent practice paper from an official examination or officially released past paper. The tests on this page are published by GL Education for preparation. They can help you practise question handling and time management, but they are not official CSCA papers and their results are not official CSCA scores.</p>
            <p className="mt-4 leading-8 text-slate-600">The released Mathematics test uses a 48-question, 60-minute practice format and displays a result after submission. Other subjects appear as complete sets are released. Check the subject cards above for current availability rather than assuming every planned test can be started. A useful session includes the attempt, a review of errors and a plan to revise weak topics against the official syllabus.</p>
            <p className="mt-4 leading-8 text-slate-600">For official exam dates, registration, fees, subject requirements and published rules, visit the <a href="https://csca.cn/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#1B3A6B] underline">official CSCA website</a> and check the admission notice of your target university. Use the resources below to answer common questions and continue preparation.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {title:"Where Can I Take a CSCA Mock Test for Free?",desc:"Compare free independent practice with official exam services and learn what a useful mock should include.",href:"/blog/where-to-take-free-csca-mock-test"},
              {title:"Is a Free CSCA Mock Test Available Online?",desc:"Understand how to use a free test, interpret the result and verify official requirements.",href:"/blog/is-free-csca-mock-test-available-online"},
              {title:"What Is the CSCA Exam?",desc:"Get the broader admission context, subject guidance and preparation steps.",href:"/blog/what-is-csca-exam-2026-guide"},
              {title:"CSCA Syllabus and Subjects",desc:"Organise preparation around official subject documents and your target major.",href:"/blog/csca-exam-syllabus-and-subjects"},
              {title:"How to Prepare for CSCA Mathematics",desc:"Use a practical plan for topic revision, timed practice and error review.",href:"/blog/how-to-prepare-csca-mathematics"},
              {title:"GL Education CSCA Exam Guide",desc:"Read the overview, examine the subject areas and find independent course options.",href:"/csca"}
            ].map(item => (
              <article key={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                <h3 className="text-lg font-black text-[#0A1628]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
                <Link href={item.href} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#C8102E] underline underline-offset-4">Read the guide<ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            <b>Use trusted sources:</b> For exam rules and official information, read the <a href="https://csca.cn/about/examintro" target="_blank" rel="noopener noreferrer" className="font-bold text-[#1B3A6B] underline">CSCA exam introduction</a> and current notices on <a href="https://csca.cn/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#1B3A6B] underline">csca.cn</a>. A practice website should never be treated as the registration portal.
          </div>
        </div>
      </section>

      <section id="csca-faq" className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">Frequently asked questions</p><h2 className="mt-2 text-3xl font-black md:text-4xl">CSCA Mock Test and Exam Preparation FAQs</h2><p className="mt-3 leading-7 text-slate-600">Answers about the 20-test subject series, available CSCA practice questions, mock-test results and official exam requirements.</p></div>
        <div className="mt-7 grid gap-3 lg:grid-cols-2">{faqs.map(({q,a},i)=><details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-black leading-6"><span><span className="mr-2 text-xs text-[#C8102E]">{String(i+1).padStart(2,"0")}</span>{q}</span><ArrowRight className="mt-1 h-4 w-4 shrink-0 transition group-open:rotate-90" /></summary><p className="mt-4 text-sm leading-7 text-slate-600">{a}</p></details>)}</div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <h2 className="text-xl font-black">Explore related CSCA resources</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Continue with relevant preparation information or move to the official exam source.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              {label:"CSCA exam guide",href:"/csca"},
              {label:"Free CSCA mock test",href:"/csca/mocktest"},
              {label:"CSCA Mathematics questions",href:"/csca/mocktest/mathematics/1"},
              {label:"CSCA homework practice",href:"/csca/homework"},
              {label:"Study in China",href:"/programs/bachelors-degree"}
            ].map(item=><Link key={item.label} href={item.href} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-[#1B3A6B] transition hover:border-[#1B3A6B] hover:bg-blue-50">{item.label}</Link>)}
            <a href="https://csca.cn/" target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-[#1B3A6B] transition hover:border-[#1B3A6B] hover:bg-blue-50">Official CSCA Portal</a>
          </div>
        </div>
      </section>
    </main>
  );
}
