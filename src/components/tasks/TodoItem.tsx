import { Trash2, Pencil, Check, CalendarClock } from 'lucide-react'
import type { Todo } from '@/types'
import { useStore } from '@/store'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { cn, formatDate } from '@/lib/utils'

export function TodoItem({ todo, onEdit }: { todo: Todo; onEdit: (t: Todo) => void }) {
  const toggleTodo = useStore((s) => s.toggleTodo)
  const deleteTask = useStore((s) => s.deleteTask)
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem)
  const [expanded, setExpanded] = useState(false)

  const overdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  return (
    <div
      className={cn(
        'group rounded-xl border border-white/[0.06] bg-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors hover:border-white/10 hover:bg-white/[0.025]',
        todo.completed && 'border-emerald-500/30 bg-emerald-500/[0.04]',
        overdue && 'border-red-500/30'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={cn(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-colors',
            todo.completed
              ? 'border-emerald-400/70 bg-emerald-500 text-white'
              : 'border-white/15 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
          )}
          aria-label="Toggle todo"
        >
          {todo.completed && <Check className="h-4 w-4" strokeWidth={3} />}
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
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(todo)} className="rounded-md p-1.5 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => deleteTask(todo.id, 'todo')} className="rounded-md p-1.5 text-red-400 hover:bg-red-500/10" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {(expanded || todo.checklist.length > 0) && (todo.notes || todo.checklist.length > 0) && (
        <div className="border-t border-white/[0.05] px-4 py-3 text-sm">
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
    </div>
  )
}
