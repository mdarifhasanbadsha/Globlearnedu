const fs = require('fs');
const path = require('path');
const root = process.cwd();
function write(filePath, content) {
  const fullPath = path.join(root, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
function pageContent(title) {
  return `import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-8">
      <div className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <h1 className="text-4xl font-semibold text-slate-900">${title}</h1>
        <p className="mt-4 text-slate-600">This is a scaffolded page for the Globlearn Education platform.</p>
      </div>
    </main>
  );
}
`;
}
function routeContent(message) {
  return `import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "${message}" });
}

export async function POST() {
  return NextResponse.json({ message: "${message} created" });
}
`;
}
const files = [
  ['.gitignore', `node_modules/
.next/
.open-next/
out/
dist/
.env.local
.env.*.local
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log
`],
  ['package.json', JSON.stringify({
    name: 'globlearnedu',
    private: true,
    version: '0.1.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      preview: 'opennextjs-cloudflare build && wrangler dev',
      deploy: 'opennextjs-cloudflare build && wrangler deploy',
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
      'db:generate': 'drizzle-kit generate'
    },
    dependencies: {
      next: '^15.0.0',
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      '@opennextjs/cloudflare': '^1.0.0',
      '@clerk/nextjs': '^5.0.0',
      '@neondatabase/serverless': '^1.0.0',
      'drizzle-orm': '^0.45.2',
      resend: '^1.0.0',
      stripe: '^12.0.0',
      '@aws-sdk/client-s3': '^3.0.0',
      'framer-motion': '^11.0.0',
      'date-fns': '^2.0.0',
      zod: '^3.0.0',
      '@tanstack/react-query': '^5.0.0'
    },
    devDependencies: {
      typescript: '^5.5.4',
      eslint: '^8.0.0',
      'eslint-config-next': 'latest',
      tailwindcss: '^4.0.0',
      postcss: '^8.4.0',
      autoprefixer: '^10.0.0',
      wrangler: '^4.0.0',
      'drizzle-kit': '^1.0.0',
      '@types/node': '^20.0.0',
      '@types/react': '^18.3.3',
      '@types/react-dom': '^18.3.0'
    }
  }, null, 2)],
  ['tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      lib: ['dom', 'dom.iterable', 'es2022'],
      allowJs: false,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      types: ['node']
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
    exclude: ['node_modules']
  }, null, 2)],
  ['next-env.d.ts', `/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module "*.module.css";
declare module "*.module.scss";
declare module "*.module.sass";
`],
  ['next.config.mjs', `const nextConfig = {
  experimental: {
    serverActions: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
`],
  ['tailwind.config.ts', `import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
`],
  ['postcss.config.js', `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`],
  ['open-next.config.ts', `import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  cloudflare: {
    compatibilityDate: '2026-06-01',
    compatibilityFlags: ['nodejs_compat'],
    assets: {
      directory: '.open-next/assets',
      binding: 'ASSETS',
    },
  },
};

export default config;
`],
  ['wrangler.jsonc', `{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "globlearnedu",
  "compatibility_date": "2026-06-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
`],
  ['.env.local.example', `# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Neon Database
DATABASE_URL=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=globlearnedu-files
R2_PUBLIC_URL=

# Resend Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@globlearnedu.com

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=https://globlearnedu.com
NEXT_PUBLIC_APP_NAME=Globlearn Education
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_WECHAT_QR_URL=
`],
  ['README.md', `# Globlearn Education

Scaffold for the Globlearn Education Study in China consultancy platform.

## Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Cloudflare Pages with OpenNext
- Neon Postgres + Drizzle ORM
- Clerk Authentication
- Cloudflare R2
- Resend Email
- Stripe
`],
  ['.github/workflows/deploy.yml', `name: Deploy Globlearn Education

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v5
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
`],
  ['middleware.ts', `import { NextResponse, type NextRequest } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

async function getRole(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.userId) return null;
  const user = await clerkClient.users.getUser(auth.userId);
  return user.publicMetadata?.role as string | null;
}

export async function middleware(req: NextRequest) {
  const role = await getRole(req);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard') && role !== 'student') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (pathname.startsWith('/partner') && role !== 'partner') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (pathname.startsWith('/staff') && role !== 'staff' && role !== 'admin') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/partner/:path*', '/staff/:path*', '/admin/:path*', '/api/:path*'],
};
`],
  ['src/app/layout.tsx', `import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Globlearn Education',
  description: 'Study in China consultancy platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
`],
  ['src/app/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f8fafc;
  color: #0f172a;
}

