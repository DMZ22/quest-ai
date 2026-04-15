import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/store'
import { xpToNextLevel, CLASS_INFO, effectiveStat } from '@/lib/gamification'
import { Heart, Zap, Coins, Gem, Swords, Brain, Shield, Eye, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { ParticleField } from '@/components/ui/particles'

export function CharacterCard({ compact = false }: { compact?: boolean }) {
  const character = useStore((s) => s.character)
  const classInfo = CLASS_INFO[character.class]
  const xpNext = xpToNextLevel(character.level)

  return (
    <Card className="relative overflow-hidden border-violet-500/30 bg-gradient-to-br from-violet-950/60 via-fuchsia-950/30 to-slate-900/60 glow-ring hex-pattern">
      <ParticleField count={28} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,0.25),_transparent_65%)]" />
      <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/20 opacity-60" />
      <CardContent className="relative p-5">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 text-5xl shadow-2xl ring-2 ring-violet-400/40"
            style={{ boxShadow: `0 0 48px ${classInfo.color}55, inset 0 0 20px rgba(255,255,255,0.1)` }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-white/10" />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="relative z-10"
            >
              {character.avatar}
            </motion.div>
            {/* Orbital spark */}
            <motion.div
              className="absolute h-2 w-2 rounded-full bg-fuchsia-300 shadow-lg shadow-fuchsia-400"
              animate={{
                x: [30, 0, -30, 0, 30],
                y: [0, 30, 0, -30, 0],
                opacity: [0.6, 1, 0.6, 1, 0.6],
              }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            />
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-xl font-bold shine-text">{character.name}</h3>
              <span className="rounded-full bg-gradient-to-r from-fuchsia-500/30 to-violet-500/30 px-2 py-0.5 text-xs font-semibold text-fuchsia-200 ring-1 ring-fuchsia-500/50 shadow-[0_0_12px_rgba(236,72,153,0.4)]">
                Lv {character.level}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <span>{classInfo.icon}</span>
              <span>{classInfo.name}</span>
              {character.streakDays > 0 && (
                <>
                  <span className="mx-1">·</span>
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-orange-300">{character.streakDays} day streak</span>
                </>
              )}
            </div>

            {/* HP / XP / Mana bars */}
            <div className="mt-3 space-y-2">
              <Bar icon={<Heart className="h-3.5 w-3.5" />} label="HP" value={character.hp} max={character.maxHp} color="bg-red-500" />
              <Bar icon={<Zap className="h-3.5 w-3.5" />} label="XP" value={character.xp} max={xpNext} color="bg-amber-400" />
              <Bar icon={<Brain className="h-3.5 w-3.5" />} label="Mana" value={character.mana} max={character.maxMana} color="bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-4 flex items-center gap-4 border-t border-border/40 pt-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-amber-400" />
            <span className="font-semibold text-amber-200">{character.gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gem className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-cyan-200">{character.gems}</span>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {character.totalTasksCompleted} tasks done
          </div>
        </div>

        {/* Stats */}
        {!compact && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            <Stat icon={<Swords className="h-3.5 w-3.5" />} label="STR" value={effectiveStat('str', character)} />
            <Stat icon={<Brain className="h-3.5 w-3.5" />} label="INT" value={effectiveStat('int', character)} />
            <Stat icon={<Shield className="h-3.5 w-3.5" />} label="CON" value={effectiveStat('con', character)} />
            <Stat icon={<Eye className="h-3.5 w-3.5" />} label="PER" value={effectiveStat('per', character)} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Bar({ icon, label, value, max, color }: { icon: React.ReactNode; label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-1 opacity-80">
          {icon}
          <span>{label}</span>
        </div>
        <span className="tabular-nums">{value}/{max}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (value / Math.max(1, max)) * 100)}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${color} relative`}
          style={{ boxShadow: '0 0 12px currentColor' }}
        >
          <div className="shimmer absolute inset-0 rounded-full opacity-60" />
        </motion.div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: 'spring', stiffness: 400 }}
      className="rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-2 text-center shadow-inner"
    >
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 text-base font-bold tabular-nums">{value}</div>
    </motion.div>
  )
}
