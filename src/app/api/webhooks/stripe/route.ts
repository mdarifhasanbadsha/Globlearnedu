export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Stripe Webhook" });
}

export async function POST() {
  return NextResponse.json({ message: "Stripe Webhook created" });
}
