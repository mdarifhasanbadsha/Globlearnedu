"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Clock3,
  ExternalLink, GraduationCap, FlaskConical, Calculator, Atom, X, Sparkles,
  ShieldCheck, Globe2, Laptop2, BadgeCheck
} from "lucide-react";

const OFFICIAL = "https://csca.cn/home";
const OFFICIAL_REGISTER = "https://csca.cn/register";
const OFFICIAL_ABOUT = "https://csca.cn/about/examintro";
const ACADEMY_GUIDE = "https://csca.app/en/exam-guide";

const exams = [
  { date: "November 14–15, 2026", registration: "October 15–21, 2026", status: "Registration opens soon", highlight: true },
  { date: "December 19–20, 2026", registration: "Registration not yet open", status: "Upcoming" },
  { date: "January 23–24, 2027", registration: "Registration not yet open", status: "Upcoming" },
];

const subjects = [
  { icon: BookOpen, title: "Professional Chinese", meta: "90 min · 80 questions · Chinese", desc: "Chinese-language academic and professional communication assessment." },
  { icon: Globe2, title: "Science Chinese", meta: "90 min · 80 questions · Chinese", desc: "Chinese proficiency for science-oriented undergraduate study." },
  { icon: Calculator, title: "Mathematics", meta: "60 min · 48 questions · Chinese / English", desc: "Core quantitative foundation used across many undergraduate pathways." },
  { icon: Atom, title: "Physics", meta: "60 min · 48 questions · Chinese / English", desc: "Subject assessment for programmes where physics is required." },
  { icon: FlaskConical, title: "Chemistry", meta: "60 min · 48 questions · Chinese / English", desc: "Subject assessment for programmes where chemistry is required." },
];

const faqs = [
  ["What is CSCA?", "CSCA is a standardized academic-level test for international students planning undergraduate study in China. It is organized under the China Scholarship Council and is used by Chinese universities as an academic reference."],
  ["Which subjects should I take?", "Requirements depend on your target university, major and scholarship route. Mathematics is widely relevant; Professional Chinese, Science Chinese, Physics and Chemistry may be required or selected according to the programme."],
  ["Where do I register?", "Always use the official CSCA portal for real exam registration and check the latest announcement before paying any exam fee."],
  ["Is the GL Education course an official CSCA course?", "No. GL Education courses are independent preparation programmes designed to help students prepare for the CSCA. The official exam remains administered through the CSCA system."],
];

