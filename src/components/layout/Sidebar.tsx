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
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border/40 bg-card/40 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border/40 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg shadow-lg">
          ⚔️
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight">Quest AI</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Level Up IRL</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-200 shadow-inner'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4 transition group-hover:scale-110" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border/40 p-3">
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-2 text-xs">
          <div className="text-2xl">{character.avatar}</div>
          <div>
            <div className="font-semibold">{character.name}</div>
            <div className="text-muted-foreground">Lv {character.level}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
