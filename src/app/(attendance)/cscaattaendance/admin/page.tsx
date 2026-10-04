"use client";
import {useState} from "react";
export default function AdminAttendance(){
 const [password,setPassword]=useState(""),[date,setDate]=useState(new Date().toISOString().slice(0,10)),[busy,setBusy]=useState(false),[error,setError]=useState("");
 async function download(type:string){
  setBusy(true);setError("");
  try{
   const r=await fetch("/api/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"report",type,date,password})});
   if(!r.ok){const x=await r.json().catch(()=>({}));setError(x.message||"Invalid password or report error.");return}
   const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=r.headers.get("Content-Disposition")?.match(/filename="?([^"]+)/)?.[1]||`attendance-${type}.csv`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }catch{setError("Could not download report.")}finally{setBusy(false)}
 }
 return <main className="min-h-screen bg-slate-50 p-4 sm:p-8"><div className="mx-auto max-w-2xl">
  <div className="rounded-2xl border bg-white p-6 shadow-sm"><a href="/cscaattaendance" className="text-sm text-blue-600">← Back to attendance</a><h1 className="mt-3 text-2xl font-bold">Attendance Reports</h1><p className="mt-1 text-sm text-slate-500">Reports are generated directly from the database.</p>
   <label className="mt-6 block text-sm font-semibold">Admin password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter admin password" className="mt-2 w-full rounded-xl border px-4 py-3"/>
   <label className="mt-4 block text-sm font-semibold">Report date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3"/>
   {error&&<div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
   <div className="mt-6 grid gap-3">
    <button disabled={busy||!password} onClick={()=>download("daily")} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">Download selected day report</button>
    <button disabled={busy||!password} onClick={()=>download("full")} className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50">Download all attendance history</button>
    <button disabled={busy||!password} onClick={()=>download("matrix")} className="rounded-xl border px-4 py-3 font-semibold">Download 90-day attendance matrix</button>
   </div>
   <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">The daily report can be used for today, yesterday, or any previous date. The full-history report never deletes older attendance records.</div>
  </div>
 </div></main>
}
