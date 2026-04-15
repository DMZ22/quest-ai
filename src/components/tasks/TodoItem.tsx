import { Trash2, Pencil, Check, CalendarClock } from 'lucide-react'
import type { Todo } from '@/types'
import { useStore } from '@/store'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { cn, formatDate } from '@/lib/utils'

export function TodoItem({ todo, onEdit }: { todo: Todo; onEdit: (t: Todo) => void }) {
  const toggleTodo = useStore((s) => s.toggleTodo)
  const deleteTask = useStore((s) => s.deleteTask)
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem)
  const [expanded, setExpanded] = useState(false)

  const overdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  return (
    <motion.div
      layout
      className={cn(
        'group rounded-xl border border-border/40 bg-card/60 backdrop-blur transition hover:border-amber-500/40',
        todo.completed && 'border-emerald-500/40 bg-emerald-500/5',
        overdue && 'border-red-500/40'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={cn(
            'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-2 transition',
            todo.completed
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10'
          )}
          aria-label="Toggle todo"
        >
          {todo.completed && <Check className="h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => (todo.checklist.length > 0 || todo.notes) && setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <span className={cn('font-medium', todo.completed && 'line-through opacity-60')}>{todo.title}</span>
            <Badge variant={todo.difficulty}>{todo.difficulty}</Badge>
            {todo.dueDate && (
              <span className={cn('flex items-center gap-0.5 text-xs', overdue ? 'text-red-400' : 'text-muted-foreground')}>
                <CalendarClock className="h-3 w-3" />
                {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
          {todo.tags.length > 0 && (
            <div className="mt-0.5 text-xs text-muted-foreground">{todo.tags.map((t) => `#${t}`).join(' ')}</div>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button onClick={() => onEdit(todo)} className="rounded p-1.5 hover:bg-accent" aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => deleteTask(todo.id, 'todo')} className="rounded p-1.5 text-red-400 hover:bg-red-500/10" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {(expanded || todo.checklist.length > 0) && (todo.notes || todo.checklist.length > 0) && (
        <div className="border-t border-border/40 px-4 py-3 text-sm">
          {todo.notes && <p className="mb-2 text-muted-foreground">{todo.notes}</p>}
          {todo.checklist.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChecklistItem(todo.id, 'todo', item.id)}
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
