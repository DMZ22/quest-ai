import { create } from 'zustand'
import { useEffect } from 'react'
import { sfx } from '@/lib/sound'
import { useStore } from '@/store'

interface PaletteState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useCommandPalette = create<PaletteState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}))

export function useGlobalShortcuts() {
  const toggle = useCommandPalette((s) => s.toggle)
  const soundOn = useStore((s) => s.settings.sound)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggle()
        if (soundOn) sfx.ding()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, soundOn])
}
