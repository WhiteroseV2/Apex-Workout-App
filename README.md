# Apex Fuel & Fitness

A mobile fitness app for workout tracking, nutrition logging, recovery insights, and Gemini-powered coaching.

This repository ships native Android and iOS applications through [Capacitor](https://capacitorjs.com/). The React UI is bundled into each native app at build time; the production target is not a hosted web application.

## Features

- Daily calorie and macro tracking
- Workout plans, set tracking, and rest timers
- Hydration tracking and training streaks
- Offline-aware mobile UI
- Context-aware Gemini AI coaching

## Requirements

- Node.js 18 or newer
- npm
- Android Studio and an Android SDK for Android builds
- macOS with Xcode for iOS builds
- `GEMINI_API_KEY` for AI features

## Install and develop

```bash
npm install
Copy-Item .env.example .env
```

Set `GEMINI_API_KEY` in `.env`, then use the browser development server for fast UI iteration:

```bash
npm run dev
```

The development server is only a development convenience. The mobile app is built with Capacitor.

## Build and run on mobile

Build the React bundle and synchronize it into both native projects:

```bash
npm run mobile:build
```

Open the native project in its platform IDE:

```bash
npm run mobile:android
npm run mobile:ios
```

Android builds run on Windows, macOS, and Linux with Android Studio installed. iOS builds require macOS and Xcode.

## Quality checks

```bash
npm run lint
npm run build
```

## Project structure

```text
├── android/              # Native Android project
├── ios/                  # Native iOS project
├── capacitor.config.ts   # Capacitor app identity and web bundle settings
├── src/
│   ├── App.tsx           # Mobile application UI and state
│   ├── index.css         # Mobile design system and safe-area styles
│   ├── lib/gemini.ts     # Gemini AI integration
│   ├── main.tsx          # React entry point
│   └── types/workout.ts   # Shared AI workout response types
├── package.json
└── vite.config.ts        # Bundle configuration used by Capacitor
```

`dist/` and native generated asset copies are build output. Run `npm run mobile:build` after changing the React source before opening a native project.

## License

This project is licensed under the [MIT License](LICENSE).
