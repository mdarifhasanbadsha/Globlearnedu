"use client";

import Link from "next/link";
import { Calculator, Atom, FlaskConical, Languages, LockKeyhole, CheckCircle2, ArrowRight, BookOpenCheck } from "lucide-react";

const subjects = [
  { slug:"mathematics", title:"Mathematics", icon:Calculator, active:true, desc:"Definitions, formulas, coordinate geometry and CSCA-style basic practice." },
  { slug:"physics", title:"Physics", icon:Atom, active:false, desc:"Assignments will be released after the relevant classes." },
  { slug:"chemistry", title:"Chemistry", icon:FlaskConical, active:false, desc:"Assignments will be released after the relevant classes." },
  { slug:"chinese-language", title:"Chinese Language", icon:Languages, active:false, desc:"Language assignments will be released with the Chinese classes." },
];

export default function HomeworkPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-[#0A1628]">
      <section className="bg-gradient-to-br from-[#071A35] via-[#103B5C] to-[#1B3A6B] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-300"><Link href="/csca" className="hover:text-white">CSCA</Link><span>/</span><span className="text-white">Homework</span></div>
          <div className="mt-7 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#FFD700]"><BookOpenCheck className="h-4 w-4"/> GL Education Learning Hub</span>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">CSCA Homework & Assignments</h1>
            <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">Review each class through short, beginner-friendly assignments. Choose a subject below and complete the released homework to check your understanding.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {subjects.map(({slug,title:subject,icon:Icon,active,desc}) => (
            <div key={slug} className={"rounded-[2rem] border bg-white p-6 shadow-sm transition md:p-7 "+(active?"border-[#C8102E]/30":"border-slate-200")}>
              <div className="flex items-start justify-between gap-4">
                <div className={"flex h-14 w-14 items-center justify-center rounded-2xl "+(active?"bg-red-50 text-[#C8102E]":"bg-slate-100 text-slate-400")}><Icon className="h-7 w-7"/></div>
                {active ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Available</span> : <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500"><LockKeyhole className="h-3.5 w-3.5"/> Coming soon</span>}
              </div>
              <h2 className="mt-5 text-2xl font-black">{subject}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4"><span className="text-xs font-bold text-slate-500">Assignments</span><b className="mt-1 block text-xl">{active?"20":"—"}</b></div>
                <div className="rounded-2xl bg-slate-50 p-4"><span className="text-xs font-bold text-slate-500">Released</span><b className="mt-1 block text-xl">{active?"1 / 20":"0 / 20"}</b></div>
              </div>
              <Link href={active?"/csca/homework/mathematics":"#"} aria-disabled={!active} className={"mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black "+(active?"bg-[#C8102E] text-white hover:bg-[#a90d27]":"pointer-events-none bg-slate-100 text-slate-400")}>{active?"Open Mathematics Assignments":"Not released yet"}{active&&<ArrowRight className="h-4 w-4"/>}</Link>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] border border-[#1B3A6B]/15 bg-[#F4F8FC] p-6 md:p-8"><div className="flex gap-4"><CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-600"/><div><h3 className="text-xl font-black">How it works</h3><p className="mt-2 text-sm leading-7 text-slate-600">Only released assignments can be answered. Submit your name and phone number before starting. After submission, your score is shown immediately and the same assignment will take you back to your saved result instead of allowing another attempt.</p></div></div></div>
      </section>
    </main>
  );
}
