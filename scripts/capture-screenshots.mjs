// One-shot script to screenshot every page of Quest AI.
// Requires: dev server running on http://localhost:5180/
// Uses playwright-core with an existing Chrome install (no download needed).

import { chromium } from 'playwright-core'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '..', 'docs', 'screenshots')

const pages = [
  { name: '01-dashboard', hash: '/' },
  { name: '02-tasks', hash: '/tasks' },
  { name: '03-quests', hash: '/quests' },
  { name: '04-shop', hash: '/shop' },
  { name: '05-inventory', hash: '/inventory' },
  { name: '06-ai-coach', hash: '/ai' },
  { name: '07-mood', hash: '/mood' },
  { name: '08-analytics', hash: '/analytics' },
  { name: '09-achievements', hash: '/achievements' },
  { name: '10-settings', hash: '/settings' },
]

const viewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile', width: 390, height: 844 },
]

const BASE_URL = process.env.BASE_URL || 'http://localhost:5180/'

async function main() {
  const chromePath =
    process.env.CHROME_PATH ||
    (process.platform === 'win32'
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined)

  console.log(`Launching Chrome from: ${chromePath ?? '(default)'}`)

  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
  })

  try {
    for (const vp of viewports) {
      console.log(`\n📸 Viewport: ${vp.label} (${vp.width}x${vp.height})`)
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        colorScheme: 'dark',
      })
      const page = await context.newPage()

      // Warm up the app so localStorage seeds and routes render fully.
      await page.goto(`${BASE_URL}#/`, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(500)

      for (const p of pages) {
        const url = `${BASE_URL}#${p.hash}`
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
        await page.waitForTimeout(700) // let motion/page-transition settle
        const file = path.join(outDir, `${p.name}-${vp.label}.png`)
        await page.screenshot({ path: file, fullPage: true })
        console.log(`  ✓ ${path.basename(file)}`)
      }

      await context.close()
    }
  } finally {
    await browser.close()
  }
  console.log(`\n✅ All screenshots saved to: ${outDir}`)
}

main().catch((err) => {
  console.error('❌ Capture failed:', err)
  process.exit(1)
})
