"use client";

import { useEffect, useMemo, useState } from "react";

type Student={serial:number;id:string;name:string;phoneMasked:string};
type Record={studentId:string;attendanceAt:string;attendanceDay:string};

function localDateKey(d=new Date()){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Dhaka"}).format(d)}
function addDaysToKey(key:string,days:number){const [y,m,d]=key.split("-").map(Number);const x=new Date(Date.UTC(y,m-1,d+days));return x.toISOString().slice(0,10)}
function fmtTime(iso:string){return new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Dhaka",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(iso))}
function classOpenNow(){const parts=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Dhaka",hour:"2-digit",hour12:false}).formatToParts(new Date());const h=Number(parts.find(p=>p.type==="hour")?.value||0);return h>=22&&h<23}
function fmtDateKey(key:string){const [y,m,d]=key.split("-").map(Number);return new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",timeZone:"UTC"}).format(new Date(Date.UTC(y,m-1,d,12)))}

export default function AttendancePage(){
 const [students,setStudents]=useState<Student[]>([]),[records,setRecords]=useState<Record[]>([]);
 const [loading,setLoading]=useState(true),[search,setSearch]=useState(""),[message,setMessage]=useState("");
 const [modal,setModal]=useState<Student|null>(null),[last4,setLast4]=useState(""),[saving,setSaving]=useState(false),[classOpen,setClassOpen]=useState(classOpenNow());
 const [newName,setNewName]=useState(""),[newPhone,setNewPhone]=useState(""),[adding,setAdding]=useState(false);

 async function load(){
  setLoading(true); try{const r=await fetch("/api/attendance?action=students",{cache:"no-store"});const x=await r.json();if(x.ok){setStudents(x.students);setRecords(x.records)}else setMessage(x.message)}catch{setMessage("Could not load attendance.")}finally{setLoading(false)}
 }
 useEffect(()=>{load();const t=setInterval(()=>setClassOpen(classOpenNow()),5000);return()=>clearInterval(t)},[]);
 const dates=useMemo(()=>{const today=localDateKey();return Array.from({length:90},(_,i)=>addDaysToKey(today,i))},[]);
 const filtered=students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()));
 const recMap=useMemo(()=>{const m=new Map<string,string>();records.forEach(r=>m.set(r.studentId+"|"+r.attendanceDay,r.attendanceAt));return m},[records]);

 async function attend(){
  if(!modal)return; setSaving(true);setMessage("");
  try{const r=await fetch("/api/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"attend",studentId:modal.id,last4})});const x=await r.json();setMessage(x.message||"Done");if(x.ok){setModal(null);setLast4("");await load()}}catch{setMessage("Could not save attendance.")}finally{setSaving(false)}
 }
 async function add(){
  setAdding(true);setMessage("");
  try{const r=await fetch("/api/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"register",name:newName,phone:newPhone})});const x=await r.json();if(x.ok){setNewName("");setNewPhone("");setMessage(x.existing ? "This phone number is already registered." : "Student added successfully.");await load()}else setMessage(x.message)}catch{setMessage("Could not add student.")}finally{setAdding(false)}
 }
 return <main className="min-h-screen bg-slate-50 text-slate-900">
  <div className="mx-auto max-w-[1600px] p-3 sm:p-6">
   <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm border">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
     <div><h1 className="text-2xl font-bold">📚 Class Attendance</h1><p className="text-sm text-slate-500">Attendance is available daily from 10:00 PM to 11:00 PM Bangladesh time.</p></div>
     <div className="flex gap-2"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student name" className="w-full md:w-72 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/><a href="/cscaattaendance/admin" className="rounded-xl bg-slate-900 px-4 py-3 text-white whitespace-nowrap">Admin reports</a></div>
    </div>
    {message&&<div className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>}
   </div>

   <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
    <div className="overflow-x-auto"><table className="min-w-max border-collapse text-sm">
     <thead className="sticky top-0 z-10 bg-slate-100"><tr>
      <th className="sticky left-0 z-20 bg-slate-100 px-3 py-3 text-left">#</th><th className="sticky left-10 z-20 bg-slate-100 px-3 py-3 text-left min-w-48">Student</th><th className="sticky left-[13rem] z-20 bg-slate-100 px-3 py-3 text-left">Phone</th>
      {dates.map(d=>{const today=d===localDateKey();return <th key={d} className="px-3 py-3 text-center min-w-24">{today?"Today":fmtDateKey(d)}</th>})}
     </tr></thead>
     <tbody>
      {loading?<tr><td colSpan={93} className="p-8 text-center">Loading...</td></tr>:filtered.map(s=><tr key={s.id} className="border-t hover:bg-slate-50">
       <td className="sticky left-0 bg-white px-3 py-3">{s.serial}</td><td className="sticky left-10 bg-white px-3 py-3 font-medium">{s.name}</td><td className="sticky left-[13rem] bg-white px-3 py-3 font-mono tracking-wide">{s.phoneMasked}</td>
       {dates.map(d=>{const at=recMap.get(s.id+"|"+d);const today=d===localDateKey();return <td key={d} className="px-2 py-2 text-center">{at?<span className="inline-flex flex-col rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700"><b>✓</b><span className="text-[11px]">{fmtTime(at)}</span></span>:today?(classOpen?<button onClick={()=>{setModal(s);setLast4("")}} className="rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700">Attend</button>:<span className="text-[11px] text-amber-600">Wait for class<br/>10 PM BD</span>):<span className="text-slate-300">—</span>}</td>})}
      </tr>)}
     {!loading&&!filtered.length&&<tr><td colSpan={93} className="p-8 text-center text-slate-500">No student found.</td></tr>}
     </tbody>
    </table></div>
   </div>

   <div className="mt-5 rounded-2xl border bg-white p-4 shadow-sm">
    <h2 className="font-bold">Student not on the list?</h2><p className="mb-3 text-sm text-slate-500">Add your name and phone number once. Your phone number will be used to verify attendance.</p>
    <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]"><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Full name" className="rounded-xl border px-4 py-3"/><input value={newPhone} onChange={e=>setNewPhone(e.target.value)} placeholder="Phone number" inputMode="tel" className="rounded-xl border px-4 py-3"/><button disabled={adding} onClick={add} className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">{adding?"Adding...":"Add student"}</button></div>
   </div>
  </div>

  {modal&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
   <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-xl font-bold">Confirm attendance</h2><p className="mt-1 text-sm text-slate-600">Student: <b>{modal.name}</b></p><p className="mb-4 text-sm text-slate-600">Enter the last 4 digits of your registered phone number.</p>
    <input autoFocus maxLength={4} inputMode="numeric" value={last4} onChange={e=>setLast4(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="Last 4 digits" className="w-full rounded-xl border px-4 py-3 text-center text-xl tracking-widest"/>
    <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>setModal(null)} className="rounded-xl border px-4 py-3">Cancel</button><button disabled={saving||last4.length!==4} onClick={attend} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{saving?"Saving...":"Confirm"}</button></div>
   </div>
  </div>}
 </main>
}
