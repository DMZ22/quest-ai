import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, Store, Swords, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/tasks', icon: ListChecks, label: 'Tasks' },
  { to: '/quests', icon: Swords, label: 'Quests' },
  { to: '/shop', icon: Store, label: 'Shop' },
  { to: '/ai', icon: Sparkles, label: 'AI' },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border/40 bg-card/90 backdrop-blur-xl lg:hidden">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition',
              isActive ? 'text-violet-300' : 'text-muted-foreground'
            )
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
