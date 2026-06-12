# Globlearn Education — Claude Code Master Briefing
# Read this file completely before doing anything else in this project.

---

## PROJECT OVERVIEW

**Product:** Globlearn Education (globlearnedu.com)
**Type:** Study in China consultancy platform
**Stack:** Next.js 15 App Router + TypeScript + Tailwind CSS v4
**Deployment:** Cloudflare Pages via GitHub Actions (auto-deploys on push to main)
**Database:** Neon Postgres + Drizzle ORM (HTTP driver — required for Cloudflare Workers)
**Auth:** NextAuth.js v5 with credentials provider (JWT strategy, cookie name: gl_session_v2)
**Storage:** Cloudflare R2 (bucket: globlearnedu)
**Email:** Resend (from: noreply@globlearnedu.com)
**Payments:** Alipay QR + WeChat QR + Bank transfer + Manual slip upload (NO Stripe)

---

## CRITICAL RULES — NEVER BREAK THESE

1. Always "Globlearn Education" — never "Globlearn" alone
2. Never "free apply" — always "affordable cost" or "transparent fees"
3. All primary CTA buttons are red #C8102E — no exceptions
4. Visa = "guidance" not "guarantee" — Chinese Embassy decides
5. 99% visa guidance success — always add disclaimer about Embassy decision
6. Show all 4 funding types equally: CSC + University + Provincial + Self-sponsored
7. Mobile first — every component must work at 375px
8. `npm run build` must pass before every commit — never push broken code
9. One commit per feature with `feat:` or `fix:` prefix
10. `export const dynamic = "force-dynamic"` on ALL API route files

---

## DESIGN SYSTEM

```
Navy:       #1B3A6B  (primary text, nav, headings)
Sky blue:   #29ABE2  (secondary, links, accents)
China red:  #C8102E  (ALL primary buttons and CTAs)
Red hover:  #A50D25
Gold:       #FFD700  (scholarship, premium elements)
Dark hero:  #0A1628  (hero backgrounds)
Background: #f8fafc  (page background)
Font:       Inter
```

**Tailwind v4 rule:** Always use inline hex: `bg-[#C8102E]` NOT `bg-china-red`

---

## CLOUDFLARE PAGES — CRITICAL PATTERNS

Every external service client MUST use lazy singleton pattern.
Never initialize at module level — crashes build time.

```typescript
// ❌ WRONG — crashes Cloudflare build
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ CORRECT — lazy singleton
let _client: Resend | null = null;
function getClient() {
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY!);
  return _client;
}
```

This applies to: Resend, R2/S3Client, any external SDK.
The DB (Neon) already uses a Proxy-based lazy pattern in `src/lib/db/index.ts`.

---

## PROJECT STRUCTURE

```
src/
├── app/
│   ├── (public)/          ← public website pages
│   ├── (auth)/            ← sign-in, sign-up, forgot-password, reset-password
│   ├── (student)/dashboard/ ← student portal
│   ├── (partner)/         ← partner portal
│   ├── (admin)/           ← admin panel
│   ├── (staff)/           ← staff portal
│   └── api/               ← all API routes
├── components/
│   ├── layout/            ← Header, Footer, MobileBottomBar, MobileDashboardNav
│   ├── home/              ← all 12 homepage sections
│   ├── dashboard/         ← DashboardSidebar, DashboardTopBar, DashboardHomeClient
│   ├── admin/             ← AdminSidebar, AdminTopBar, BlogPostEditor
│   ├── application/       ← ApplicationForm, PaymentSection, Step components
│   ├── shared/            ← FloatingWhatsApp, WhatsAppButton, WhatsAppNudge, ApplyCTA
│   └── ui/                ← Button, Badge, SectionHeader
├── lib/
│   ├── auth/              ← config.ts (NextAuth), helpers.ts, verification.ts, types.ts
│   ├── db/                ← index.ts (lazy Drizzle), schema.ts (all tables), sequences.ts
│   ├── email/             ← resend.ts (lazy), templates.ts (11 templates), notifications.ts
│   ├── storage/           ← r2.ts (lazy S3Client)
│   ├── payments/          ← manual.ts (getPaymentConfig reads from DB settings)
│   ├── validations/       ← application.ts (Zod schemas steps 1-7), user.ts
│   └── settings.ts        ← cached DB settings reader
└── middleware.ts          ← NextAuth route protection + role-based redirects
```

---

## DATABASE SCHEMA — KEY TABLES

All tables in `src/lib/db/schema.ts`:

- `users` — id, email, passwordHash, firstName, lastName, role (student/partner/staff/admin), emailVerified
- `staff` — userId, staffRole (admin/application_manager/content_manager/support_agent/finance)
- `partners` — userId, agencyName, agencyCountry, isApproved
- `universities` — 1,500 real universities imported. slug, nameEn, nameCn, city, tier985, tier211, qsRanking, dataConfidence
- `programs` — universityId, name, level (bachelor/master/phd/mbbs/language/diploma/foundation/short_course)
- `applications` — applicationNumber (format: MD20260608001), studentId, partnerId, assignedStaffId, status (14 stages), all form step data as columns + JSONB
- `applicationUniversities` — per-university status rows
- `notifications` — userId, applicationId, title, message, channel, isRead
- `payments` — applicationId, type (deposit/university_deposit/service_charge), amount, status, manualSlipUrl
- `referrals` — referrerId, referredUserId, commissionAmount (20% of service charge)
- `blogPosts` — slug, title, content, status (draft/published/scheduled/in_review), authorName="GloblearnEdu Team"
- `admissionYearPages` — slug, year, pageType, universityId, feesVerified, datesVerified, programsVerified, disclaimerActive
- `emailTemplates` — name, subject, bodyHtml, triggerEvent, isAutoTrigger
- `settings` — key/value store for admin-configurable values (QR codes, payment config, etc.)
- `activityLog` — userId, applicationId, action, details
- NextAuth tables: accounts, sessions, verificationTokens

---

## APPLICATION ID FORMAT

Program codes: MD=MBBS, B=Bachelor, M=Master, P=PhD, L=Language, D=Diploma, F=Foundation, S=ShortCourse, G=General
Format: `{CODE}{YYYY}{MM}{DD}{NNN}` — e.g. `MD20260608001`
Serial from DB daily count via `src/lib/db/sequences.ts`

---

## AUTH SYSTEM

- NextAuth.js v5 with credentials provider
- JWT strategy, cookie name: `gl_session_v2`
- Session has: `user.id`, `user.email`, `user.role`, `user.firstName`, `user.lastName`
- Sign out: always use `signOut({ callbackUrl: "/" })` from `next-auth/react` in client components
- Sign out page: `/sign-out` — clears all cookies and redirects to homepage
- Role redirects: admin/staff → /admin, partner → /partner, student → /dashboard
- Server components: `import { auth } from "@/lib/auth/config"`
- Client components: `import { useSession } from "next-auth/react"`

---

## API ROUTES — ALL EXISTING

```
POST /api/auth/register          ← create account
POST /api/auth/login             ← NextAuth handles via [...nextauth]
POST /api/auth/send-verification ← send email verification
POST /api/auth/verify-email      ← verify email token
POST /api/auth/forgot-password   ← send password reset email
POST /api/auth/reset-password    ← set new password
GET/POST /api/applications       ← student creates/gets applications
GET/PATCH /api/applications/[id] ← get/update specific application
POST /api/applications/[id]/steps ← save form step data
POST /api/upload/presign         ← get R2 presigned upload URL
POST /api/upload/payment-slip    ← upload payment slip to R2
GET/POST /api/payments           ← create payment record
POST /api/payments/[id]/confirm  ← admin confirms manual payment
GET /api/admin/analytics         ← real DB analytics data
GET /api/admin/applications      ← admin applications list with filters
POST /api/admin/applications/[id]/status ← update status + send email
GET/POST /api/admin/blog         ← blog post management
PATCH/DELETE /api/admin/blog/[id] ← edit/delete blog post
GET/PATCH /api/admin/email-templates ← manage email templates
POST /api/admin/email-templates/test ← send test email
GET/POST /api/admin/universities/import ← bulk JSON import
GET/POST /api/admin/admission-pages ← scheduler management
POST /api/admin/admission-pages/[id]/verify ← verify page section
GET/POST /api/admin/staff        ← staff management
GET /api/admin/staff/performance ← performance metrics
GET/POST /api/settings           ← admin settings (QR codes etc)
GET /api/partner/students        ← partner's student list
GET /api/partner/commissions     ← partner commission data
GET /api/notifications           ← user notifications
POST /api/notifications/read     ← mark notifications as read (supports { ids } or { markAll: true })
GET /api/applications/track      ← public lookup by applicationNumber or passportNumber (no auth)
```

---

## ENVIRONMENT VARIABLES

All set in Cloudflare Pages + local `.env.local`:
```
DATABASE_URL                    ← Neon Postgres (non-pooled connection string)
NEXTAUTH_SECRET                 ← random 64-char string
NEXTAUTH_URL                    ← https://globlearnedu.com
RESEND_API_KEY                  ← re_i6gmXL8d_...
RESEND_FROM_EMAIL               ← noreply@globlearnedu.com
R2_ACCOUNT_ID                   ← 8c00813fc42c4b694eebc27ff98b1de5
R2_ACCESS_KEY_ID                ← ca3ab53df2ee957685104ed76d96f9d1
R2_SECRET_ACCESS_KEY            ← (set in Cloudflare, not shown here)
R2_BUCKET_NAME                  ← globlearnedu
R2_PUBLIC_URL                   ← https://pub-1805c1d6eed7442688af0b5b475bb420.r2.dev
NEXT_PUBLIC_APP_URL             ← https://globlearnedu.com
NEXT_PUBLIC_WHATSAPP_NUMBER     ← 8615655031556
NEXT_PUBLIC_APP_NAME            ← Globlearn Education
```