function CourseJoin({ course }: { course: string }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("CSCA Course Enrollment — " + course);
    const body = encodeURIComponent(
      "Hello GL Education,\n\nI want to join: " + course +
      "\n\nName: " + name + "\nPhone: " + phone + "\nEmail: " + email +
      "\n\nPlease send me the enrollment instructions.\n"
    );
    window.location.href = "mailto:info@globlearnedu.com?subject=" + subject + "&body=" + body;
    setSubmitted(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setSubmitted(false); }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B3A6B] px-5 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#102B52]"
      >
        Join Course <ArrowRight className="h-4 w-4" />
      </button>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#07101f]/70 px-4 py-6 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="relative w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close enrollment form" className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><X className="h-5 w-5" /></button>
            <span className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">Course enrollment</span>
            <h3 className="mt-2 pr-10 text-2xl font-black text-[#0A1628]">{course}</h3>
            {submitted ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
                Your email draft has been opened. Send it to complete your enrollment request. No WhatsApp or account sign-in is required.
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-[#1B3A6B]" />
                <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-[#1B3A6B]" />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-[#1B3A6B]" />
                <button type="submit" className="w-full rounded-xl bg-[#C8102E] px-5 py-3.5 font-black text-white hover:bg-[#a90d27]">Continue by Email</button>
                <a
                  href={"https://wa.me/8801901923239?text=" + encodeURIComponent("Hello GL Education, I want to join the CSCA course: " + course)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 font-black text-white hover:bg-[#1fb85a]"
                >
                  Join via WhatsApp
                </a>
                <p className="text-center text-xs leading-5 text-slate-500">Choose email or WhatsApp. No account sign-in is required.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function CscaPage() {
  const [popup, setPopup] = useState(true);

  useEffect(() => {
    const seen = window.localStorage.getItem("globlearn-csca-registration-popup-v1");
    if (seen) setPopup(false);
  }, []);

  const dismissPopup = () => {
    setPopup(false);
    window.localStorage.setItem("globlearn-csca-registration-popup-v1", "1");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-[#0A1628]">
      {popup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#07101f]/70 px-4 py-6 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="csca-alert-title" className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <button onClick={dismissPopup} aria-label="Close CSCA registration reminder" className="absolute right-4 top-4 z-10 rounded-full border-2 border-white bg-[#1B3A6B] p-2.5 text-white shadow-lg transition hover:scale-105">
              <X className="h-6 w-6" />
            </button>
            <div className="bg-[#1B3A6B] px-7 py-7 text-white md:px-9">
              <div className="flex items-center gap-3 text-[#FFD700]"><CalendarDays className="h-6 w-6" /><span className="text-xs font-black uppercase tracking-[.18em]">Latest official update</span></div>
              <h2 id="csca-alert-title" className="mt-3 pr-12 text-3xl font-black md:text-4xl">CSCA registration reminder</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">The next currently listed CSCA examination is November 14–15, 2026.</p>
            </div>
            <div className="space-y-6 px-7 py-7 md:px-9">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-bold text-slate-500">Next exam</p>
                  <p className="mt-1 text-2xl font-black">November 14–15, 2026</p>
                </div>
                <div className="rounded-2xl border border-[#C8102E]/20 bg-red-50 p-5">
                  <p className="text-sm font-bold text-[#C8102E]">Registration period</p>
                  <p className="mt-1 text-xl font-black">October 15–21, 2026</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">Beijing Time (UTC+8)</p>
                </div>
              </div>
              <div className="rounded-2xl border border-[#29ABE2]/20 bg-blue-50 p-5">
                <div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#1B3A6B]" /><p className="text-sm leading-6 text-slate-700">Registration for this sitting opens on October 15. Check the official portal for the exact current registration workflow and any updates before submitting.</p></div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={OFFICIAL_REGISTER} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1B3A6B] px-5 py-3.5 font-black text-white">Register at csca.cn <ExternalLink className="h-4 w-4" /></a>
                <button onClick={() => { dismissPopup(); setTimeout(() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" }), 50); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3.5 font-black text-[#1B3A6B]">View CSCA courses</button>
              </div>
              <p className="text-xs leading-5 text-slate-500">Official schedule source: CSCA. GL Education does not administer the examination.</p>
            </div>
          </div>
        </div>
      )}

      <section className="bg-[#0A1628] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div className="flex items-center gap-2 text-sm font-black"><span className="rounded-lg bg-[#C8102E] px-2 py-1">CSCA</span><span className="text-slate-300">China undergraduate entrance academic-level preparation</span></div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-300"><span>Study in China</span><span className="text-[#FFD700]">GL Education</span></div>
          </div>
          <div className="grid gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#FFD700]"><Sparkles className="h-4 w-4" /> CSCA 2026–2027</span>
              <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">CSCA Exam Guide & Free Course Opportunities</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">Understand the CSCA, follow the latest official examination schedule, and prepare with GL Education courses in Mathematics, Physics, Chemistry and core CSCA subjects.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={OFFICIAL_REGISTER} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3.5 font-black text-white">Official CSCA Registration <ExternalLink className="h-4 w-4" /></a>
                <a href="#courses" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-black text-[#0A1628]">Explore Free Courses <ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-7">
              <div className="flex items-center gap-3"><CalendarDays className="h-6 w-6 text-[#29ABE2]" /><b>Next official sitting</b></div>
              <div className="mt-6 text-4xl font-black">Nov 14–15</div>
              <p className="mt-1 text-slate-400">2026 · Registration Oct 15–21</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/5 p-4 text-center"><b className="block text-xl">90</b><span className="text-[11px] text-slate-400">min Chinese</span></div>
                <div className="rounded-2xl bg-white/5 p-4 text-center"><b className="block text-xl">60</b><span className="text-[11px] text-slate-400">min subjects</span></div>
                <div className="rounded-2xl bg-white/5 p-4 text-center"><b className="block text-xl">5</b><span className="text-[11px] text-slate-400">subject areas</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 py-4 md:px-8">
          {[
            ["#overview","Overview"],["#subjects","Subjects"],["#schedule","2026–27 Schedule"],["#courses","CSCA Courses"],["#faq","FAQ"]
          ].map(([href,label]) => <a key={href} href={href} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200">{label}</a>)}
          <a href={ACADEMY_GUIDE} target="_blank" rel="noreferrer" className="rounded-full bg-[#1B3A6B] px-4 py-2 text-sm font-black text-white">Exam guide <ExternalLink className="ml-1 inline h-3.5 w-3.5" /></a>
        </div>
      </section>

      <section id="overview" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">Understand the exam</span>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">What is CSCA?</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">CSCA is a standardized academic-level test for international students planning undergraduate study in China. The official CSCA website describes it as an assessment of language and academic foundations, with scores serving as an important reference for university admission and scholarship evaluation.</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border bg-white p-5 shadow-sm"><GraduationCap className="text-[#C8102E]" /><b className="mt-4 block">Undergraduate focus</b><p className="mt-2 text-sm leading-6 text-slate-500">Designed around international students preparing for undergraduate study in China.</p></div>
              <div className="rounded-3xl border bg-white p-5 shadow-sm"><ShieldCheck className="text-[#1B3A6B]" /><b className="mt-4 block">Official pathway</b><p className="mt-2 text-sm leading-6 text-slate-500">Use the official portal for registration, exam announcements and results.</p></div>
              <div className="rounded-3xl border bg-white p-5 shadow-sm"><Laptop2 className="text-[#29ABE2]" /><b className="mt-4 block">Modern delivery</b><p className="mt-2 text-sm leading-6 text-slate-500">The official site describes home online testing alongside centralized test arrangements.</p></div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-[#F4F7FB] p-7">
            <h3 className="text-xl font-black">Current official fee reference</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">The official exam-introduction page currently lists:</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white p-4"><span className="font-bold">1 subject</span><b>RMB 450</b></div>
              <div className="flex items-center justify-between rounded-2xl bg-white p-4"><span className="font-bold">2 or more subjects</span><b>RMB 700</b></div>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Fees can change. Verify the amount shown in the official registration portal before payment.</p>
            <a href={OFFICIAL_ABOUT} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#1B3A6B]">Official exam information <ExternalLink className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section id="subjects" className="bg-[#0A1628] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <span className="text-xs font-black uppercase tracking-[.18em] text-[#FFD700]">Subject structure</span>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Know what you may need to prepare</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">The required combination depends on the target university, major and scholarship route. Confirm your exact requirements with your target institutions.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map(({icon:Icon,title,meta,desc}) => <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/[.07]"><Icon className="h-7 w-7 text-[#29ABE2]" /><h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-2 text-xs font-black uppercase tracking-wider text-[#FFD700]">{meta}</p><p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section id="schedule" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><span className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">Latest schedule</span><h2 className="mt-2 text-3xl font-black md:text-4xl">CSCA 2026–2027 examination dates</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600">These dates reflect the latest schedule currently displayed on the official CSCA website. Registration status can change, so the official portal remains the final reference.</p></div>
          <a href={OFFICIAL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-[#1B3A6B]">Check official schedule <ExternalLink className="h-4 w-4" /></a>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {exams.map((exam) => <div key={exam.date} className={"rounded-3xl border bg-white p-6 shadow-sm "+(exam.highlight?"border-[#C8102E] ring-2 ring-[#C8102E]/10":"border-slate-200")}><div className="flex items-center justify-between gap-3"><span className={"rounded-full px-3 py-1 text-xs font-black "+(exam.highlight?"bg-red-50 text-[#C8102E]":"bg-slate-100 text-slate-600")}>{exam.status}</span><CalendarDays className="h-5 w-5 text-slate-400"/></div><h3 className="mt-5 text-2xl font-black">{exam.date}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{exam.registration}</p>{exam.highlight && <a href={OFFICIAL_REGISTER} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#C8102E]">Register when open <ExternalLink className="h-4 w-4" /></a>}</div>)}
        </div>
      </section>

      <section id="courses" className="bg-white border-y">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="max-w-3xl"><span className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">GL Education</span><h2 className="mt-2 text-3xl font-black md:text-4xl">CSCA Courses</h2><p className="mt-3 leading-7 text-slate-600">Structured preparation for students targeting Chinese undergraduate admission. Join options below go to the GL Education contact flow — no WhatsApp requirement.</p></div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-[2rem] border-2 border-[#C8102E] bg-[#FFF7F8] p-7 shadow-sm">
              <div className="absolute right-5 top-5 rounded-full bg-[#C8102E] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">Ongoing</div>
              <span className="text-xs font-black uppercase tracking-[.16em] text-[#C8102E]">Live CSCA preparation</span>
              <h3 className="mt-3 pr-24 text-2xl font-black">CSCA Complete Preparation Course</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Started October 4, 2026 · Ongoing. A structured course for students preparing for CSCA and undergraduate admission in China.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4"><span className="text-xs font-bold text-slate-500">Course fee</span><div className="mt-1"><span className="text-lg font-bold text-slate-400 line-through">৳10,000</span> <span className="ml-1 text-2xl font-black text-[#C8102E]">FREE</span></div><span className="text-xs font-bold text-emerald-600">৳0 BDT</span></div>
                <div className="rounded-2xl bg-white p-4"><span className="text-xs font-bold text-slate-500">Start date</span><div className="mt-1 text-lg font-black">October 4, 2026</div><span className="text-xs font-bold text-emerald-600">Ongoing</span></div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No WhatsApp required to join</div>
              <div className="mt-5"><CourseJoin course="CSCA Complete Preparation Course — Ongoing October 4, 2026" /></div>
            </article>

            <article className="relative overflow-hidden rounded-[2rem] border border-[#1B3A6B]/20 bg-[#F5F8FD] p-7 shadow-sm">
              <div className="absolute right-5 top-5 rounded-full bg-[#1B3A6B] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">Next batch</div>
              <span className="text-xs font-black uppercase tracking-[.16em] text-[#1B3A6B]">Upcoming</span>
              <h3 className="mt-3 pr-24 text-2xl font-black">CSCA Complete Preparation Course</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Next course starts January 1, 2027. Reserve your place early for the next preparation cycle.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4"><span className="text-xs font-bold text-slate-500">Course fee</span><div className="mt-1"><span className="text-lg font-bold text-slate-400 line-through">৳10,000</span> <span className="ml-1 text-2xl font-black text-[#1B3A6B]">FREE</span></div><span className="text-xs font-bold text-emerald-600">৳0 BDT</span></div>
                <div className="rounded-2xl bg-white p-4"><span className="text-xs font-bold text-slate-500">Starts</span><div className="mt-1 text-lg font-black">January 1, 2027</div><span className="text-xs font-bold text-[#1B3A6B]">Upcoming</span></div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-600"><BadgeCheck className="h-4 w-4 text-[#29ABE2]" /> Free enrollment offer</div>
              <div className="mt-5"><CourseJoin course="CSCA Complete Preparation Course — January 1, 2027 Batch" /></div>
            </article>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4"><div><h3 className="text-2xl font-black">CSCA Master Courses</h3><p className="mt-2 text-sm text-slate-600">Focused subject preparation for students who want deeper practice in one core subject.</p></div></div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["CSCA Mathematics Master Course","Mathematics","48-question subject format · bilingual preparation","Build accuracy, speed and exam technique."],
                ["CSCA Physics Master Course","Physics","48-question subject format · bilingual preparation","Strengthen concepts, formulas and timed problem solving."],
                ["CSCA Chemistry Master Course","Chemistry","48-question subject format · bilingual preparation","Build reaction, calculation and concept confidence."]
              ].map(([title,tag,meta,desc]) => <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"><div className="flex items-center justify-between"><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#C8102E]">{tag}</span><ChevronRight className="h-5 w-5 text-slate-400" /></div><h4 className="mt-5 text-xl font-black">{title}</h4><p className="mt-2 text-xs font-black uppercase tracking-wider text-[#1B3A6B]">{meta}</p><p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p><div className="mt-5"><CourseJoin course={title} /></div></article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="max-w-3xl"><span className="text-xs font-black uppercase tracking-[.18em] text-[#C8102E]">FAQ</span><h2 className="mt-2 text-3xl font-black">CSCA questions students ask</h2></div>
        <div className="mt-7 space-y-3">{faqs.map(([q,a]) => <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-black">{q}<ChevronRight className="h-5 w-5 transition group-open:rotate-90" /></summary><p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">{a}</p></details>)}</div>
      </section>

      <section className="bg-[#0A1628] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center md:px-8">
          <Sparkles className="mx-auto h-9 w-9 text-[#FFD700]" />
          <h2 className="mt-4 text-3xl font-black">Start preparing for CSCA</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">Check the official exam schedule, then choose the GL Education preparation path that fits your target subjects.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={OFFICIAL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-black text-[#0A1628]">Visit CSCA official website <ExternalLink className="h-4 w-4" /></a>
            <a href="#courses" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3.5 font-black text-white">View courses <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
