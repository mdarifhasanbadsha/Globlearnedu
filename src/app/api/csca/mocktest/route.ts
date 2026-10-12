import {NextRequest,NextResponse} from "next/server";
import {db} from "@/lib/db";
import {sql} from "drizzle-orm";
import crypto from "crypto";
import { sendMockTestSubmissionEmails } from "@/lib/csca/mocktest-email";
import { sendMockTestThankYouEmail } from "@/lib/csca/mocktest-followup-email";
import {getMockExam} from "@/lib/csca/mocktest-bank";
import {isValidMockSubject,mockKey,RELEASED_MOCKS} from "@/lib/csca/mocktest-public";

const firstRow=(r:any)=>r?.rows?.[0]||r?.[0];
const isValidPhone=(v:string)=>/^0\d{10}$/.test(v);
const isValidComEmail=(v:string)=>/^[^\s@]+@[^\s@]+\.com$/i.test(v.trim());
const normalizePhone=(v:string)=>{const d=v.replace(/[^0-9]/g,"");return d.length===11&&d.startsWith("01")?"88"+d:d;};
const adminToken=()=>crypto.createHmac("sha256","GL-EDU-CSCA-ADMIN").update("csca-homework-admin").digest("hex");
const validAdmin=(r:NextRequest)=>r.headers.get("x-csca-admin-token")===adminToken();

async function ensureTable(){
 await db.execute(sql`CREATE TABLE IF NOT EXISTS csca_mocktest_attempts(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),exam_key varchar(100) NOT NULL,subject varchar(30) NOT NULL,test_number integer NOT NULL,
  candidate_name varchar(180) NOT NULL,candidate_email varchar(320) NOT NULL DEFAULT '',phone varchar(40) NOT NULL,answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  score numeric(10,2) NOT NULL DEFAULT 0,total_marks numeric(10,2) NOT NULL,question_count integer NOT NULL,
  duration_minutes integer NOT NULL,away_count integer NOT NULL DEFAULT 0,result_token varchar(100) NOT NULL UNIQUE,
  started_at timestamp NOT NULL DEFAULT now(),submitted_at timestamp NOT NULL DEFAULT now(),UNIQUE(exam_key,phone)
 )`);
 await db.execute(sql`ALTER TABLE csca_mocktest_attempts ADD COLUMN IF NOT EXISTS away_count integer NOT NULL DEFAULT 0`);
 await db.execute(sql`ALTER TABLE csca_mocktest_attempts ADD COLUMN IF NOT EXISTS candidate_email varchar(320) NOT NULL DEFAULT ''`);
 await db.execute(sql`ALTER TABLE csca_mocktest_attempts DROP CONSTRAINT IF EXISTS csca_mocktest_attempts_exam_key_phone_key`);
 await db.execute(sql`CREATE INDEX IF NOT EXISTS csca_mocktest_attempts_phone_idx ON csca_mocktest_attempts(phone)`);
 await db.execute(sql`CREATE TABLE IF NOT EXISTS csca_mocktest_followups(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),phone varchar(40) NOT NULL,recipient_email varchar(320) NOT NULL,channel varchar(20) NOT NULL DEFAULT 'email',status varchar(20) NOT NULL DEFAULT 'sent',sent_at timestamp NOT NULL DEFAULT now())`);
 await db.execute(sql`CREATE INDEX IF NOT EXISTS csca_mocktest_followups_phone_idx ON csca_mocktest_followups(phone,channel,sent_at)`);
}
function publicExam(e:NonNullable<ReturnType<typeof getMockExam>>){
 return {subject:e.subject,testNumber:e.testNumber,title:e.title,durationMinutes:e.durationMinutes,totalMarks:e.totalMarks,
 questionCount:e.questions.length,instructions:e.instructions,questions:e.questions.map(q=>({prompt:q.prompt,options:q.options,marks:q.marks??1}))};
}

