import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Clerk Webhook" });
}

export async function POST() {
  return NextResponse.json({ message: "Clerk Webhook created" });
}