* {
  box-sizing: border-box;
}
`],
  ['src/lib/db/index.ts', `import { drizzle } from 'drizzle-orm';
import { neonHttp } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const client = neonHttp({ url: process.env.DATABASE_URL });
export const db = drizzle(client);
`],
  ['src/lib/auth/index.ts', `import { type NextRequest } from 'next/server';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import type { UserRole } from '~/types';

export async function getUserRole(req: NextRequest): Promise<UserRole | null> {
  const auth = getAuth(req);
  if (!auth.userId) return null;
  const user = await clerkClient.users.getUser(auth.userId);
  return (user.publicMetadata?.role as UserRole | undefined) ?? null;
}

export function isStudent(role: string | null): role is 'student' {
  return role === 'student';
}

export function isPartner(role: string | null): role is 'partner' {
  return role === 'partner';
}

export function isStaff(role: string | null): role is 'staff' {
  return role === 'staff';
}

export function isAdmin(role: string | null): role is 'admin' {
  return role === 'admin';
}

export function requireRole(role: UserRole | null, expected: UserRole[]) {
  return role !== null && expected.includes(role);
}
`],
  ['src/lib/r2/index.ts', `import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

if (!process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_URL) {
  throw new Error('R2_BUCKET_NAME and R2_PUBLIC_URL are required');
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_PUBLIC_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadFile(key: string, body: Uint8Array | Buffer | string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return r2Client.send(command);
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });
  return r2Client.send(command);
}
`],
  ['src/lib/email/index.ts', `import Resend from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: { to: string; subject: string; html?: string; text?: string }) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'noreply@globlearnedu.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
`],
  ['src/lib/notifications/index.ts', `import { db } from '~/lib/db';
import { notifications } from '~/lib/db/schema';
import { sendEmail } from '~/lib/email';

export async function sendNotification(applicationId: number, recipientType: 'student' | 'partner', recipientId: number, type: string, data: { title: string; message: string; email?: string; }) {
  await db.insert(notifications).values({
    application_id: applicationId,
    application_university_id: null,
    recipient_type: recipientType,
    recipient_id: recipientId,
    notification_type: type,
    title: data.title,
    message: data.message,
    is_read: false,
    sent_at: new Date(),
    created_at: new Date(),
  });

  if (data.email) {
    await sendEmail({
      to: data.email,
      subject: data.title,
      text: data.message,
    });
  }
}
`],
  ['src/lib/whatsapp/index.ts', `export function generateWhatsAppLink(phone: string, templateType: string, data: Record<string, string>) {
  const parts = ['Hello from Globlearn Education,', 'I am interested in ' + templateType + '.'];
  for (const key in data) {
    parts.push(key + ': ' + data[key]);
  }
  const text = encodeURIComponent(parts.join(' '));
  return 'https://wa.me/' + phone + '?text=' + text;
}
`],
  ['src/lib/seo/index.ts', `export function generateUniversityMeta(university: { name_en: string; description: string; slug: string }) {
  return {
    title: university.name_en + ' | Globlearn Education',
    description: university.description,
    openGraph: {
      title: university.name_en,
      description: university.description,
      url: process.env.NEXT_PUBLIC_APP_URL + '/universities/' + university.slug,
    },
  };
}

export function generateBlogMeta(post: { title: string; excerpt: string; slug: string }) {
  return {
    title: post.title + ' | Globlearn Education Blog',
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: process.env.NEXT_PUBLIC_APP_URL + '/blog/' + post.slug,
    },
  };
}

