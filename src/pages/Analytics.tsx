import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/store'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, LineChart, Line } from 'recharts'
import { xpToNextLevel } from '@/lib/gamification'
import { TrendingUp, Target, Flame, Trophy } from 'lucide-react'

const COLORS = ['#a855f7', '#ec4899', '#facc15', '#22c55e', '#3b82f6']

export function AnalyticsPage() {
  const character = useStore((s) => s.character)
  const habits = useStore((s) => s.habits)
  const dailies = useStore((s) => s.dailies)
  const todos = useStore((s) => s.todos)

  const difficultyData = [
    { name: 'Trivial', value: [...habits, ...dailies, ...todos].filter((t) => t.difficulty === 'trivial').length },
    { name: 'Easy', value: [...habits, ...dailies, ...todos].filter((t) => t.difficulty === 'easy').length },
    { name: 'Medium', value: [...habits, ...dailies, ...todos].filter((t) => t.difficulty === 'medium').length },
    { name: 'Hard', value: [...habits, ...dailies, ...todos].filter((t) => t.difficulty === 'hard').length },
  ].filter((d) => d.value > 0)

  const tasksByType = [
    { name: 'Habits', count: habits.length },
    { name: 'Dailies', count: dailies.length },
    { name: 'Todos', count: todos.filter((t) => !t.completed).length },
    { name: 'Done', count: todos.filter((t) => t.completed).length },
  ]

  // Build a 14-day history from dailies
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return d.toISOString().split('T')[0]
  })
  const dailyActivity = last14.map((date) => {
    const done = dailies.reduce((sum, d) => sum + (d.history.find((h) => h.date === date && h.completed) ? 1 : 0), 0)
    return { date: date.slice(5), done }
  })

  const topStreak = Math.max(0, ...dailies.map((d) => d.longestStreak))

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox icon={<TrendingUp className="h-5 w-5 text-violet-400" />} label="Total Tasks" value={character.totalTasksCompleted} />
        <StatBox icon={<Target className="h-5 w-5 text-amber-400" />} label="Current Level" value={character.level} />
        <StatBox icon={<Flame className="h-5 w-5 text-orange-400" />} label="Longest Streak" value={topStreak} />
        <StatBox icon={<Trophy className="h-5 w-5 text-emerald-400" />} label="Gold Earned" value={character.gold} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader><CardTitle className="text-base">14-Day Daily Completion</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#1a1625', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="done" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader><CardTitle className="text-base">Tasks by Type</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={tasksByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#1a1625', border: '1px solid #333' }} />
                  <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader><CardTitle className="text-base">Difficulty Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={difficultyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {difficultyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1625', border: '1px solid #333' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader><CardTitle className="text-base">Character Progression</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Level" value={`${character.level} (${character.xp}/${xpToNextLevel(character.level)} XP)`} />
            <Row label="HP" value={`${character.hp}/${character.maxHp}`} />
            <Row label="Gold" value={character.gold.toLocaleString()} />
            <Row label="STR / INT / CON / PER" value={`${character.stats.str} / ${character.stats.int} / ${character.stats.con} / ${character.stats.per}`} />
            <Row label="Streak" value={`${character.streakDays} days`} />
            <Row label="Owned items" value={character.ownedItems.length.toString()} />
            <Row label="Pets" value={character.pets.length.toString()} />
            <Row label="Class" value={character.class} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="border-border/40">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">{icon}</div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold tabular-nums">{value.toLocaleString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 pb-1 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
