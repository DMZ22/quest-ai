import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import { useStore } from '@/store'
import { Plus, Zap, Store, Swords, BarChart3, Sparkles, Settings, ListChecks, Trophy, Smile, Backpack, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Cmd {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const addHabit = useStore((s) => s.addHabit)
  const addDaily = useStore((s) => s.addDaily)
  const addTodo = useStore((s) => s.addTodo)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelected(0)
    }
  }, [isOpen])

  const go = (path: string) => {
    navigate(path)
    close()
  }

  const quickAdd = (type: 'habit' | 'daily' | 'todo', title: string) => {
    if (!title.trim()) return
    if (type === 'habit') addHabit(title, 'medium', 'positive')
    else if (type === 'daily') addDaily(title, 'medium')
    else addTodo(title, 'medium')
    close()
  }

  const commands: Cmd[] = [
    { id: 'nav-dash', label: 'Go to Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, action: () => go('/') },
    { id: 'nav-tasks', label: 'Go to Tasks', icon: <ListChecks className="h-4 w-4" />, action: () => go('/tasks') },
    { id: 'nav-quests', label: 'Go to Quests', icon: <Swords className="h-4 w-4" />, action: () => go('/quests') },
    { id: 'nav-shop', label: 'Go to Shop', icon: <Store className="h-4 w-4" />, action: () => go('/shop') },
    { id: 'nav-inv', label: 'Go to Inventory', icon: <Backpack className="h-4 w-4" />, action: () => go('/inventory') },
    { id: 'nav-ai', label: 'Go to AI Coach', icon: <Sparkles className="h-4 w-4" />, action: () => go('/ai') },
    { id: 'nav-mood', label: 'Go to Mood', icon: <Smile className="h-4 w-4" />, action: () => go('/mood') },
    { id: 'nav-analytics', label: 'Go to Analytics', icon: <BarChart3 className="h-4 w-4" />, action: () => go('/analytics') },
    { id: 'nav-ach', label: 'Go to Achievements', icon: <Trophy className="h-4 w-4" />, action: () => go('/achievements') },
    { id: 'nav-settings', label: 'Go to Settings', icon: <Settings className="h-4 w-4" />, action: () => go('/settings') },
  ]

  const quickAddVisible = query.trim().length > 0 && !query.trim().startsWith('/')
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
  const total = (quickAddVisible ? 3 : 0) + filtered.length
  const clampedSelected = Math.min(selected, Math.max(0, total - 1))

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(total - 1, s + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(0, s - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const idx = clampedSelected
      if (quickAddVisible) {
        if (idx === 0) return quickAdd('habit', query)
        if (idx === 1) return quickAdd('daily', query)
        if (idx === 2) return quickAdd('todo', query)
        filtered[idx - 3]?.action()
      } else {
        filtered[idx]?.action()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type to search or create a task..."
          autoFocus
          className="border-none bg-transparent text-base focus-visible:ring-0"
        />
        <div className="mt-3 max-h-80 overflow-y-auto border-t border-border/40 pt-3">
          {quickAddVisible && (
            <div className="mb-2 space-y-1">
              <div className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground">Quick create</div>
              {['habit', 'daily', 'todo'].map((t, i) => (
                <button
                  key={t}
                  onClick={() => quickAdd(t as any, query)}
                  onMouseEnter={() => setSelected(i)}
                  className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm', i === clampedSelected && 'bg-accent')}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create {t}: <strong>{query}</strong></span>
                </button>
              ))}
            </div>
          )}
          <div className="space-y-0.5">
            <div className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground">Navigate</div>
            {filtered.map((c, i) => {
              const idx = (quickAddVisible ? 3 : 0) + i
              return (
                <button
                  key={c.id}
                  onClick={c.action}
                  onMouseEnter={() => setSelected(idx)}
                  className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm', idx === clampedSelected && 'bg-accent')}
                >
                  {c.icon}
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
