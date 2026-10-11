import {NextRequest,NextResponse} from "next/server";
import {db} from "@/lib/db";
import {sql} from "drizzle-orm";
import crypto from "crypto";
import {getMockExam} from "@/lib/csca/mocktest-bank";
import {isValidMockSubject,mockKey,RELEASED_MOCKS} from "@/lib/csca/mocktest-public";

const firstRow=(r:any)=>r?.rows?.[0]||r?.[0];
const normalizePhone=(v:string)=>{const d=v.replace(/[^0-9]/g,"").replace(/^00/,"");return d.length===11&&d.startsWith("01")?"88"+d:d;};
const adminToken=()=>crypto.createHmac("sha256","GL-EDU-CSCA-ADMIN").update("csca-homework-admin").digest("hex");
const validAdmin=(r:NextRequest)=>r.headers.get("x-csca-admin-token")===adminToken();

async function ensureTable(){
 await db.execute(sql`CREATE TABLE IF NOT EXISTS csca_mocktest_attempts(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),exam_key varchar(100) NOT NULL,subject varchar(30) NOT NULL,test_number integer NOT NULL,
  candidate_name varchar(180) NOT NULL,phone varchar(40) NOT NULL,answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  score numeric(10,2) NOT NULL DEFAULT 0,total_marks numeric(10,2) NOT NULL,question_count integer NOT NULL,
  duration_minutes integer NOT NULL,away_count integer NOT NULL DEFAULT 0,result_token varchar(100) NOT NULL UNIQUE,
  started_at timestamp NOT NULL DEFAULT now(),submitted_at timestamp NOT NULL DEFAULT now(),UNIQUE(exam_key,phone)
 )`);
 await db.execute(sql`ALTER TABLE csca_mocktest_attempts ADD COLUMN IF NOT EXISTS away_count integer NOT NULL DEFAULT 0`);
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
 const token=p.get("token");
 if(token){await ensureTable();const r=await db.execute(sql`SELECT exam_key,subject,test_number,candidate_name,phone,score,total_marks,question_count,duration_minutes,away_count,result_token AS token,started_at,submitted_at FROM csca_mocktest_attempts WHERE result_token=${token} LIMIT 1`);const row=firstRow(r);return NextResponse.json(row?{submitted:true,...row}:{submitted:false},{headers:{"Cache-Control":"no-store"}});}
 if(p.get("action")==="existing"){
  await ensureTable();const s=p.get("subject")||"",n=Number(p.get("test")||0),phone=normalizePhone(p.get("phone")||"");
  if(!isValidMockSubject(s)||!Number.isInteger(n)||n<1||n>20||phone.length<6)return NextResponse.json({error:"Please check the test and phone number."},{status:400});
  const key=mockKey(s,n);const r=await db.execute(sql`SELECT candidate_name,phone,score,total_marks,question_count,away_count,result_token AS token,submitted_at FROM csca_mocktest_attempts WHERE exam_key=${key} AND phone=${phone} LIMIT 1`);
  const row=firstRow(r);return NextResponse.json(row?{taken:true,...row}:{taken:false},{headers:{"Cache-Control":"no-store"}});
 }
 if(p.get("admin")==="1"){
  await ensureTable();if(!validAdmin(req))return NextResponse.json({error:"Unauthorized."},{status:401});
  const s=p.get("subject")||"mathematics",n=Number(p.get("test")||1);
  if(!isValidMockSubject(s)||!Number.isInteger(n)||n<1||n>20)return NextResponse.json({error:"Invalid subject/test."},{status:400});
  const key=mockKey(s,n);const r=await db.execute(sql`SELECT id,exam_key,subject,test_number,candidate_name,phone,score,total_marks,question_count,duration_minutes,away_count,result_token AS token,started_at,submitted_at FROM csca_mocktest_attempts WHERE exam_key=${key} ORDER BY submitted_at DESC`);
  const e=getMockExam(key);return NextResponse.json({submissions:r?.rows||r||[],exam:e?publicExam(e):null},{headers:{"Cache-Control":"no-store"}});
 }
 return NextResponse.json({error:"Invalid request."},{status:400});
 }catch(e){console.error("Mock-test GET error",e);return NextResponse.json({error:"Unable to load mock-test information."},{status:500});}}

export async function POST(req:NextRequest){try{
 await ensureTable();const b=await req.json();
 if(b.action!=="submit")return NextResponse.json({error:"Invalid request."},{status:400});
 const s=String(b.subject||""),n=Number(b.testNumber||0);
 if(!isValidMockSubject(s)||!Number.isInteger(n)||n<1||n>20||!RELEASED_MOCKS[s].includes(n))return NextResponse.json({error:"This mock test is not released yet."},{status:403});
 const key=mockKey(s,n),e=getMockExam(key);if(!e)return NextResponse.json({error:"This mock test is not released yet."},{status:403});
 const name=String(b.name||"").trim().slice(0,180),phone=normalizePhone(String(b.phone||"")).slice(0,40);
 const answers=Array.isArray(b.answers)?b.answers.slice(0,e.questions.length).map((v:unknown)=>Number.isInteger(v)?Number(v):-1):[];
 if(!name||phone.length<6)return NextResponse.json({error:"Enter your passport name and a valid phone number."},{status:400});
 if(answers.length!==e.questions.length||answers.some((a:number,i:number)=>a < -1||a>=e.questions[i].options.length))return NextResponse.json({error:"The submitted answer sheet is incomplete or invalid."},{status:400});
 const score=e.questions.reduce((sum,q,i)=>sum+(answers[i]===q.answerIndex?(q.marks??1):0),0);
 const token=crypto.randomUUID(),awayCount=Math.max(0,Math.min(1000,Math.floor(Number(b.awayCount)||0)));
 const r=await db.execute(sql`
  INSERT INTO csca_mocktest_attempts(exam_key,subject,test_number,candidate_name,phone,answers,score,total_marks,question_count,duration_minutes,away_count,result_token,started_at,submitted_at)
  VALUES(${key},${s},${n},${name},${phone},${JSON.stringify(answers)},${score},${e.totalMarks},${e.questions.length},${e.durationMinutes},${awayCount},${token},${String(b.startedAt||new Date().toISOString())},now())
  ON CONFLICT(exam_key,phone) DO UPDATE SET candidate_name=EXCLUDED.candidate_name,answers=EXCLUDED.answers,score=EXCLUDED.score,total_marks=EXCLUDED.total_marks,question_count=EXCLUDED.question_count,duration_minutes=EXCLUDED.duration_minutes,away_count=EXCLUDED.away_count,result_token=EXCLUDED.result_token,started_at=EXCLUDED.started_at,submitted_at=now()
  RETURNING exam_key,subject,test_number,candidate_name,phone,score,total_marks,question_count,duration_minutes,away_count,result_token AS token,started_at,submitted_at`);
 return NextResponse.json({submitted:true,...(firstRow(r)||{})},{headers:{"Cache-Control":"no-store"}});
 }catch(e){console.error("Mock-test POST error",e);return NextResponse.json({error:"Unable to submit this mock test right now."},{status:500});}}
