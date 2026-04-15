// Core types for Quest AI

export type Difficulty = 'trivial' | 'easy' | 'medium' | 'hard'
export type CharacterClass = 'warrior' | 'mage' | 'healer' | 'rogue' | 'none'
export type TaskType = 'habit' | 'daily' | 'todo' | 'reward'
export type HabitDirection = 'positive' | 'negative' | 'both'

export interface Stats {
  str: number
  int: number
  con: number
  per: number
}

export interface Equipment {
  weapon: string | null
  armor: string | null
  head: string | null
  shield: string | null
  pet: string | null
  mount: string | null
}

export type EquipmentSlot = keyof Equipment

export interface Character {
  name: string
  avatar: string
  class: CharacterClass
  level: number
  xp: number
  hp: number
  maxHp: number
  mana: number
  maxMana: number
  gold: number
  gems: number
  stats: Stats
  buffs: Stats
  equipment: Equipment
  ownedItems: string[]
  pets: string[]
  mounts: string[]
  achievements: string[]
  createdAt: string
  lastActive: string
  streakDays: number
  totalTasksCompleted: number
  deathCount: number
}

export interface BaseTask {
  id: string
  type: TaskType
  title: string
  notes: string
  tags: string[]
  difficulty: Difficulty
  createdAt: string
  updatedAt: string
  archived: boolean
}

export interface Habit extends BaseTask {
  type: 'habit'
  direction: HabitDirection
  counterUp: number
  counterDown: number
  history: Array<{ date: string; direction: 'up' | 'down'; value: number }>
  streak: number
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Daily extends BaseTask {
  type: 'daily'
  completed: boolean
  streak: number
  longestStreak: number
  repeat: { mon: boolean; tue: boolean; wed: boolean; thu: boolean; fri: boolean; sat: boolean; sun: boolean }
  checklist: ChecklistItem[]
  history: Array<{ date: string; completed: boolean }>
  lastCompletedAt: string | null
  dueToday: boolean
}

export interface Todo extends BaseTask {
  type: 'todo'
  completed: boolean
  dueDate: string | null
  checklist: ChecklistItem[]
  completedAt: string | null
}

export interface Reward extends BaseTask {
  type: 'reward'
  cost: number
  redeemedCount: number
}

export type AnyTask = Habit | Daily | Todo | Reward

export interface ShopItem {
  id: string
  name: string
  description: string
  slot: 'weapon' | 'armor' | 'head' | 'shield' | 'pet' | 'mount' | 'consumable'
  price: number
  currency: 'gold' | 'gems'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  icon: string
  bonus?: Partial<Stats>
  restoreHp?: number
  restoreMana?: number
  class?: CharacterClass
  levelReq?: number
}

export interface Quest {
  id: string
  name: string
  description: string
  boss: string
  bossHp: number
  bossMaxHp: number
  bossIcon: string
  rewards: {
    xp: number
    gold: number
    items: string[]
  }
  progress: number
  active: boolean
  completed: boolean
  startedAt: string | null
  completedAt: string | null
  difficulty: Difficulty
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string | null
  progress: number
  target: number
  category: 'tasks' | 'streaks' | 'social' | 'combat' | 'collection'
}

export interface AIMessage {
  id: string
  role: 'user' | 'coach'
  content: string
  timestamp: string
}

export interface MoodEntry {
  date: string
  mood: 1 | 2 | 3 | 4 | 5
  note: string
  energy: number
  focus: number
}

export interface Settings {
  theme: 'dark' | 'light'
  apiKey: string
  aiProvider: 'gemini' | 'openai' | 'anthropic' | 'local'
  notifications: boolean
  sound: boolean
  compactMode: boolean
  dayStartHour: number
}
