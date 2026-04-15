# ⚔️ Quest AI — Level Up Your Life

**The craziest gamified habit tracker on the internet.** Better than Habitica, powered by AI, 100% free, 100% offline-first.

![Status](https://img.shields.io/badge/status-live-brightgreen) ![React](https://img.shields.io/badge/React-19-61dafb?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 What is it?

Quest AI turns your real-life goals into an RPG. Build habits, complete dailies, kill to-do list bosses, and level up an actual character that gains stats, gear, pets, and mounts. An AI coach helps you break down big goals, stay motivated, and design quests that match your life.

**Think Habitica, but prettier, faster, AI-powered, and completely free.**

## ✨ Features

### 🧙 Character System
- Character with HP, XP, Mana, and Gold
- 4 unlockable classes at level 10 — **Warrior / Mage / Healer / Rogue**
- 4 stats: **STR / INT / CON / PER** that grow with level + gear
- Custom avatar, name, and progression

### 📋 Task System
- **Habits** — positive, negative, or both (e.g. "drink water" vs "junk food")
- **Dailies** — recurring tasks with streaks; missing them costs HP
- **To-Dos** — one-off tasks with due dates and overdue penalties
- **Rewards** — custom real-life rewards you buy with gold
- **Checklists, tags, notes, difficulty tiers** (Trivial → Easy → Medium → Hard)

### 🤖 AI Coach (unique, not in Habitica)
- Chat with an AI coach that knows your stats, level, streaks, and tasks
- Supports **Google Gemini (free)**, **OpenAI**, and **Anthropic Claude**
- **Offline fallback** with smart local responses (no API key required)
- **Goal Breakdown** — paste a big goal, get 5 starter subtasks auto-added
- Context-aware quest suggestions

### ⚔️ Quests & Boss Fights
- Turn any goal into a boss fight
- Every completed task damages the boss
- Themed quest ideas ("Slay the Procrastination Dragon", "The Fortress of Focus", etc.)
- Boss rewards scale with boss HP

### 🏪 Shop & Inventory
- 40+ items across 7 slots: Weapons, Armor, Head, Shields, Pets, Mounts, Consumables
- 5 rarity tiers: Common → Uncommon → Rare → Epic → Legendary
- Class-restricted gear for advanced builds
- Equippable gear with **live stat updates** (STR/INT/CON/PER)
- Consumables: Health Potion, Mana Potion, Full Elixir

### 😊 Mood Tracker (unique)
- Daily mood, energy, and focus check-ins
- 14-day line chart with three trend lines
- AI Coach uses your mood data for personalized advice

### 📊 Analytics Dashboard
- Character progression stats
- 14-day daily completion history
- Task distribution by type
- Difficulty distribution pie chart
- Total XP, gold, streaks at a glance

### 🏆 Achievements
- 18 built-in achievements across 5 categories (Tasks, Streaks, Combat, Social, Collection)
- Progress tracking with live bars
- Unlock notifications

### 🎮 Power User Features
- **⌘K / Ctrl+K** command palette — instant navigation + quick task creation
- **Sound effects** via Web Audio API (tap complete, level up, reward, damage)
- **Framer Motion** animations throughout
- **Data export/import** — JSON backup, never lose your progress
- **PWA ready** — installable, works offline
- **Dark theme** with neon purple/fuchsia palette
- **Responsive** — desktop sidebar + mobile bottom nav

## 🗂️ Project Structure

```
quest-ai/
├── public/                        # Static assets (favicon, manifest)
├── src/
│   ├── components/
│   │   ├── ui/                    # Button, Card, Dialog, Tabs, Toast...
│   │   ├── character/             # CharacterCard
│   │   ├── tasks/                 # HabitItem, DailyItem, TodoItem, RewardItem, TaskDialog
│   │   └── layout/                # Sidebar, TopBar, MobileNav, CommandPalette
│   ├── pages/                     # Dashboard, Tasks, Quests, Shop, Inventory, AICoach,
│   │                              # Mood, Analytics, Achievements, Settings
│   ├── store/                     # Zustand store (single source of truth)
│   ├── lib/                       # gamification, ai, storage, sound, utils
│   ├── data/                      # shop items, achievements, seed tasks
│   ├── hooks/                     # useCommandPalette, useGlobalShortcuts
│   ├── types/                     # TypeScript interfaces
│   ├── App.tsx                    # Router + layout
│   ├── main.tsx                   # Entry
│   └── index.css                  # Tailwind + theme tokens
├── .github/workflows/deploy.yml   # GitHub Pages CI
├── DEPLOYMENT.md                  # Deployment steps + live URL
├── PROJECT_REPORT.md              # Full project report
└── README.md
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Deploy to GitHub Pages (auto on push to main)
git push origin main
```

**Live demo:** 🌐 **https://dmz22.github.io/quest-ai/**

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full deployment pipeline.

## 💾 Data & Privacy

- **All data lives in your browser's localStorage.** No server, no account, no tracking.
- **Export / Import JSON backups** from the Settings page.
- **API keys** (Gemini/OpenAI/Claude) are stored locally and only sent to the provider you configured.

## 🎨 Design Philosophy

1. **Craziest UX** — neon gradients, animations, sound effects, hero cards.
2. **Optimized** — ~272 KB gzipped bundle, tree-shaken, no backend.
3. **Free forever** — static site, deployable to GitHub Pages / Vercel / Netlify for $0.
4. **Offline-first** — works without internet; localStorage persistence; PWA installable.
5. **AI-powered** — an actual coach that reads your state, not a dumb chatbot.

## 🏗️ Tech Stack

- **React 19** + **TypeScript 5**
- **Vite 6** for insanely fast builds
- **Tailwind CSS 3** + custom neon theme
- **Zustand** for state management (beats Redux for this scale)
- **Framer Motion** for buttery animations
- **Recharts** for analytics
- **Lucide React** icons
- **react-router-dom 7** for HashRouter (Pages-friendly)

## 🧑‍💻 Why it's better than Habitica

| Feature            | Habitica | Quest AI |
|--------------------|----------|----------|
| Modern UI          | ❌ 2013-era | ✅ 2026 neon |
| AI Coach           | ❌       | ✅ Gemini/OpenAI/Claude |
| Offline           | ❌       | ✅ 100% offline |
| Mood tracking      | ❌       | ✅ With charts |
| Goal breakdown     | ❌       | ✅ AI-powered |
| Command palette    | ❌       | ✅ Ctrl+K |
| Data export/import | Limited  | ✅ JSON |
| PWA installable   | ❌       | ✅ |
| Deploy cost       | $0 (hosted) | $0 (self-hosted, no signup) |
| Privacy           | Account required | ✅ Zero accounts |

## 📜 License

MIT. Fork it. Ship it. Level up.

## 🙏 Credits

Built with ❤️ inspired by Habitica.
