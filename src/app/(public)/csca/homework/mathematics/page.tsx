"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Calculator } from "lucide-react";

export default function MathematicsAssignments(){
  const assignments=Array.from({length:20},(_,i)=>i+1);
  return <main className="min-h-screen bg-slate-50 text-[#0A1628]">
    <section className="bg-gradient-to-br from-[#071A35] via-[#103B5C] to-[#1B3A6B] text-white">
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <Link href="/csca/homework" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white">← Homework</Link>
        <div className="mt-7 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10"><Calculator className="h-7 w-7 text-[#FFD700]"/></div><div><span className="text-xs font-black uppercase tracking-[.18em] text-[#FFD700]">CSCA Mathematics</span><h1 className="mt-1 text-3xl font-black md:text-5xl">Homework & Assignments</h1></div></div>
        <p className="mt-5 max-w-2xl leading-7 text-slate-300">20 assignment slots are prepared for the course. New assignments will be released after the relevant classes.</p>
      </div>
    </section>
    <section className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assignments.map(n=>{
          const available=n===1;
          return <div key={n} className={"rounded-3xl border bg-white p-5 shadow-sm "+(available?"border-[#C8102E]/30":"border-slate-200")}>
            <div className="flex items-center justify-between"><span className={"flex h-10 w-10 items-center justify-center rounded-full text-sm font-black "+(available?"bg-red-50 text-[#C8102E]":"bg-slate-100 text-slate-400")}>{n}</span>{available?<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5"/> Available</span>:<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500"><LockKeyhole className="h-3.5 w-3.5"/> Not released</span>}</div>
            <h2 className="mt-5 text-lg font-black">Homework/Assignment {n}</h2>
            <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{available?"Straight Line — Class 1 basic concepts, definitions and formulas.":"Will be released after the corresponding class."}</p>
            {available?<Link href="/csca/homework/mathematics/1" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-4 py-3 font-black text-white hover:bg-[#a90d27]">Answer Now <ArrowRight className="h-4 w-4"/></Link>:<button disabled className="mt-5 w-full rounded-xl bg-slate-100 px-4 py-3 font-black text-slate-400">Locked</button>}
          </div>
        })}
      </div>
    </section>
  </main>
}
