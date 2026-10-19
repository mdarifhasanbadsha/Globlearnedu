# /business — Requirements Matrix & Progress

Last updated: after commit `d44b8f8`
Branch: `feat/business-crm` (unpushed, not deployed)

Status vocabulary: `NOT_STARTED` · `IMPLEMENTING` · `VERIFIED_LOCAL` · `VERIFIED_PREVIEW` ·
`VERIFIED_LIVE` · `BLOCKED_EXTERNAL`

## Scope

Owner-directed scope: **automated messaging, AI counseling, lead collection, followup**.
Documents, finance/payments, visa, and university application submission are **out of scope** by instruction.

## Hard boundaries this build respects

- Existing tables (`users`, `applications`, `payments`, `universities`, `programs`) are **never written**.
- The counseling AI is **never grounded** on the existing `programs` catalog, because that data is
  templated (1 distinct deadline across 4,493 rows, 15 distinct program names). Grounding on it would
  have produced confident false fee quotes.
- Knowledge comes only from owner-approved uploads in `biz_knowledge_entries`.
- One existing file is modified: `src/middleware.ts` (+7 lines, no deletions) and the public
  layout gains one widget component.

## Matrix

| Requirement | Status | Evidence |
|---|---|---|
| Public website chat widget | VERIFIED_LOCAL | Renders on live homepage alongside WhatsApp; 375px screenshot clean |
| Guest session isolation | VERIFIED_LOCAL | 34-char random token `g_<32 hex>`; invalid token starts a new session, never inherits |
| Rate limiting | VERIFIED_LOCAL | Per-IP 20/min, per-session 15/min, upsert counters in `biz_rate_limits` |
| Message persistence | VERIFIED_LOCAL | `biz_messages` stores in/out with explicit author kind |
| AI counseling (Bangla/English/Banglish) | VERIFIED_LOCAL | Replied in correct Bangla script with real fees |
| Progressive intake, one question per turn | VERIFIED_LOCAL | Degree → subject → GPA flow observed across turns |
| GPA without scale → clarify | VERIFIED_LOCAL | Model asks for scale and explains it will not compare scales |
| No invented fees | VERIFIED_LOCAL | Asked about Tsinghua medicine with no matching knowledge → declined to quote a number |
| Brand knowledge from brochures | VERIFIED_LOCAL | Vision read a 5-program brochure, exact fees 24500/22000/29800/31200/16000 CNY |
| Human approval gate | VERIFIED_LOCAL | Entries default `draft`; only `approved` rows are loaded for the AI |
| Lead collection | VERIFIED_LOCAL | Subject and GPA 3.80/4.00 captured from a 2-turn conversation |
| Lead field validation | VERIFIED_LOCAL | Phone needs 7+ digits, email shape checked, GPA needs a scale, budget must be ≥1 |
| Staff takeover | VERIFIED_LOCAL | PATCH `aiState=human_owned` assigns staff and stops AI replies |
| Return to AI / resolve / reopen | VERIFIED_LOCAL | State transitions validated against allow-lists |
| Followup reminders | VERIFIED_LOCAL | In-app only, overdue-first, business timezone rendering |
| Credential encryption | VERIFIED_LOCAL | AES-256-GCM round-trip, random IV, tamper detection all tested |
| Connections UI | VERIFIED_LOCAL | Per-channel honest status; website shows connected because it works |
| Site not broken | VERIFIED_LOCAL | Build 114/114 static pages, 139 routes total |
| Messenger / Instagram / WhatsApp | BLOCKED_EXTERNAL | Meta app review (`pages_messaging`, `whatsapp_business_messaging`) — owner action |
| Email inbound | NOT_STARTED | Needs Resend inbound configuration |
| Outbound email/SMS followups | NOT_STARTED | Deliberately deferred; in-app reminders only so nothing can message a real student |
| Campaigns / segments | NOT_STARTED | |
| Analytics beyond basic counts | NOT_STARTED | |
| Guardian access | NOT_STARTED | Out of current scope |
| Deployment | NOT_STARTED | Branch unpushed; owner decision required |

## Bugs found and fixed during verification

1. **Vision output truncated.** `max_tokens` was capped at 2000 while the model spends
   ~1600 tokens on reasoning first, so JSON was cut mid-object and parsed to zero programs.
   Raised the ceiling and marked truncation as retryable. Recovered all 5 programs after the fix.
2. **Structured extraction silently lost.** The model ignored the "return JSON" instruction and
   answered in prose, so lead fields were empty. Fixed with `response_format: json_object`
   plus a deterministic GPA regex backstop.
3. **`budget_amount: 0` stored.** Sanitiser allowed 0 as a real budget; now requires ≥1.
4. **Stale-server false pass.** An early 21/21 run hit a dev server that had not reloaded.
   Re-verified after a clean restart — this is why the suite is re-run after every schema or
   parser change.

## Test commands

```powershell
npx tsc --noEmit
npm run build
npm run dev
```

Behavioural checks were run against live Neon and the live DeepSeek API, then test rows were deleted.
Reported results: 29 unit tests, 5 AI grounding checks, 21 API integration tests, 7 UI pages
inspected at 1280px and 375px.

## Known limitations

- AI extraction can still misread a brochure; human approval is the safeguard, not a formality.
- No message is sent to any external channel yet; followups are internal reminders.
- `biz_conversations.visitor_id` is not linked to a `users` row — student login linking is future work.
- Cost accounting reports **unknown** rather than zero until price env vars are set.
