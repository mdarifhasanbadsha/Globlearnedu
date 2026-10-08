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
  "/refer-and-earn",
  "/hsk",
  "/sign-in",
  "/sign-up",
  "/sign-out",
  "/forgot-password",
  "/reset-password",

  "/verify-email",
  "/csca",
];

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith("/study-in-china-from")) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname === "/cscaattaendance" || pathname.startsWith("/cscaattaendance/")) return true;
  if (pathname.startsWith("/api/attendance")) return true;
  if (pathname.startsWith("/api/csca/homework")) return true;
  if (pathname.startsWith("/api/public")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$/)) return true;
  return publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

const protectedMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

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

  if (pathname.startsWith("/partner/") && !["partner", "admin"].includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export default function middleware(req: Parameters<typeof protectedMiddleware>[0]) {
  if (isPublicPath(req.nextUrl.pathname)) return NextResponse.next();
  return (protectedMiddleware as any)(req);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
