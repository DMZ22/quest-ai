import type { Character, Difficulty, CharacterClass, AnyTask, Habit, Daily, Todo } from '@/types'

// Difficulty multipliers for rewards/damage
export const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  trivial: 0.3,
  easy: 0.7,
  medium: 1.0,
  hard: 1.6,
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  trivial: 'Trivial',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export const CLASS_INFO: Record<CharacterClass, { name: string; icon: string; color: string; desc: string }> = {
  warrior: { name: 'Warrior', icon: '⚔️', color: '#ef4444', desc: 'Strength focus. Extra damage on hard tasks.' },
  mage: { name: 'Mage', icon: '🔮', color: '#8b5cf6', desc: 'Intelligence focus. Larger XP gains.' },
  healer: { name: 'Healer', icon: '✨', color: '#22c55e', desc: 'Constitution focus. More HP and recovery.' },
  rogue: { name: 'Rogue', icon: '🗡️', color: '#facc15', desc: 'Perception focus. More gold and rare drops.' },
  none: { name: 'Adventurer', icon: '🎒', color: '#94a3b8', desc: 'Pick a class at level 10 to unlock perks.' },
}

// XP needed to reach next level (quadratic curve)
export function xpToNextLevel(level: number): number {
  return Math.round(25 + Math.pow(level, 1.8) * 20)
}

export function maxHpForLevel(level: number, con: number, cls: CharacterClass): number {
  const base = 50 + level * 2 + con * 1.5
  return Math.round(cls === 'healer' ? base * 1.15 : base)
}

export function maxManaForLevel(level: number, int: number, cls: CharacterClass): number {
  const base = 10 + level + int * 1.2
  return Math.round(cls === 'mage' ? base * 1.2 : base)
}

// Compute effective stat with class bonus
export function effectiveStat(stat: keyof Character['stats'], char: Character): number {
  const base = char.stats[stat] + char.buffs[stat]
  const classBonus =
    (char.class === 'warrior' && stat === 'str') ||
    (char.class === 'mage' && stat === 'int') ||
    (char.class === 'healer' && stat === 'con') ||
    (char.class === 'rogue' && stat === 'per')
      ? Math.floor(char.level / 2)
      : 0
  return base + classBonus
}

export interface TaskRewardResult {
  xp: number
  gold: number
  hpDelta: number
  mana: number
  levelUp: boolean
  newLevel: number
  drop?: { type: 'item' | 'gem'; id: string; name: string }
  message: string
}

export function applyHabit(char: Character, habit: Habit, direction: 'up' | 'down'): { character: Character; result: TaskRewardResult } {
  const mult = DIFFICULTY_MULTIPLIER[habit.difficulty]
  const charCopy: Character = JSON.parse(JSON.stringify(char))

  let xp = 0, gold = 0, hpDelta = 0, mana = 0
  let message = ''

  if (direction === 'up') {
    xp = Math.round((4 + effectiveStat('int', char) * 0.3) * mult)
    gold = Math.round((2 + effectiveStat('per', char) * 0.2) * mult)
    mana = Math.round(1 * mult)
    message = `+${xp} XP  +${gold} gold`
  } else {
    hpDelta = -Math.round((4 + (3 - effectiveStat('con', char) * 0.2)) * mult)
    message = `${hpDelta} HP`
  }

  charCopy.xp += Math.max(0, xp)
  charCopy.gold += Math.max(0, gold)
  charCopy.hp = Math.max(0, Math.min(charCopy.maxHp, charCopy.hp + hpDelta))
  charCopy.mana = Math.min(charCopy.maxMana, charCopy.mana + mana)
  charCopy.totalTasksCompleted += direction === 'up' ? 1 : 0

  const levelUpResult = checkLevelUp(charCopy)
  return {
    character: levelUpResult.character,
    result: { xp, gold, hpDelta, mana, levelUp: levelUpResult.leveled, newLevel: levelUpResult.character.level, message },
  }
}

