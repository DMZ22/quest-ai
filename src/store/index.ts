import { create } from 'zustand'
import type {
  Character, Habit, Daily, Todo, Reward, Quest, Achievement, MoodEntry, AIMessage, Settings,
  CharacterClass, Difficulty, AnyTask, HabitDirection, ChecklistItem,
} from '@/types'
import { loadState, saveState } from '@/lib/storage'
import { seedHabits, seedDailies, seedTodos, seedRewards } from '@/data/seedTasks'
import { makeInitialAchievements } from '@/data/achievements'
import { findItem, SHOP_ITEMS } from '@/data/shopItems'
import {
  applyHabit, applyDailyComplete, applyDailyMiss, applyTodoComplete,
  maxHpForLevel, maxManaForLevel, isDueToday,
} from '@/lib/gamification'
import { uuid, todayISO } from '@/lib/utils'
import { sfx } from '@/lib/sound'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'destructive' | 'reward' | 'levelup'
}

interface State {
  character: Character
  habits: Habit[]
  dailies: Daily[]
  todos: Todo[]
  rewards: Reward[]
  quests: Quest[]
  achievements: Achievement[]
  mood: MoodEntry[]
  ai: AIMessage[]
  settings: Settings
  toasts: Toast[]
  initialized: boolean
  lastDailyReset: string

  // Actions
  init: () => void
  persist: () => void
  resetAll: () => void

  // Character
  updateCharacter: (patch: Partial<Character>) => void
  selectClass: (c: CharacterClass) => void
  setAvatar: (emoji: string) => void
  setName: (name: string) => void

  // Tasks
  addHabit: (title: string, difficulty: Difficulty, direction: HabitDirection, notes?: string, tags?: string[]) => void
  addDaily: (title: string, difficulty: Difficulty, notes?: string, tags?: string[]) => void
  addTodo: (title: string, difficulty: Difficulty, notes?: string, tags?: string[], dueDate?: string | null) => void
  addReward: (title: string, cost: number, notes?: string) => void
  updateTask: (id: string, type: 'habit' | 'daily' | 'todo' | 'reward', patch: Partial<AnyTask>) => void
  deleteTask: (id: string, type: 'habit' | 'daily' | 'todo' | 'reward') => void
  scoreHabit: (id: string, direction: 'up' | 'down') => void
  toggleDaily: (id: string) => void
  toggleTodo: (id: string) => void
  redeemReward: (id: string) => void

  // Checklist
  addChecklistItem: (taskId: string, type: 'daily' | 'todo', text: string) => void
  toggleChecklistItem: (taskId: string, type: 'daily' | 'todo', itemId: string) => void
  removeChecklistItem: (taskId: string, type: 'daily' | 'todo', itemId: string) => void

  // Shop
  buyItem: (itemId: string) => boolean
  equipItem: (itemId: string) => void
  useConsumable: (itemId: string) => void

  // Quests
  addQuest: (q: Omit<Quest, 'id' | 'progress' | 'active' | 'completed' | 'startedAt' | 'completedAt' | 'bossMaxHp'>) => void
  startQuest: (id: string) => void
  abandonQuest: (id: string) => void

  // Mood
  logMood: (mood: 1 | 2 | 3 | 4 | 5, note: string, energy: number, focus: number) => void

  // AI
  addAIMessage: (role: 'user' | 'coach', content: string) => void
  clearAI: () => void

  // Settings
  updateSettings: (patch: Partial<Settings>) => void

  // Toasts
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void

  // Dailies maintenance
  performDailyResetIfNeeded: () => void

  // Internal helpers
  progressQuest: (amount: number) => void
  checkAchievements: () => void
}

const makeInitialCharacter = (): Character => {
  const stats = { str: 5, int: 5, con: 5, per: 5 }
  const level = 1
  return {
    name: 'Hero',
    avatar: '🧙',
    class: 'none',
    level,
    xp: 0,
    hp: maxHpForLevel(level, stats.con, 'none'),
    maxHp: maxHpForLevel(level, stats.con, 'none'),
    mana: maxManaForLevel(level, stats.int, 'none'),
    maxMana: maxManaForLevel(level, stats.int, 'none'),
    gold: 50,
    gems: 0,
    stats,
    buffs: { str: 0, int: 0, con: 0, per: 0 },
    equipment: { weapon: null, armor: null, head: null, shield: null, pet: null, mount: null },
    ownedItems: [],
    pets: [],
    mounts: [],
    achievements: [],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    streakDays: 0,
    totalTasksCompleted: 0,
    deathCount: 0,
  }
}

