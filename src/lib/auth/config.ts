import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, staff } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "gl_session_v2",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/sign-in",
    newUser: "/dashboard",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "student";
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.staffRole = (user as any).staffRole ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).staffRole = token.staffRole ?? null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

          if (!user || !user.passwordHash) return null;
          if (!user.isActive) return null;

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) return null;

          // Load staffRole for staff/admin users
          let staffRole: string | null = null;
          if (user.role === "staff" || user.role === "admin") {
            const [staffRecord] = await db
              .select({ staffRole: staff.staffRole })
              .from(staff)
              .where(eq(staff.userId, user.id))
              .limit(1);
            if (staffRecord) staffRole = staffRecord.staffRole;
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            staffRole,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
