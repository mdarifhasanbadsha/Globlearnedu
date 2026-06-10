import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/", process.env.NEXTAUTH_URL || "https://globlearnedu.com")
  );

  const cookieNames = [
    "gl_session_v2",
    "gl_session_token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "__Secure-next-auth.callback-url",
    "next-auth.callback-url",
  ];

  cookieNames.forEach((name) => {
    response.cookies.set(name, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
    });
  });

  return response;
}
