import { Coins, Heart, Zap, Command as CmdIcon, Gem } from 'lucide-react'
import { useStore } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import { Button } from '@/components/ui/button'

export function TopBar() {
  const character = useStore((s) => s.character)
  const location = useLocation()
  const navigate = useNavigate()
  const { open } = useCommandPalette()

  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/tasks': 'Tasks',
    '/quests': 'Quests',
    '/shop': 'Shop',
    '/inventory': 'Inventory',
    '/ai': 'AI Coach',
    '/mood': 'Mood Tracker',
    '/analytics': 'Analytics',
    '/achievements': 'Trophies',
    '/settings': 'Settings',
  }
  const title = titles[location.pathname] ?? 'Quest AI'

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 lg:hidden"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">⚔️</div>
        <span className="font-bold">Quest AI</span>
      </button>
      <h1 className="hidden text-xl font-bold lg:block">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Button variant="outline" size="sm" onClick={open} className="hidden sm:inline-flex">
          <CmdIcon className="h-3.5 w-3.5" /> <span className="hidden md:inline">Quick add</span>
          <kbd className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">Ctrl+K</kbd>
        </Button>

        <StatChip icon={<Heart className="h-3.5 w-3.5 text-red-400" />} value={`${character.hp}/${character.maxHp}`} />
        <StatChip icon={<Zap className="h-3.5 w-3.5 text-amber-400" />} value={`Lv ${character.level}`} />
        <StatChip icon={<Coins className="h-3.5 w-3.5 text-amber-400" />} value={character.gold.toString()} />
        <StatChip icon={<Gem className="h-3.5 w-3.5 text-cyan-400" />} value={character.gems.toString()} />
      </div>
    </header>
  )
}

function StatChip({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border/40 bg-card/40 px-2.5 py-1 text-xs font-semibold tabular-nums">
      {icon}
      {value}
    </div>
  )
}
