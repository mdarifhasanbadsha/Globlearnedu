# GL Education CSCA Exam — Android test app

This is an Android WebView shell for the existing CSCA section at https://globlearnedu.com/csca/. It keeps the current website, question sets, and exam flows as the first prototype instead of duplicating the exam system in native Android code.

## Build a test APK

A GitHub Actions workflow builds a debug APK when files under `android-csca/` change, or when manually started:

1. Open the repository's **Actions** tab.
2. Select **Build GL CSCA Android APK**.
3. Open a successful run and download the `gl-csca-exam-debug-apk` artifact.
4. Extract the ZIP and install the APK on an Android test phone. Android may require permission to install apps from the browser/file manager used to open it.

The debug APK is for internal testing, not a production release.

## Prototype protections

- Android `FLAG_SECURE` to block normal screenshots and non-secure display capture on supported devices.
- JavaScript and DOM storage enabled for the existing exam page's web app functionality.
- Third-party cookies disabled.
- Only HTTPS URLs under the site's `/csca` path are allowed inside the app.
- Native Back confirmation.
- Connection-error retry panel.
- Existing website timer, question navigation, answer saving, recovery and exam rules remain responsible for exam behavior.

## Important limitations

This first prototype is **not a fully locked-down or cheat-proof exam app**. Students own their devices, so this app cannot reliably prevent them from using a second phone, another camera, a modified device, or every possible system/app-switching behavior. `FLAG_SECURE` is a deterrent, not an absolute guarantee. Android's strongest kiosk restrictions generally require a managed/dedicated device configuration, which is not available on ordinary student-owned phones.

The web exam backend must still enforce attempts, timing, grading, and answer security. Never rely on the client APK alone to keep correct answers secret. Before using it for consequential exams, test login, all subjects, reload/recovery, app switching, phone calls, network loss, low-memory restoration, and submission on a range of real devices.

## Current entry page

The app opens the Mathematics mock-test list. The allowed host/path is restricted to `globlearnedu.com/csca/*`. Update `START_URL` in `MainActivity.kt` if the intended CSCA landing page changes.
