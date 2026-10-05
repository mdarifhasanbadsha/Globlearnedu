"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Headphones, RotateCcw, Save, Volume2, XCircle } from "lucide-react";

type Question={id:number;section:"Listening"|"Reading";prompt:string;options:string[];answer:number;audio?:string;explanation:string};
const questions:Question[]=[
{id:1,section:"Listening",prompt:"听：你好吗？",options:["你好吗？","你叫什么？","你是哪国人？","你住在哪儿？"],answer:0,audio:"你好吗？",explanation:"“你好吗？” means “How are you?”"},
{id:2,section:"Listening",prompt:"听：今天星期几？",options:["星期一","星期三","星期五","星期日"],answer:1,audio:"今天星期三。",explanation:"The audio says 今天星期三 — Today is Wednesday."},
{id:3,section:"Listening",prompt:"听：我喜欢喝茶。",options:["He likes coffee.","She likes tea.","I like tea.","I like water."],answer:2,audio:"我喜欢喝茶。",explanation:"我 = I, 喜欢 = like, 喝茶 = drink tea."},
{id:4,section:"Reading",prompt:"我叫王明。我是学生。问：王明是什么？",options:["老师","学生","医生","经理"],answer:1,explanation:"The sentence says 王明 is a student."},
{id:5,section:"Reading",prompt:"今天很冷，请穿一件衣服。问：今天怎么样？",options:["很热","很好","很冷","很忙"],answer:2,explanation:"很冷 means very cold."},
{id:6,section:"Reading",prompt:"我每天早上七点吃早饭。问：我几点吃早饭？",options:["六点","七点","八点","九点"],answer:1,explanation:"每天早上七点 = every morning at seven o'clock."},
{id:7,section:"Reading",prompt:"这本书是我的，那本书是他的。问：那本书是谁的？",options:["我的","你的","他的","老师的"],answer:2,explanation:"他的 means his."},
{id:8,section:"Reading",prompt:"小李喜欢中国菜，但是不喜欢辣的菜。问：小李喜欢什么？",options:["辣的菜","中国菜","日本菜","甜的菜"],answer:1,explanation:"小李喜欢中国菜."},
{id:9,section:"Listening",prompt:"听：明天我们八点上课。问：什么时候上课？",options:["七点","八点","九点","十点"],answer:1,audio:"明天我们八点上课。",explanation:"八点 = eight o'clock."},
{id:10,section:"Reading",prompt:"请把“书”放在桌子上。问：书应该放在哪里？",options:["椅子上","床上","桌子上","门上"],answer:2,explanation:"桌子上 means on the table."},
];

