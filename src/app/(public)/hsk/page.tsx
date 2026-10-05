"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronDown, Clock3, ExternalLink, FileText, Headphones, Lightbulb, Mic2, PenLine, ShieldCheck, Sparkles, Target, Trophy, Volume2 } from "lucide-react";

const levels = [
  {level:"HSK 1",tag:"Beginner",words:"150+",desc:"Understand and use very simple Chinese words and sentences for everyday needs."},
  {level:"HSK 2",tag:"Elementary",words:"300+",desc:"Handle simple, direct communication about familiar everyday topics."},
  {level:"HSK 3",tag:"Intermediate",words:"600+",desc:"Complete basic communication tasks in daily life, study and work."},
  {level:"HSK 4",tag:"Upper-intermediate",words:"1,200+",desc:"Communicate about more complex topics with more accurate expression."},
  {level:"HSK 5",tag:"Advanced",words:"2,500+",desc:"Discuss abstract or professional topics and handle a wide range of tasks."},
  {level:"HSK 6",tag:"Advanced+",words:"5,000+",desc:"Use Chinese flexibly in social communication at a high level."},
];

const faqs = [
  ["What is HSK?","HSK (Hanyu Shuiping Kaoshi) is the standardized Chinese language proficiency test for non-native Chinese speakers. It is used for study, work and other academic or professional purposes."],
  ["What is HSK 3.0?","HSK 3.0 is the upgraded Chinese proficiency assessment framework. It expands assessment beyond the traditional six written levels and places greater emphasis on integrated language ability."],
  ["Is HSK 3.0 already available?","The official Chinese Test Service Website has published HSK 3.0 materials, including the syllabus, sample questions, competency profile and a test experience. The official worldwide launch is announced for December 13, 2026."],
  ["How long is an HSK certificate valid?","For HSK scores, the official HSK pages state that scores are valid for two years from the test date. Always check the institution you are applying to for its own admission requirements."],
  ["Where do I register?","Registration is handled through the official Chinese Test Service Website. Use the Register for HSK button on this page to open the official registration portal."],
];

