import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import crypto from "crypto";

async function ensureTable(){
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS csca_homework_submissions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      assignment varchar(80) NOT NULL,
      name varchar(150) NOT NULL,
      phone varchar(40) NOT NULL,
      answers jsonb NOT NULL DEFAULT '[]'::jsonb,
      score integer NOT NULL,
      result_token varchar(80) NOT NULL UNIQUE,
      submitted_at timestamp NOT NULL DEFAULT now(),
      UNIQUE (assignment, phone)
    )
  `);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS csca_homework_assignment_idx ON csca_homework_submissions(assignment)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS csca_homework_phone_idx ON csca_homework_submissions(phone)`);
}

function normalizePhone(v:string){ return v.replace(/[^0-9+]/g,"").replace(/^00/,"+"); }

function firstRow(result:any){ return result?.rows?.[0] || result?.[0]; }

// Server-side answer keys: never trust a score supplied by the client.
const HOMEWORK_ANSWER_KEYS: Record<string, number[]> = {
  "math-1": [1, 0, 0, 1, 1, 2, 0, 0, 0, 0],
  "physics-1": [1, 2, 2, 0, 1, 2, 2, 3, 1, 1, 2, 1, 0, 2, 1, 2, 1, 2, 2, 1],
};
function adminToken(){
  const secret = process.env.CSCA_ADMIN_API_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return "";
  return crypto.createHmac("sha256", secret).update("csca-homework-admin").digest("hex");
}
function validAdmin(req:NextRequest){
  const expected = adminToken();
  const supplied = req.headers.get("x-csca-admin-token") || "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req:NextRequest){
  try{
    await ensureTable();
    const {searchParams}=new URL(req.url);
    if(searchParams.get("admin")==="1"){
      if(!validAdmin(req)) return NextResponse.json({error:"Unauthorized."},{status:401});
      const selected=searchParams.get("assignment")||"math-1";
      const rows=await db.execute(sql`SELECT id, assignment, name, phone, score, submitted_at FROM csca_homework_submissions WHERE assignment=${selected} ORDER BY submitted_at DESC`);
      return NextResponse.json({submissions:rows?.rows||rows||[]});
    }
    const token=searchParams.get("token");
    const assignment=searchParams.get("assignment");
    const phone=searchParams.get("phone");
    if(token){
      const rows=await db.execute(sql`SELECT name, phone, score, answers, assignment, result_token AS token, submitted_at FROM csca_homework_submissions WHERE result_token=${token} LIMIT 1`);
      const row=firstRow(rows);
      return NextResponse.json(row?{submitted:true,...row}:{submitted:false});
    }
    if(!assignment||!phone) return NextResponse.json({submitted:false});
    const normalized=normalizePhone(phone);
    const rows=await db.execute(sql`SELECT name, phone, score, assignment, result_token AS token, submitted_at FROM csca_homework_submissions WHERE assignment=${assignment} AND phone=${normalized} LIMIT 1`);
    const row=firstRow(rows);
    return NextResponse.json(row?{submitted:true,...row}:{submitted:false});
  }catch(error){
    console.error("CSCA homework GET error",error);
    return NextResponse.json({error:"Unable to check homework result."},{status:500});
  }
}

export async function POST(req:NextRequest){
  try{
    await ensureTable();
    const body=await req.json();
    if(body.adminLogin===true){
      // Lightweight math CAPTCHA: 39 + 87 = 126.
      if(String(body.captchaAnswer||"").trim()!=="126"){
        return NextResponse.json({error:"Incorrect security answer. Please solve 39 + 87."},{status:400});
      }
      const adminPhone=String(body.phone||"").replace(/[^0-9]/g,"");
      const adminPassword=String(body.password||"");
      const supplied=crypto.createHash("sha256").update(adminPhone+":"+adminPassword).digest("hex");
      const expected="cedf64195389f5ef9e15ca67231c28da8fc2a78fa9de0e3f86b0428b4f14f4f9";
      if(supplied===expected) {
        const token = adminToken();
        if(!token) return NextResponse.json({authenticated:false,error:"Admin API secret is not configured on the server."},{status:503});
        return NextResponse.json({authenticated:true,token});
      }
      return NextResponse.json({authenticated:false,error:"Invalid admin phone number or password."},{status:401});
    }
    const assignment=String(body.assignment||"").trim();
    const name=String(body.name||"").trim().slice(0,150);
    const phone=normalizePhone(String(body.phone||"").trim()).slice(0,40);
    const answerKey = HOMEWORK_ANSWER_KEYS[assignment];
    if(!answerKey) return NextResponse.json({error:"This assignment is not available."},{status:400});
    if(!name||phone.length<6) return NextResponse.json({error:"Please provide a valid name and phone number."},{status:400});

    const submitted = Array.isArray(body.answers) ? body.answers : [];
    if(submitted.length !== answerKey.length || submitted.some((value: unknown) => !Number.isInteger(value) || Number(value) < 0 || Number(value) > 3)) {
      return NextResponse.json({error:"The submitted answer sheet is incomplete or invalid."},{status:400});
    }
    const answers = submitted.map((value: unknown) => Number(value));
    // Score exclusively on the server. A caller-provided body.score is intentionally ignored.
    const score = answers.reduce((total: number, answer: number, index: number) => total + (answer === answerKey[index] ? 1 : 0), 0);
    const existing=await db.execute(sql`SELECT name, phone, score, result_token AS token FROM csca_homework_submissions WHERE assignment=${assignment} AND phone=${phone} LIMIT 1`);
    const old=firstRow(existing);
    if(old) return NextResponse.json({submitted:true,...old});
    const token=crypto.randomUUID();
    const inserted=await db.execute(sql`INSERT INTO csca_homework_submissions (assignment,name,phone,answers,score,result_token) VALUES (${assignment},${name},${phone},${JSON.stringify(answers)},${score},${token}) RETURNING name, phone, score, assignment, result_token AS token, submitted_at`);
    const row=firstRow(inserted);
    return NextResponse.json({submitted:true,...row});
  }catch(error:any){
    console.error("CSCA homework POST error",error);
    if(String(error?.message||"").toLowerCase().includes("unique")) return NextResponse.json({error:"This phone number has already submitted this assignment."},{status:409});
    return NextResponse.json({error:"Unable to submit homework right now."},{status:500});
  }
}
