import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Globlearn Education — Study in China",
    template: "%s | Globlearn Education",
  },
  description:
    "Globlearn Education helps students from Africa, Middle East & South Asia study at top Chinese universities with CSC, University & Provincial scholarships. 99% visa guidance success.",
  keywords: [
    "study in China",
    "CSC scholarship 2025",
    "China university admission",
    "Globlearn Education",
    "MBBS China",
    "scholarship China 2025",
  ],
  metadataBase: new URL("https://globlearnedu.com"),
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
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="font-sans antialiased">
          <div id="scroll-progress" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
