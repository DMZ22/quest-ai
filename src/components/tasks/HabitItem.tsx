import { Plus, Minus, Flame, Trash2, Pencil } from 'lucide-react'
import type { Habit } from '@/types'
import { useStore } from '@/store'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function HabitItem({ habit, onEdit }: { habit: Habit; onEdit: (h: Habit) => void }) {
  const scoreHabit = useStore((s) => s.scoreHabit)
  const deleteTask = useStore((s) => s.deleteTask)
  const [bounce, setBounce] = useState<'up' | 'down' | null>(null)

  const handleScore = (direction: 'up' | 'down') => {
    setBounce(direction)
    scoreHabit(habit.id, direction)
    setTimeout(() => setBounce(null), 350)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.9 }}
      whileHover={{ scale: 1.01 }}
      className="group flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-card/70 to-card/40 backdrop-blur transition-all duration-200 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20"
    >
      {(habit.direction === 'positive' || habit.direction === 'both') && (
        <button
          onClick={() => handleScore('up')}
          className="relative flex w-14 items-center justify-center border-r border-white/10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-300 transition-all hover:from-emerald-500/30 hover:to-emerald-600/20 active:scale-95"
          aria-label="Mark habit positive"
        >
          <motion.div
            animate={bounce === 'up' ? { scale: [1, 1.6, 1], rotate: [0, 15, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Plus className="h-5 w-5 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          </motion.div>
          {bounce === 'up' && (
            <motion.span
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -30, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none absolute text-xs font-bold text-emerald-300"
            >+XP</motion.span>
          )}
        </button>
      )}
      <div className="flex-1 p-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{habit.title}</span>
          <Badge variant={habit.difficulty}>{habit.difficulty}</Badge>
          {habit.streak > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-orange-400">
              <Flame className="h-3 w-3" />
              {habit.streak}
            </span>
          )}
        </div>
        {habit.notes && <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{habit.notes}</div>}
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-emerald-400">+{habit.counterUp}</span>
          <span className="text-red-400">-{habit.counterDown}</span>
          {habit.tags.length > 0 && (
            <span className="opacity-70">{habit.tags.map((t) => `#${t}`).join(' ')}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 pr-2 opacity-0 transition group-hover:opacity-100">
        <button onClick={() => onEdit(habit)} className="rounded p-1.5 hover:bg-accent" aria-label="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => deleteTask(habit.id, 'habit')} className="rounded p-1.5 text-red-400 hover:bg-red-500/10" aria-label="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {(habit.direction === 'negative' || habit.direction === 'both') && (
        <button
          onClick={() => handleScore('down')}
          className="relative flex w-14 items-center justify-center border-l border-white/10 bg-gradient-to-br from-red-500/20 to-rose-600/10 text-red-300 transition-all hover:from-red-500/30 hover:to-rose-600/20 active:scale-95"
          aria-label="Mark habit negative"
        >
          <motion.div
            animate={bounce === 'down' ? { scale: [1, 1.6, 1], rotate: [0, -15, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Minus className="h-5 w-5 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
          </motion.div>
          {bounce === 'down' && (
            <motion.span
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -30, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none absolute text-xs font-bold text-red-300"
            >-HP</motion.span>
          )}
        </button>
      )}
    </motion.div>
  )
}
