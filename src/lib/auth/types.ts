import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "partner" | "staff" | "admin";
      firstName?: string | null;
      lastName?: string | null;
    } & DefaultSession["user"];
  }
}

export type UserRole = "student" | "partner" | "staff" | "admin";