const makeInitialSettings = (): Settings => ({
  theme: 'dark',
  apiKey: '',
  aiProvider: 'gemini',
  notifications: true,
  sound: true,
  compactMode: false,
  dayStartHour: 4,
})

export const useStore = create<State>()((set, get) => ({
  character: makeInitialCharacter(),
  habits: [],
  dailies: [],
  todos: [],
  rewards: [],
  quests: [],
  achievements: makeInitialAchievements(),
  mood: [],
  ai: [],
  settings: makeInitialSettings(),
  toasts: [],
  initialized: false,
  lastDailyReset: todayISO(),

  init: () => {
    const saved = loadState()
    if (saved) {
      set({
        character: (saved.character as Character) ?? makeInitialCharacter(),
        habits: ((saved.tasks as any)?.habits as Habit[]) ?? seedHabits(),
        dailies: ((saved.tasks as any)?.dailies as Daily[]) ?? seedDailies(),
        todos: ((saved.tasks as any)?.todos as Todo[]) ?? seedTodos(),
        rewards: ((saved.tasks as any)?.rewards as Reward[]) ?? seedRewards(),
        quests: (saved.quests as Quest[]) ?? [],
        achievements: (saved.achievements as Achievement[]) ?? makeInitialAchievements(),
        mood: (saved.mood as MoodEntry[]) ?? [],
        ai: (saved.ai as AIMessage[]) ?? [],
        settings: { ...makeInitialSettings(), ...(saved.settings as Settings) },
        lastDailyReset: saved.lastDailyReset ?? todayISO(),
        initialized: true,
      })
    } else {
      set({
        habits: seedHabits(),
        dailies: seedDailies(),
        todos: seedTodos(),
        rewards: seedRewards(),
        initialized: true,
      })
    }
    get().performDailyResetIfNeeded()
    get().persist()
  },

  persist: () => {
    const s = get()
    saveState({
      character: s.character,
      tasks: { habits: s.habits, dailies: s.dailies, todos: s.todos, rewards: s.rewards },
      quests: s.quests,
      achievements: s.achievements,
      mood: s.mood,
      ai: s.ai,
      settings: s.settings,
      lastDailyReset: s.lastDailyReset,
    })
  },

  resetAll: () => {
    set({
      character: makeInitialCharacter(),
      habits: seedHabits(),
      dailies: seedDailies(),
      todos: seedTodos(),
      rewards: seedRewards(),
      quests: [],
      achievements: makeInitialAchievements(),
      mood: [],
      ai: [],
      toasts: [],
      lastDailyReset: todayISO(),
    })
    get().persist()
  },

  updateCharacter: (patch) => {
    set((s) => ({ character: { ...s.character, ...patch, lastActive: new Date().toISOString() } }))
    get().persist()
  },

  selectClass: (c) => {
    const char = get().character
    if (char.level < 10 && c !== 'none') {
      get().pushToast({ title: 'Locked', description: 'Classes unlock at level 10.', variant: 'destructive' })
      return
    }
    const updated = { ...char, class: c, maxHp: maxHpForLevel(char.level, char.stats.con, c), maxMana: maxManaForLevel(char.level, char.stats.int, c) }
    updated.hp = Math.min(updated.hp, updated.maxHp)
    updated.mana = Math.min(updated.mana, updated.maxMana)
    set({ character: updated })
    get().pushToast({ title: `You are now a ${c.toUpperCase()}!`, variant: 'levelup' })
    get().persist()
  },

  setAvatar: (emoji) => get().updateCharacter({ avatar: emoji }),
  setName: (name) => get().updateCharacter({ name }),

  addHabit: (title, difficulty, direction, notes = '', tags = []) => {
    const now = new Date().toISOString()
    const h: Habit = { id: uuid(), type: 'habit', title, notes, tags, difficulty, direction, counterUp: 0, counterDown: 0, history: [], streak: 0, createdAt: now, updatedAt: now, archived: false }
    set((s) => ({ habits: [h, ...s.habits] }))
    get().persist()
  },

  addDaily: (title, difficulty, notes = '', tags = []) => {
    const now = new Date().toISOString()
    const d: Daily = { id: uuid(), type: 'daily', title, notes, tags, difficulty, completed: false, streak: 0, longestStreak: 0, repeat: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }, checklist: [], history: [], lastCompletedAt: null, dueToday: true, createdAt: now, updatedAt: now, archived: false }
    set((s) => ({ dailies: [d, ...s.dailies] }))
    get().persist()
  },

  addTodo: (title, difficulty, notes = '', tags = [], dueDate = null) => {
    const now = new Date().toISOString()
    const t: Todo = { id: uuid(), type: 'todo', title, notes, tags, difficulty, completed: false, dueDate, checklist: [], completedAt: null, createdAt: now, updatedAt: now, archived: false }
    set((s) => ({ todos: [t, ...s.todos] }))
    get().persist()
  },

  addReward: (title, cost, notes = '') => {
    const now = new Date().toISOString()
    const r: Reward = { id: uuid(), type: 'reward', title, notes, tags: [], difficulty: 'easy', cost, redeemedCount: 0, createdAt: now, updatedAt: now, archived: false }
    set((s) => ({ rewards: [r, ...s.rewards] }))
    get().persist()
  },

  updateTask: (id, type, patch) => {
    set((s) => {
      const update = (arr: any[]) => arr.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t))
      if (type === 'habit') return { habits: update(s.habits) }
      if (type === 'daily') return { dailies: update(s.dailies) }
      if (type === 'todo') return { todos: update(s.todos) }
      return { rewards: update(s.rewards) }
    })
    get().persist()
  },

  deleteTask: (id, type) => {
    set((s) => {
      if (type === 'habit') return { habits: s.habits.filter((t) => t.id !== id) }
      if (type === 'daily') return { dailies: s.dailies.filter((t) => t.id !== id) }
      if (type === 'todo') return { todos: s.todos.filter((t) => t.id !== id) }
      return { rewards: s.rewards.filter((t) => t.id !== id) }
    })
    get().persist()
  },

  scoreHabit: (id, direction) => {
    const { character, habits, settings } = get()
    const habit = habits.find((h) => h.id === id)
    if (!habit) return
    const { character: newChar, result } = applyHabit(character, habit, direction)
    const updatedHabit: Habit = {
      ...habit,
      counterUp: direction === 'up' ? habit.counterUp + 1 : habit.counterUp,
      counterDown: direction === 'down' ? habit.counterDown + 1 : habit.counterDown,
      history: [...habit.history.slice(-29), { date: todayISO(), direction, value: 1 }],
      streak: direction === 'up' ? habit.streak + 1 : Math.max(0, habit.streak - 1),
    }
    set((s) => ({
      character: newChar,
      habits: s.habits.map((h) => (h.id === id ? updatedHabit : h)),
    }))
    if (settings.sound) (direction === 'up' ? sfx.habitPlus : sfx.habitMinus)()
    get().pushToast({ title: habit.title, description: result.message, variant: direction === 'up' ? 'success' : 'destructive' })
    if (result.levelUp) {
      if (settings.sound) sfx.levelUp()
      get().pushToast({ title: `LEVEL UP! Level ${result.newLevel}`, variant: 'levelup' })
    }
    get().progressQuest(result.xp + Math.abs(result.hpDelta))
    get().checkAchievements()
    get().persist()
  },

  toggleDaily: (id) => {
    const { character, dailies, settings } = get()
    const daily = dailies.find((d) => d.id === id)
    if (!daily) return
    if (!daily.completed) {
      const { character: newChar, result } = applyDailyComplete(character, daily)
      const updated: Daily = {
        ...daily,
        completed: true,
        streak: daily.streak + 1,
        longestStreak: Math.max(daily.longestStreak, daily.streak + 1),
        lastCompletedAt: new Date().toISOString(),
        history: [...daily.history.slice(-29), { date: todayISO(), completed: true }],
      }
      set((s) => ({ character: newChar, dailies: s.dailies.map((d) => (d.id === id ? updated : d)) }))
      if (settings.sound) sfx.taskComplete()
      get().pushToast({ title: daily.title, description: result.message, variant: 'success' })
      if (result.levelUp) {
        if (settings.sound) sfx.levelUp()
        get().pushToast({ title: `LEVEL UP! Level ${result.newLevel}`, variant: 'levelup' })
      }
      get().progressQuest(result.xp)
    } else {
      set((s) => ({ dailies: s.dailies.map((d) => (d.id === id ? { ...d, completed: false } : d)) }))
      if (get().settings.sound) sfx.pop()
    }
    get().checkAchievements()
    get().persist()
  },

  toggleTodo: (id) => {
    const { character, todos, settings } = get()
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    if (!todo.completed) {
      const overdueDays = todo.dueDate ? Math.max(0, Math.floor((Date.now() - new Date(todo.dueDate).getTime()) / 86400000)) : 0
      const { character: newChar, result } = applyTodoComplete(character, todo, overdueDays)
      set((s) => ({
        character: newChar,
        todos: s.todos.map((t) => (t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t)),
      }))
      if (settings.sound) sfx.taskComplete()
      get().pushToast({ title: todo.title, description: result.message, variant: 'success' })
      if (result.levelUp) {
        if (settings.sound) sfx.levelUp()
        get().pushToast({ title: `LEVEL UP! Level ${result.newLevel}`, variant: 'levelup' })
      }
      get().progressQuest(result.xp)
    } else {
      set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, completed: false, completedAt: null } : t)) }))
      if (get().settings.sound) sfx.pop()
    }
    get().checkAchievements()
    get().persist()
  },

  redeemReward: (id) => {
    const { character, rewards, settings } = get()
    const reward = rewards.find((r) => r.id === id)
    if (!reward) return
    if (character.gold < reward.cost) {
      if (settings.sound) sfx.error()
      get().pushToast({ title: 'Not enough gold', variant: 'destructive' })
      return
    }
    set((s) => ({
      character: { ...s.character, gold: s.character.gold - reward.cost },
      rewards: s.rewards.map((r) => (r.id === id ? { ...r, redeemedCount: r.redeemedCount + 1 } : r)),
    }))
    if (settings.sound) sfx.reward()
    get().pushToast({ title: `Enjoy: ${reward.title}`, description: `-${reward.cost} gold`, variant: 'reward' })
    get().persist()
  },

  addChecklistItem: (taskId, type, text) => {
    const item: ChecklistItem = { id: uuid(), text, completed: false }
    set((s) => {
      if (type === 'daily') {
        return { dailies: s.dailies.map((d) => (d.id === taskId ? { ...d, checklist: [...d.checklist, item] } : d)) }
      }
      return { todos: s.todos.map((t) => (t.id === taskId ? { ...t, checklist: [...t.checklist, item] } : t)) }
    })
    get().persist()
  },

  toggleChecklistItem: (taskId, type, itemId) => {
    set((s) => {
      if (type === 'daily') {
        return { dailies: s.dailies.map((d) => (d.id === taskId ? { ...d, checklist: d.checklist.map((c) => c.id === itemId ? { ...c, completed: !c.completed } : c) } : d)) }
      }
      return { todos: s.todos.map((t) => (t.id === taskId ? { ...t, checklist: t.checklist.map((c) => c.id === itemId ? { ...c, completed: !c.completed } : c) } : t)) }
    })
    get().persist()
  },

  removeChecklistItem: (taskId, type, itemId) => {
    set((s) => {
      if (type === 'daily') {
        return { dailies: s.dailies.map((d) => (d.id === taskId ? { ...d, checklist: d.checklist.filter((c) => c.id !== itemId) } : d)) }
      }
      return { todos: s.todos.map((t) => (t.id === taskId ? { ...t, checklist: t.checklist.filter((c) => c.id !== itemId) } : t)) }
    })
    get().persist()
  },

  buyItem: (itemId) => {
    const item = findItem(itemId)
    if (!item) return false
    const { character, settings } = get()
    if (character.gold < item.price) {
      if (settings.sound) sfx.error()
      get().pushToast({ title: 'Not enough gold', variant: 'destructive' })
      return false
    }
    if (item.class && character.class !== 'none' && item.class !== character.class) {
      if (settings.sound) sfx.error()
      get().pushToast({ title: 'Class-restricted', description: `Only ${item.class}s can buy this.`, variant: 'destructive' })
      return false
    }
    const owned = [...character.ownedItems]
    if (item.slot !== 'consumable' && owned.includes(itemId)) {
      if (settings.sound) sfx.error()
      get().pushToast({ title: 'Already owned', variant: 'destructive' })
      return false
    }
    if (item.slot !== 'consumable') owned.push(itemId)
    set((s) => ({
      character: {
        ...s.character,
        gold: s.character.gold - item.price,
        ownedItems: owned,
        pets: item.slot === 'pet' && !s.character.pets.includes(itemId) ? [...s.character.pets, itemId] : s.character.pets,
        mounts: item.slot === 'mount' && !s.character.mounts.includes(itemId) ? [...s.character.mounts, itemId] : s.character.mounts,
      },
    }))
    if (settings.sound) sfx.buy()
    get().pushToast({ title: `Bought ${item.name}`, description: `-${item.price} gold`, variant: 'reward' })
    get().persist()
    return true
  },

  equipItem: (itemId) => {
    const item = findItem(itemId)
    if (!item || item.slot === 'consumable') return
    const { character } = get()
    const isEquipped = character.equipment[item.slot] === itemId
    // Recompute buffs from all equipped items
    const equipment = { ...character.equipment, [item.slot]: isEquipped ? null : itemId }
    const buffs = { str: 0, int: 0, con: 0, per: 0 }
    ;(['weapon', 'armor', 'head', 'shield', 'pet', 'mount'] as const).forEach((slot) => {
      const id = equipment[slot]
      if (!id) return
      const i = findItem(id)
      if (!i?.bonus) return
      buffs.str += i.bonus.str ?? 0
      buffs.int += i.bonus.int ?? 0
      buffs.con += i.bonus.con ?? 0
      buffs.per += i.bonus.per ?? 0
    })
    const newMaxHp = maxHpForLevel(character.level, character.stats.con + buffs.con, character.class)
    const newMaxMana = maxManaForLevel(character.level, character.stats.int + buffs.int, character.class)
    set({
      character: {
        ...character,
        equipment,
        buffs,
        maxHp: newMaxHp,
        maxMana: newMaxMana,
        hp: Math.min(character.hp, newMaxHp),
        mana: Math.min(character.mana, newMaxMana),
      },
    })
    if (get().settings.sound) sfx.equip()
    get().persist()
  },

  useConsumable: (itemId) => {
    const item = findItem(itemId)
    if (!item || item.slot !== 'consumable') return
    const { character, settings } = get()
    set({
      character: {
        ...character,
        hp: Math.min(character.maxHp, character.hp + (item.restoreHp ?? 0)),
        mana: Math.min(character.maxMana, character.mana + (item.restoreMana ?? 0)),
      },
    })
    if (settings.sound) sfx.potion()
    get().pushToast({ title: `Used ${item.name}`, variant: 'success' })
    get().persist()
  },

  addQuest: (q) => {
    const quest: Quest = {
      ...q,
      id: uuid(),
      bossMaxHp: q.bossHp,
      progress: 0,
      active: false,
      completed: false,
      startedAt: null,
      completedAt: null,
    }
    set((s) => ({ quests: [quest, ...s.quests] }))
    get().persist()
  },

  startQuest: (id) => {
    set((s) => ({
      quests: s.quests.map((q) => (q.id === id ? { ...q, active: true, startedAt: new Date().toISOString() } : { ...q, active: false })),
    }))
    if (get().settings.sound) sfx.questStart()
    get().persist()
  },

  abandonQuest: (id) => {
    set((s) => ({ quests: s.quests.map((q) => (q.id === id ? { ...q, active: false } : q)) }))
    get().persist()
  },

  logMood: (mood, note, energy, focus) => {
    const entry: MoodEntry = { date: todayISO(), mood, note, energy, focus }
    set((s) => ({ mood: [entry, ...s.mood.filter((m) => m.date !== entry.date)] }))
    get().persist()
  },

  addAIMessage: (role, content) => {
    set((s) => ({ ai: [...s.ai, { id: uuid(), role, content, timestamp: new Date().toISOString() }] }))
    get().persist()
  },

  clearAI: () => {
    set({ ai: [] })
    get().persist()
  },

  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }))
    get().persist()
  },

  pushToast: (t) => {
    const id = uuid()
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
    }, 3500)
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  performDailyResetIfNeeded: () => {
    const state = get()
    const today = todayISO()
    if (state.lastDailyReset === today) return

    // Apply misses for dailies that were due but not completed
    let char = state.character
    const resetDailies = state.dailies.map((d) => {
      if (isDueToday(d, new Date(state.lastDailyReset)) && !d.completed) {
        const { character: newChar } = applyDailyMiss(char, d)
        char = newChar
        return { ...d, streak: 0, completed: false, history: [...d.history.slice(-29), { date: state.lastDailyReset, completed: false }], dueToday: isDueToday(d) }
      }
      return { ...d, completed: false, dueToday: isDueToday(d) }
    })

    // Update streak
    const yesterdayActive = state.dailies.some((d) => d.lastCompletedAt && new Date(d.lastCompletedAt).toISOString().split('T')[0] === state.lastDailyReset)
    const newStreak = yesterdayActive ? char.streakDays + 1 : 0

    set({
      character: { ...char, streakDays: newStreak },
      dailies: resetDailies,
      lastDailyReset: today,
    })
    get().persist()
  },

  progressQuest: (amount) => {
    const soundOn = get().settings.sound
    set((s) => ({
      quests: s.quests.map((q) => {
        if (!q.active || q.completed) return q
        const newProgress = Math.min(q.bossMaxHp, q.progress + amount)
        const completed = newProgress >= q.bossMaxHp
        // Boss hit sound (only if there was damage and quest not yet done)
        if (amount > 0 && !completed && soundOn) sfx.bossHit()
        if (completed) {
          if (soundOn) sfx.bossDefeat()
          // Award boss rewards
          setTimeout(() => {
            const c = get().character
            const bonusXp = q.rewards.xp
            const bonusGold = q.rewards.gold
            set({ character: { ...c, xp: c.xp + bonusXp, gold: c.gold + bonusGold } })
            get().pushToast({ title: `⚔️ Defeated ${q.boss}!`, description: `+${bonusXp} XP, +${bonusGold} gold`, variant: 'levelup' })
          }, 0)
        }
        return { ...q, progress: newProgress, completed, completedAt: completed ? new Date().toISOString() : q.completedAt, active: completed ? false : q.active }
      }),
    }))
  },

  checkAchievements: () => {
    const { character, achievements, dailies } = get()
    const maxStreak = Math.max(0, ...dailies.map((d) => d.longestStreak))
    const updated = achievements.map((a) => {
      if (a.unlockedAt) return a
      let progress = a.progress
      if (a.category === 'tasks') progress = character.totalTasksCompleted
      if (a.category === 'streaks') progress = Math.max(character.streakDays, maxStreak)
      if (a.category === 'combat' && a.id.startsWith('level_')) progress = character.level
      if (a.category === 'collection' && a.id === 'pet_first') progress = character.pets.length
      if (a.category === 'combat' && a.id === 'boss_first') progress = get().quests.filter((q) => q.completed).length
      if (a.category === 'combat' && a.id === 'boss_five') progress = get().quests.filter((q) => q.completed).length
      if (a.id === 'gold_1k') progress = character.gold
      const unlocked = progress >= a.target
      if (unlocked && !a.unlockedAt) {
        if (get().settings.sound) sfx.achievement()
        get().pushToast({ title: `🏆 ${a.name}`, description: a.description, variant: 'reward' })
        return { ...a, progress, unlockedAt: new Date().toISOString() }
      }
      return { ...a, progress }
    })
    set({ achievements: updated })
  },
}))

export { SHOP_ITEMS }
