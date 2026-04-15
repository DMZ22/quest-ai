import { Flame, Trash2, Pencil, Check } from 'lucide-react'
import type { Daily } from '@/types'
import { useStore } from '@/store'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function DailyItem({ daily, onEdit }: { daily: Daily; onEdit: (d: Daily) => void }) {
  const toggleDaily = useStore((s) => s.toggleDaily)
  const deleteTask = useStore((s) => s.deleteTask)
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem)
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      className={cn(
        'group rounded-xl border border-border/40 bg-card/60 backdrop-blur transition hover:border-sky-500/40',
        daily.completed && 'border-emerald-500/40 bg-emerald-500/5'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={() => toggleDaily(daily.id)}
          className={cn(
            'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-2 transition',
            daily.completed
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-sky-500/50 hover:border-sky-500 hover:bg-sky-500/10'
          )}
          aria-label="Toggle daily"
        >
          {daily.completed && <Check className="h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => (daily.checklist.length > 0 || daily.notes) && setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <span className={cn('font-medium', daily.completed && 'line-through opacity-60')}>{daily.title}</span>
            <Badge variant={daily.difficulty}>{daily.difficulty}</Badge>
            {daily.streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-orange-400">
                <Flame className="h-3 w-3" />
                {daily.streak}
              </span>
            )}
          </div>
          {daily.tags.length > 0 && (
            <div className="mt-0.5 text-xs text-muted-foreground">{daily.tags.map((t) => `#${t}`).join(' ')}</div>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button onClick={() => onEdit(daily)} className="rounded p-1.5 hover:bg-accent" aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => deleteTask(daily.id, 'daily')} className="rounded p-1.5 text-red-400 hover:bg-red-500/10" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {(expanded || daily.checklist.length > 0) && (daily.notes || daily.checklist.length > 0) && (
        <div className="border-t border-border/40 px-4 py-3 text-sm">
          {daily.notes && <p className="mb-2 text-muted-foreground">{daily.notes}</p>}
          {daily.checklist.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChecklistItem(daily.id, 'daily', item.id)}
                className="h-4 w-4 rounded"
              />
              <span className={cn(item.completed && 'line-through opacity-60')}>{item.text}</span>
            </label>
          ))}
        </div>
      )}
    </motion.div>
  )
}
