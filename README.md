<div align="center">
  <img src="./favicon.svg" width="96" alt="AirCourse AI Logo" />
  <h2>AirCourse AI · Timetable to ICS</h2>
  <p>Upload your timetable screenshot · Export ICS for Apple / Google Calendar</p>
  <p>
    <img src="https://img.shields.io/github/stars/lounwb/apple-timetable?style=social" alt="GitHub Stars" />
    <img src="https://img.shields.io/github/forks/lounwb/apple-timetable?style=social" alt="GitHub Forks" />
    <img src="https://img.shields.io/github/license/lounwb/apple-timetable" alt="License" />
    <a href="./README_zh.md">
      <img src="https://img.shields.io/badge/lang-中文简体-blue?logo=google-translate" alt="Chinese README" />
    </a>
  </p>
</div>

---

## ✨ Overview

**AirCourse AI** is a web tool optimized for Chinese university students. It helps you:

- Upload a timetable screenshot and let an **Alibaba DashScope (Qwen) vision model** extract course data  
- Auto‑fill **class time slots + campus address** based on your university and campus  
- Support **odd / even weeks**, multiple time slots per course, and complex schedules  
- Export standard **`.ics` calendar files** that work with:
  - Apple Calendar (iPhone / iPad / Mac)
  - Google Calendar
  - Any other calendar app that supports ICS

Live demo: `https://apple-timetable.vercel.app`

---

## 🎯 Features

- **AI‑powered timetable OCR**
  - Upload images (JPG/PNG, etc.), and the DashScope Qwen model recognizes:
    - course name, instructor, location, weekday, start class, end class
  - Clear error state when recognition fails.

- **University presets (China‑focused)**
  - Local file `data/universities.js` stores many Chinese universities:
    - Campus address
    - Daily periods (start / end time per period)
  - Fuzzy search with **highlighted matches** in the dropdown.
  - When selecting from the dropdown:
    - Automatically fills campus address and `periods` (time slots)
    - Locks the address input to read‑only to avoid accidental edits
  - When typing school name manually:
    - Address input is fully editable
    - Clearing the school name will also clear the address

- **Course editing UX**
  - Each course can have **multiple time slots** (different weeks / weekdays / rooms).
  - For each slot:
    - **Start period / end period** each use a **single compact select**  
      (no extra “snap to period” dropdown).
    - When start period changes, end period **auto‑defaults to the next period**  
      (e.g. start at period 2 → end at period 3 by default).
    - Repeatedly changing the start period always keeps the default as “one period later”
      to represent a 2‑period class by default.

- **Weekly timetable preview & ICS export**
  - Switch between weeks, with **Odd / Even** badges.
  - One‑click export of `.ics` file.

- **Auth & quota**
  - **Supabase Auth** with email magic link:
    - Click “Sign in”, enter your email and receive a magic link.
    - After clicking the link you’ll be logged in; the header shows your email.
  - **Guest users: 10 free AI calls per day**:
    - All calls are recorded in Supabase table `guest_daily_usage`.
    - If a non‑logged‑in user exceeds 10 calls in a day:
      - API returns HTTP 429
      - UI shows “Daily free quota used up, please sign in.”
    - Logged‑in users are currently **not limited** by the 10‑call cap (still tracked).

---

## 🧱 Tech Stack

- Frontend: **React 19 + Vite + TypeScript**
- UI: **Tailwind CSS**, responsive layout, dark mode support
- AI: **Alibaba DashScope / Qwen** compatible API (called from serverless, API key never exposed to the browser)
- Auth & data: **Supabase**
  - Auth: email magic link
  - `guest_daily_usage`: per‑IP daily quota tracking for guests

---

## 🚀 Development

### 1. Prerequisites

- Node.js 18+ (18 or 20 recommended)

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create `.env.local` in the project root:

```env
# Frontend API base URL (in dev you can point to your deployed Vercel URL,
# or leave empty and run `vercel dev` to host /api locally)
VITE_API_BASE_URL=https://apple-timetable.vercel.app

# Supabase client config (Anon key is public)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# DashScope / Qwen API key (serverless only, never exposed to client)
DASHSCOPE_API_KEY=your_dashscope_key

# Supabase server config (Service Role key has full DB rights, use only on server)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Salt used to hash IP addresses for quota tracking
GUEST_QUOTA_SALT=some_random_long_string

# GitHub repo URL used by the navigation bar GitHub button
VITE_GITHUB_URL=https://github.com/Lounwb/apple-timetable

# Optional: redirect URL for Supabase magic link
VITE_SUPABASE_REDIRECT_URL=https://apple-timetable.vercel.app
```

### 4. Supabase schema

Create the quota table in Supabase:

```sql
create table if not exists guest_daily_usage (
  day text not null,
  ip_hash text not null,
  count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key(day, ip_hash)
);
```

> Tip: you may also add an index on `day` for faster analytics.

### 5. Start the dev server

Frontend only (API points to deployed Vercel endpoint):

```bash
npm run dev
```

Or run both frontend and serverless functions locally with Vercel:

```bash
vercel dev
```

## 🤝 Contributing

- Use GitHub Issues for:
  - Bug reports (recognition errors, export problems, UI issues, etc.)
  - Feature requests (more universities, more export formats, more reminder options)
- If you have a full timetable configuration for your own university/campus, PRs updating
  `data/universities.js` are very welcome.

## 📄 License

This project is open‑sourced under the **MIT License**.  
You are free to use, modify, and distribute it under the terms of the license.


## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Lounwb/apple-timetable&type=date&legend=bottom-right)](https://www.star-history.com/#Lounwb/apple-timetable&type=date&legend=bottom-right)

---