# APEX — Performance Nutrition & Strength Protocol

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_GenAI-Gemini_3.8_Flash-orange?logo=google&logoColor=white" alt="Gemini 3.8 Flash" />
  <img src="https://img.shields.io/badge/Vite-6.2-purple?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

> **A high-performance mobile application unifying sports nutrition tracking, progressive resistance training, and recovery telemetry into a single, zero-friction interface.**

---

## ⚡ Executive Summary & Portfolio Case Study

Most fitness applications suffer from **feature bloat and fractured workflows**: MyFitnessPal requires 4–5 screen transitions to log a meal, while dedicated workout loggers have zero nutrition or recovery awareness. 

**APEX** was engineered as a high-density, mobile-first companion tailored for hybrid athletes and performance nutrition (inspired by industrial minimalism and functional nutrition brands like **Huel** and **Whoop**). It replaces tedious multi-step dialogs with **one-tap logging**, a **live workout bottom sheet**, and an **AI coach** that understands the athlete's real-time daily metrics.

---

## ✨ Key Features & Interactive Workflows

### 1. 📊 Glanceable Daily Protocol (Overview)
- **Dynamic Conic Calorie Ring**: Visualizes caloric budget, consumed energy, and remaining balance at a glance.
- **Micro & Macro Balance**: High-contrast progress indicators for protein, carbohydrates, and fats.
- **CNS Recovery Readiness**: Daily bio-readiness score (84/100 · *Primed to Perform*) paired with heart-rate variability (HRV) and sleep telemetry.

### 2. 🥗 1-Tap Athletic Nutrition Logging (Nutrition)
- **Pre-Configured Performance Fuels**: 1-tap logging for athletic staples (e.g. *Huel Black Edition*, *Whey Isolate*, *Grilled Chicken & Jasmine Rice*, *Wild Salmon*).
- **Custom Macro Input**: Intuitive bottom sheet for manual food logging with instant macro breakdown calculations.
- **Live Timeline**: Chronological log of meals consumed with one-tap removal and dynamic macro recalculations.

### 3. 🏋️ Real-Time Workout Drawer (Training)
- **Interactive Bottom Sheet**: Non-intrusive workout interface with live ticking interval stopwatch.
- **Split Support**: Pre-configured protocols for *Push (Strength)*, *Pull (Hypertrophy)*, *Legs (Power)*, *Upper*, and *Active Recovery*.
- **Tactile Set Checkmarks**: One-tap completion triggers haptic visual feedback and tracks working load ($32\text{ kg} \times 10\text{ reps}$).

### 4. 📈 Performance Analytics & Progression (Progress)
- **7-Day Caloric & Volume Adherence**: Clean bar charts tracking daily consistency.
- **1RM Progression**: Track compound lift progression (Bench Press, Barbell Squat, Conventional Deadlift) with percentage gains.
- **Weekly Load Breakdown**: Volume distribution across Push, Pull, and Legs.

### 5. 🤖 Context-Aware AI Coach (APEX Intelligence)
- Powered by **Gemini 3.8 Flash** via the official `@google/genai` TypeScript SDK.
- **Context-Informed**: Unlike generic fitness chatbots, the coach is injected with the user's real-time daily calories, consumed protein, active training split, and recovery score.
- **Quick-Prompt Chips**: Fast-action queries (*"Adjust today's workout"*, *"Analyze my protein intake"*, *"Why is recovery 84 today?"*).

---

## 🎨 Design System & Philosophy

APEX follows a rigorous **mobile-first design constitution**:

- **Typographic Hierarchy**:
  - **Manrope**: Geometric humanist sans-serif for clean, authoritative athletic headers and controls.
  - **DM Mono**: Monospaced tabular figures for weights, sets, calories, and timestamps to eliminate layout shift.
- **Palette**:
  - Backgrounds: Obsidian `#060706` and Athletic Charcoal `#0e100f`.
  - Cards & Borders: Subtle `#141720` with hairline 1px `#1f2220` dividers.
  - Primary Accent: High-legibility Periwinkle `#a9b9ff` for optimal contrast against dark surfaces.
  - Functional Accents: Amber flame `#f5b58b` for streaks and Emerald `#34d399` for recovery readiness.
- **Strict Canvas Constraints**: Fixed 440px container on desktop/tablet views with fluid 100% responsiveness on smaller handhelds ($\ge 44\text{px}$ touch target compliance).
- **Zero-Pill Discipline**: Metadata is rendered cleanly using typographic delimiters (`·`, `/`) rather than cluttered bordered capsules.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Engine**: [Google Gen AI SDK (`@google/genai`)](https://github.com/google-gemini/generative-ai-js) — Gemini 3.8 Flash
- **Icons**: Custom optimized SVG icon system inspired by Lucide

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/apex-fuel-fitness.git
   cd apex-fuel-fitness
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (obtainable free from [Google AI Studio](https://aistudio.google.com/)):
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```
   *(Note: The app includes graceful fallbacks so all core workouts, food logging, and UI workflows operate seamlessly even without an API key).*

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
├── index.html            # HTML entry point with Manrope & DM Mono typography
├── metadata.json         # AI Studio applet configuration & permissions
├── package.json          # Project scripts and dependencies
├── tsconfig.json         # Strict TypeScript compiler options
├── vite.config.ts        # Vite configuration with Tailwind CSS plugin
├── src/
│   ├── App.tsx           # Main application architecture & interactive state
│   ├── main.tsx          # React DOM entry point
│   ├── index.css         # Complete design system tokens, themes & layout rules
│   ├── data.ts           # Athletic splits and default data fixtures
│   ├── lib/
│   │   └── gemini.ts     # Google GenAI SDK integration with Gemini 3.8 Flash
└── README.md             # Project documentation & portfolio case study
```

---

## 🗺️ Roadmap & V2 Concepts

- [ ] **Camera Barcode & Food Scanner**: Using Gemini Vision (`gemini-3.8-flash`) to parse nutrition fact labels directly from the camera feed.
- [ ] **Apple HealthKit & Whoop BLE Sync**: Direct background synchronization of resting heart rate and active caloric burn.
- [ ] **Offline-First Storage**: IndexedDB persistence for complete offline gym tracking with sync-on-reconnect.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