---

## PAYMENT SYSTEM

NO Stripe. Three methods:
1. Alipay QR — QR image URL stored in DB settings key: `alipay_qr_url`
2. WeChat Pay QR — QR image URL stored in DB settings key: `wechat_qr_url`
3. Bank transfer — details in DB settings keys: `bank_name`, `bank_account_number`, `bank_swift`
4. Contact team — WhatsApp button with pre-filled message

All payments require manual staff verification → admin clicks "Confirm payment" → triggers email.
Deposit amount: 500 RMB (stored in DB settings key: `deposit_amount`)

---

## EMAIL TEMPLATES (11 total)

All in `src/lib/email/templates.ts`. Triggered via `src/lib/email/notifications.ts`:
1. Application received (student)
2. Application received (partner)
3. Status update (generic — used for most stage changes)
4. Admission offer
5. Interview scheduled
6. Document/action required
7. Payment confirmed
8. Visa guidance pack
9. Referral commission earned
10. Partner account approved
11. Admission complete

---

## PROGRAMS (8 types)

slugs and DB enum values:
- mbbs-medicine → mbbs
- bachelors-degree → bachelor
- masters-degree → master
- phd-program → phd
- chinese-language → language
- diploma-vocational → diploma
- foundation-pre-university → foundation
- short-course-exchange → short_course

---

## WHATSAPP

Number: 8615655031556
All links: `https://wa.me/8615655031556?text={encoded_message}`
Floating button shows after 8 seconds on all public pages.
WhatsAppNudge component used after key sections on program/university pages.
"Replies in 5 min" badge in desktop header.

---

## CURRENT BUILD STATUS

Last known: 137 pages, 0 errors, 0 Clerk references
All API routes have `export const dynamic = "force-dynamic"`
All external clients use lazy singleton pattern

---

## PHASES COMPLETED

- Phase 1 ✅ Homepage + layout (12 sections)
- Phase 2 ✅ All public pages (programs, universities, blog, countries, about, contact, FAQ, track, scholarships)
- Phase 3 ✅ Dashboard, 9-step application form, partner portal, admin panel UI
- Phase 4 ✅ Backend wiring — DB, R2, Resend, payments, notifications
- Auth ✅ NextAuth.js v5 replacing Clerk
- SEO ✅ Sitemap, robots.txt, global metadata
- University DB ✅ 1,500 universities imported to Neon

## CURRENT WORK — PHASE 5

Step 1: Email verification + password reset ← IN PROGRESS
Step 2: Blog CMS (admin writes real posts)
Step 3: Email template editor
Step 4: Admission year auto-scheduler
Step 5: Staff performance tracking
Step 6: Analytics dashboard real data
Step 7: Partner commission tracking
Step 8: Application serial from DB
Step 9: Notifications centre
Step 10: Final verification

---

## IMPORTANT NOTES

- Session sign-out uses `/sign-out` page route for reliable cookie clearing
- Role-based redirects: admin→/admin, partner→/partner, student→/dashboard
- `data/universities.json` is gitignored — local import script only

---

## KNOWN ISSUES FIXED (pre-Phase 6 session)

All student dashboard pages wired to real DB (previously showing hardcoded demo data):

- **My Application page** (`/dashboard/application`) — now fetches real application by studentId; empty state with "Start Application" CTA if none found
- **Documents page** (`/dashboard/documents`) — now reads real documents JSONB field; shows uploaded/missing status per document type; extracted to `_DocumentsClient.tsx`
- **Notices sidebar badge** — DashboardSidebar now accepts `unreadCount` prop; layout fetches real unread count from DB on every request
- **Notices page** (`/dashboard/notices`) — was already real DB; now auto-marks all as read on page visit via `useEffect` + `POST /api/notifications/read { markAll: true }`
- **Payments page** (`/dashboard/payments`) — was already real DB (no change needed)
- **Public track page** (`/track`) — redesigned: input form with Application ID format validation; logged-in users with an application auto-redirect to `/track/[applicationNumber]`; no more demo stage stepper on public page
- **Track detail page** (`/track/[id]`) — NEW: queries DB by applicationNumber; shows real stage; 404 error page if not found (never shows demo data)
- **Track API** (`GET /api/applications/track`) — NEW public endpoint: accepts `?applicationNumber=` or `?passportNumber=`; returns `{ found, applicationNumber }`; no auth required
- **Mobile bottom bar track** — validates Application ID format before navigating; calls `/api/applications/track` API; shows inline error if not found
- **Notifications read API** (`POST /api/notifications/read`) — now supports `{ markAll: true }` in addition to `{ ids: [...] }`

New files created:
- `src/app/(public)/track/[id]/page.tsx` — real application tracking detail page
- `src/app/(public)/track/_TrackForm.tsx` — client component with format validation
- `src/app/api/applications/track/route.ts` — public lookup API
- `src/app/(student)/dashboard/documents/_DocumentsClient.tsx` — extracted client component
