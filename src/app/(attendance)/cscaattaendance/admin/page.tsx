"use client";
import {useState} from "react";
export default function AdminAttendance(){
 const [password,setPassword]=useState(""),[date,setDate]=useState(new Date().toISOString().slice(0,10)),[busy,setBusy]=useState(false),[error,setError]=useState(""),[students,setStudents]=useState<any[]>([]),[loadingStudents,setLoadingStudents]=useState(false),[live,setLive]=useState<any>(null),[liveBusy,setLiveBusy]=useState(false);
 async function loadStudents(){
  setLoadingStudents(true);setError("");
  try{const r=await fetch("/api/attendance?action=students");const x=await r.json();if(!r.ok||!x.ok)throw new Error(x.message||"Could not load students.");setStudents(x.students||[])}
  catch(e:any){setError(e.message||"Could not load students.")}finally{setLoadingStudents(false)}
 }
 async function setStatus(student:any,active:boolean){
  if(!password){setError("Enter the admin password first.");return}
  const action=active?"activate":"deactivate";
  if(!confirm(`${active?"Activate":"Deactivate"} ${student.name}?`))return;
  setBusy(true);setError("");
  try{const r=await fetch("/api/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"setStudentStatus",studentId:student.id,active,password})});const x=await r.json();if(!r.ok||!x.ok)throw new Error(x.message||"Could not update student.");await loadStudents()}
  catch(e:any){setError(e.message||"Could not update student.")}finally{setBusy(false)}
 }
 async function deleteStudent(student:any){
  if(!password){setError("Enter the admin password first.");return}
  if(!confirm(`PERMANENTLY DELETE ${student.name}? All attendance history will also be deleted. This cannot be undone.`))return;
  setBusy(true);setError("");
  try{const r=await fetch("/api/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"deleteStudent",studentId:student.id,password})});const x=await r.json();if(!r.ok||!x.ok)throw new Error(x.message||"Could not delete student.");setStudents(v=>v.filter(s=>s.id!==student.id))}
  catch(e:any){setError(e.message||"Could not delete student.")}finally{setBusy(false)}
 }
 async function loadLive(){
  if(!password)return;
  setLiveBusy(true);
  try{const r=await fetch("/api/attendance?action=live&password="+encodeURIComponent(password),{cache:"no-store"});const x=await r.json();if(!r.ok||!x.ok)throw new Error(x.message||"Could not load live sheet.");setLive(x)}
  catch(e:any){setError(e.message||"Could not load live sheet.")}finally{setLiveBusy(false)}
 }
 async function markLive(student:any){
  if(!password)return;
  if(!confirm(`Mark attendance for ${student.name}?`))return;
  setLiveBusy(true);setError("");
  try{const r=await fetch("/api/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"manualAttend",studentId:student.id,password})});const x=await r.json();if(!r.ok||!x.ok)throw new Error(x.message||"Could not mark attendance.");await loadLive()}
  catch(e:any){setError(e.message||"Could not mark attendance.")}finally{setLiveBusy(false)}
 }
 async function download(type:string){
  setBusy(true);setError("");
  try{
   const r=await fetch(`/api/attendance?action=report&type=${encodeURIComponent(type)}&date=${encodeURIComponent(date)}&password=${encodeURIComponent(password)}`);
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
   <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-bold text-emerald-900">Live class attendance sheet</h2><p className="mt-1 text-sm text-emerald-800">Live view for today. Students can self-attend only from 10:00 PM to 11:00 PM Bangladesh time.</p></div>
      <button onClick={loadLive} disabled={liveBusy||!password} className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50">{liveBusy?"Refreshing...":"Open / refresh live sheet"}</button>
    </div>
    {live&&<div className="mt-4 overflow-x-auto rounded-xl border bg-white"><div className="flex items-center justify-between border-b p-3 text-sm"><b>{live.date} · Bangladesh time</b><span className={live.classOpen?"font-semibold text-emerald-700":"font-semibold text-slate-500"}>{live.classOpen?"CLASS OPEN · 10–11 PM":"CLASS CLOSED"}</span></div><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-3 text-left">#</th><th className="p-3 text-left">Student</th><th className="p-3 text-left">Phone</th><th className="p-3 text-left">Status / Time</th><th className="p-3 text-left">Teacher</th></tr></thead><tbody>{live.students.map((s:any)=>{const rec=live.records.find((r:any)=>r.studentId===s.id);return <tr key={s.id} className="border-t"><td className="p-3">{s.serial}</td><td className="p-3 font-medium">{s.name}</td><td className="p-3 font-mono">{s.phoneMasked}</td><td className="p-3">{rec?<span className="font-semibold text-emerald-700">✓ Attended · {new Date(rec.attendanceAt).toLocaleTimeString("en-GB",{timeZone:"Asia/Dhaka",hour:"2-digit",minute:"2-digit"})}</span>:<span className="text-amber-700">Not attended</span>}</td><td className="p-3">{rec?"—":s.active?<button onClick={()=>markLive(s)} disabled={liveBusy} className="rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white disabled:opacity-50">Mark attended</button>:<span className="text-slate-400">Inactive</span>}</td></tr>})}</tbody></table></div>}
   </div>
   <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
    <h2 className="font-bold text-red-800">Student management</h2>
    <p className="mt-1 text-sm text-red-700">Deactivate keeps all attendance history. Permanent delete removes the student and all of their attendance history.</p>
    <button onClick={loadStudents} disabled={loadingStudents||!password} className="mt-3 rounded-xl bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-50">{loadingStudents?"Loading...":"Load student list"}</button>
    {students.length>0&&<div className="mt-4 max-h-96 space-y-2 overflow-auto">{students.map(s=><div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-3"><div><div className="font-semibold">{s.name}</div><div className="text-xs text-slate-500">{s.phoneMasked}</div></div><div className="flex gap-2"><button onClick={()=>setStatus(s,false)} disabled={busy} className="rounded-lg border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-800 disabled:opacity-50">Deactivate</button><button onClick={()=>deleteStudent(s)} disabled={busy} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Delete permanently</button></div></div>)}</div>}
   </div>
   <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">The daily report can be used for today, yesterday, or any previous date. The full-history report never deletes older attendance records.</div>
  </div>
 </div></main>
}
