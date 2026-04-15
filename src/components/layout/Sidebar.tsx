import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, Store, Swords, Trophy, BarChart3, Sparkles, Settings, Smile, Backpack } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: ListChecks, label: 'Tasks' },
  { to: '/quests', icon: Swords, label: 'Quests' },
  { to: '/shop', icon: Store, label: 'Shop' },
  { to: '/inventory', icon: Backpack, label: 'Inventory' },
  { to: '/ai', icon: Sparkles, label: 'AI Coach' },
  { to: '/mood', icon: Smile, label: 'Mood' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/achievements', icon: Trophy, label: 'Trophies' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const character = useStore((s) => s.character)
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/[0.06] bg-background/60 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_16px_rgba(139,92,246,0.35)]">
          ⚔️
        </div>
        <div>
          <div className="text-[13px] font-semibold tracking-tight">Quest AI</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Level Up IRL</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-white/[0.06] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                  : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-[18px] w-[18px]', isActive ? 'text-violet-300' : '')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
          <div className="text-xl leading-none">{character.avatar}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold">{character.name}</div>
            <div className="text-[10px] text-muted-foreground">Lv {character.level} · {character.gold.toLocaleString()}g</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
