import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "CSCA Mock Test Result | GL Education" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } }
};

export default function MockTestResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
