import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { useStore } from '@/store'
import { askCoach, localBreakdown } from '@/lib/ai'
import { Sparkles, Send, Trash2, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function AICoachPage() {
  const messages = useStore((s) => s.ai)
  const addMessage = useStore((s) => s.addAIMessage)
  const clearAI = useStore((s) => s.clearAI)
  const settings = useStore((s) => s.settings)
  const character = useStore((s) => s.character)
  const habits = useStore((s) => s.habits)
  const dailies = useStore((s) => s.dailies)
  const todos = useStore((s) => s.todos)
  const addTodo = useStore((s) => s.addTodo)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [goal, setGoal] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    addMessage('user', text)
    setLoading(true)
    try {
      const completedToday = dailies.filter((d) => d.completed).length + todos.filter((t) => t.completed).length
      const reply = await askCoach(settings, {
        character,
        tasks: [...habits, ...dailies, ...todos],
        completedToday,
        missedToday: 0,
      }, text)
      addMessage('coach', reply)
    } catch (e) {
      addMessage('coach', 'Sorry, I hit a snag. Check your API key in Settings.')
    } finally {
      setLoading(false)
    }
  }

  const handleBreakdown = () => {
    if (!goal.trim()) return
    const subtasks = localBreakdown(goal)
    subtasks.forEach((task) => addTodo(task, 'medium', `From goal: ${goal}`))
    setGoal('')
    addMessage('user', `Break down: ${goal}`)
    addMessage('coach', `Added ${subtasks.length} subtasks to your To-Dos. Start with the first one today.`)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="flex h-[72vh] flex-col border-border/40">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-fuchsia-400" /> AI Coach
            </CardTitle>
            <Button size="xs" variant="ghost" onClick={clearAI}><Trash2 className="h-3.5 w-3.5" /></Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <div ref={scrollRef} className="h-full space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="py-8 text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-fuchsia-400" />
                  <h3 className="mt-2 font-bold">Your Personal Coach</h3>
                  <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                    Ask for habit ideas, motivation, quest suggestions, or help breaking down a big goal.
                    {!settings.apiKey && ' (Works offline with smart local replies; add an API key in Settings for Gemini/OpenAI/Claude.)'}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Give me 3 habit ideas', 'I feel unmotivated', 'Suggest a quest for this week'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setInput(s) }}
                        className="rounded-full border border-border/40 bg-card/60 px-3 py-1.5 text-xs hover:border-violet-500/40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm',
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg'
                        : 'border border-border/40 bg-card'
                    )}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-400" />
                  Coach is thinking...
                </div>
              )}
            </div>
          </CardContent>
          <div className="border-t border-border/40 p-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask the coach anything..."
              />
              <Button variant="gradient" onClick={handleSend} disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-border/40">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Wand2 className="h-4 w-4 text-violet-400" /> Goal Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">Paste a big scary goal and I'll split it into 5 starter to-dos.</p>
            <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Launch my side project" />
            <Button variant="gradient" className="w-full" onClick={handleBreakdown}>Break it down</Button>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-violet-950/20 to-slate-900/20">
          <CardHeader><CardTitle className="text-base">Pro Tips</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>• Start with one hard task per day. Hard tasks give 60% more XP.</p>
            <p>• Streak multiplier caps at 1.42x (21 days). Protect your streak!</p>
            <p>• At level 10, pick a class. Warriors get bonus hard-task gold.</p>
            <p>• Missed dailies cost HP. Lower difficulty or archive if you're overcommitted.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
