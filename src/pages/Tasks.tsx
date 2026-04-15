import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useStore } from '@/store'
import { Plus, Search } from 'lucide-react'
import { HabitItem } from '@/components/tasks/HabitItem'
import { DailyItem } from '@/components/tasks/DailyItem'
import { TodoItem } from '@/components/tasks/TodoItem'
import { RewardItem } from '@/components/tasks/RewardItem'
import { TaskDialog } from '@/components/tasks/TaskDialog'
import type { AnyTask } from '@/types'

export function TasksPage() {
  const habits = useStore((s) => s.habits)
  const dailies = useStore((s) => s.dailies)
  const todos = useStore((s) => s.todos)
  const rewards = useStore((s) => s.rewards)

  const [tab, setTab] = useState('habits')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'habit' | 'daily' | 'todo' | 'reward'>('habit')
  const [editing, setEditing] = useState<AnyTask | null>(null)

  const openAdd = () => {
    setEditing(null)
    setDialogType(tab === 'habits' ? 'habit' : tab === 'dailies' ? 'daily' : tab === 'todos' ? 'todo' : 'reward')
    setDialogOpen(true)
  }
  const openEdit = (t: AnyTask) => {
    setEditing(t)
    setDialogOpen(true)
  }

  const match = (title: string) => title.toLowerCase().includes(search.toLowerCase())

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="pl-9" />
        </div>
        <Button variant="gradient" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="dailies">Dailies</TabsTrigger>
          <TabsTrigger value="todos">To-Dos</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="habits">
          <Card className="border-border/40"><CardContent className="space-y-2 p-4">
            {habits.filter((h) => match(h.title)).map((h) => <HabitItem key={h.id} habit={h} onEdit={openEdit} />)}
            {habits.length === 0 && <EmptyState label="habits" />}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="dailies">
          <Card className="border-border/40"><CardContent className="space-y-2 p-4">
            {dailies.filter((d) => match(d.title)).map((d) => <DailyItem key={d.id} daily={d} onEdit={openEdit} />)}
            {dailies.length === 0 && <EmptyState label="dailies" />}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="todos">
          <Card className="border-border/40"><CardContent className="space-y-2 p-4">
            {todos.filter((t) => match(t.title)).map((t) => <TodoItem key={t.id} todo={t} onEdit={openEdit} />)}
            {todos.length === 0 && <EmptyState label="to-dos" />}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card className="border-border/40"><CardContent className="space-y-2 p-4">
            {rewards.filter((r) => match(r.title)).map((r) => <RewardItem key={r.id} reward={r} onEdit={openEdit} />)}
            {rewards.length === 0 && <EmptyState label="rewards" />}
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} type={dialogType} editingTask={editing} />
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return <div className="py-10 text-center text-sm text-muted-foreground">No {label} yet. Click Add to create one.</div>
}
