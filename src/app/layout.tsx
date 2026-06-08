import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Study in China 2026–2027 — Scholarships & Universities | Globlearn Education",
    template: "%s | Globlearn Education",
  },
  description:
    "Globlearn Education — trusted by 5,000+ students from 80+ countries. Expert guidance for studying in China: CSC scholarships, university admissions, MBBS, Engineering, Business. Affordable cost. Expert visa guidance.",
  metadataBase: new URL("https://globlearnedu.com"),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {
    google: "",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <div id="scroll-progress" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
