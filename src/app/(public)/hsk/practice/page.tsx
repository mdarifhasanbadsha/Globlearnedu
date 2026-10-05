"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Headphones, RotateCcw, Save, Sparkles, Target, Volume2 } from "lucide-react";

type Mode="mock"|"vocabulary"|"general";
type Word={id:number;level:number;lesson:number;word:string;pinyin:string;meaning:string};
type Question={id:number;prompt:string;options:string[];answer:number;explanation:string;audio?:string};

const levels=[1,2,3,4,5,6,7,8,9];
const levelMeta:Record<number,{time:number;questions:number;skills:string;lessons:number}>={
1:{time:35,questions:40,skills:"Listening + Reading",lessons:12},
2:{time:50,questions:60,skills:"Listening + Reading",lessons:15},
3:{time:85,questions:80,skills:"Listening + Reading + Writing",lessons:20},
4:{time:100,questions:100,skills:"Listening + Reading + Writing",lessons:20},
5:{time:120,questions:100,skills:"Listening + Reading + Writing",lessons:24},
6:{time:135,questions:101,skills:"Listening + Reading + Writing",lessons:24},
7:{time:210,questions:98,skills:"Listening + Reading + Writing + Translation + Speaking",lessons:30},
8:{time:210,questions:98,skills:"Listening + Reading + Writing + Translation + Speaking",lessons:30},
9:{time:210,questions:98,skills:"Listening + Reading + Writing + Translation + Speaking",lessons:30}
};

const words:Word[]=[
[1,1,"我","wǒ","I; me"],[1,2,"你","nǐ","you"],[1,3,"好","hǎo","good; well"],[1,4,"学生","xuésheng","student"],[1,5,"老师","lǎoshī","teacher"],[1,6,"学习","xuéxí","to study"],[1,7,"中国","Zhōngguó","China"],[1,8,"朋友","péngyou","friend"],
[2,1,"工作","gōngzuò","work"],[2,2,"喜欢","xǐhuan","to like"],[2,3,"时间","shíjiān","time"],[2,4,"今天","jīntiān","today"],[2,5,"明天","míngtiān","tomorrow"],[2,6,"因为","yīnwèi","because"],[2,7,"所以","suǒyǐ","therefore"],[2,8,"一起","yìqǐ","together"],
[3,1,"决定","juédìng","to decide"],[3,2,"参加","cānjiā","to participate"],[3,3,"发现","fāxiàn","to discover"],[3,4,"需要","xūyào","to need"],[3,5,"提高","tígāo","to improve"],[3,6,"重要","zhòngyào","important"],[3,7,"办法","bànfǎ","method; solution"],[3,8,"环境","huánjìng","environment"],
[4,1,"经验","jīngyàn","experience"],[4,2,"影响","yǐngxiǎng","influence; effect"],[4,3,"负责","fùzé","to be responsible"],[4,4,"安排","ānpái","to arrange"],[4,5,"适合","shìhé","to suit"],[4,6,"交流","jiāoliú","to communicate"],[4,7,"解决","jiějué","to solve"],[4,8,"条件","tiáojiàn","condition"],
[5,1,"趋势","qūshì","trend"],[5,2,"资源","zīyuán","resource"],[5,3,"承担","chéngdān","to undertake"],[5,4,"效率","xiàolǜ","efficiency"],[5,5,"观点","guāndiǎn","viewpoint"],[5,6,"措施","cuòshī","measure"],[5,7,"改善","gǎishàn","to improve"],[5,8,"逐渐","zhújiàn","gradually"],
[6,1,"现象","xiànxiàng","phenomenon"],[6,2,"复杂","fùzá","complex"],[6,3,"本质","běnzhì","essence"],[6,4,"实施","shíshī","to implement"],[6,5,"促进","cùjìn","to promote"],[6,6,"领域","lǐngyù","field; domain"],[6,7,"判断","pànduàn","to judge"],[6,8,"可靠","kěkào","reliable"]
].map((x,i)=>({id:i+1,level:x[0] as number,lesson:x[1] as number,word:x[2] as string,pinyin:x[3] as string,meaning:x[4] as string}));

