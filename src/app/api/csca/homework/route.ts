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

export async function GET(req:NextRequest){
  try{
    await ensureTable();
    const {searchParams}=new URL(req.url);
    const token=searchParams.get("token");
    const assignment=searchParams.get("assignment");
    const phone=searchParams.get("phone");
    if(token){
      const rows=await db.execute(sql`SELECT name, phone, score, assignment, result_token AS token, submitted_at FROM csca_homework_submissions WHERE result_token=${token} LIMIT 1`);
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
    const assignment=String(body.assignment||"").trim();
    const name=String(body.name||"").trim().slice(0,150);
    const phone=normalizePhone(String(body.phone||"").trim()).slice(0,40);
    const answers=Array.isArray(body.answers)?body.answers.slice(0,20):[];
    const score=Math.max(0,Math.min(10,Number(body.score)||0));
    if(assignment!=="math-1") return NextResponse.json({error:"This assignment is not available."},{status:400});
    if(!name||phone.length<6) return NextResponse.json({error:"Please provide a valid name and phone number."},{status:400});
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