const STORAGE="globlearn-hsk-practice-v1";
function speak(text:string){if(typeof window!=="undefined"&&"speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="zh-CN";u.rate=.82;window.speechSynthesis.speak(u)}}

export default function HskPracticePage(){
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [bookmarks,setBookmarks]=useState<number[]>([]);
 const [current,setCurrent]=useState(0);
 const [started,setStarted]=useState(false);
 const [finished,setFinished]=useState(false);
 const [saved,setSaved]=useState(false);
 const [seconds,setSeconds]=useState(30*60);
 useEffect(()=>{try{const raw=localStorage.getItem(STORAGE);if(raw){const x=JSON.parse(raw);setAnswers(x.answers||{});setBookmarks(x.bookmarks||[]);setCurrent(x.current||0);setStarted(Boolean(x.started));setSeconds(x.seconds||1800)}}catch{}},[]);
 useEffect(()=>{if(!started||finished)return;const t=setInterval(()=>setSeconds(s=>{if(s<=1){clearInterval(t);setFinished(true);return 0}return s-1}),1000);return()=>clearInterval(t)},[started,finished]);
 useEffect(()=>{if(started)try{localStorage.setItem(STORAGE,JSON.stringify({answers,bookmarks,current,started,seconds}))}catch{}},[answers,bookmarks,current,started,seconds]);
 const q=questions[current];
 const score=useMemo(()=>questions.reduce((n,x)=>n+(answers[x.id]===x.answer?1:0),0),[answers]);
 const mins=String(Math.floor(seconds/60)).padStart(2,"0"), secs=String(seconds%60).padStart(2,"0");
 const choose=(i:number)=>setAnswers(a=>({...a,[q.id]:i}));
 const reset=()=>{setAnswers({});setBookmarks([]);setCurrent(0);setStarted(false);setFinished(false);setSaved(false);setSeconds(1800);localStorage.removeItem(STORAGE)};
 if(!started)return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-5xl px-5 py-12 md:px-8"><Link href="/hsk" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B3A6B]"><ArrowLeft className="h-4 w-4"/> Back to HSK Guide</Link><div className="mt-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"><div className="bg-[#0A1628] p-8 text-white md:p-12"><span className="inline-flex rounded-full bg-[#C8102E] px-3 py-1 text-xs font-black">FREE PRACTICE</span><h1 className="mt-4 text-4xl font-black">HSK Practice Test</h1><p className="mt-3 max-w-2xl text-slate-300">A lightweight practice experience for listening and reading. Your progress is saved automatically in this browser.</p></div><div className="grid gap-4 p-8 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-5"><Headphones className="text-[#29ABE2]"/><b className="mt-3 block">Listening</b><span className="text-sm text-slate-500">Audio practice</span></div><div className="rounded-2xl bg-slate-50 p-5"><CheckCircle2 className="text-[#29ABE2]"/><b className="mt-3 block">Auto score</b><span className="text-sm text-slate-500">Instant results</span></div><div className="rounded-2xl bg-slate-50 p-5"><Save className="text-[#29ABE2]"/><b className="mt-3 block">Auto-save</b><span className="text-sm text-slate-500">Continue later</span></div></div><div className="border-t p-8"><button onClick={()=>setStarted(true)} className="w-full rounded-xl bg-[#C8102E] px-5 py-4 font-black text-white hover:bg-[#A50D25]">Start practice test</button></div></div></div></main>;
 if(finished)return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-4xl px-5 py-12 md:px-8"><div className="rounded-[2rem] border bg-white p-8 text-center shadow-sm md:p-12"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"><TrophyIcon/></div><p className="mt-5 text-sm font-black uppercase tracking-wider text-[#C8102E]">Practice complete</p><h1 className="mt-2 text-4xl font-black">{score}/{questions.length}</h1><p className="mt-2 text-slate-500">{Math.round(score/questions.length*100)}% correct</p><div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><b>{questions.filter(x=>x.section==="Listening").filter(x=>answers[x.id]===x.answer).length}</b><span className="block text-xs text-slate-500">Listening correct</span></div><div className="rounded-xl bg-slate-50 p-4"><b>{questions.filter(x=>x.section==="Reading").filter(x=>answers[x.id]===x.answer).length}</b><span className="block text-xs text-slate-500">Reading correct</span></div><div className="rounded-xl bg-slate-50 p-4"><b>{questions.filter(x=>answers[x.id]!==undefined).length}</b><span className="block text-xs text-slate-500">Answered</span></div></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={()=>setFinished(false)} className="flex-1 rounded-xl border px-5 py-3 font-bold">Review answers</button><button onClick={reset} className="flex-1 rounded-xl bg-[#C8102E] px-5 py-3 font-bold text-white">Try again</button></div></div></div></main>;
 return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-6xl px-4 py-5 md:px-8 md:py-8"><div className="mb-8 flex justify-end">
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
</div><style jsx>{`
.hsk-brand-rotate{animation:hskBrandRotate 6s ease-in-out infinite}
.hsk-contact-rotate{animation:hskContactRotate 6s ease-in-out infinite}
@keyframes hskContactRotate{
0%,43%{transform:translateY(0);opacity:1}
50%{transform:translateY(-5px);opacity:.15}
57%,93%{transform:translateY(-20px);opacity:1}
100%{transform:translateY(-25px);opacity:0}
}
@keyframes hskBrandRotate{
0%,43%{transform:translateY(0);opacity:1}
50%{transform:translateY(-7px);opacity:.15}
57%,93%{transform:translateY(-28px);opacity:1}
100%{transform:translateY(-35px);opacity:0}
}
`}</style>
  <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/hsk" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B3A6B]"><ArrowLeft className="h-4 w-4"/> HSK Guide</Link><div className="flex items-center gap-3"><span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-black shadow-sm"><Clock3 className="h-4 w-4 text-[#C8102E]"/>{mins}:{secs}</span><button onClick={()=>setSaved(true)} className="rounded-xl border bg-white px-3 py-2 text-sm font-bold">{saved?"Saved":"Save now"}</button></div></div>
  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
   <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-8"><div className="flex items-center justify-between"><div><span className="text-xs font-black uppercase tracking-wider text-[#C8102E]">{q.section}</span><h1 className="mt-1 text-xl font-black">Question {current+1} of {questions.length}</h1></div><button onClick={()=>setBookmarks(b=>b.includes(q.id)?b.filter(x=>x!==q.id):[...b,q.id])} className={`rounded-xl p-2.5 ${bookmarks.includes(q.id)?"bg-amber-50 text-amber-600":"bg-slate-50 text-slate-500"}`}><Bookmark className="h-5 w-5"/></button></div>
    <div className="mt-8 rounded-2xl bg-slate-50 p-6"><div className="flex items-start justify-between gap-4"><p className="text-lg font-bold leading-8">{q.prompt}</p>{q.audio&&<button onClick={()=>speak(q.audio!)} title="Play Chinese audio" className="shrink-0 rounded-xl bg-white p-3 text-[#1B3A6B] shadow-sm"><Volume2 className="h-5 w-5"/></button>}</div></div>
    <div className="mt-5 space-y-3">{q.options.map((o,i)=><button key={o} onClick={()=>choose(i)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${answers[q.id]===i?"border-[#29ABE2] bg-blue-50":"border-slate-200 bg-white hover:bg-slate-50"}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${answers[q.id]===i?"bg-[#1B3A6B] text-white":"bg-slate-100"}`}>{String.fromCharCode(65+i)}</span><span className="font-medium">{o}</span></button>)}</div>
    <div className="mt-8 flex items-center justify-between gap-3"><button disabled={current===0} onClick={()=>setCurrent(c=>Math.max(0,c-1))} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-bold disabled:opacity-40"><ChevronLeft className="h-4 w-4"/> Previous</button>{current===questions.length-1?<button onClick={()=>setFinished(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 font-black text-white">Finish <CheckCircle2 className="h-4 w-4"/></button>:<button onClick={()=>setCurrent(c=>c+1)} className="inline-flex items-center gap-2 rounded-xl bg-[#1B3A6B] px-5 py-3 font-black text-white">Next <ChevronRight className="h-4 w-4"/></button>}</div>
   </section>
   <aside className="rounded-3xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><b>Questions</b><span className="text-xs text-slate-500">{Object.keys(answers).length}/{questions.length}</span></div><div className="mt-4 grid grid-cols-5 gap-2">{questions.map((x,i)=><button key={x.id} onClick={()=>setCurrent(i)} className={`relative h-10 rounded-lg text-sm font-black ${i===current?"bg-[#1B3A6B] text-white":answers[x.id]!==undefined?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-600"}`}>{i+1}{bookmarks.includes(x.id)&&<span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500"/>}</button>)}</div><div className="mt-7 border-t pt-5 text-sm text-slate-500"><p><span className="font-bold text-slate-700">Auto-save:</span> answers and position are stored locally as you practice.</p><button onClick={reset} className="mt-4 inline-flex items-center gap-2 text-[#C8102E] font-bold"><RotateCcw className="h-4 w-4"/> Reset test</button></div></aside>
  </div>
  {saved&&<div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#0A1628] px-5 py-2.5 text-sm font-bold text-white shadow-xl">Progress saved on this device</div>}
 </div></main>;
}
function TrophyIcon(){return <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/></svg>}
