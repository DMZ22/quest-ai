import { CharacterCard } from '@/components/character/CharacterCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Swords, Plus, Flame, Target } from 'lucide-react'
import { DailyItem } from '@/components/tasks/DailyItem'
import { TodoItem } from '@/components/tasks/TodoItem'
import { HabitItem } from '@/components/tasks/HabitItem'
import { useState } from 'react'
import { TaskDialog } from '@/components/tasks/TaskDialog'
import type { AnyTask } from '@/types'
import { Progress } from '@/components/ui/progress'

export function Dashboard() {
  const character = useStore((s) => s.character)
  const habits = useStore((s) => s.habits)
  const dailies = useStore((s) => s.dailies)
  const todos = useStore((s) => s.todos)
  const quests = useStore((s) => s.quests)
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'habit' | 'daily' | 'todo'>('daily')
  const [editing, setEditing] = useState<AnyTask | null>(null)

  const activeDailies = dailies.filter((d) => !d.archived && d.dueToday)
  const pendingDailies = activeDailies.filter((d) => !d.completed)
  const pendingTodos = todos.filter((t) => !t.completed && !t.archived)
  const activeQuest = quests.find((q) => q.active)

  const todayProgress = activeDailies.length > 0
    ? (activeDailies.filter((d) => d.completed).length / activeDailies.length) * 100
    : 0

  const openAdd = (type: 'habit' | 'daily' | 'todo') => {
    setDialogType(type)
    setEditing(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CharacterCard />
        </div>
        <Card className="border-border/40 bg-gradient-to-br from-fuchsia-950/40 to-slate-900/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-fuchsia-400" /> Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dailies complete</span>
                <span className="font-bold">{activeDailies.filter((d) => d.completed).length}/{activeDailies.length}</span>
              </div>
              <Progress value={todayProgress} indicatorClassName="bg-gradient-to-r from-violet-500 to-fuchsia-500" className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-border/40 bg-background/30 p-2">
                <div className="text-lg font-bold">{habits.length}</div>
                <div className="text-[10px] uppercase text-muted-foreground">Habits</div>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/30 p-2">
                <div className="text-lg font-bold">{pendingDailies.length}</div>
                <div className="text-[10px] uppercase text-muted-foreground">Dailies Left</div>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/30 p-2">
                <div className="text-lg font-bold">{pendingTodos.length}</div>
                <div className="text-[10px] uppercase text-muted-foreground">To-Do</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" variant="gradient" onClick={() => navigate('/tasks')}>
                <Plus className="h-3.5 w-3.5" /> Add task
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/ai')}>
                <Sparkles className="h-3.5 w-3.5" /> Ask AI
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Quest */}
      {activeQuest && (
        <Card className="relative overflow-hidden border-fuchsia-500/30 bg-gradient-to-r from-red-950/30 via-violet-950/30 to-slate-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(236,72,153,0.15),_transparent_60%)]" />
          <CardContent className="relative flex items-center gap-4 p-5">
            <div className="text-5xl">{activeQuest.bossIcon}</div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-fuchsia-400">Active Quest · Boss Fight</div>
              <div className="text-xl font-bold">{activeQuest.name}</div>
              <div className="text-sm text-muted-foreground">{activeQuest.description}</div>
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-xs font-medium">
                  <span>{activeQuest.boss}</span>
                  <span>{activeQuest.progress}/{activeQuest.bossMaxHp}</span>
                </div>
                <Progress value={activeQuest.progress} max={activeQuest.bossMaxHp} indicatorClassName="bg-gradient-to-r from-red-500 to-fuchsia-500" className="h-2" />
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/quests')}>
              <Swords className="h-3.5 w-3.5" /> View
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Task columns */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard title="Dailies" onAdd={() => openAdd('daily')} emptyText="No dailies yet. Create one to start a streak." icon={<Flame className="h-4 w-4 text-orange-400" />}>
          {pendingDailies.slice(0, 5).map((d) => <DailyItem key={d.id} daily={d} onEdit={(t) => { setEditing(t); setDialogOpen(true) }} />)}
          {pendingDailies.length === 0 && activeDailies.length > 0 && (
            <div className="py-6 text-center text-sm text-emerald-400">All dailies done! 🎉</div>
          )}
        </SectionCard>
        <SectionCard title="Habits" onAdd={() => openAdd('habit')} emptyText="Add habits like 'Drink water' or 'No snacking'." icon={<Target className="h-4 w-4 text-violet-400" />}>
          {habits.slice(0, 5).map((h) => <HabitItem key={h.id} habit={h} onEdit={(t) => { setEditing(t); setDialogOpen(true) }} />)}
        </SectionCard>
        <SectionCard title="To-Dos" onAdd={() => openAdd('todo')} emptyText="Capture one-off tasks to earn XP." icon={<Target className="h-4 w-4 text-amber-400" />}>
          {pendingTodos.slice(0, 5).map((t) => <TodoItem key={t.id} todo={t} onEdit={(task) => { setEditing(task); setDialogOpen(true) }} />)}
        </SectionCard>
      </div>

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} type={dialogType} editingTask={editing} />
    </div>
  )
}

function SectionCard({ title, onAdd, children, emptyText, icon }: { title: string; onAdd: () => void; children: React.ReactNode; emptyText: string; icon: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children
  return (
    <Card className="border-border/40 bg-card/40">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">{icon}{title}</CardTitle>
        <Button size="xs" variant="ghost" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {hasChildren ? children : <div className="py-6 text-center text-sm text-muted-foreground">{emptyText}</div>}
      </CardContent>
    </Card>
  )
}
