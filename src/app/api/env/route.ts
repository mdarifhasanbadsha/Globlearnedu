export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    databaseUrl: !!process.env.DATABASE_URL,
    nextauthSecret: !!process.env.NEXTAUTH_SECRET,
    r2AccountId: !!process.env.R2_ACCOUNT_ID,
    r2BucketName: !!process.env.R2_BUCKET_NAME,
    r2PublicUrl: !!process.env.R2_PUBLIC_URL,
    resendApiKey: !!process.env.RESEND_API_KEY,
    appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    whatsappNumber: !!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  });
}
