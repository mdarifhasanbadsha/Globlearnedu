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
    default: "Study in China 2026–2027 | Globlearn Education",
    template: "%s | Globlearn Education",
  },
  description:
    "Globlearn Education — your trusted partner for studying in China. Expert guidance for CSC scholarships, university applications, and student visas. Trusted by 5,000+ students from 80+ countries since 2014.",
  keywords: [
    "study in China",
    "CSC scholarship 2026",
    "China university admission",
    "Globlearn Education",
    "MBBS China",
    "scholarship China 2026",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://globlearnedu.com"),
  openGraph: {
    type: "website",
    siteName: "Globlearn Education",
    title: "Globlearn Education — Study in China",
    description:
      "Top-ranked Chinese universities with affordable tuition and full scholarship opportunities.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@globlearnedu" },
  robots: { index: true, follow: true },
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
