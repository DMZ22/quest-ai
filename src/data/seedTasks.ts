import type { Habit, Daily, Todo, Reward } from '@/types'
import { uuid } from '@/lib/utils'

const now = new Date().toISOString()

export function seedHabits(): Habit[] {
  return [
    { id: uuid(), type: 'habit', title: 'Drink water', notes: 'Stay hydrated throughout the day', tags: ['health'], difficulty: 'easy', direction: 'positive', counterUp: 0, counterDown: 0, history: [], streak: 0, createdAt: now, updatedAt: now, archived: false },
    { id: uuid(), type: 'habit', title: 'Exercise / Move', notes: 'Any form of movement counts', tags: ['health', 'body'], difficulty: 'medium', direction: 'positive', counterUp: 0, counterDown: 0, history: [], streak: 0, createdAt: now, updatedAt: now, archived: false },
    { id: uuid(), type: 'habit', title: 'Junk food', notes: 'Track when I slip up', tags: ['health'], difficulty: 'medium', direction: 'negative', counterUp: 0, counterDown: 0, history: [], streak: 0, createdAt: now, updatedAt: now, archived: false },
    { id: uuid(), type: 'habit', title: 'Deep work session', notes: '25-minute focused block', tags: ['work'], difficulty: 'hard', direction: 'positive', counterUp: 0, counterDown: 0, history: [], streak: 0, createdAt: now, updatedAt: now, archived: false },
  ]
}

export function seedDailies(): Daily[] {
  const repeat = { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
  return [
    { id: uuid(), type: 'daily', title: 'Morning routine', notes: 'Wake up, wash up, stretch', tags: ['morning'], difficulty: 'easy', completed: false, streak: 0, longestStreak: 0, repeat, checklist: [], history: [], lastCompletedAt: null, dueToday: true, createdAt: now, updatedAt: now, archived: false },
    { id: uuid(), type: 'daily', title: 'Read 10 pages', notes: '', tags: ['learning'], difficulty: 'medium', completed: false, streak: 0, longestStreak: 0, repeat, checklist: [], history: [], lastCompletedAt: null, dueToday: true, createdAt: now, updatedAt: now, archived: false },
    { id: uuid(), type: 'daily', title: 'Plan tomorrow', notes: 'Write 3 MITs for tomorrow', tags: ['evening'], difficulty: 'easy', completed: false, streak: 0, longestStreak: 0, repeat, checklist: [], history: [], lastCompletedAt: null, dueToday: true, createdAt: now, updatedAt: now, archived: false },
  ]
}

export function seedTodos(): Todo[] {
  return [
    { id: uuid(), type: 'todo', title: 'Welcome to Quest AI!', notes: 'Click the + button to complete this and earn XP. You\'re on your way.', tags: [], difficulty: 'trivial', completed: false, dueDate: null, checklist: [{ id: uuid(), text: 'Read this note', completed: false }, { id: uuid(), text: 'Create your own first task', completed: false }, { id: uuid(), text: 'Check the AI Coach', completed: false }], completedAt: null, createdAt: now, updatedAt: now, archived: false },
    { id: uuid(), type: 'todo', title: 'Set up your first real quest', notes: 'Open Quests tab and start a boss fight.', tags: [], difficulty: 'easy', completed: false, dueDate: null, checklist: [], completedAt: null, createdAt: now, updatedAt: now, archived: false },
  ]
}

export function seedRewards(): Reward[] {
  return [
    { id: uuid(), type: 'reward', title: '30 min of gaming', notes: 'Guilt-free break', tags: [], difficulty: 'medium', cost: 50, redeemedCount: 0, createdAt: now, updatedAt: now, archived: false },
    { id: uuid(), type: 'reward', title: 'Episode of your show', notes: '', tags: [], difficulty: 'easy', cost: 30, redeemedCount: 0, createdAt: now, updatedAt: now, archived: false },
    { id: uuid(), type: 'reward', title: 'Nice coffee out', notes: '', tags: [], difficulty: 'medium', cost: 100, redeemedCount: 0, createdAt: now, updatedAt: now, archived: false },
  ]
}
