# CSCA Go — Native Android App

CSCA Go is a separate native Android project in `csca-go/`. Mobile UI changes stay on `feature/csca-go-native`; the GL Education website's visible pages and styles are not redesigned by this project.

## Connected functionality

- Native sign-in and registration screens.
- Mobile authentication API at `/api/csca-go/auth`, reusing the existing `users` table and bcrypt password hashes.
- Email OTP for new CSCA Go registration, OTP expiry/attempt limits, server-side rate limiting, and hashed bearer sessions.
- Encrypted Android storage for the mobile session token.
- Display-name update and profile-image upload through `/api/csca-go/profile`.
- Live released mock-test list and question payload from the existing `/api/csca/mocktest` API.
- Server-side answer scoring and saving through the existing mock-test submission endpoint.
- Native question navigator, timer, mark-for-review controls, and practice interruption telemetry.
- CSCA information screens and Android system back navigation.

## Known incomplete items (not live yet)

- **Courses and enrollment:** free and premium course cards are placeholders. The app does not yet read a live course catalog or enroll a student.
- **Homework:** account-linked assignment listing, submissions, grades and homework history are not integrated natively.
- **Progress dashboard:** profile totals, score averages and trends are not yet pulled from an authenticated progress endpoint.
- **Official syllabus:** subject detail pages still need the full, reviewed, current official syllabus text/documents.
- **Previous-year papers:** placeholders only until GL Education supplies approved papers. Original practice papers must not be labeled as official past papers.
- **Online-exam infographic:** the image supplied in chat has not yet been added as an Android asset. The guide currently shows text instructions.
- **Study in China:** the homepage banner currently opens an information dialog, not the planned full native information hub.
- **Branding:** launcher icon is temporary until the CSCA Go logo is supplied.

## Mock-test limitations

Mock-test questions and results use the existing website API and are scored by the server. The current website API identifies public practice attempts using candidate name, phone and email; the flow is not yet a fully authenticated, account-bound attempt API. Answers are held in app memory until submission, so a force-stop or process death can lose an unfinished attempt. Do not use this practice flow as a substitute for the official CSCA exam client.

## Authentication and privacy notes

- No database credentials or server secrets are packaged in the APK.
- Mobile bearer tokens are stored using Android encrypted shared preferences; the server stores a token hash and supports revocation/expiry.
- Registration email delivery must be tested with a real inbox in the deployed environment; passing a build/type-check does not prove that email delivery or every live flow works.
- Phone matching is conservative: use the number format associated with the existing account, preferably with its international calling code.

## Build

The workflow `.github/workflows/csca-go-apk.yml` builds a debug APK when app files change. Open the latest successful run, then download the `csca-go-debug-apk` artifact. Debug APKs are for testing, not production distribution.

## Official CSCA information

Exam dates, subject requirements, formats and home-exam setup can change. Check the current official registration portal, candidate handbook, admission ticket and session notices before acting on guidance shown in this app.
