import { Card, CardContent } from '@/components/ui/card'
import { useStore } from '@/store'
import { xpToNextLevel, CLASS_INFO, effectiveStat } from '@/lib/gamification'
import { Heart, Zap, Coins, Gem, Swords, Brain, Shield, Eye, Flame } from 'lucide-react'

export function CharacterCard({ compact = false }: { compact?: boolean }) {
  const character = useStore((s) => s.character)
  const classInfo = CLASS_INFO[character.class]
  const xpNext = xpToNextLevel(character.level)

  return (
    <Card className="relative overflow-hidden border-white/[0.08] bg-[linear-gradient(135deg,rgba(139,92,246,0.08)_0%,rgba(255,255,255,0.01)_60%)] hex-pattern glow-ring">
      {/* Static depth gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.18),_transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,_rgba(0,0,0,0.3),_transparent)]" />
      </div>

      <CardContent className="relative p-6">
        <div className="flex items-start gap-5">
          {/* Avatar — static, softly lit */}
          <div
            className="relative flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center rounded-2xl text-[52px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_28px_rgba(0,0,0,0.45)]"
            style={{
              background:
                'linear-gradient(160deg, rgba(139,92,246,0.35) 0%, rgba(236,72,153,0.18) 55%, rgba(0,0,0,0.3) 100%)',
            }}
          >
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {character.avatar}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[22px] font-bold tracking-tight gradient-text">
                {character.name}
              </h3>
              <span className="rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-violet-200 ring-1 ring-inset ring-violet-400/30">
                Lv {character.level}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <span>{classInfo.icon}</span>
              <span>{classInfo.name}</span>
              {character.streakDays > 0 && (
                <>
                  <span className="mx-1 text-border">·</span>
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-orange-300">{character.streakDays} day streak</span>
                </>
              )}
            </div>

            {/* Bars */}
            <div className="mt-4 space-y-2.5">
              <Bar icon={<Heart className="h-3.5 w-3.5" />} label="HP" value={character.hp} max={character.maxHp} fromColor="from-rose-500" toColor="to-red-500" glow="rgba(244,63,94,0.35)" />
              <Bar icon={<Zap className="h-3.5 w-3.5" />} label="XP" value={character.xp} max={xpNext} fromColor="from-amber-400" toColor="to-orange-400" glow="rgba(251,146,60,0.35)" />
              <Bar icon={<Brain className="h-3.5 w-3.5" />} label="Mana" value={character.mana} max={character.maxMana} fromColor="from-sky-500" toColor="to-blue-500" glow="rgba(59,130,246,0.35)" />
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-5 flex items-center gap-5 border-t border-white/[0.06] pt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-amber-400" />
            <span className="font-semibold tabular-nums text-amber-200">{character.gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gem className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold tabular-nums text-cyan-200">{character.gems}</span>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {character.totalTasksCompleted} tasks done
          </div>
        </div>

        {/* Stats */}
        {!compact && (
          <div className="mt-4 grid grid-cols-4 gap-2.5">
            <Stat icon={<Swords className="h-3.5 w-3.5" />} label="STR" value={effectiveStat('str', character)} color="text-red-400" />
            <Stat icon={<Brain className="h-3.5 w-3.5" />} label="INT" value={effectiveStat('int', character)} color="text-blue-400" />
            <Stat icon={<Shield className="h-3.5 w-3.5" />} label="CON" value={effectiveStat('con', character)} color="text-emerald-400" />
            <Stat icon={<Eye className="h-3.5 w-3.5" />} label="PER" value={effectiveStat('per', character)} color="text-amber-400" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Bar({
  icon, label, value, max, fromColor, toColor, glow,
}: {
  icon: React.ReactNode
  label: string
  value: number
  max: number
  fromColor: string
  toColor: string
  glow: string
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100))
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] font-medium">
        <div className="flex items-center gap-1.5 opacity-75">
          {icon}
          <span className="uppercase tracking-wider">{label}</span>
        </div>
        <span className="tabular-nums opacity-80">{value}/{max}</span>
      </div>
      <div className="relative h-[7px] overflow-hidden rounded-full bg-white/[0.04] ring-1 ring-inset ring-white/[0.06]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fromColor} ${toColor} transition-[width] duration-700 ease-out`}
          style={{
            width: `${pct}%`,
            boxShadow: `0 0 12px ${glow}`,
          }}
        />
      </div>
    </div>
  )
}

function Stat({
  icon, label, value, color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className={`flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wider ${color} opacity-80`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 text-base font-bold tabular-nums">{value}</div>
    </div>
  )
}
