import { useEffect, useState } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useStore } from '@/store'
import type { Difficulty, HabitDirection, AnyTask } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'habit' | 'daily' | 'todo' | 'reward'
  editingTask?: AnyTask | null
}

export function TaskDialog({ open, onOpenChange, type, editingTask }: Props) {
  const addHabit = useStore((s) => s.addHabit)
  const addDaily = useStore((s) => s.addDaily)
  const addTodo = useStore((s) => s.addTodo)
  const addReward = useStore((s) => s.addReward)
  const updateTask = useStore((s) => s.updateTask)

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [direction, setDirection] = useState<HabitDirection>('positive')
  const [dueDate, setDueDate] = useState('')
  const [cost, setCost] = useState(20)
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setNotes(editingTask.notes)
      setDifficulty(editingTask.difficulty)
      setTags(editingTask.tags.join(', '))
      if (editingTask.type === 'habit') setDirection(editingTask.direction)
      if (editingTask.type === 'todo') setDueDate(editingTask.dueDate ?? '')
      if (editingTask.type === 'reward') setCost(editingTask.cost)
    } else {
      setTitle('')
      setNotes('')
      setDifficulty('medium')
      setDirection('positive')
      setDueDate('')
      setCost(20)
      setTags('')
    }
  }, [editingTask, open])

  const handleSubmit = () => {
    if (!title.trim()) return
    const tagArr = tags.split(',').map((t) => t.trim()).filter(Boolean)
    if (editingTask) {
      const patch: any = { title, notes, difficulty, tags: tagArr }
      if (editingTask.type === 'habit') patch.direction = direction
      if (editingTask.type === 'todo') patch.dueDate = dueDate || null
      if (editingTask.type === 'reward') patch.cost = cost
      updateTask(editingTask.id, editingTask.type, patch)
    } else {
      if (type === 'habit') addHabit(title, difficulty, direction, notes, tagArr)
      else if (type === 'daily') addDaily(title, difficulty, notes, tagArr)
      else if (type === 'todo') addTodo(title, difficulty, notes, tagArr, dueDate || null)
      else addReward(title, cost, notes)
    }
    onOpenChange(false)
  }

  const titles: Record<string, string> = {
    habit: editingTask ? 'Edit Habit' : 'New Habit',
    daily: editingTask ? 'Edit Daily' : 'New Daily',
    todo: editingTask ? 'Edit To-Do' : 'New To-Do',
    reward: editingTask ? 'Edit Reward' : 'New Reward',
  }

  const effectiveType = editingTask?.type ?? type

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{titles[effectiveType]}</DialogTitle>
        <DialogDescription>
          {effectiveType === 'habit' && 'Habits can be clicked up or down repeatedly throughout the day.'}
          {effectiveType === 'daily' && 'Dailies reset every day and cost HP if missed.'}
          {effectiveType === 'todo' && 'One-off tasks. Earn XP and gold when completed.'}
          {effectiveType === 'reward' && 'Buy yourself something nice when you finish tasks.'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Read 30 minutes" autoFocus />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Notes (optional)</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional details..." />
        </div>

        {effectiveType !== 'reward' && (
          <div>
            <label className="mb-1 block text-xs font-medium">Difficulty</label>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
              <option value="trivial">Trivial</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </div>
        )}

        {effectiveType === 'habit' && (
          <div>
            <label className="mb-1 block text-xs font-medium">Direction</label>
            <Select value={direction} onChange={(e) => setDirection(e.target.value as HabitDirection)}>
              <option value="positive">Positive only (+)</option>
              <option value="negative">Negative only (-)</option>
              <option value="both">Both (+/-)</option>
            </Select>
          </div>
        )}

        {effectiveType === 'todo' && (
          <div>
            <label className="mb-1 block text-xs font-medium">Due date (optional)</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        )}

        {effectiveType === 'reward' && (
          <div>
            <label className="mb-1 block text-xs font-medium">Gold cost</label>
            <Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} min={1} />
          </div>
        )}

        {effectiveType !== 'reward' && (
          <div>
            <label className="mb-1 block text-xs font-medium">Tags (comma separated)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="work, health" />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button variant="gradient" onClick={handleSubmit}>{editingTask ? 'Save' : 'Create'}</Button>
      </DialogFooter>
    </Dialog>
  )
}