const sampleQuestions:Record<number,Question[]>={
1:[
{id:1,prompt:"听：你好吗？",options:["你好吗？","你是谁？","你去哪儿？","你叫什么？"],answer:0,explanation:"The sentence asks 你好吗？",audio:"你好吗？"},
{id:2,prompt:"我叫李明。我是学生。问：李明是什么？",options:["老师","学生","医生","经理"],answer:1,explanation:"我是学生 means I am a student."},
{id:3,prompt:"今天很冷。问：今天怎么样？",options:["很热","很冷","很忙","很好看"],answer:1,explanation:"很冷 means very cold."}
],
2:[
{id:1,prompt:"听：明天我们八点上课。问：什么时候上课？",options:["七点","八点","九点","十点"],answer:1,explanation:"八点 means eight o'clock.",audio:"明天我们八点上课。"},
{id:2,prompt:"因为下雨，所以我没有去公园。问：我为什么没有去公园？",options:["因为下雨","因为工作","因为很忙","因为生病"],answer:0,explanation:"因为下雨 explains the reason."},
{id:3,prompt:"我喜欢喝茶，但是弟弟喜欢喝咖啡。问：弟弟喜欢什么？",options:["茶","水","咖啡","牛奶"],answer:2,explanation:"弟弟喜欢喝咖啡."}
],
3:[
{id:1,prompt:"她决定参加学校的中文比赛。问：她决定做什么？",options:["参加比赛","学习英语","回家休息","买一本书"],answer:0,explanation:"决定参加比赛 means she decided to participate in the competition."},
{id:2,prompt:"提高中文水平需要长期练习。问：提高中文水平需要什么？",options:["运气","长期练习","旅行","更多朋友"],answer:1,explanation:"The passage states that long-term practice is needed."},
{id:3,prompt:"请把这份材料交给经理。问：应该把材料交给谁？",options:["老师","同学","经理","医生"],answer:2,explanation:"经理 is the person who should receive it."}
],
4:[
{id:1,prompt:"公司正在安排下个月的培训。问：公司正在做什么？",options:["安排培训","招聘老师","购买电脑","关闭办公室"],answer:0,explanation:"正在安排培训 means arranging training."},
{id:2,prompt:"这个办法比较适合目前的情况。问：这个办法怎么样？",options:["不可靠","不重要","比较适合","太复杂"],answer:2,explanation:"比较适合 means relatively suitable."},
{id:3,prompt:"良好的沟通有助于解决问题。问：良好的沟通有什么作用？",options:["增加成本","解决问题","改变天气","减少时间"],answer:1,explanation:"有助于解决问题 means helps solve problems."}
],
5:[
{id:1,prompt:"这项措施可以提高工作效率。问：这项措施有什么作用？",options:["提高效率","增加问题","减少资源","改变观点"],answer:0,explanation:"提高工作效率 is the stated effect."},
{id:2,prompt:"随着经验增加，他处理复杂问题的能力逐渐提高。问：他的能力有什么变化？",options:["逐渐提高","突然下降","没有变化","完全消失"],answer:0,explanation:"逐渐提高 means gradually improves."},
{id:3,prompt:"报告指出，合理利用资源是提高效率的重要条件。问：什么是提高效率的重要条件？",options:["增加人员","合理利用资源","减少交流","改变目标"],answer:1,explanation:"The sentence directly identifies reasonable resource use."}
],
6:[
{id:1,prompt:"这一现象反映了社会结构正在发生变化。问：这一现象说明什么？",options:["社会结构正在变化","经济完全停止","技术没有影响","人口没有变化"],answer:0,explanation:"反映了社会结构正在发生变化."},
{id:2,prompt:"研究人员认为，准确判断问题的本质是制定可靠措施的基础。问：什么是制定可靠措施的基础？",options:["增加成本","判断问题本质","扩大市场","减少交流"],answer:1,explanation:"判断问题的本质 is identified as the basis."},
{id:3,prompt:"新政策旨在促进不同领域之间的合作。问：新政策的目的是什么？",options:["减少合作","促进合作","取消交流","限制领域"],answer:1,explanation:"旨在促进 means aims to promote."}
],
7:[
{id:1,prompt:"研究报告认为，这一现象不能孤立地理解，而应结合社会、经济与文化因素综合判断。问：应如何理解这一现象？",options:["只看经济因素","孤立判断","综合多种因素","忽略文化因素"],answer:2,explanation:"综合判断 requires considering multiple factors."},
{id:2,prompt:"从长远来看，政策实施的成效取决于制度设计与实际执行之间能否形成良性互动。问：成效取决于什么？",options:["单一宣传","制度与执行的互动","短期成本","个人意见"],answer:1,explanation:"The sentence identifies制度设计与实际执行之间的互动."},
{id:3,prompt:"该观点强调在复杂环境中保持判断的独立性与证据意识。问：该观点强调什么？",options:["快速决定","独立判断与证据意识","避免研究","减少证据"],answer:1,explanation:"独立性与证据意识 are explicitly emphasized."}
],
8:[
{id:1,prompt:"在信息高度流动的时代，真正困难的并非获取信息，而是辨析信息来源、语境与潜在偏差。问：真正困难的是什么？",options:["获取信息","辨析信息质量","增加信息数量","停止交流"],answer:1,explanation:"The passage contrasts obtaining information with evaluating it."},
{id:2,prompt:"任何单一指标都不足以完整刻画一个复杂系统的运行状态。问：单一指标有什么局限？",options:["能够解释一切","不足以完整刻画复杂系统","完全没有价值","可以代替所有研究"],answer:1,explanation:"A single indicator cannot fully describe a complex system."},
{id:3,prompt:"只有将理论假设与实证材料相互验证，研究结论才具有较强的解释力。问：什么能增强结论的解释力？",options:["减少材料","相互验证","忽略假设","只用理论"],answer:1,explanation:"Theory and empirical evidence should validate each other."}
],
9:[
{id:1,prompt:"在跨学科研究中，概念边界的澄清并非形式上的要求，而是避免不同研究传统在同一术语下产生歧义的必要条件。问：为什么要澄清概念边界？",options:["为了增加术语","为了避免歧义","为了减少研究","为了简化所有问题"],answer:1,explanation:"Clarifying boundaries helps prevent ambiguity."},
{id:2,prompt:"若缺乏可重复验证的证据，即使结论具有直觉上的吸引力，也难以形成稳固的学术论证。问：稳固论证需要什么？",options:["直觉","可重复验证的证据","更多修辞","更长标题"],answer:1,explanation:"Repeatable evidence is necessary for robust academic argument."},
{id:3,prompt:"面对相互矛盾的研究结果，成熟的分析应首先检视研究设计、样本边界与测量方法，而非立即选择支持自身立场的结果。问：成熟分析首先应该做什么？",options:["选择支持自己的结果","检视研究设计等因素","忽略矛盾结果","停止分析"],answer:1,explanation:"The passage recommends examining methodology before taking a side."}
]
};

