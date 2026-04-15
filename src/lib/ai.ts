// AI module — supports Gemini (free tier), OpenAI, Anthropic.
// If no API key is set, falls back to smart local heuristics.
import type { Character, AnyTask, Settings } from '@/types'

export interface AIContext {
  character: Character
  tasks: AnyTask[]
  completedToday: number
  missedToday: number
}

const SYSTEM_PROMPT = `You are the AI Coach inside Quest AI — a gamified productivity app that blends RPG mechanics with habit tracking.
Your job is to be a motivating, realistic, and encouraging coach. You are playful but always practical.
When users ask for help, you:
- Keep responses short (max 3-4 sentences) and actionable.
- Never lecture or moralize.
- Reference their character stats, level, streaks, and current tasks when relevant.
- Suggest concrete next steps (e.g., "Try completing just 1 hard task before lunch").
- Celebrate wins enthusiastically but briefly.
- When users ask for habit suggestions, give 3 specific ideas with difficulty tags.`

export async function askCoach(
  settings: Settings,
  context: AIContext,
  userMessage: string
): Promise<string> {
  if (!settings.apiKey || settings.aiProvider === 'local') {
    return localCoachReply(context, userMessage)
  }
  try {
    switch (settings.aiProvider) {
      case 'gemini':
        return await callGemini(settings.apiKey, buildPrompt(context, userMessage))
      case 'openai':
        return await callOpenAI(settings.apiKey, buildPrompt(context, userMessage))
      case 'anthropic':
        return await callAnthropic(settings.apiKey, buildPrompt(context, userMessage))
      default:
        return localCoachReply(context, userMessage)
    }
  } catch (e) {
    console.error('AI error:', e)
    return `(Coach offline) ${localCoachReply(context, userMessage)}`
  }
}

function buildPrompt(ctx: AIContext, message: string): string {
  const activeTasks = ctx.tasks.filter((t) => !t.archived).slice(0, 10)
  const summary = activeTasks.map((t) => `- [${t.type}] ${t.title} (${t.difficulty})`).join('\n')
  return `${SYSTEM_PROMPT}

--- PLAYER STATE ---
Name: ${ctx.character.name}
Level: ${ctx.character.level} ${ctx.character.class}
HP: ${ctx.character.hp}/${ctx.character.maxHp}
XP: ${ctx.character.xp}
Gold: ${ctx.character.gold}
Streak: ${ctx.character.streakDays} days
Completed today: ${ctx.completedToday}
Missed today: ${ctx.missedToday}

--- ACTIVE TASKS ---
${summary}

--- USER MESSAGE ---
${message}`
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
      }),
    }
  )
  if (!res.ok) throw new Error(`Gemini error ${res.status}`)
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'I could not generate a response.'
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 300,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

async function callAnthropic(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic error ${res.status}`)
  const data = await res.json()
  return data?.content?.[0]?.text ?? ''
}

// --- Local fallback coach (no API needed) ---
function localCoachReply(ctx: AIContext, msg: string): string {
  const m = msg.toLowerCase().trim()
  const { character: c, completedToday, missedToday, tasks } = ctx

  if (/^(hi|hello|hey|sup|yo)\b/.test(m)) {
    return `Hey ${c.name}! You're level ${c.level} with a ${c.streakDays}-day streak. What are we crushing today?`
  }
  if (m.includes('tired') || m.includes('lazy') || m.includes('motivat')) {
    return `I hear you. Try a Trivial habit right now — one 2-minute win changes the whole afternoon. What's the smallest task you can do this minute?`
  }
  if (m.includes('stuck') || m.includes('overwhelm')) {
    return `Too many open fronts drain HP. Pick your ONE hardest task and break it into 3 subtasks. I'll wait.`
  }
  if (m.includes('habit') && (m.includes('suggest') || m.includes('idea') || m.includes('what'))) {
    return `Try these:
• 📖 Read 10 pages — Easy
• 🧘 5-min meditation — Trivial
• 💧 Drink water on wake — Trivial`
  }
  if (m.includes('quest') || m.includes('boss')) {
    return `A Quest turns your week into a boss fight. Name a real goal (ex: "finish chapter 3"), and each task you complete damages the boss. Want me to create one?`
  }
  if (m.includes('streak')) {
    if (c.streakDays === 0) return `No streak yet — that's fine. Start one today with ONE trivial daily. Momentum beats intensity.`
    return `${c.streakDays} days strong. Protect it with 1 guaranteed daily before bed. What's your easiest daily right now?`
  }
  if (m.includes('level up') || m.includes('class')) {
    return `Level 10 unlocks classes. Warrior = extra hard-task rewards. Mage = extra XP. Healer = HP tanking. Rogue = extra gold. Which fits your playstyle?`
  }
  if (m.includes('why') && m.includes('miss')) {
    return `Missing dailies costs HP like a fight you can't dodge. Two fixes: reduce to one daily, or lower difficulty. Which do you want?`
  }
  // Contextual default
  if (completedToday === 0 && tasks.length > 0) {
    return `You haven't completed anything yet today. Pick the fastest task on your list and check it off in the next 60 seconds. Ready?`
  }
  if (completedToday >= 3) {
    return `${completedToday} tasks already? You're on fire. 🔥 Take a 2-min stretch, then one more. What's next?`
  }
  return `I'm here. Tell me what you're struggling with, or ask for habit ideas, quest suggestions, or streak advice.`
}

export function localQuestIdeas(): Array<{ name: string; description: string; boss: string; bossIcon: string; bossHp: number }> {
  return [
    { name: 'Slay the Procrastination Dragon', description: 'Defeat the beast that steals your time. Complete 15 tasks over 7 days.', boss: 'Procrastinus Rex', bossIcon: '🐉', bossHp: 150 },
    { name: 'The Fortress of Focus', description: 'Infiltrate the tower of distractions. Complete 10 dailies in a row.', boss: 'Lord Distract', bossIcon: '🏰', bossHp: 100 },
    { name: 'Sleep Dragon', description: 'This beast wakes you at 3am. Defeat it with 7 consecutive early-sleep dailies.', boss: 'Insomnius', bossIcon: '🌙', bossHp: 70 },
    { name: 'The Book Wyrm', description: 'Read 5 chapters to break its spine spell.', boss: 'Tome the Devourer', bossIcon: '📚', bossHp: 50 },
    { name: 'The Iron Titan', description: '20 workouts. No excuses. No mercy.', boss: 'Titan of Steel', bossIcon: '⚔️', bossHp: 200 },
  ]
}

export function localBreakdown(goal: string): string[] {
  const g = goal.trim()
  return [
    `Research & scope: what does "${g}" actually look like done?`,
    `Draft a 15-minute starter version of ${g}`,
    `Set a daily 25-minute session toward ${g}`,
    `Review progress each Friday and adjust`,
    `Celebrate the first real milestone of ${g}`,
  ]
}
