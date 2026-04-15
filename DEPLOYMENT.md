# 🚀 Quest AI — Deployment

## 🌐 Live URL

> # **https://dmz22.github.io/quest-ai/**

**Status:** ✅ **LIVE** (deployed 2026-04-15)
**Host:** GitHub Pages (global CDN via Fastly)
**Cost:** $0 / month **forever**
**Repo:** https://github.com/DMZ22/quest-ai

Open the URL in any modern browser. No signup. No installation. Everything works offline after first load thanks to localStorage persistence + PWA manifest.

---

## 🏗️ How it's deployed

Quest AI is a 100% **static Vite + React** app. `npm run build` outputs a `dist/` folder that gets published to the **`gh-pages` branch** of the repo. GitHub Pages serves that branch directly.

**No server. No database. No backend. No subscription. No credit card.**

### The deploy pipeline

```bash
npm run build          # Vite builds to ./dist
npx gh-pages -d dist   # Publishes ./dist to the gh-pages branch
# GitHub Pages picks up the change and serves it in ~20 seconds
```

This is wired into `package.json` as:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

So a full deploy is just:
```bash
npm run deploy
```

### Configuration that made it possible

1. **`vite.config.ts`** — `base: './'` so asset paths work at any sub-path.
2. **`App.tsx`** — uses `HashRouter` (not `BrowserRouter`) so routes resolve client-side without server rewrites.
3. **`public/manifest.webmanifest`** — makes the app installable as a PWA.
4. **`public/favicon.svg`** — vector icon, no raster assets needed.

---

## 📦 Build stats

| Metric              | Value              |
|---------------------|--------------------|
| Bundle (raw)        | 942 KB             |
| Bundle (gzipped)    | **274 KB**         |
| CSS (gzipped)       | 9 KB               |
| Total modules       | 2665               |
| Build time          | ~20s               |
| Dependencies        | 401 packages       |
| Lighthouse (target) | 95+ performance    |

---

## 🔄 Redeploying

From the repo root:

```bash
cd quest-ai
npm run build   # rebuild
npm run deploy  # ships to gh-pages branch
```

GitHub Pages will auto-rebuild in ~20s after `gh-pages` pushes. You can watch status:
```bash
gh api repos/DMZ22/quest-ai/pages
```

Expected response when live:
```json
{ "status": "built", "html_url": "https://dmz22.github.io/quest-ai/" }
```

---

## 🔧 Local development

```bash
cd quest-ai
npm install
npm run dev      # http://localhost:5173
npm run build    # produces dist/
npm run preview  # preview the production build locally
```

---

## 🌍 Alternative free hosts (drop-in)

Because Quest AI is 100% static, you can deploy `dist/` to any of these for free:

| Host                | Command                                               |
|---------------------|-------------------------------------------------------|
| **Vercel**          | `vercel deploy --prod`                                |
| **Netlify**         | `netlify deploy --prod --dir=dist`                    |
| **Cloudflare Pages**| Connect the repo in the dashboard                     |
| **Surge.sh**        | `surge dist my-quest-ai.surge.sh`                     |
| **Firebase Hosting**| `firebase deploy`                                     |

All stay free forever — Quest AI has zero server costs by design.

---

## 🔐 Privacy & data

- **All data lives in the user's browser** (`localStorage`). No server, no account, no telemetry.
- **API keys** (optional Gemini / OpenAI / Claude for the AI Coach) are stored only in `localStorage` and only sent to the chosen provider.
- **Export/Import JSON** backups from Settings → Data.
- Clearing browser data = losing your character. Export regularly.

---

## 🧭 Custom domain (optional)

1. Add a `CNAME` file in `public/` containing your domain (e.g. `questai.yourdomain.com`).
2. Point a CNAME DNS record at `dmz22.github.io`.
3. Run `npm run deploy`.
4. GitHub Pages will auto-provision SSL within a few minutes.

---

## 📊 Post-deploy verification

After every deploy, hit the live URL and check:

- [x] Page loads with title "Quest AI — Level Up Your Life"
- [x] Character card renders with animated avatar + particles
- [x] Sidebar navigation works across all 10 routes
- [x] Clicking a habit + button updates XP live
- [x] Ctrl+K command palette opens
- [x] Browser console is clean (no errors)
- [x] Data persists across page reloads

---

**Deployed:** 2026-04-15
**Repo:** https://github.com/DMZ22/quest-ai
**Owner:** [@DMZ22](https://github.com/DMZ22)
