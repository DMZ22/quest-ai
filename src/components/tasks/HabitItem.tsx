import { Plus, Minus, Flame, Trash2, Pencil } from 'lucide-react'
import type { Habit } from '@/types'
import { useStore } from '@/store'
import { Badge } from '@/components/ui/badge'

export function HabitItem({ habit, onEdit }: { habit: Habit; onEdit: (h: Habit) => void }) {
  const scoreHabit = useStore((s) => s.scoreHabit)
  const deleteTask = useStore((s) => s.deleteTask)

  return (
    <div className="group flex items-stretch overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors hover:border-white/10 hover:bg-white/[0.025]">
      {(habit.direction === 'positive' || habit.direction === 'both') && (
        <button
          onClick={() => scoreHabit(habit.id, 'up')}
          className="flex w-14 items-center justify-center border-r border-white/[0.06] bg-emerald-500/[0.08] text-emerald-300 transition-colors hover:bg-emerald-500/20 active:bg-emerald-500/30"
          aria-label="Mark habit positive"
        >
          <Plus className="h-5 w-5" />
        </button>
      )}
      <div className="flex-1 p-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium">{habit.title}</span>
          <Badge variant={habit.difficulty}>{habit.difficulty}</Badge>
          {habit.streak > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] text-orange-400">
              <Flame className="h-3 w-3" />
              {habit.streak}
            </span>
          )}
        </div>
        {habit.notes && <div className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">{habit.notes}</div>}
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="text-emerald-400">+{habit.counterUp}</span>
          <span className="text-red-400">-{habit.counterDown}</span>
          {habit.tags.length > 0 && (
            <span className="opacity-70">{habit.tags.map((t) => `#${t}`).join(' ')}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 pr-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={() => onEdit(habit)} className="rounded-md p-1.5 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" aria-label="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => deleteTask(habit.id, 'habit')} className="rounded-md p-1.5 text-red-400 hover:bg-red-500/10" aria-label="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {(habit.direction === 'negative' || habit.direction === 'both') && (
        <button
          onClick={() => scoreHabit(habit.id, 'down')}
          className="flex w-14 items-center justify-center border-l border-white/[0.06] bg-red-500/[0.08] text-red-300 transition-colors hover:bg-red-500/20 active:bg-red-500/30"
          aria-label="Mark habit negative"
        >
          <Minus className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
