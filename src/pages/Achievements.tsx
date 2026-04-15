import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import { Trophy } from 'lucide-react'

export function AchievementsPage() {
  const achievements = useStore((s) => s.achievements)
  const unlocked = achievements.filter((a) => a.unlockedAt)
  const locked = achievements.filter((a) => !a.unlockedAt)

  return (
    <div className="space-y-4">
      <Card className="border-border/40 bg-gradient-to-br from-amber-950/30 to-slate-900/30">
        <CardContent className="flex items-center gap-4 p-5">
          <Trophy className="h-10 w-10 text-amber-400" />
          <div>
            <h2 className="text-xl font-bold">Trophies & Achievements</h2>
            <p className="text-sm text-muted-foreground">{unlocked.length} of {achievements.length} unlocked</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold text-amber-300">{Math.round((unlocked.length / achievements.length) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </CardContent>
      </Card>

      {unlocked.length > 0 && (
        <Card className="border-border/40">
          <CardHeader><CardTitle className="text-base">Unlocked</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {unlocked.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/5 p-3">
                  <div className="text-3xl">{a.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/40">
        <CardHeader><CardTitle className="text-base">In Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((a) => (
              <div key={a.id} className={cn('rounded-xl border border-border/40 p-3', a.progress > 0 && 'bg-card/60')}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl opacity-50">{a.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{a.name}</span>
                      <Badge variant="outline">{a.category}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{a.description}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="mb-0.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="tabular-nums">{Math.min(a.progress, a.target)}/{a.target}</span>
                  </div>
                  <Progress value={a.progress} max={a.target} indicatorClassName="bg-gradient-to-r from-amber-500 to-orange-500" className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
