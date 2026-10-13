# CSCA Go — Native Android App (Initial implementation)

This is a separate Android project under `csca-go/`. It does not change the existing website pages, styles, routes, database schema, or web exam implementation.

## Current prototype screens
- Animated native homepage and bottom navigation
- CSCA information hub: purpose, formats, subject categories, registration checklist, dates/results guidance, preparation roadmap
- Online exam environment and rules: room/desk setup, primary computer, secondary camera position, connectivity, permitted items, check-in, candidate conduct, technical issues and consequences
- Study Materials with five subject categories and previous-year-question placeholders
- Free CSCA preparation course and premium course catalog placeholders
- Mock test screen, homework screen, student profile and local profile photo selection
- Study in China information banner
- Build workflow for a debug APK

## Accuracy notes
Exam delivery rules and equipment requirements can change by session and delivery mode. The guide is an orientation summary, not a substitute for the current official CSCA registration portal, admission ticket, candidate declaration or handbook. The current official instructions take precedence.

## Integration status
This initial version deliberately does **not** fabricate live student data, scores, course enrollment, homework, or exam availability. The current backend and API contracts must be audited before connecting accounts and data. `ApiConfig.kt` is an explicit integration boundary; `API_BASE_URL` is null until an approved API is identified or implemented. Never put database passwords or service-role credentials in an APK.

The profile name and image currently stay on the device. Account-wide photo sync, login/OTP/password recovery, live course enrollment, homework submissions, exam sessions and result analytics require the secure backend integration phase.

## Build
The repository workflow `.github/workflows/csca-go-apk.yml` builds a debug APK on changes under `csca-go/`. Open the GitHub Actions run and download the `csca-go-debug-apk` artifact.

## Branding
The current icon is a placeholder. Replace it after the CSCA Go / GL Education logo is supplied.
