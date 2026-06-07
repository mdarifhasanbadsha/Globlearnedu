import { NextResponse, type NextRequest } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

async function getRole(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.userId) return null;
  const user = await clerkClient.users.getUser(auth.userId);
  return user.publicMetadata?.role as string | null;
}

export async function middleware(req: NextRequest) {
  const role = await getRole(req);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard') && role !== 'student') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (pathname.startsWith('/partner') && role !== 'partner') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (pathname.startsWith('/staff') && role !== 'staff' && role !== 'admin') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/partner/:path*', '/staff/:path*', '/admin/:path*', '/api/:path*'],
};
