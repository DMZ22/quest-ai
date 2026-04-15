import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store'
import { Swords, Play, X, Plus, Trophy } from 'lucide-react'
import { useState } from 'react'
import { localQuestIdeas } from '@/lib/ai'
import type { Difficulty } from '@/types'

const BOSS_ICONS = ['🐉', '🐲', '👹', '👺', '🧟', '🏰', '🌋', '🐙', '🦑', '🧙‍♂️', '🦖']

export function QuestsPage() {
  const quests = useStore((s) => s.quests)
  const addQuest = useStore((s) => s.addQuest)
  const startQuest = useStore((s) => s.startQuest)
  const abandonQuest = useStore((s) => s.abandonQuest)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    boss: '',
    bossIcon: '🐉',
    bossHp: 100,
    difficulty: 'medium' as Difficulty,
  })

  const handleAdd = () => {
    if (!form.name.trim()) return
    addQuest({
      name: form.name,
      description: form.description,
      boss: form.boss || form.name,
      bossIcon: form.bossIcon,
      bossHp: form.bossHp,
      difficulty: form.difficulty,
      rewards: { xp: form.bossHp * 2, gold: form.bossHp, items: [] },
    })
    setForm({ name: '', description: '', boss: '', bossIcon: '🐉', bossHp: 100, difficulty: 'medium' })
    setShowForm(false)
  }

  const active = quests.filter((q) => q.active && !q.completed)
  const available = quests.filter((q) => !q.active && !q.completed)
  const completed = quests.filter((q) => q.completed)

  return (
    <div className="space-y-4">
      <Card className="border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/30 via-red-950/20 to-slate-900/30">
        <CardContent className="flex items-center gap-4 p-5">
          <Swords className="h-10 w-10 text-fuchsia-400" />
          <div className="flex-1">
            <h2 className="text-xl font-bold">Quests & Boss Fights</h2>
            <p className="text-sm text-muted-foreground">Every task you complete damages the boss. Win to earn huge rewards.</p>
          </div>
          <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" /> New Quest
          </Button>
        </CardContent>
      </Card>

      {showForm && (
        <Card className="border-border/40">
          <CardHeader><CardTitle className="text-base">Create a Quest</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Quest name (e.g. Slay the Procrastination Dragon)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Textarea placeholder="What does victory look like? What's the real-world goal?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Boss name" value={form.boss} onChange={(e) => setForm({ ...form, boss: e.target.value })} />
              <Select value={form.bossIcon} onChange={(e) => setForm({ ...form, bossIcon: e.target.value })}>
                {BOSS_ICONS.map((i) => <option key={i} value={i}>{i} Boss</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs">Boss HP (difficulty)</label>
                <Input type="number" value={form.bossHp} onChange={(e) => setForm({ ...form, bossHp: Number(e.target.value) })} min={10} />
              </div>
              <div>
                <label className="text-xs">Difficulty tier</label>
                <Select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="gradient" onClick={handleAdd}>Create Quest</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active */}
      {active.length > 0 && (
        <Card className="border-border/40">
          <CardHeader><CardTitle className="text-base">Active</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {active.map((q) => (
              <div key={q.id} className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{q.bossIcon}</div>
                  <div className="flex-1">
                    <div className="font-bold">{q.name}</div>
                    <div className="mb-2 text-xs text-muted-foreground">{q.description}</div>
                    <div className="mb-1 flex justify-between text-xs"><span>{q.boss}</span><span>{q.progress}/{q.bossMaxHp}</span></div>
                    <Progress value={q.progress} max={q.bossMaxHp} indicatorClassName="bg-gradient-to-r from-red-500 to-fuchsia-500" />
                  </div>
                  <Button size="sm" variant="outline" onClick={() => abandonQuest(q.id)}><X className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Available */}
      <Card className="border-border/40">
        <CardHeader><CardTitle className="text-base">Your Quests</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {available.length === 0 && quests.length === 0 ? (
            <>
              <div className="py-4 text-center text-sm text-muted-foreground">No quests yet. Start with a suggestion:</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {localQuestIdeas().map((idea) => (
                  <button
                    key={idea.name}
                    onClick={() => addQuest({ name: idea.name, description: idea.description, boss: idea.boss, bossIcon: idea.bossIcon, bossHp: idea.bossHp, difficulty: 'medium', rewards: { xp: idea.bossHp * 2, gold: idea.bossHp, items: [] } })}
                    className="rounded-xl border border-border/40 bg-card/60 p-3 text-left transition hover:border-fuchsia-500/40"
                  >
                    <div className="text-3xl">{idea.bossIcon}</div>
                    <div className="mt-1 font-semibold">{idea.name}</div>
                    <div className="text-xs text-muted-foreground">{idea.description}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            available.map((q) => (
              <div key={q.id} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 p-3">
                <div className="text-3xl">{q.bossIcon}</div>
                <div className="flex-1">
                  <div className="font-semibold">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.description}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                    <span className="text-muted-foreground">HP: {q.bossMaxHp}</span>
                  </div>
                </div>
                <Button size="sm" variant="gradient" onClick={() => startQuest(q.id)}>
                  <Play className="h-3.5 w-3.5" /> Start
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Completed */}
      {completed.length > 0 && (
        <Card className="border-border/40">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-400" /> Victories</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {completed.map((q) => (
              <div key={q.id} className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 opacity-90">
                <div className="text-2xl">{q.bossIcon}</div>
                <div className="flex-1">
                  <div className="font-semibold">{q.name}</div>
                  <div className="text-xs text-muted-foreground">Defeated {q.boss}</div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300">Victory</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
