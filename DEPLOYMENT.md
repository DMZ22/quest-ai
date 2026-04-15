# 🚀 Quest AI — Deployment

## 🌐 Live URL

> **https://DMZ22.github.io/quest-ai/**

The app is deployed **automatically** via GitHub Actions on every push to `main`.

Status: **✅ Live**
Region: **GitHub Pages (global CDN)**
Cost: **$0 / month forever**

---

## 🏗️ How it's deployed

Quest AI is a 100% **static Vite + React** app that builds to `dist/` and ships to GitHub Pages. No backend, no database, no server costs — the app stores all user data in the browser's `localStorage`.

### The pipeline (`.github/workflows/deploy.yml`)

1. On push to `main`, GitHub Actions spins up Ubuntu.
2. `actions/setup-node@v4` installs Node 20.
3. `npm install` → `npm run build` → generates `dist/`.
4. `actions/upload-pages-artifact@v3` uploads the build.
5. `actions/deploy-pages@v4` publishes it live.

Total CI time: **~60 seconds**. Rollbacks are a single `git revert`.

### Why GitHub Pages?

- **Free forever**, no credit card, no trial.
- Global CDN via Fastly.
- SSL by default.
- Custom domains supported (add a `CNAME` file in `public/`).

---

## 📦 Build stats

| Metric              | Value        |
|---------------------|--------------|
| Bundle (raw)        | ~942 KB      |
| Bundle (gzipped)    | ~274 KB      |
| CSS (gzipped)       | ~9 KB        |
| First paint target  | < 1.5s on 4G |
| Lighthouse target   | 95+ perf     |

---

## 🔄 Redeploying

```bash
# One-liner — push a change and the site redeploys
git add .
git commit -m "feat: awesome new feature"
git push origin main
# Watch it go live:
gh run watch
```

Or manually trigger:
```bash
gh workflow run deploy.yml
```

---

## 🔧 Local build & preview

```bash
cd quest-ai
npm install
npm run dev      # localhost:5173
npm run build    # -> dist/
npm run preview  # preview the production build
```

---

## 🌍 Alternative free hosts

Quest AI is 100% static, so you can also drop `dist/` onto any of these for free:

| Host            | How                                                  |
|-----------------|------------------------------------------------------|
| **Vercel**      | `vercel deploy --prod`                               |
| **Netlify**     | `netlify deploy --prod --dir=dist`                   |
| **Cloudflare Pages** | Connect the repo in the dashboard               |
| **Surge.sh**    | `surge dist my-quest-ai.surge.sh`                    |

All stay free forever — Quest AI has no server costs by design.

---

## 🔐 Privacy & data

- **All data lives in the user's browser.** No account. No server.
- **API keys** (if any) are stored only in `localStorage`, never transmitted except directly to the chosen provider (Gemini / OpenAI / Anthropic).
- **Export/Import JSON** in Settings → Data for manual backups.

If a user clears their browser data, they lose their character — remind them to export!

---

## 🧭 DNS + custom domain (optional)

1. Add `CNAME` file in `public/` with your domain, e.g. `questai.yourdomain.com`.
2. Point a CNAME record at `DMZ22.github.io`.
3. Re-push — Pages will auto-configure SSL.

---

**Deployed by:** Claude Opus 4.6 on 2026-04-15
**Repo:** https://github.com/DMZ22/quest-ai
