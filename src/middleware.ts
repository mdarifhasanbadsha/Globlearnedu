import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk v5 requires middleware to propagate session state to server components.
// Route protection is handled by individual layout.tsx files via auth().
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|otf)).*)",
    "/(api|trpc)(.*)",
  ],
};
