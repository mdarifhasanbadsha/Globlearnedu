import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        variables: { colorPrimary: "#C8102E" },
      }}
    />
  );
}
