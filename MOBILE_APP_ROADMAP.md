# Mobile App Development Roadmap (React + Capacitor)

## 📱 Goal
Convert the existing **Career Growth** web platform into a native mobile application (Android & iOS) that can be published to the Google Play Store and Apple App Store.

## 🛠 Technology Stack
We will use **Capacitor**.
*   **Why?** It allows us to keep our existing React/Vite/Tailwind code. It "wraps" your website in a native container but allows access to native features (Camera, Notifications, etc.).
*   **Vs React Native**: React Native would require rewriting all the HTML/CSS into native components (~2 months work). Capacitor lets us launch in ~2 weeks.

## 📅 Estimated Timeline: 2-4 Weeks

### Phase 1: Setup & Integration (Week 1)
*   [ ] Install Capacitor core and CLI.
*   [ ] Initialize Capacitor in the project.
*   [ ] Add Android and iOS platforms.
*   [ ] Build the web assets and sync to native folders.
*   [ ] **Milestone**: Running the app on a physical phone or simulator.

### Phase 2: Mobile UI/UX Optimization (Week 2)
*   [ ] **Safe Areas**: Ensure content isn't hidden behind the notch or home bar (`viewport-fit=cover`).
*   [ ] **Touch Targets**: Make buttons and links finger-friendly (min 44px).
*   [ ] **Responsiveness**: Fix any grid layouts that break on small screens.
*   [ ] **Navigation**: Handle the hardware "Back" button on Android.
*   [ ] **Status Bar**: Style the native status bar to match the app theme.

### Phase 3: Native Features (Week 3)
*   [ ] **Deep Linking**: Allow opening the app from email links.
*   [ ] **Push Notifications**: Integrate native push notifications (FCM).
*   [ ] **Offline Mode**: Better handling when there is no internet.
*   [ ] **App Icon & Splash Screen**: Generate assets for all device sizes.

### Phase 4: App Store Deployment (Week 4)
*   [ ] **Accounts**:
    *   Google Play Console ($25 one-time).
    *   Apple Developer Program ($99/year).
*   [ ] **Building**: Generate signed APK/AAB (Android) and Archive (iOS).
*   [ ] **Testing**: Internal testing loops (TestFlight / Play Console).
*   [ ] **Store Listing**: Screenshots, specific descriptions, privacy policy.
*   [ ] **Review**: Submit for review (takes 1-3 days).

## 👥 Requirements
*   **Team**: Just **You (User)** + **Me (AI)** is 100% enough.
*   **Your Role**: Run build commands, test on your device, handle store accounts.
*   **My Role**: Write code, fix bugs, guide configuration, generate assets logic.

## 🚀 Getting Started Command
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init
```