export async function GET(req:NextRequest){try{
 const {searchParams:p}=new URL(req.url);
 if(p.get("exam")==="1"){
  const s=p.get("subject")||"",n=Number(p.get("test")||0);
  if(!isValidMockSubject(s)||!Number.isInteger(n)||n<1||n>20||!RELEASED_MOCKS[s].includes(n))return NextResponse.json({released:false},{status:404,headers:{"Cache-Control":"no-store"}});
  const e=getMockExam(mockKey(s,n));if(!e)return NextResponse.json({released:false},{status:404});
  return NextResponse.json({released:true,exam:publicExam(e)},{headers:{"Cache-Control":"no-store"}});
 }
 if(p.get("students")==="1"){
  await ensureTable();
  if(!validAdmin(req))return NextResponse.json({error:"Unauthorized."},{status:401});
  const result=await db.execute(sql`SELECT id,exam_key,subject,test_number,candidate_name,candidate_email,phone,score,total_marks,question_count,duration_minutes,away_count,result_token AS token,started_at,submitted_at FROM csca_mocktest_attempts ORDER BY submitted_at DESC`);
  const records:any[]=result?.rows||result||[];
  const grouped=new Map<string,any>();
  for(const row of records){
   const phone=String(row.phone||"");if(!phone)continue;
   if(!grouped.has(phone))grouped.set(phone,{phone,name:String(row.candidate_name||""),email:String(row.candidate_email||""),last_submitted_at:row.submitted_at,attempts:[]});
   const student=grouped.get(phone);const total=Number(row.total_marks)||0;const score=Number(row.score)||0;
   student.attempts.push({id:String(row.id||""),subject:String(row.subject||""),test_number:Number(row.test_number)||0,score,total_marks:total,percentage:total?Math.round(score/total*10000)/100:0,question_count:Number(row.question_count)||0,duration_minutes:Number(row.duration_minutes)||0,away_count:Number(row.away_count)||0,token:String(row.token||""),started_at:row.started_at,submitted_at:row.submitted_at});
  }
  const baseStudents=Array.from(grouped.values()).map(student=>{const attempts=student.attempts as any[];const average=attempts.length?attempts.reduce((sum,a)=>sum+Number(a.percentage||0),0)/attempts.length:0;return {...student,exam_count:attempts.length,average_score:Math.round(average*100)/100};});
  const followupResult=await db.execute(sql`SELECT phone,MAX(sent_at) AS email_sent_at FROM csca_mocktest_followups WHERE channel='email' AND status='sent' AND sent_at>now()-interval '24 hours' GROUP BY phone`);
  const recentEmails=new Map<string,string>();for(const row of (followupResult?.rows||followupResult||[]) as any[]){recentEmails.set(String(row.phone||""),row.email_sent_at?new Date(row.email_sent_at).toISOString():"");}
  const students=baseStudents.map(student=>({...student,email_sent_at:recentEmails.get(student.phone)||null}));
  return NextResponse.json({students},{headers:{"Cache-Control":"no-store"}});
 }
 const token=p.get("token");
 if(token && p.get("review")==="1"){
  await ensureTable();
  const r=await db.execute(sql`SELECT exam_key,answers,result_token AS token FROM csca_mocktest_attempts WHERE result_token=${token} LIMIT 1`);
  const row=firstRow(r);
  if(!row)return NextResponse.json({submitted:false},{status:404,headers:{"Cache-Control":"no-store"}});
  const exam=getMockExam(String(row.exam_key||""));
  if(!exam)return NextResponse.json({submitted:false},{status:404,headers:{"Cache-Control":"no-store"}});
  let savedAnswers:number[]=[];
  try{
   const raw=row.answers;
   savedAnswers=Array.isArray(raw)?raw.map((v:unknown)=>Number(v)):JSON.parse(String(raw||"[]"));
   if(!Array.isArray(savedAnswers))savedAnswers=[];
  }catch{savedAnswers=[];}
  const questions=exam.questions.map((q,i)=>({
   number:i+1,prompt:q.prompt,options:q.options,
   selectedIndex:Number.isInteger(savedAnswers[i])?savedAnswers[i]:-1,
   answerIndex:q.answerIndex,explanation:q.explanation||"",marks:q.marks??1
  }));
  return NextResponse.json({submitted:true,questions},{headers:{"Cache-Control":"no-store"}});
 }
 if(token){await ensureTable();const r=await db.execute(sql`SELECT exam_key,subject,test_number,candidate_name,candidate_email,phone,score,total_marks,question_count,duration_minutes,away_count,result_token AS token,started_at,submitted_at FROM csca_mocktest_attempts WHERE result_token=${token} LIMIT 1`);const row=firstRow(r);return NextResponse.json(row?{submitted:true,...row}:{submitted:false},{headers:{"Cache-Control":"no-store"}});}
 if(p.get("action")==="existing"){
  await ensureTable();const s=p.get("subject")||"",n=Number(p.get("test")||0),rawPhone=p.get("phone")||"",email=(p.get("email")||"").trim().toLowerCase();
  if(!isValidMockSubject(s)||!Number.isInteger(n)||n<1||n>20||!isValidPhone(rawPhone)||!isValidComEmail(email))return NextResponse.json({error:"Use an 11-digit phone number starting with 0 and a valid email address ending in .com."},{status:400});
  const phone=normalizePhone(rawPhone);const key=mockKey(s,n);const r=await db.execute(sql`SELECT candidate_name,phone,score,total_marks,question_count,away_count,result_token AS token,submitted_at FROM csca_mocktest_attempts WHERE exam_key=${key} AND phone=${phone} ORDER BY submitted_at DESC LIMIT 1`);
  const row=firstRow(r);return NextResponse.json(row?{taken:true,...row}:{taken:false},{headers:{"Cache-Control":"no-store"}});
 }
 if(p.get("admin")==="1"){
  await ensureTable();if(!validAdmin(req))return NextResponse.json({error:"Unauthorized."},{status:401});
  const s=p.get("subject")||"mathematics",n=Number(p.get("test")||1);
  if(!isValidMockSubject(s)||!Number.isInteger(n)||n<1||n>20)return NextResponse.json({error:"Invalid subject/test."},{status:400});
  const key=mockKey(s,n);const r=await db.execute(sql`SELECT id,exam_key,subject,test_number,candidate_name,candidate_email,phone,score,total_marks,question_count,duration_minutes,away_count,result_token AS token,started_at,submitted_at FROM csca_mocktest_attempts WHERE exam_key=${key} ORDER BY submitted_at DESC`);
  const e=getMockExam(key);return NextResponse.json({submissions:r?.rows||r||[],exam:e?publicExam(e):null},{headers:{"Cache-Control":"no-store"}});
 }
 return NextResponse.json({error:"Invalid request."},{status:400});
 }catch(e){console.error("Mock-test GET error",e);return NextResponse.json({error:"Unable to load mock-test information."},{status:500});}}

