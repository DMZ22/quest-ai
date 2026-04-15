import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Toaster } from '@/components/ui/toast'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { ConfettiBurst } from '@/components/ui/confetti'
import { useGlobalShortcuts } from '@/hooks/useCommandPalette'
import { useStore } from '@/store'
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
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
  const toasts = useStore((s) => s.toasts)
  const [confettiKey, setConfettiKey] = useState(0)

  useGlobalShortcuts()

  useEffect(() => {
    if (!initialized) init()
  }, [init, initialized])

  useEffect(() => {
    setSoundEnabled(soundOn)
  }, [soundOn])

  // Fire confetti whenever a levelup toast appears
  useEffect(() => {
    const hasLevelUp = toasts.some((t) => t.variant === 'levelup')
    if (hasLevelUp) setConfettiKey((k) => k + 1)
  }, [toasts])

  return (
    <HashRouter>
      <div className="min-h-screen">
        <Sidebar />
        <div className="lg:pl-60">
          <TopBar />
          <main className="mx-auto w-full max-w-7xl p-4 pb-24 lg:p-8">
            <AnimatedRoutes />
          </main>
        </div>
        <MobileNav />
        <Toaster />
        <CommandPalette />
        <ConfettiBurst key={confettiKey} active={confettiKey > 0} />
      </div>
    </HashRouter>
  )
}

export default App
