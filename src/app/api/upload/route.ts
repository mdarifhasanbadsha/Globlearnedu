import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Upload API" });
}

export async function POST() {
  return NextResponse.json({ message: "Upload API created" });
}
