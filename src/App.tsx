import { useEffect, useRef } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Toaster } from '@/components/ui/toast'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { useGlobalShortcuts } from '@/hooks/useCommandPalette'
import { useStore } from '@/store'
import { sfx } from '@/lib/sound'
import { Dashboard } from '@/pages/Dashboard'
import { TasksPage } from '@/pages/Tasks'
import { ShopPage } from '@/pages/Shop'
import { InventoryPage } from '@/pages/Inventory'
import { QuestsPage } from '@/pages/Quests'
import { AICoachPage } from '@/pages/AICoach'
import { MoodPage } from '@/pages/Mood'
import { AnalyticsPage } from '@/pages/Analytics'
import { AchievementsPage } from '@/pages/Achievements'
import { SettingsPage } from '@/pages/Settings'
import { setSoundEnabled } from '@/lib/sound'

function AnimatedRoutes() {
  const location = useLocation()
  const soundOn = useStore((s) => s.settings.sound)
  const isFirstRender = useRef(true)
  // Fire a chime on every route change (but not on very first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (soundOn) sfx.chime()
  }, [location.pathname, soundOn])
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/ai" element={<AICoachPage />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const init = useStore((s) => s.init)
  const initialized = useStore((s) => s.initialized)
  const soundOn = useStore((s) => s.settings.sound)

  useGlobalShortcuts()

  useEffect(() => {
    if (!initialized) init()
  }, [init, initialized])

  useEffect(() => {
    setSoundEnabled(soundOn)
  }, [soundOn])

  // Global click listener: plays a tap sound on every button/link/role=button click.
  // The sound rotates through 6 variants so every tap sounds different.
  useEffect(() => {
    if (!soundOn) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const el = target.closest('button, a, [role="button"], input[type="checkbox"], input[type="radio"], label, select') as HTMLElement | null
      if (!el) return
      // Skip if the element has data-no-sound
      if (el.dataset.noSound !== undefined) return
      sfx.tap()
    }
    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [soundOn])

  return (
    <HashRouter>
      <div className="min-h-screen">
        <Sidebar />
        <div className="lg:pl-64">
          <TopBar />
          <main className="mx-auto w-full max-w-7xl p-4 pb-24 lg:p-8">
            <AnimatedRoutes />
          </main>
        </div>
        <MobileNav />
        <Toaster />
        <CommandPalette />
      </div>
    </HashRouter>
  )
}

export default App
