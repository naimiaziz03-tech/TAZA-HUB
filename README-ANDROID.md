# Taza Hub — Android APK

This package keeps the existing web app files and adds a Capacitor Android wrapper so it can be installed as an Android app instead of only installing a browser shortcut.

## Build APK using GitHub (no local Android Studio needed)
1. Create/open the GitHub repository for Taza Hub.
2. Upload the **contents** of this ZIP to the repository root, including the `.github` folder and these files: `package.json`, `capacitor.config.json`.
3. Commit the files to `main` (or `master`). Open the repository's **Actions** tab.
4. Select **Build Taza Hub Android APK** and run it if it has not run automatically.
5. Open the completed workflow run, find **Artifacts**, and download `Taza-Hub-Android-APK`.
6. Extract the downloaded artifact ZIP on the phone and install `app-debug.apk`. Android may ask permission to install unknown apps.

## Important
- This is a native Android WebView wrapper (not a Chrome shortcut). It does not require Chrome to be opened to launch the app. Android System WebView/Android WebView components are part of the platform.
- The APK is debug-signed for initial installation/testing. A debug APK built by a fresh GitHub runner may not be signed with the same key on future runs, so it may not install as an update over an older build. For reliable in-place updates, configure a persistent release keystore and build a signed release APK.
- The app's local storage is separate from the browser/PWA installation. Before moving to the APK, use **تنزيل نسخة شاملة** in the old app, then install the APK and use **استرجاع نسخة** to restore the data. Keep the backup file safe.
- Existing application sections and their source files are copied as-is; the wrapper does not rewrite their logic.
