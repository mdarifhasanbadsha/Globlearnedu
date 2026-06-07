import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Globlearn Education',
  description: 'Study in China consultancy platform.',
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {clerkPublishableKey ? (
          <ClerkProvider publishableKey={clerkPublishableKey}>{children}</ClerkProvider>
        ) : (
          <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <h1 className="text-2xl font-semibold text-red-900">Clerk configuration missing</h1>
              <p className="mt-4 text-red-700">
                Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> in your deployment environment.
              </p>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