export function generateProgramMeta(program: { name: string; degree_level: string; slug: string }) {
  return {
    title: program.name + ' | ' + program.degree_level + ' Program | Globlearn Education',
    description: 'Explore ' + program.name + ' with Globlearn Education.',
    openGraph: {
      title: program.name,
      description: 'Explore ' + program.name + ' with Globlearn Education.',
      url: process.env.NEXT_PUBLIC_APP_URL + '/programs/' + program.slug,
    },
  };
}
`],
  ['src/lib/utils/index.ts', `export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
}

export function formatRMB(amount: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount);
}

export function generateApplicationNumber(counter: number) {
  return 'APP-' + new Date().getFullYear() + '-' + String(counter).padStart(4, '0');
}

export function generateTrackingToken() {
  return crypto.randomUUID();
}

export function getTimezoneFromCountry(country: string) {
  const mapping: Record<string, string> = {
    China: 'Asia/Shanghai',
    India: 'Asia/Kolkata',
    Nigeria: 'Africa/Lagos',
    Brazil: 'America/Sao_Paulo',
    Ghana: 'Africa/Accra',
  };
  return mapping[country] ?? 'Asia/Shanghai';
}
`],
  ['src/lib/payments/index.ts', `import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

export async function createPaymentIntent(amount: number, currency: string, metadata: Record<string, string>) {
  return stripe.paymentIntents.create({ amount, currency, metadata });
}

export async function retrievePaymentIntent(id: string) {
  return stripe.paymentIntents.retrieve(id);
}
`],
];
for (const [filePath, content] of files) {
  write(filePath, content);
}
const pageFiles = [
  ['src/app/(public)/page.tsx', 'Globlearn Education'],
  ['src/app/(public)/universities/page.tsx', 'University Search'],
  ['src/app/(public)/universities/[slug]/page.tsx', 'University Profile'],
  ['src/app/(public)/universities/[slug]/apply/page.tsx', 'University Application Portal'],
  ['src/app/(public)/programs/[slug]/page.tsx', 'Program Details'],
  ['src/app/(public)/blog/page.tsx', 'Blog Listing'],
  ['src/app/(public)/blog/[slug]/page.tsx', 'Blog Post'],
  ['src/app/(public)/study-in-china-from/[country]/page.tsx', 'Country Landing Page'],
  ['src/app/(public)/compare/page.tsx', 'University Comparison'],
  ['src/app/(auth)/sign-in/page.tsx', 'Sign In'],
  ['src/app/(auth)/sign-up/page.tsx', 'Sign Up'],
  ['src/app/(student)/dashboard/page.tsx', 'Student Dashboard'],
  ['src/app/(student)/dashboard/application/page.tsx', 'My Applications'],
  ['src/app/(student)/dashboard/documents/page.tsx', 'Documents & Info'],
  ['src/app/(student)/dashboard/notices/page.tsx', 'Notices'],
  ['src/app/(student)/dashboard/payments/page.tsx', 'Payments'],
  ['src/app/(student)/dashboard/guide/page.tsx', 'Visa & Travel Guide'],
  ['src/app/(partner)/partner/page.tsx', 'Partner Dashboard'],
  ['src/app/(partner)/partner/students/page.tsx', 'Partner Student List'],
  ['src/app/(partner)/partner/add-student/page.tsx', 'Partner Add Student'],
  ['src/app/(partner)/partner/notices/page.tsx', 'Partner Notices'],
  ['src/app/(partner)/partner/commission/page.tsx', 'Partner Commission'],
  ['src/app/(partner)/partner/profile/page.tsx', 'Partner Profile'],
  ['src/app/(staff)/staff/page.tsx', 'Staff Application Queue'],
  ['src/app/(staff)/staff/applications/[id]/page.tsx', 'Application Detail'],
  ['src/app/(admin)/admin/page.tsx', 'Admin Dashboard'],
  ['src/app/(admin)/admin/universities/page.tsx', 'Admin Universities'],
  ['src/app/(admin)/admin/universities/new/page.tsx', 'Create University'],
  ['src/app/(admin)/admin/universities/[id]/page.tsx', 'Edit University'],
  ['src/app/(admin)/admin/applications/page.tsx', 'Admin Applications'],
  ['src/app/(admin)/admin/blog/page.tsx', 'Admin Blog'],
  ['src/app/(admin)/admin/blog/[id]/page.tsx', 'Edit Blog Post'],
  ['src/app/(admin)/admin/partners/page.tsx', 'Admin Partners'],
  ['src/app/(admin)/admin/staff/page.tsx', 'Admin Staff'],
  ['src/app/(admin)/admin/settings/page.tsx', 'Admin Settings'],
];
for (const [filePath, title] of pageFiles) {
  write(filePath, pageContent(title));
}
const routeFiles = [
  ['src/app/api/universities/route.ts', 'Universities API'],
  ['src/app/api/applications/route.ts', 'Applications API'],
  ['src/app/api/upload/route.ts', 'Upload API'],
  ['src/app/api/payments/route.ts', 'Payments API'],
  ['src/app/api/webhooks/clerk/route.ts', 'Clerk Webhook'],
  ['src/app/api/webhooks/stripe/route.ts', 'Stripe Webhook'],
];
for (const [filePath, message] of routeFiles) {
  write(filePath, routeContent(message));
}
write('src/types/index.ts', `export type UserRole = 'student' | 'partner' | 'staff' | 'admin';
export type Currency = 'RMB' | 'USD';
export type DocumentType =
  | 'photo'
  | 'passport_data_page'
  | 'academic_certificate'
  | 'academic_transcript'
  | 'police_clearance'
  | 'physical_exam'
  | 'bank_statement'
  | 'english_proficiency'
  | 'recommendation_1'
  | 'recommendation_2'
  | 'self_intro_video'
  | 'eca'
  | 'china_physical_exam'
  | 'china_police_clearance'
  | 'enrolment_certificate'
  | 'other';
