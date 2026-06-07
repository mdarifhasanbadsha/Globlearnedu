import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    clerkPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerkSecretKey: !!process.env.CLERK_SECRET_KEY,
    clerkWebhookSecret: !!process.env.CLERK_WEBHOOK_SECRET,
    databaseUrl: !!process.env.DATABASE_URL,
    r2BucketName: !!process.env.R2_BUCKET_NAME,
    r2PublicUrl: !!process.env.R2_PUBLIC_URL,
    resendApiKey: !!process.env.RESEND_API_KEY,
    stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
    appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    runtime: typeof process !== "undefined" && !!process.env,
  });
}
