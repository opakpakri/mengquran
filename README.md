# ⌨️ Mengqur'an

<div align="center">

[![React Version](https://img.shields.io/badge/react-v19.2-61dafb?logo=react&logoColor=black&style=flat-squared)](https://react.dev)
[![Vite Version](https://img.shields.io/badge/vite-v8.0-646cff?logo=vite&style=flat-squared)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-v4.0-38bdf8?logo=tailwind-css&style=flat-squared)](https://tailwindcss.com)

**Mengqur'an** is a modern online Al-Quran web application designed for reading, reflecting, and listening to the Al-Quran with comfort. Built with a minimalist aesthetic, high performance, and interactive worship companion features.

[Features](#-key-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Installation](#-getting-started) • [Shortcuts](#-keyboard-shortcuts) • [Themes](#-themes-gallery)

</div>

---

## ✨ Key Features

- **🟢 Smart Murottal Player**: Audio playback per surah or per verse with a _spotlight_ effect on the active verse, _dimming_ of other verses, soundwave visualizer animation, and _auto-scroll_ tracking.
- **🕌 Prayer Times & Countdown**: Daily prayer schedule integrated with the official Kemenag RI API, complete with city search, local preferences persistence, and a real-time countdown to the next prayer.
- **📚 Surah Details, Transliteration & Tafsir**: Features 114 surahs complete with Arabic script, Latin transliteration, Indonesian translation, and 4 sources of tafsir (Kemenag Short/Long, Jalalayn, Quraish Shihab).
- **⚙️ Typography Customization**: Interactive sliders to adjust Arabic and Latin/translation font sizes independently (automatically saved to browser).
- **🔖 Bookmarks & Last Read**: Save favorite verses and mark your reading progress instantly.
- **🔔 Interactive Notifications**: interactive toast alerts powered by **SweetAlert2** for bookmark and last-read actions.
- **🌓 Light & Dark Modes**: Premium user interface with smooth transitions to ensure visual comfort.

---

## 🛠️ Tech Stack

- **Frontend Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using the official `@tailwindcss/vite` compiler plugin)
- **Icon Library**: [Lucide React](https://lucide.dev/)
- **State Management & Persistence**: React Hooks + LocalStorage
- **Audio Synthesis**: Web Audio API (custom oscillators & gain nodes)

---

## 🛠️ Tech Stack

- **Frontend Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using the official `@tailwindcss/vite` compiler plugin)
- **Local Storage**: Browser LocalStorage
- **Official APIs**: [API Muslim v3 (myQuran)](https://api.myquran.com/v3/doc) & [e-Quran API]()

---

## 🚀 Getting Started Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

---

Built to facilitate digital Al-Quran reading in a modern era. 🕌✨