export default function HskPage() {
  const [open, setOpen] = useState<string | null>("What is HSK 3.0?");
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <section className="relative overflow-hidden bg-[#0A1628] text-white">
      <div className="absolute inset-0 hero-grid opacity-70"/>
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#29ABE2]/20 blur-3xl"/>
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#C8102E]/20 blur-3xl"/>
      <div className="relative mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10"><div className="mb-8 flex justify-end">
  <div className="text-right">
    <div className="h-7 overflow-hidden text-sm font-black text-white">
      <div className="hsk-brand-rotate">
        <div className="h-7 leading-7">Study in China</div>
        <div className="h-7 leading-7 text-[#FFD700]">GL Education</div>
      </div>
    </div>
    <div className="mt-1 text-xs font-semibold text-slate-300">Contact GL Education</div>
    <div className="h-5 overflow-hidden text-xs font-bold text-white">
      <div className="hsk-contact-rotate">
        <div className="h-5 leading-5">
          <a href="https://wa.me/8801901923239" target="_blank" rel="noreferrer" className="hover:text-[#29ABE2]">+8801901923239</a>
          <span className="mx-1.5 text-slate-500">•</span>
          <a href="https://wa.me/8615655031556" target="_blank" rel="noreferrer" className="hover:text-[#29ABE2]">+8615655031556</a>
        </div>
        <div className="h-5 leading-5 text-[#FFD700]">
          <a href="https://wa.me/8801901923239" target="_blank" rel="noreferrer" className="hover:text-white">Click here to Chat</a>
        </div>
      </div>
    </div>
  </div>
</div>
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold backdrop-blur"><Sparkles className="h-4 w-4 text-[#FFD700]"/> Chinese Proficiency Test Hub</span>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">HSK Exam Guide</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Everything you need to understand HSK, explore HSK 3.0, prepare smarter, and find the official registration route.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/hsk/practice" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3.5 font-bold shadow-lg shadow-red-950/30 transition hover:bg-[#A50D25]">Free Practice Test <ArrowRight className="h-4 w-4"/></Link>
            <a href="https://www.chinesetest.cn/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold backdrop-blur transition hover:bg-white/15">Register for HSK <ExternalLink className="h-4 w-4"/></a>
          </div>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {[["6","Traditional HSK levels"],["3.0","New framework"],["2 years","HSK score validity"]].map(([a,b])=><div key={b} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"><div className="text-2xl font-black">{a}</div><div className="mt-1 text-sm text-slate-400">{b}</div></div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-[#1B3A6B]"><BookOpen/></div><div><p className="text-sm font-bold uppercase tracking-wider text-[#C8102E]">Start here</p><h2 className="text-2xl font-black">What is HSK?</h2></div></div>
          <p className="mt-5 leading-8 text-slate-600">HSK is an international standardized test designed to assess the Chinese language proficiency of non-native speakers. It is commonly used as evidence of Chinese ability for education, scholarships and professional purposes.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[[Headphones,"Listening"],[BookOpen,"Reading"],[PenLine,"Writing"],[Mic2,"Speaking"]].map(([Icon,label])=>{const I=Icon; return <div key={String(label)} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"><I className="h-5 w-5 text-[#29ABE2]"/><span className="font-semibold">{String(label)}</span></div>})}
          </div>
        </div>
        <div className="rounded-3xl border border-[#29ABE2]/20 bg-gradient-to-br from-blue-50 to-white p-7 shadow-sm">
          <div className="flex items-center gap-2 text-[#1B3A6B]"><CalendarDays className="h-5 w-5"/><span className="font-bold">2026 HSK 3.0 update</span></div>
          <h3 className="mt-4 text-2xl font-black">Official launch: 13 December 2026</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">The official Chinese Test Service Website has announced a worldwide HSK 3.0 launch date. Registration details should be checked on the official portal.</p>
          <a href="https://www.chinesetest.cn/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-[#C8102E]">Check official updates <ArrowRight className="h-4 w-4"/></a>
        </div>
      </div>
    </section>

    <section id="hsk30" className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#1B3A6B] via-[#10284b] to-[#0A1628] p-7 text-white shadow-xl md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl"><span className="inline-flex rounded-full bg-[#FFD700] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A1628]">Featured</span><h2 className="mt-4 text-3xl font-black md:text-4xl">HSK 3.0 — New HSK</h2><p className="mt-4 leading-7 text-slate-300">Explore the upgraded framework, official syllabus, sample questions, competency profile and the official HSK 3.0 experience.</p></div>
            <div className="flex flex-wrap gap-2">
              {[
                ["Syllabus","https://www.chinesetest.cn/syllabus"],
                ["Sample questions","https://www.chinesetest.cn/"],
                ["Try HSK 3.0","https://m-hsk3demo-intl.chinesetest.cn/"]
              ].map(([t,u])=><a key={t} href={u} target="_blank" rel="noreferrer" className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15">{t}</a>)}
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[[Target,"Competency-based","Focus on what learners can understand and do with Chinese."],[FileText,"Official syllabus","Use the current official syllabus and sample resources as your source of truth."],[ShieldCheck,"Official information","Registration, dates and policy updates should always be verified with CTI."]].map(([Icon,title,desc])=>{const I=Icon; return <div key={String(title)} className="rounded-2xl border border-white/10 bg-white/5 p-5"><I className="h-5 w-5 text-[#29ABE2]"/><h3 className="mt-3 font-bold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{String(desc)}</p></div>})}
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <div className="flex items-end justify-between gap-5"><div><p className="text-sm font-black uppercase tracking-wider text-[#C8102E]">Traditional HSK</p><h2 className="mt-2 text-3xl font-black">Choose your level</h2></div><Link href="/hsk/practice" className="hidden items-center gap-2 font-bold text-[#1B3A6B] sm:flex">Practice now <ArrowRight className="h-4 w-4"/></Link></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((x,i)=><div key={x.level} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#29ABE2]/40 hover:shadow-md">
          <div className="flex items-start justify-between"><div><div className="text-2xl font-black text-[#1B3A6B]">{x.level}</div><span className="text-xs font-bold text-slate-500">{x.tag}</span></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#1B3A6B]">{x.words}</span></div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{x.desc}</p>
          <Link href="/hsk/practice" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#C8102E] opacity-80 group-hover:opacity-100">Practice this level <ArrowRight className="h-4 w-4"/></Link>
        </div>)}
      </div>
    </section>

    <section className="bg-slate-100 py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[[Clock3,"Exam format","Understand sections, question types, timing and scoring before test day."],[Trophy,"Scoring","Know how section scores combine into the total score."],[Lightbulb,"Preparation","Build vocabulary, listening, reading and writing skills with focused practice."],[Volume2,"Listening","Train your listening comprehension with repeated, distraction-free practice."]].map(([Icon,t,d])=><div key={String(t)} className="rounded-2xl border border-slate-200 bg-white p-6"><Icon className="h-6 w-6 text-[#C8102E]"/><h3 className="mt-4 font-black">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{d}</p></div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-4xl px-5 py-14 md:px-8">
      <div className="text-center"><p className="text-sm font-black uppercase tracking-wider text-[#C8102E]">FAQ</p><h2 className="mt-2 text-3xl font-black">Important HSK questions</h2></div>
      <div className="mt-7 space-y-3">{faqs.map(([q,a])=><div key={q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><button onClick={()=>setOpen(open===q?null:q)} className="flex w-full items-center justify-between gap-5 p-5 text-left font-bold"><span>{q}</span><ChevronDown className={`h-5 w-5 shrink-0 transition ${open===q?"rotate-180 text-[#C8102E]":""}`}/></button>{open===q&&<div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600">{a}</div>}</div>)}</div>
    </section>

    <section className="bg-[#C8102E] py-14 text-white">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
        <h2 className="text-3xl font-black md:text-4xl">Ready to test your Chinese?</h2><p className="mx-auto mt-3 max-w-2xl text-red-100">Start with our free practice area, save your progress, and review your answers at your own pace.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/hsk/practice" className="rounded-xl bg-white px-6 py-3.5 font-black text-[#C8102E]">Open Free Practice Test</Link><a href="https://www.chinesetest.cn/" target="_blank" rel="noreferrer" className="rounded-xl border border-white/30 px-6 py-3.5 font-black">Official Registration <ExternalLink className="ml-1 inline h-4 w-4"/></a></div>
      </div>
    </section>
  </div>;
}
