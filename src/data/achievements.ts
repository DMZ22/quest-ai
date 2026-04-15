import type { Achievement } from '@/types'

export const ACHIEVEMENT_TEMPLATES: Omit<Achievement, 'progress' | 'unlockedAt'>[] = [
  { id: 'first_task',     name: 'First Steps',      description: 'Complete your first task.',          icon: '👟', target: 1,   category: 'tasks' },
  { id: 'ten_tasks',      name: 'Getting the Hang',  description: 'Complete 10 tasks.',                  icon: '✨', target: 10,  category: 'tasks' },
  { id: 'fifty_tasks',    name: 'Productivity Pro',  description: 'Complete 50 tasks.',                  icon: '⭐', target: 50,  category: 'tasks' },
  { id: 'hundred_tasks',  name: 'Task Master',       description: 'Complete 100 tasks.',                 icon: '💫', target: 100, category: 'tasks' },
  { id: 'thousand_tasks', name: 'Quest Legend',      description: 'Complete 1000 tasks.',                icon: '🌟', target: 1000,category: 'tasks' },
  { id: 'streak_3',       name: 'Warming Up',        description: 'Reach a 3-day streak.',               icon: '🔥', target: 3,   category: 'streaks' },
  { id: 'streak_7',       name: 'One Week Strong',   description: 'Reach a 7-day streak.',               icon: '🔥', target: 7,   category: 'streaks' },
  { id: 'streak_30',      name: 'Month of Momentum', description: 'Reach a 30-day streak.',              icon: '🏆', target: 30,  category: 'streaks' },
  { id: 'streak_100',     name: 'Centurion',         description: 'Reach a 100-day streak.',             icon: '👑', target: 100, category: 'streaks' },
  { id: 'level_5',        name: 'Adventurer',        description: 'Reach level 5.',                      icon: '🎖️', target: 5,   category: 'combat' },
  { id: 'level_10',       name: 'Class Awaits',      description: 'Reach level 10 and unlock classes.',  icon: '⚔️', target: 10,  category: 'combat' },
  { id: 'level_25',       name: 'Veteran',           description: 'Reach level 25.',                     icon: '🎗️', target: 25,  category: 'combat' },
  { id: 'level_50',       name: 'Hero',              description: 'Reach level 50.',                     icon: '🏅', target: 50,  category: 'combat' },
  { id: 'pet_first',      name: 'Animal Friend',     description: 'Adopt your first pet.',               icon: '🐾', target: 1,   category: 'collection' },
  { id: 'boss_first',     name: 'Boss Slayer',       description: 'Defeat your first quest boss.',       icon: '⚔️', target: 1,   category: 'combat' },
  { id: 'boss_five',      name: 'Legendary Slayer',  description: 'Defeat 5 quest bosses.',              icon: '🔱', target: 5,   category: 'combat' },
  { id: 'gold_1k',        name: 'Coin Collector',    description: 'Earn 1000 gold total.',               icon: '💰', target: 1000,category: 'collection' },
  { id: 'no_death',       name: 'Untouchable',       description: 'Reach level 10 without dying.',       icon: '🛡️', target: 1,   category: 'combat' },
]

export function makeInitialAchievements(): Achievement[] {
  return ACHIEVEMENT_TEMPLATES.map((t) => ({ ...t, progress: 0, unlockedAt: null }))
}