export function applyDailyComplete(char: Character, daily: Daily): { character: Character; result: TaskRewardResult } {
  const charCopy: Character = JSON.parse(JSON.stringify(char))
  const mult = DIFFICULTY_MULTIPLIER[daily.difficulty]
  const streakBonus = 1 + Math.min(daily.streak, 21) * 0.02

  const xp = Math.round((8 + effectiveStat('int', char) * 0.5) * mult * streakBonus)
  const gold = Math.round((5 + effectiveStat('per', char) * 0.4) * mult * streakBonus)
  const mana = Math.round(2 * mult)

  charCopy.xp += xp
  charCopy.gold += gold
  charCopy.mana = Math.min(charCopy.maxMana, charCopy.mana + mana)
  charCopy.totalTasksCompleted += 1

  const levelUpResult = checkLevelUp(charCopy)
  const msg = `+${xp} XP  +${gold} gold${streakBonus > 1 ? ` (🔥 ${daily.streak + 1})` : ''}`
  return {
    character: levelUpResult.character,
    result: { xp, gold, hpDelta: 0, mana, levelUp: levelUpResult.leveled, newLevel: levelUpResult.character.level, message: msg },
  }
}

export function applyDailyMiss(char: Character, daily: Daily): { character: Character; result: TaskRewardResult } {
  const charCopy: Character = JSON.parse(JSON.stringify(char))
  const mult = DIFFICULTY_MULTIPLIER[daily.difficulty]
  const hpDelta = -Math.round((6 + (3 - effectiveStat('con', char) * 0.25)) * mult)
  charCopy.hp = Math.max(0, charCopy.hp + hpDelta)
  return {
    character: charCopy,
    result: { xp: 0, gold: 0, hpDelta, mana: 0, levelUp: false, newLevel: charCopy.level, message: `${hpDelta} HP` },
  }
}

export function applyTodoComplete(char: Character, todo: Todo, overdueDays: number): { character: Character; result: TaskRewardResult } {
  const charCopy: Character = JSON.parse(JSON.stringify(char))
  const mult = DIFFICULTY_MULTIPLIER[todo.difficulty]
  const overdueMult = Math.max(0.6, 1 - overdueDays * 0.03)
  const xp = Math.round((10 + effectiveStat('int', char) * 0.6) * mult * overdueMult)
  const gold = Math.round((6 + effectiveStat('per', char) * 0.5) * mult * overdueMult)
  const mana = Math.round(3 * mult)
  charCopy.xp += xp
  charCopy.gold += gold
  charCopy.mana = Math.min(charCopy.maxMana, charCopy.mana + mana)
  charCopy.totalTasksCompleted += 1
  const levelUpResult = checkLevelUp(charCopy)
  return {
    character: levelUpResult.character,
    result: { xp, gold, hpDelta: 0, mana, levelUp: levelUpResult.leveled, newLevel: levelUpResult.character.level, message: `+${xp} XP  +${gold} gold` },
  }
}

export function checkLevelUp(char: Character): { character: Character; leveled: boolean } {
  let leveled = false
  while (char.xp >= xpToNextLevel(char.level)) {
    char.xp -= xpToNextLevel(char.level)
    char.level += 1
    leveled = true
    // stat boost
    char.stats.str += 1
    char.stats.con += 1
    char.stats.int += 1
    char.stats.per += 1
    // update max HP/mana
    char.maxHp = maxHpForLevel(char.level, char.stats.con, char.class)
    char.maxMana = maxManaForLevel(char.level, char.stats.int, char.class)
    char.hp = char.maxHp
    char.mana = char.maxMana
  }
  return { character: char, leveled }
}

export function isDueToday(daily: Daily, date: Date = new Date()): boolean {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
  const key = days[date.getDay()] as keyof Daily['repeat']
  return daily.repeat[key]
}

export function taskXPReward(task: AnyTask): number {
  if (task.type === 'reward') return 0
  return Math.round(10 * DIFFICULTY_MULTIPLIER[task.difficulty])
}
