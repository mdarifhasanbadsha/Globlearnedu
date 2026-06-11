import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Server-side logout — clears all auth cookies and redirects to home.
// Using a GET endpoint avoids CSRF requirements that break signOut() on Cloudflare Pages.
export async function GET() {
  const base = process.env.NEXTAUTH_URL ?? "https://globlearnedu.com";
  const response = NextResponse.redirect(new URL("/", base));

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    expires: new Date(0),
  };

  // Clear the custom session cookie
  response.cookies.set("gl_session_v2", "", cookieOptions);

  // Clear any other NextAuth cookies that might exist
  response.cookies.set("next-auth.session-token", "", cookieOptions);
  response.cookies.set("__Secure-next-auth.session-token", "", { ...cookieOptions, secure: true });
  response.cookies.set("next-auth.csrf-token", "", cookieOptions);
  response.cookies.set("__Host-next-auth.csrf-token", "", { ...cookieOptions, secure: true });
  response.cookies.set("next-auth.callback-url", "", cookieOptions);

  return response;
}
