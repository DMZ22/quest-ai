# 🛠️ Development & Delivery Protocol

> **Standard procedure for every project I ship. Follow this checklist end-to-end — no steps skipped.**

This protocol was distilled from the Quest AI project and applies to any web/app project going forward. Every new app in this workspace must produce the same deliverables: working code, a live deploy link, a project report, and screenshots of every screen.

---

## ✅ The 10-step delivery protocol

### 1. Scaffold the project
- Create the project folder inside `FIN App/` (never scatter projects).
- Pick the stack once and stick with it (default: **Vite + React 19 + TypeScript + Tailwind + shadcn-style**).
- Add `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`.
- `npm install` — commit `package-lock.json`.

### 2. Design the data model first
- Put all shared interfaces in `src/types/index.ts`.
- Use a **single Zustand store** (not Redux, not Context sprawl).
- Auto-persist to `localStorage` on every mutation.
- Expose `init`, `persist`, `resetAll`, `exportState`, `importState` from day 1.

### 3. Build the core before the polish
- Logic in `src/lib/` (gamification, utils, storage, ai, sound).
- Seed data in `src/data/`.
- UI primitives in `src/components/ui/` (Button, Card, Dialog, Tabs, Toast, Input, Badge, Progress).
- Feature components in `src/components/<feature>/`.
- Pages in `src/pages/`, wired via `react-router-dom` **HashRouter** (for GH Pages compatibility).

### 4. Add the *craziest* polish layer
- Custom UI primitives (no heavy component library at runtime).
- Refined typography — load Inter via Google Fonts.
- Layered gradients + inner/outer shadows; **no infinite animations**.
- **Every interactive element plays a sound** (Web Audio API, no external files).
- Command palette (**Ctrl+K**).
- Export/import JSON backup.
- PWA manifest (`public/manifest.webmanifest`).
- Dark theme by default, responsive desktop sidebar + mobile bottom nav.

### 5. Type-check and build clean
```bash
npx tsc -b       # must pass with zero errors
npm run build    # produces dist/ — check gzipped size; target < 300 KB
```

### 6. Verify in a preview server
- Run `npm run dev` locally.
- Walk through every route.
- Click every button. No console errors.

### 7. Capture screenshots of every page
- Create `scripts/capture-screenshots.mjs` (Playwright + Chrome).
- Capture **desktop (1440×900) and mobile (390×844)** for every route.
- Save to `docs/screenshots/` as `NN-page-name-<viewport>.png`.
- Run `node scripts/capture-screenshots.mjs`.
- Verify all files exist and look correct.

### 8. Write `PROJECT_REPORT.md`
- Header table with name, author, date, repo, live URL, status.
- **Embed all screenshots** (desktop hero shots + mobile thumbnail grid).
- Abstract → Problem → Solution → Tech Stack → Architecture → Features → Performance → Folder Structure → Testing → Deployment → Future Work → Conclusion.

### 9. Write `DEPLOYMENT.md`
- Prominent **live URL** at the top.
- Explain the deploy pipeline (GitHub Pages via `gh-pages` branch).
- Build stats table.
- Redeploy command.
- Alternative hosts (Vercel / Netlify / Cloudflare Pages) as optional backups.

### 10. Ship it
```bash
# Local
npm run build
npx gh-pages -d dist -u "<name> <email>"

# Push source
git add .
git commit -m "feat: ..."
git push origin main

# Enable Pages once (first time only)
gh api -X POST repos/<owner>/<repo>/pages -f source[branch]=gh-pages -f source[path]=/

# Verify
curl -s -o /dev/null -w "%{http_code}\n" "https://<owner>.github.io/<repo>/"
```

Also:
- Set the **homepage** on the repo (`gh repo edit --homepage`).
- Confirm the live URL loads HTTP 200.
- Update the repo description.

---

## 📁 Every project folder must contain

```
<project>/
├── docs/
│   └── screenshots/          # All page screenshots (desktop + mobile)
├── scripts/
│   └── capture-screenshots.mjs
├── src/                      # Source code
├── public/                   # Static assets including manifest.webmanifest
├── DEPLOYMENT.md             # Live URL + deploy pipeline
├── DEVELOPMENT_PROTOCOL.md   # This file (copy it in)
├── PROJECT_REPORT.md         # Full report with embedded screenshots
├── README.md                 # Concise features + quickstart
├── package.json
└── ... (Vite / TS config)
```

---

## 🎯 Definition of Done

A project is only "done" when **all** of these are true:

- [x] Source compiles with `tsc -b` (zero errors).
- [x] Production build succeeds (`npm run build`).
- [x] **Deployed to GitHub Pages** with a working live URL.
- [x] **Live URL is set as the repo homepage**.
- [x] `README.md` links to the live URL.
- [x] `DEPLOYMENT.md` documents the pipeline and live URL.
- [x] `PROJECT_REPORT.md` exists with embedded screenshots.
- [x] `docs/screenshots/` contains a screenshot of every page (desktop + mobile).
- [x] A final `git push` lands on `main` with all artifacts committed.
- [x] `curl -I https://<owner>.github.io/<repo>/` returns `200 OK`.

---

## 🚫 Anti-patterns to avoid

- ❌ Scattering projects outside `FIN App/`.
- ❌ Using `BrowserRouter` on a GitHub Pages deploy (→ use `HashRouter`).
- ❌ Heavy UI libraries (MUI, Chakra) — use custom shadcn-style.
- ❌ Infinite CSS animations / shine loops / floating elements — they're fatiguing.
- ❌ Skipping the screenshot step — reports without images look unfinished.
- ❌ Committing `node_modules`, `dist`, or `*.tsbuildinfo`.
- ❌ Forgetting to set `base: './'` in `vite.config.ts` (breaks Pages asset paths).
- ❌ Committing secrets (.env) — always `.gitignore` them.

---

## 📌 Default repo metadata to set

```bash
gh repo edit \
  --description "<one-line punchy description>" \
  --homepage "https://<owner>.github.io/<repo>/"

# Add topics
gh repo edit --add-topic "react,typescript,vite,tailwindcss,pwa,<project-topic>"
```

---

*Follow this protocol every time. No exceptions. No skipped steps.*