export async function POST(req:NextRequest){try{
 await ensureTable();const b=await req.json();
 if(b.action==="sendThankYouEmail"){
  if(!validAdmin(req))return NextResponse.json({error:"Unauthorized."},{status:401});
  const phone=String(b.phone||"").replace(/[^0-9]/g,"");
  if(!/^0\d{10}$/.test(phone)&&!/^880\d{10}$/.test(phone))return NextResponse.json({error:"Invalid student phone number."},{status:400});
  const recent=await db.execute(sql`SELECT sent_at FROM csca_mocktest_followups WHERE phone=${phone} AND channel='email' AND status='sent' AND sent_at>now()-interval '24 hours' ORDER BY sent_at DESC LIMIT 1`);
  if(firstRow(recent))return NextResponse.json({error:"A thank-you email was already sent to this student in the last 24 hours. Please wait before sending another."},{status:429});
  const studentResult=await db.execute(sql`SELECT candidate_name,candidate_email,phone,subject,test_number,score,total_marks,question_count,duration_minutes,result_token AS token FROM csca_mocktest_attempts WHERE phone=${phone} ORDER BY submitted_at DESC LIMIT 1`);
  const student=firstRow(studentResult);
  if(!student)return NextResponse.json({error:"Student record not found."},{status:404});
  const candidateEmail=String(student.candidate_email||"").trim().toLowerCase();
  if(!isValidComEmail(candidateEmail))return NextResponse.json({error:"This student record does not have a valid .com email address."},{status:400});
  const sent=await sendMockTestThankYouEmail({candidateName:String(student.candidate_name||"Student"),candidateEmail,phone:String(student.phone||phone),subject:String(student.subject||"mathematics"),testNumber:Number(student.test_number)||1,score:Number(student.score)||0,totalMarks:Number(student.total_marks)||100,questionCount:Number(student.question_count)||48,durationMinutes:Number(student.duration_minutes)||60,resultToken:String(student.token||"")});
  if(!sent.success)return NextResponse.json({error:"The email service could not send this message. No successful send was recorded; please try again later."},{status:502});
  await db.execute(sql`INSERT INTO csca_mocktest_followups(phone,recipient_email,channel,status,sent_at) VALUES(${phone},${candidateEmail},'email','sent',now())`);
  return NextResponse.json({sent:true,message:"Thank-you email sent."},{headers:{"Cache-Control":"no-store"}});
 }
 if(b.action!=="submit")return NextResponse.json({error:"Invalid request."},{status:400});
 const s=String(b.subject||""),n=Number(b.testNumber||0);
 if(!isValidMockSubject(s)||!Number.isInteger(n)||n<1||n>20||!RELEASED_MOCKS[s].includes(n))return NextResponse.json({error:"This mock test is not released yet."},{status:403});
 const key=mockKey(s,n),e=getMockExam(key);if(!e)return NextResponse.json({error:"This mock test is not released yet."},{status:403});
 const name=String(b.name||"").trim().slice(0,180),rawPhone=String(b.phone||"").trim(),email=String(b.email||"").trim().toLowerCase().slice(0,320);
 if(!name||!isValidPhone(rawPhone)||!isValidComEmail(email))return NextResponse.json({error:"Enter your passport name, an 11-digit phone number starting with 0, and a valid .com email address."},{status:400});
 const phone=normalizePhone(rawPhone).slice(0,40);
 const answers=Array.isArray(b.answers)?b.answers.slice(0,e.questions.length).map((v:unknown)=>Number.isInteger(v)?Number(v):-1):[];
 if(answers.length!==e.questions.length||answers.some((a:number,i:number)=>a < -1||a>=e.questions[i].options.length))return NextResponse.json({error:"The submitted answer sheet is incomplete or invalid."},{status:400});
 const rawScore=e.questions.reduce((sum,q,i)=>sum+(answers[i]===q.answerIndex?(q.marks??1):0),0);const score=Math.round(rawScore*100)/100;
 const token=crypto.randomUUID(),awayCount=Math.max(0,Math.min(1000,Math.floor(Number(b.awayCount)||0)));
 const r=await db.execute(sql`
  INSERT INTO csca_mocktest_attempts(exam_key,subject,test_number,candidate_name,candidate_email,phone,answers,score,total_marks,question_count,duration_minutes,away_count,result_token,started_at,submitted_at)
  VALUES(${key},${s},${n},${name},${email},${phone},${JSON.stringify(answers)},${score},${e.totalMarks},${e.questions.length},${e.durationMinutes},${awayCount},${token},${String(b.startedAt||new Date().toISOString())},now())
  RETURNING exam_key,subject,test_number,candidate_name,candidate_email,phone,score,total_marks,question_count,duration_minutes,away_count,result_token AS token,started_at,submitted_at`);
 const row=firstRow(r)||{};
 const emailStatus=await sendMockTestSubmissionEmails({
  candidateName:String(row.candidate_name||name),candidateEmail:String(row.candidate_email||email),
  phone:String(row.phone||phone),subject:s,testNumber:n,score:Number(row.score??score),
  totalMarks:Number(row.total_marks??e.totalMarks),questionCount:Number(row.question_count??e.questions.length),
  durationMinutes:Number(row.duration_minutes??e.durationMinutes),awayCount:Number(row.away_count??awayCount),
  token:String(row.token||token),submittedAt:String(row.submitted_at||new Date().toISOString())
 });
 return NextResponse.json({submitted:true,...row,emailSent:emailStatus.studentSent},{headers:{"Cache-Control":"no-store"}});
 }catch(e){console.error("Mock-test POST error",e);return NextResponse.json({error:"Unable to submit this mock test right now."},{status:500});}}
