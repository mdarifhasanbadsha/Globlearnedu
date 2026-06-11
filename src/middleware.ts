import { auth } from "@/lib/auth/edge-config";
import { NextResponse } from "next/server";

const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/blog",
  "/universities",
  "/programs",
  "/scholarships",
  "/compare",
  "/track",
  "/partner",
  "/refer-and-earn",
  "/sign-in",
  "/sign-up",
  "/sign-out",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith("/study-in-china-from")) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/api/public")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$/)) return true;
  return publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (isPublicPath(pathname)) return NextResponse.next();

  if (!session?.user) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = (session.user as any).role;

  if (pathname.startsWith("/admin") && !["admin", "staff"].includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/staff") && !["admin", "staff"].includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/partner/dashboard") && !["partner", "admin"].includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
