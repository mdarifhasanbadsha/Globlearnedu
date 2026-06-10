export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Universities API" });
}

export async function POST() {
  return NextResponse.json({ message: "Universities API created" });
}
