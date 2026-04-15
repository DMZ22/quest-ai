import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { useStore } from '@/store'
import { useState } from 'react'
import { Smile } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { cn } from '@/lib/utils'

const MOODS = [
  { value: 1, emoji: '😢', label: 'Rough' },
  { value: 2, emoji: '😟', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'OK' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
] as const

export function MoodPage() {
  const mood = useStore((s) => s.mood)
  const logMood = useStore((s) => s.logMood)
  const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [note, setNote] = useState('')
  const [energy, setEnergy] = useState(3)
  const [focus, setFocus] = useState(3)

  const handleSave = () => {
    if (!selected) return
    logMood(selected, note, energy, focus)
    setSelected(null)
    setNote('')
  }

  const data = [...mood].reverse().slice(-14).map((m) => ({ date: m.date.slice(5), mood: m.mood, energy: m.energy, focus: m.focus }))
  const avgMood = mood.length ? (mood.reduce((s, m) => s + m.mood, 0) / mood.length).toFixed(1) : '—'

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Smile className="h-4 w-4 text-emerald-400" /> How are you today?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelected(m.value)}
                className={cn(
                  'flex-1 rounded-xl border p-3 text-center transition',
                  selected === m.value ? 'border-violet-500/60 bg-violet-500/10' : 'border-border/40 hover:border-violet-500/40'
                )}
              >
                <div className="text-3xl">{m.emoji}</div>
                <div className="mt-1 text-xs font-medium">{m.label}</div>
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Energy: {energy}/5</label>
              <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Focus: {focus}/5</label>
              <input type="range" min={1} max={5} value={focus} onChange={(e) => setFocus(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's on your mind? (optional)" />
          <Button variant="gradient" className="w-full" onClick={handleSave} disabled={!selected}>Save today's check-in</Button>
        </CardContent>
      </Card>

      {mood.length > 0 && (
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-base">Your mood over the last 14 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-sm text-muted-foreground">
              Avg mood: <span className="font-bold text-foreground">{avgMood}/5</span> · {mood.length} check-ins logged
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" fontSize={11} />
                  <YAxis domain={[1, 5]} stroke="#888" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#1a1625', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="mood" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="energy" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="focus" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
