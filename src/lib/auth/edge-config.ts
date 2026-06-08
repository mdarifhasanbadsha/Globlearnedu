import NextAuth from "next-auth";

// Edge-compatible auth config (no bcryptjs, no DB) — used only by middleware.
// Credentials validation happens in the full config (config.ts) via the API route.
export const { auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "student";
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
      }
      return session;
    },
  },
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
