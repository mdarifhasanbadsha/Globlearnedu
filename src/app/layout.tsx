import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Globlearn Education',
  description: 'Study in China consultancy platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
