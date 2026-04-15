import { Flame, Trash2, Pencil, Check } from 'lucide-react'
import type { Daily } from '@/types'
import { useStore } from '@/store'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function DailyItem({ daily, onEdit }: { daily: Daily; onEdit: (d: Daily) => void }) {
  const toggleDaily = useStore((s) => s.toggleDaily)
  const deleteTask = useStore((s) => s.deleteTask)
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem)
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        'group rounded-xl border border-white/[0.06] bg-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors hover:border-white/10 hover:bg-white/[0.025]',
        daily.completed && 'border-emerald-500/30 bg-emerald-500/[0.04]'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={() => toggleDaily(daily.id)}
          className={cn(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-colors',
            daily.completed
              ? 'border-emerald-400/70 bg-emerald-500 text-white'
              : 'border-white/15 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
          )}
          aria-label="Toggle daily"
        >
          {daily.completed && <Check className="h-4 w-4" strokeWidth={3} />}
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
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(daily)} className="rounded-md p-1.5 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => deleteTask(daily.id, 'daily')} className="rounded-md p-1.5 text-red-400 hover:bg-red-500/10" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {(expanded || daily.checklist.length > 0) && (daily.notes || daily.checklist.length > 0) && (
        <div className="border-t border-white/[0.05] px-4 py-3 text-sm">
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
    </div>
  )
}
