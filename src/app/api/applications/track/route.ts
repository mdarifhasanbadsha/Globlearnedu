export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const applicationNumber = searchParams.get("applicationNumber");
  const passportNumber = searchParams.get("passportNumber");

  if (!applicationNumber && !passportNumber) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  if (applicationNumber) {
    const app = await db.query.applications.findFirst({
      where: eq(applications.applicationNumber, applicationNumber.toUpperCase().trim()),
    });
    if (!app) return NextResponse.json({ found: false });
    return NextResponse.json({ found: true, applicationNumber: app.applicationNumber });
  }

  if (passportNumber) {
    const app = await db.query.applications.findFirst({
      where: eq(applications.passportNumber, passportNumber.trim()),
    });
    if (!app) return NextResponse.json({ found: false });
    return NextResponse.json({ found: true, applicationNumber: app.applicationNumber });
  }

  return NextResponse.json({ found: false });
}
