"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, MessageCircle, Trophy, AlertCircle } from "lucide-react";

const QUESTIONS = [
["A set of points forming a line with constant direction","A straight line has a constant direction/slope in a coordinate plane."],
["ax + by + c = 0","The standard form is ax + by + c = 0."],
["√[(x₂−x₁)² + (y₂−y₁)²]","The distance formula is d = √[(x₂−x₁)² + (y₂−y₁)²]."],
["Its steepness or rate of change","Slope describes how steeply y changes as x changes."],
["y = mx + c","Slope-intercept form is y = mx + c."],
["y − y₁ = m(x − x₁)","Point-slope form is y − y₁ = m(x − x₁)."],
["Coordinate geometry","Polar and Cartesian coordinate conversion is part of coordinate geometry."],
["A set of all points satisfying a given condition","A locus is the set of all points that satisfy a specified condition."],
["P = ((mx₂−nx₁)/(m−n), (my₂−ny₁)/(m−n))","This is the external section formula shown in Class 1."],
["Standard, slope, point-slope, two-point and intercept forms","These were the line-equation forms highlighted in Class 1."]
];

export default function HomeworkResultPage(){
  const params=useParams(); const [data,setData]=useState<any>(null); const [open,setOpen]=useState(false); const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch("/api/csca/homework?token="+encodeURIComponent(String(params.token||""))).then(r=>r.json()).then(setData).finally(()=>setLoading(false));},[params.token]);
  if(loading) return <main className="min-h-screen bg-slate-50 p-8 text-center">Loading result...</main>;
  if(!data?.submitted) return <main className="min-h-screen bg-slate-50 p-8 text-center"><h1 className="text-2xl font-black">Result not found</h1><Link className="mt-5 inline-block font-bold text-[#1B3A6B]" href="/csca/homework">Back to Homework</Link></main>;
  const score=data.score; const success=score>=7; const missed=score<4; const msg=success?"Congratulations! You have a strong basic understanding of today's class.":missed?"You may have missed the class. Please review Class 1 and visit GL Education's Facebook page for the recorded class.":"Please review the topic and strengthen the concepts before the next class.";
  const wa=encodeURIComponent("🎓 *GL Education — CSCA Homework Submission*\n\nHello GL Education! 👋\nI completed *Mathematics — Homework/Assignment 1*.\n\n👤 *Name:* "+data.name+"\n📱 *Phone:* "+data.phone+"\n🏆 *Score:* "+score+"/10\n\nThank you! — GL Education");
  return <main className="min-h-screen bg-slate-50 text-[#0A1628]"><section className="bg-[#0A1628] text-white"><div className="mx-auto max-w-4xl px-5 py-8"><Link href="/csca/homework" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300"><ArrowLeft className="h-4 w-4"/> Homework</Link><h1 className="mt-7 text-3xl font-black">Your Homework Result</h1></div></section><section className="mx-auto max-w-3xl px-5 py-10"><div className={"rounded-[2rem] border p-8 text-center "+(success?"border-emerald-200 bg-emerald-50":missed?"border-red-200 bg-red-50":"border-amber-200 bg-amber-50")}>{success?<Trophy className="mx-auto h-12 w-12 text-emerald-600"/>:<AlertCircle className="mx-auto h-12 w-12 text-amber-600"/>}<p className="mt-4 text-sm font-bold text-slate-500">Mathematics · Homework/Assignment 1</p><h2 className="mt-2 text-3xl font-black">{data.name}</h2><div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow"><div><b className="block text-4xl">{score}</b><span>/ 10</span></div></div><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-700">{msg}</p>{missed&&<a href="https://www.facebook.com/globlearneducation" target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-[#1B3A6B] px-5 py-3 font-black text-white">Visit GL Education Facebook Page</a>}</div><div className="mt-5 rounded-[2rem] border bg-white p-6"><p className="text-sm text-slate-500">Phone: <b>{data.phone}</b></p><a href={"https://wa.me/8801993295109?text="+wa} target="_blank" rel="noreferrer" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-4 font-black text-white"><MessageCircle className="h-5 w-5"/> Send Result to Teacher on WhatsApp</a><button onClick={()=>setOpen(!open)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3.5 font-black text-[#1B3A6B]"><Eye className="h-5 w-5"/> {open?"Hide Correct Answers":"See Correct Answers"}</button></div>{open&&<div className="mt-5 space-y-3">{QUESTIONS.map(([answer,explain],i)=><div key={i} className="rounded-2xl border bg-white p-5"><p className="text-xs font-black uppercase tracking-wider text-[#C8102E]">Question {i+1}</p><p className="mt-1 text-sm"><b>Correct answer:</b> {answer}</p><p className="mt-1 text-xs leading-5 text-slate-500">{explain}</p></div>)}</div>}</section></main>;
}