`);
write('src/components/layout/Header.tsx', `export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="text-lg font-semibold text-slate-900">Globlearn Education</div>
      </div>
    </header>
  );
}
`);
write('src/components/layout/Footer.tsx', `export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 py-6 text-sm text-slate-500">
      <div className="mx-auto max-w-7xl">© 2026 Globlearn Education. All rights reserved.</div>
    </footer>
  );
}
`);
write('src/components/layout/index.ts', `export * from './Header';
export * from './Footer';
`);
write('src/components/ui/Placeholder.tsx', `export function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-slate-500">This page is scaffolded and ready for implementation.</p>
    </div>
  );
}
`);
write('src/lib/db/schema.ts', `import {
  pgEnum,
  pgTable,
  text,
  varchar,
  integer,
  serial,
  boolean,
  timestamp,
  date,
  textArray,
} from 'drizzle-orm/pg-core';

export const universityType = pgEnum('university_type', ['985', '211', 'regular', 'vocational', 'language']);
export const degreeLevel = pgEnum('degree_level', ['bachelor', 'master', 'phd', 'language', 'diploma']);
export const scholarshipType = pgEnum('scholarship_type', ['csc', 'university', 'provincial', 'other']);
export const coverageType = pgEnum('coverage_type', ['full', 'partial']);
export const paymentType = pgEnum('payment_type', ['deposit', 'university_deposit', 'service_charge']);
export const paymentStatus = pgEnum('payment_status', ['pending', 'pending_verification', 'confirmed', 'failed']);
export const currencyType = pgEnum('currency_type', ['RMB', 'USD']);
export const staffRole = pgEnum('staff_role', ['staff', 'senior_staff', 'admin']);
export const applicationStatus = pgEnum('application_status', ['draft', 'submitted', 'under_review', 'approved', 'processing', 'complete', 'cancelled']);
export const depositStatus = pgEnum('deposit_status', ['pending', 'paid', 'waived']);
export const serviceChargeStatus = pgEnum('service_charge_status', ['pending', 'invoiced', 'paid']);
export const universityApplicationStatus = pgEnum('university_application_status', [
  'pending',
  'applied',
  'processing',
  'interview_required',
  'interview_scheduled',
  'interview_completed',
  'pre_admission',
  'pre_admission_confirmed',
  'deposit_required',
  'deposit_paid',
  'admitted',
  'rejected',
  'withdrew',
]);
export const recipientType = pgEnum('recipient_type', ['student', 'partner']);
export const notificationType = pgEnum('notification_type', ['status_update', 'document_request', 'interview_scheduled', 'interview_reminder', 'pre_admission', 'admitted', 'payment_request', 'general']);
export const blogStatus = pgEnum('blog_status', ['draft', 'published', 'scheduled']);