function speak(text:string){if(typeof window!=="undefined"&&"speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="zh-CN";u.rate=.82;window.speechSynthesis.speak(u)}}

export default function HskPracticePage(){
const [mode,setMode]=useState<Mode>("mock");
const [level,setLevel]=useState(1);
const [lesson,setLesson]=useState(1);
const [started,setStarted]=useState(false);
const [finished,setFinished]=useState(false);
const [current,setCurrent]=useState(0);
const [answers,setAnswers]=useState<Record<number,number>>({});
const [saved,setSaved]=useState(false);
const [seconds,setSeconds]=useState(levelMeta[1].time*60);
const [flash,setFlash]=useState(false);
const [vocabIndex,setVocabIndex]=useState(0);
const [vocabFilter,setVocabFilter]=useState(1);

const selectedWords=useMemo(()=>words.filter(w=>w.level===vocabFilter),[vocabFilter]);
const generalWords=useMemo(()=>words.filter(w=>w.level===level&&w.lesson===lesson),[level,lesson]);
const questions=useMemo(()=>sampleQuestions[level]||sampleQuestions[1],[level]);
const score=useMemo(()=>questions.reduce((n,q)=>n+(answers[q.id]===q.answer?1:0),0),[answers,questions]);

useEffect(()=>{try{const raw=localStorage.getItem("globlearn-hsk-hub-v2");if(raw){const x=JSON.parse(raw);setMode(x.mode||"mock");setLevel(x.level||1);setLesson(x.lesson||1);setStarted(Boolean(x.started));setCurrent(x.current||0);setAnswers(x.answers||{});setSeconds(x.seconds||levelMeta[x.level||1].time*60)}}catch{}},[]);
useEffect(()=>{if(started&&!finished){const t=setInterval(()=>setSeconds(s=>{if(s<=1){clearInterval(t);setFinished(true);return 0}return s-1}),1000);return()=>clearInterval(t)}},[started,finished]);
useEffect(()=>{try{localStorage.setItem("globlearn-hsk-hub-v2",JSON.stringify({mode,level,lesson,started,finished,current,answers,seconds}))}catch{}},[mode,level,lesson,started,finished,current,answers,seconds]);

const reset=()=>{setStarted(false);setFinished(false);setCurrent(0);setAnswers({});setSeconds(levelMeta[level].time*60);setSaved(false)};
const startMock=()=>{setMode("mock");setFinished(false);setStarted(true);setCurrent(0);setAnswers({});setSeconds(levelMeta[level].time*60)};
const choose=(i:number)=>{const q=questions[current];setAnswers(a=>({...a,[q.id]:i}))};
const mins=String(Math.floor(seconds/60)).padStart(2,"0"), secs=String(seconds%60).padStart(2,"0");
const mockCard=(n:number,title:string,desc:string,icon:string)=><button onClick={()=>{setMode("mock");setLevel(n);setStarted(false)}} className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="text-2xl">{icon}</span><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#1B3A6B]">Configure <ArrowRight className="h-4 w-4"/></span></button>;

if(started&&mode==="mock"){
const q=questions[current];
if(finished)return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-4xl px-5 py-12 md:px-8"><div className="rounded-[2rem] border bg-white p-8 text-center shadow-sm md:p-12"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500"/><p className="mt-5 text-sm font-black uppercase tracking-wider text-[#C8102E]">Mock complete</p><h1 className="mt-2 text-5xl font-black">{score}/{questions.length}</h1><p className="mt-2 text-slate-500">{Math.round(score/questions.length*100)}% correct · HSK {level} sample</p><div className="mt-8 space-y-3 text-left">{questions.map((x,i)=><div key={x.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-start justify-between gap-4"><b>Question {i+1}</b><span className={answers[x.id]===x.answer?"text-emerald-600":"text-red-600"}>{answers[x.id]===x.answer?"Correct":"Review"}</span></div><p className="mt-2 text-sm">{x.explanation}</p></div>)}</div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={reset} className="flex-1 rounded-xl border px-5 py-3 font-bold">Back to practice hub</button><button onClick={startMock} className="flex-1 rounded-xl bg-[#C8102E] px-5 py-3 font-bold text-white">Try again</button></div></div></div></main>;
return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-6xl px-4 py-6 md:px-8"><div className="flex items-center justify-between"><Link href="/hsk" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B3A6B]"><ArrowLeft className="h-4 w-4"/> HSK Guide</Link><span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-black shadow-sm"><Clock3 className="h-4 w-4 text-[#C8102E]"/>{mins}:{secs}</span></div><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]"><section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8"><div className="flex items-center justify-between"><div><span className="text-xs font-black uppercase tracking-wider text-[#C8102E]">HSK {level} sample mock</span><h1 className="mt-1 text-xl font-black">Question {current+1} of {questions.length}</h1></div><button onClick={()=>speak(q.audio||q.prompt)} className="rounded-xl bg-slate-50 p-3 text-[#1B3A6B]" title="Play Chinese audio"><Volume2 className="h-5 w-5"/></button></div><div className="mt-7 rounded-2xl bg-slate-50 p-6"><p className="text-lg font-bold leading-8">{q.prompt}</p></div><div className="mt-5 space-y-3">{q.options.map((o,i)=><button key={o} onClick={()=>choose(i)} className={"flex w-full items-center gap-4 rounded-2xl border p-4 text-left "+(answers[q.id]===i?"border-[#29ABE2] bg-blue-50":"border-slate-200 hover:bg-slate-50")}><span className={"flex h-8 w-8 items-center justify-center rounded-full text-sm font-black "+(answers[q.id]===i?"bg-[#1B3A6B] text-white":"bg-slate-100")}>{String.fromCharCode(65+i)}</span><span className="font-medium">{o}</span></button>)}</div><div className="mt-8 flex justify-between gap-3"><button disabled={!current} onClick={()=>setCurrent(c=>c-1)} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-bold disabled:opacity-40"><ChevronLeft className="h-4 w-4"/> Previous</button>{current===questions.length-1?<button onClick={()=>setFinished(true)} className="rounded-xl bg-[#C8102E] px-5 py-3 font-black text-white">Finish</button>:<button onClick={()=>setCurrent(c=>c+1)} className="inline-flex items-center gap-2 rounded-xl bg-[#1B3A6B] px-5 py-3 font-black text-white">Next <ChevronRight className="h-4 w-4"/></button>}</div></section><aside className="rounded-3xl border bg-white p-5 shadow-sm"><b>Exam structure</b><div className="mt-4 space-y-3 text-sm"><div><span className="text-slate-500">Questions</span><b className="float-right">{levelMeta[level].questions}</b></div><div><span className="text-slate-500">Official approx.</span><b className="float-right">{levelMeta[level].time} min</b></div><div><span className="text-slate-500">Skills</span><b className="mt-1 block">{levelMeta[level].skills}</b></div></div><p className="mt-6 border-t pt-5 text-xs leading-5 text-slate-500">This is a short GL Education sample mock using HSK 3.0-aligned tasks. It is not an official CTI paper.</p></aside></div></div></main>;
}

return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-7xl px-5 py-7 md:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><Link href="/hsk" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B3A6B]"><ArrowLeft className="h-4 w-4"/> Back to HSK Guide</Link><div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-sm"><Sparkles className="h-4 w-4 text-[#C8102E]"/> HSK 3.0 Practice Hub</div></div>
<div className="mt-7 rounded-[2rem] bg-[#0A1628] p-8 text-white md:p-12"><span className="text-xs font-black uppercase tracking-[.18em] text-[#FFD700]">Free learning system</span><h1 className="mt-3 text-4xl font-black md:text-5xl">Practice HSK 3.0 your way</h1><p className="mt-4 max-w-3xl leading-7 text-slate-300">Take a realistic sample mock, build vocabulary with flashcards and MCQs, or practice a whole level or selected lessons. Your progress is saved on this device.</p></div>
<div className="mt-5 grid gap-3 md:grid-cols-3"><button onClick={()=>setMode("mock")} className={"rounded-2xl border p-5 text-left "+(mode==="mock"?"border-[#C8102E] bg-red-50":"bg-white")}><Headphones className="text-[#C8102E]"/><b className="mt-3 block">Mock Test on Real Exam</b><span className="text-sm text-slate-500">Timed level-based sample exams</span></button><button onClick={()=>setMode("vocabulary")} className={"rounded-2xl border p-5 text-left "+(mode==="vocabulary"?"border-[#29ABE2] bg-blue-50":"bg-white")}><BookOpen className="text-[#1B3A6B]"/><b className="mt-3 block">Test Vocabulary</b><span className="text-sm text-slate-500">Level learning, flashcards and MCQ</span></button><button onClick={()=>setMode("general")} className={"rounded-2xl border p-5 text-left "+(mode==="general"?"border-emerald-500 bg-emerald-50":"bg-white")}><Target className="text-emerald-600"/><b className="mt-3 block">General Practice</b><span className="text-sm text-slate-500">Whole level or selected lessons</span></button></div>

{mode==="mock"&&<section className="mt-8"><div className="flex items-end justify-between gap-4"><div><h2 className="text-2xl font-black">Mock Test on Real Exam</h2><p className="mt-2 text-sm text-slate-600">Choose a level. The full-test blueprint follows the official level structure; the interactive sample is shorter so students can try it immediately.</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{mockCard(1,"HSK 1 Mock","Listening + Reading · 40-question blueprint","①")}{mockCard(2,"HSK 2 Mock","Listening + Reading · 60-question blueprint","②")}{mockCard(3,"HSK 3 Mock","Listening + Reading + Writing · 80-question blueprint","③")}{mockCard(4,"HSK 4 Mock","Listening + Reading + Writing · 100-question blueprint","④")}{mockCard(5,"HSK 5 Mock","Listening + Reading + Writing · 100-question blueprint","⑤")}{mockCard(6,"HSK 6 Mock","101-question blueprint · advanced writing","⑥")}{mockCard(7,"HSK 7–9 Advanced","Listening + Reading + Writing + Translation + Speaking","⑦")}</div><div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><span className="text-xs font-black uppercase text-[#C8102E]">Selected level</span><h3 className="mt-1 text-2xl font-black">HSK {level}</h3><p className="mt-1 text-sm text-slate-500">{levelMeta[level].skills} · approx. {levelMeta[level].time} minutes</p></div><div className="flex gap-3"><select value={level} onChange={e=>setLevel(Number(e.target.value))} className="rounded-xl border px-4 py-3 font-bold">{levels.map(n=><option key={n} value={n}>HSK {n}</option>)}</select><button onClick={startMock} className="rounded-xl bg-[#C8102E] px-5 py-3 font-black text-white">Start sample mock</button></div></div></div></section>}

{mode==="vocabulary"&&<section className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr]"><aside className="rounded-3xl border bg-white p-5 shadow-sm"><h2 className="text-xl font-black">Vocabulary levels</h2><div className="mt-4 grid grid-cols-3 gap-2 lg:grid-cols-1">{levels.map(n=><button key={n} onClick={()=>{setVocabFilter(n);setVocabIndex(0);setFlash(false)}} className={"rounded-xl px-3 py-2 text-left text-sm font-bold "+(vocabFilter===n?"bg-[#1B3A6B] text-white":"bg-slate-50")}>HSK {n}</button>)}</div><div className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">The UI is ready for the complete official HSK 3.0 word-bank import. The current build includes a starter vocabulary dataset for interaction testing.</div></aside><div className="space-y-5"><div className="rounded-3xl border bg-white p-7 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><span className="text-xs font-black uppercase text-[#C8102E]">Level-wise learning</span><h2 className="mt-1 text-3xl font-black">HSK {vocabFilter} Vocabulary</h2></div><span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black">{selectedWords.length} starter words</span></div><div className="mt-7 grid gap-4 sm:grid-cols-2">{selectedWords.slice(0,8).map(w=><div key={w.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between"><b className="text-2xl">{w.word}</b><button onClick={()=>speak(w.word)} className="rounded-lg bg-white p-2"><Volume2 className="h-4 w-4"/></button></div><p className="mt-1 text-sm text-[#1B3A6B]">{w.pinyin}</p><p className="mt-2 text-sm text-slate-600">{w.meaning}</p><span className="mt-3 inline-block text-[11px] font-bold text-slate-400">Lesson {w.lesson}</span></div>)}</div></div><div className="grid gap-5 md:grid-cols-2"><div className="rounded-3xl border bg-white p-7 shadow-sm"><h3 className="text-xl font-black">Flashcards</h3><div className="mt-5 flex min-h-48 flex-col items-center justify-center rounded-3xl bg-[#0A1628] p-6 text-center text-white"><span className="text-xs uppercase text-slate-400">Card {vocabIndex+1}</span>{!flash?<b className="mt-4 text-4xl">{selectedWords[vocabIndex]?.word||"—"}</b>:<><b className="mt-4 text-3xl">{selectedWords[vocabIndex]?.pinyin}</b><p className="mt-2 text-slate-300">{selectedWords[vocabIndex]?.meaning}</p></>}<button onClick={()=>setFlash(x=>!x)} className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-black text-[#0A1628]">{flash?"Hide answer":"Reveal answer"}</button></div><div className="mt-4 flex justify-between"><button onClick={()=>{setVocabIndex(i=>Math.max(0,i-1));setFlash(false)}} className="rounded-xl border p-3"><ChevronLeft/></button><button onClick={()=>{setVocabIndex(i=>Math.min(selectedWords.length-1,i+1));setFlash(false)}} className="rounded-xl border p-3"><ChevronRight/></button></div></div><VocabularyQuiz words={selectedWords}/></div></div></section>}

{mode==="general"&&<section className="mt-8 rounded-3xl border bg-white p-7 shadow-sm"><span className="text-xs font-black uppercase text-emerald-600">General Practice</span><h2 className="mt-1 text-3xl font-black">Practice a whole level or selected lessons</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Select a level, then choose a lesson. The practice engine will draw questions from the selected lesson set.</p><div className="mt-7 grid gap-4 md:grid-cols-3"><div><label className="text-xs font-black text-slate-500">LEVEL</label><select value={level} onChange={e=>setLevel(Number(e.target.value))} className="mt-2 w-full rounded-xl border px-4 py-3 font-bold">{levels.map(n=><option key={n} value={n}>HSK {n}</option>)}</select></div><div><label className="text-xs font-black text-slate-500">LESSON</label><select value={lesson} onChange={e=>setLesson(Number(e.target.value))} className="mt-2 w-full rounded-xl border px-4 py-3 font-bold"><option value={0}>All lessons</option>{Array.from({length:Math.min(levelMeta[level].lessons,30)},(_,i)=><option key={i+1} value={i+1}>Lesson {i+1}</option>)}</select></div><div className="flex items-end"><button onClick={()=>{setMode("mock");setStarted(true);setFinished(false);setCurrent(0);setAnswers({});setSeconds(levelMeta[level].time*60)}} className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-black text-white">Start practice</button></div></div><div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-5"><b>Whole level</b><p className="mt-1 text-xs text-slate-500">All available words and tasks</p></div><div className="rounded-2xl bg-slate-50 p-5"><b>Selected lessons</b><p className="mt-1 text-xs text-slate-500">Focus on one lesson or range</p></div><div className="rounded-2xl bg-slate-50 p-5"><b>Saved progress</b><p className="mt-1 text-xs text-slate-500">Resume on this device</p></div></div><p className="mt-5 text-xs text-slate-500">Current interactive questions use the HSK 3.0-aligned starter bank. The full official vocabulary dataset can be imported into this same engine without changing the interface.</p></section>}

<div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-4 shadow-sm"><span className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><Save className="h-4 w-4 text-[#1B3A6B]"/> Progress saves automatically on this device.</span><button onClick={()=>{setSaved(true);try{localStorage.setItem("globlearn-hsk-hub-v2",JSON.stringify({mode,level,lesson,started,finished,current,answers,seconds}))}catch{}}} className="inline-flex items-center gap-2 rounded-xl bg-[#1B3A6B] px-4 py-2.5 text-sm font-black text-white">Save now</button></div>{saved&&<p className="mt-3 text-center text-xs font-bold text-emerald-600">Saved successfully.</p>}
</div></main>
}

function VocabularyQuiz({words}:{words:Word[]}){
const [i,setI]=useState(0); const [choice,setChoice]=useState<number|null>(null); const [done,setDone]=useState(0);
const w=words[i]; if(!w)return <div className="rounded-3xl border bg-white p-7">No vocabulary loaded for this level yet.</div>;
const opts=[w.meaning,...words.filter(x=>x.id!==w.id).slice(0,3).map(x=>x.meaning)];
return <div className="rounded-3xl border bg-white p-7 shadow-sm"><h3 className="text-xl font-black">MCQ Vocabulary Test</h3><p className="mt-1 text-sm text-slate-500">Choose the closest meaning of the word.</p><div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center"><b className="text-4xl">{w.word}</b><p className="mt-1 text-sm text-[#1B3A6B]">{w.pinyin}</p></div><div className="mt-4 grid gap-2">{opts.map((o,n)=><button key={o} disabled={choice!==null} onClick={()=>{setChoice(n);if(n===0)setDone(d=>d+1)}} className={"rounded-xl border p-3 text-left text-sm font-bold "+(choice===n?(n===0?"border-emerald-400 bg-emerald-50":"border-red-400 bg-red-50"):"hover:bg-slate-50")}>{String.fromCharCode(65+n)}. {o}</button>)}</div><div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500"><span>Correct this session: {done}</span><button onClick={()=>{setI((i+1)%words.length);setChoice(null)}} className="inline-flex items-center gap-1 text-[#1B3A6B]">Next <ArrowRight className="h-3 w-3"/></button></div></div>;
}
