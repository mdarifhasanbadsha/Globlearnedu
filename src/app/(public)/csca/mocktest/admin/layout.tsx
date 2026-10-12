import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Mock Test Administration | GL Education" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } }
};

export default function MockTestAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