export const universities = pgTable('universities', {
  id: serial('id').primaryKey(),
  name_en: varchar('name_en', { length: 255 }).notNull(),
  name_zh: varchar('name_zh', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  agency_number: varchar('agency_number', { length: 64 }).notNull(),
  type: universityType('type').notNull(),
  city: varchar('city', { length: 128 }).notNull(),
  province: varchar('province', { length: 128 }).notNull(),
  country: varchar('country', { length: 128 }).notNull().default('China'),
  website: varchar('website', { length: 255 }).notNull(),
  founded_year: integer('founded_year').notNull(),
  qs_ranking: integer('qs_ranking'),
  the_ranking: integer('the_ranking'),
  china_ranking: integer('china_ranking'),
  ranking_year: integer('ranking_year'),
  total_students: integer('total_students'),
  campus_size: varchar('campus_size', { length: 128 }),
  description: text('description').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  is_featured: boolean('is_featured').notNull().default(false),
  is_partner: boolean('is_partner').notNull().default(false),
  data_confidence: varchar('data_confidence', { length: 32 }).notNull().default('unverified'),
  last_verified_at: timestamp('last_verified_at'),
  last_verified_by: varchar('last_verified_by', { length: 128 }),
  hero_image_url: varchar('hero_image_url', { length: 512 }),
  logo_url: varchar('logo_url', { length: 512 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const programs = pgTable('programs', {
  id: serial('id').primaryKey(),
  university_id: integer('university_id').notNull().references(() => universities.id),
  name: varchar('name', { length: 255 }).notNull(),
  degree_level: degreeLevel('degree_level').notNull(),
  medium_of_instruction: varchar('medium_of_instruction', { length: 32 }).notNull(),
  duration_years: integer('duration_years').notNull(),
  tuition_fee_rmb_per_year: integer('tuition_fee_rmb_per_year').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  intake_months: textArray('intake_months'),
  requires_interview: boolean('requires_interview').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const majors = pgTable('majors', {
  id: serial('id').primaryKey(),
  program_id: integer('program_id').notNull().references(() => programs.id),
  university_id: integer('university_id').notNull().references(() => universities.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const scholarships = pgTable('scholarships', {
  id: serial('id').primaryKey(),
  university_id: integer('university_id').notNull().references(() => universities.id),
  type: scholarshipType('type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  coverage_type: coverageType('coverage_type').notNull(),
  applicable_levels: textArray('applicable_levels'),
  covers_tuition: boolean('covers_tuition').notNull().default(false),
  tuition_percentage: integer('tuition_percentage'),
  covers_accommodation: boolean('covers_accommodation').notNull().default(false),
  covers_stipend: boolean('covers_stipend').notNull().default(false),
  stipend_amount_monthly: integer('stipend_amount_monthly'),
  covers_insurance: boolean('covers_insurance').notNull().default(false),
  covers_travel: boolean('covers_travel').notNull().default(false),
  monthly_stipend_min: integer('monthly_stipend_min'),
  monthly_stipend_max: integer('monthly_stipend_max'),
  application_deadline: date('application_deadline'),
  quota_notes: text('quota_notes'),
  requirements: text('requirements'),
  province: varchar('province', { length: 128 }),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const actual_costs = pgTable('actual_costs', {
  id: serial('id').primaryKey(),
  university_id: integer('university_id').notNull().references(() => universities.id),
  cost_name: varchar('cost_name', { length: 255 }).notNull(),
  cost_type: varchar('cost_type', { length: 32 }).notNull(),
  amount_min_rmb: integer('amount_min_rmb'),
  amount_max_rmb: integer('amount_max_rmb'),
  is_covered_by_scholarship: textArray('is_covered_by_scholarship'),
  notes: text('notes'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const admission_cycles = pgTable('admission_cycles', {
  id: serial('id').primaryKey(),
  university_id: integer('university_id').notNull().references(() => universities.id),
  academic_year: varchar('academic_year', { length: 32 }).notNull(),
  application_open_date: date('application_open_date'),
  application_deadline: date('application_deadline'),
  intake_month: varchar('intake_month', { length: 32 }),
  intake_year: integer('intake_year'),
  is_active: boolean('is_active').notNull().default(true),
  auto_published: boolean('auto_published').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const university_gallery = pgTable('university_gallery', {
  id: serial('id').primaryKey(),
  university_id: integer('university_id').notNull().references(() => universities.id),
  image_url: varchar('image_url', { length: 512 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  caption: varchar('caption', { length: 512 }),
  display_order: integer('display_order').notNull().default(0),
  file_size_bytes: integer('file_size_bytes'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const university_videos = pgTable('university_videos', {
  id: serial('id').primaryKey(),
  university_id: integer('university_id').notNull().references(() => universities.id),
  video_url: varchar('video_url', { length: 512 }).notNull(),
  platform: varchar('platform', { length: 64 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 64 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  clerk_user_id: varchar('clerk_user_id', { length: 128 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  surname: varchar('surname', { length: 128 }),
  given_name: varchar('given_name', { length: 128 }),
  phone: varchar('phone', { length: 64 }),
  whatsapp: varchar('whatsapp', { length: 64 }),
  country: varchar('country', { length: 128 }),
  profile_photo_url: varchar('profile_photo_url', { length: 512 }),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  clerk_user_id: varchar('clerk_user_id', { length: 128 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  company_name: varchar('company_name', { length: 255 }).notNull(),
  contact_name: varchar('contact_name', { length: 255 }),
  phone: varchar('phone', { length: 64 }),
  whatsapp: varchar('whatsapp', { length: 64 }),
  country: varchar('country', { length: 128 }),
  commission_rate: integer('commission_rate').notNull().default(0),
  is_approved: boolean('is_approved').notNull().default(false),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const staff = pgTable('staff', {
  id: serial('id').primaryKey(),
  clerk_user_id: varchar('clerk_user_id', { length: 128 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  role: staffRole('role').notNull().default('staff'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  application_number: varchar('application_number', { length: 64 }).notNull().unique(),
  student_id: integer('student_id').notNull().references(() => students.id),
  partner_id: integer('partner_id').references(() => partners.id),
  degree_level: degreeLevel('degree_level').notNull(),
  overall_status: applicationStatus('overall_status').notNull().default('draft'),
  deposit_amount_rmb: integer('deposit_amount_rmb'),
  deposit_status: depositStatus('deposit_status').notNull().default('pending'),
  deposit_waived_by: varchar('deposit_waived_by', { length: 255 }),
  service_charge_amount: integer('service_charge_amount'),
  service_charge_status: serviceChargeStatus('service_charge_status').notNull().default('pending'),
  is_urgent: boolean('is_urgent').notNull().default(false),
  assigned_staff_id: integer('assigned_staff_id').references(() => staff.id),
  consent_ranking_substitution: boolean('consent_ranking_substitution').notNull().default(false),
  consent_given_at: timestamp('consent_given_at'),
  tracking_token: varchar('tracking_token', { length: 128 }).notNull().unique(),
  submitted_at: timestamp('submitted_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const application_universities = pgTable('application_universities', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id),
  university_id: integer('university_id').notNull().references(() => universities.id),
  program_id: integer('program_id').notNull().references(() => programs.id),
  major_preference: varchar('major_preference', { length: 255 }),
  option_order: integer('option_order').notNull().default(1),
  status: universityApplicationStatus('status').notNull().default('pending'),
  interview_type: varchar('interview_type', { length: 64 }),
  interview_platform: varchar('interview_platform', { length: 128 }),
  interview_datetime_cst: timestamp('interview_datetime_cst'),
  interview_duration_minutes: integer('interview_duration_minutes'),
  interview_link: varchar('interview_link', { length: 512 }),
  interview_password: varchar('interview_password', { length: 128 }),
  interview_interviewer: varchar('interview_interviewer', { length: 255 }),
  interview_language: varchar('interview_language', { length: 64 }),
  interview_guidelines: text('interview_guidelines'),
  university_deposit_required: boolean('university_deposit_required').notNull().default(false),
  university_deposit_amount: integer('university_deposit_amount'),
  university_deposit_status: varchar('university_deposit_status', { length: 64 }),
  pre_admission_doc_url: varchar('pre_admission_doc_url', { length: 512 }),
  admission_notice_url: varchar('admission_notice_url', { length: 512 }),
  jw202_url: varchar('jw202_url', { length: 512 }),
  rejection_reason: text('rejection_reason'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const application_personal_info = pgTable('application_personal_info', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id).unique(),
  surname: varchar('surname', { length: 128 }).notNull(),
  given_name: varchar('given_name', { length: 128 }).notNull(),
  gender: varchar('gender', { length: 32 }),
  dob: date('dob'),
  nationality: varchar('nationality', { length: 128 }),
  country_of_birth: varchar('country_of_birth', { length: 128 }),
  marital_status: varchar('marital_status', { length: 64 }),
  religion: varchar('religion', { length: 64 }),
  passport_number: varchar('passport_number', { length: 64 }),
  passport_issue_date: date('passport_issue_date'),
  passport_expiry_date: date('passport_expiry_date'),
  passport_issuing_country: varchar('passport_issuing_country', { length: 128 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const application_contact = pgTable('application_contact', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id).unique(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 64 }),
  whatsapp: varchar('whatsapp', { length: 64 }),
  detailed_address: text('detailed_address'),
  city: varchar('city', { length: 128 }),
  post_code: varchar('post_code', { length: 32 }),
  country: varchar('country', { length: 128 }),
  permanent_home_address: text('permanent_home_address'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const application_family = pgTable('application_family', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id).unique(),
  father_name: varchar('father_name', { length: 255 }),
  father_profession: varchar('father_profession', { length: 255 }),
  father_phone: varchar('father_phone', { length: 64 }),
  father_email: varchar('father_email', { length: 255 }),
  mother_name: varchar('mother_name', { length: 255 }),
  mother_profession: varchar('mother_profession', { length: 255 }),
  mother_phone: varchar('mother_phone', { length: 64 }),
  mother_email: varchar('mother_email', { length: 255 }),
  sponsor_type: varchar('sponsor_type', { length: 64 }),
  sponsor_name: varchar('sponsor_name', { length: 255 }),
  sponsor_relationship: varchar('sponsor_relationship', { length: 128 }),
  sponsor_phone: varchar('sponsor_phone', { length: 64 }),
  sponsor_email: varchar('sponsor_email', { length: 255 }),
  sponsor_occupation: varchar('sponsor_occupation', { length: 255 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const application_academic = pgTable('application_academic', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id),
  institution_name: varchar('institution_name', { length: 255 }).notNull(),
  country: varchar('country', { length: 128 }).notNull(),
  degree_level: varchar('degree_level', { length: 64 }).notNull(),
  major: varchar('major', { length: 255 }).notNull(),
  start_date: date('start_date'),
  end_date: date('end_date'),
  gpa: varchar('gpa', { length: 32 }),
  gpa_type: varchar('gpa_type', { length: 32 }),
  medium_of_instruction: varchar('medium_of_instruction', { length: 64 }),
  display_order: integer('display_order').notNull().default(1),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const application_work = pgTable('application_work', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id),
  company_name: varchar('company_name', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  start_date: date('start_date'),
  end_date: date('end_date'),
  is_current: boolean('is_current').notNull().default(false),
  contact_person_name: varchar('contact_person_name', { length: 255 }),
  contact_phone: varchar('contact_phone', { length: 64 }),
  contact_email: varchar('contact_email', { length: 255 }),
  display_order: integer('display_order').notNull().default(1),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const application_language = pgTable('application_language', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id).unique(),
  english_test_type: varchar('english_test_type', { length: 64 }).notNull().default('none'),
  english_score: varchar('english_score', { length: 64 }),
  english_issue_date: date('english_issue_date'),
  english_expiry_date: date('english_expiry_date'),
  chinese_test_type: varchar('chinese_test_type', { length: 64 }).notNull().default('none'),
  chinese_level: varchar('chinese_level', { length: 64 }),
  chinese_score: varchar('chinese_score', { length: 64 }),
  chinese_issue_date: date('chinese_issue_date'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const application_china_status = pgTable('application_china_status', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id).unique(),
  is_in_china: boolean('is_in_china').notNull().default(false),
  visa_type: varchar('visa_type', { length: 64 }),
  entry_date: date('entry_date'),
  visa_expiry_date: date('visa_expiry_date'),
  acknowledged_disclosure: boolean('acknowledged_disclosure').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const application_documents = pgTable('application_documents', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id),
  document_type: varchar('document_type', { length: 64 }).notNull(),
  file_url: varchar('file_url', { length: 512 }).notNull(),
  file_name: varchar('file_name', { length: 255 }).notNull(),
  file_size_bytes: integer('file_size_bytes'),
  upload_source: varchar('upload_source', { length: 64 }).notNull(),
  admin_status: varchar('admin_status', { length: 64 }).notNull().default('pending'),
  admin_notes: text('admin_notes'),
  is_compressed: boolean('is_compressed').notNull().default(false),
  original_size_bytes: integer('original_size_bytes'),
  uploaded_at: timestamp('uploaded_at').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id),
  payment_type: paymentType('payment_type').notNull(),
  amount: integer('amount').notNull(),
  currency: currencyType('currency').notNull(),
  payment_method: varchar('payment_method', { length: 64 }).notNull(),
  status: paymentStatus('status').notNull(),
  stripe_payment_intent_id: varchar('stripe_payment_intent_id', { length: 255 }),
  payment_slip_url: varchar('payment_slip_url', { length: 512 }),
  verified_by: varchar('verified_by', { length: 128 }),
  verified_at: timestamp('verified_at'),
  notes: text('notes'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id),
  application_university_id: integer('application_university_id').references(() => application_universities.id),
  recipient_type: recipientType('recipient_type').notNull(),
  recipient_id: integer('recipient_id').notNull(),
  notification_type: notificationType('notification_type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  is_read: boolean('is_read').notNull().default(false),
  read_at: timestamp('read_at'),
  sent_at: timestamp('sent_at').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const email_logs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').references(() => applications.id),
  recipient_email: varchar('recipient_email', { length: 255 }).notNull(),
  recipient_type: recipientType('recipient_type').notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  template_used: varchar('template_used', { length: 255 }),
  status: varchar('status', { length: 64 }).notNull(),
  resend_id: varchar('resend_id', { length: 255 }),
  sent_at: timestamp('sent_at').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const whatsapp_logs = pgTable('whatsapp_logs', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').references(() => applications.id),
  recipient_phone: varchar('recipient_phone', { length: 64 }).notNull(),
  recipient_type: recipientType('recipient_type').notNull(),
  message_preview: text('message_preview'),
  sent_by_staff_id: integer('sent_by_staff_id').references(() => staff.id),
  sent_at: timestamp('sent_at').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const application_notes = pgTable('application_notes', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id),
  note: text('note').notNull(),
  created_by_staff_id: integer('created_by_staff_id').notNull().references(() => staff.id),
  is_urgent_flag: boolean('is_urgent_flag').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const application_activity_log = pgTable('application_activity_log', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').notNull().references(() => applications.id),
  action: varchar('action', { length: 128 }).notNull(),
  details: text('details'),
  performed_by: varchar('performed_by', { length: 128 }),
  performed_by_type: varchar('performed_by_type', { length: 64 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const blog_posts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featured_image_url: varchar('featured_image_url', { length: 512 }),
  author_id: integer('author_id').notNull().references(() => staff.id),
  category: varchar('category', { length: 128 }),
  tags: textArray('tags'),
  seo_title: varchar('seo_title', { length: 255 }),
  seo_description: varchar('seo_description', { length: 512 }),
  status: blogStatus('status').notNull().default('draft'),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  seo_title: varchar('seo_title', { length: 255 }),
  seo_description: varchar('seo_description', { length: 512 }),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const site_settings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 128 }).notNull().unique(),
  value: text('value').notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});
`);
write('src/lib/db/README.md', `This folder contains Drizzle ORM schema definitions and Neon HTTP client setup.
`);
console.log('Scaffold generation complete');
