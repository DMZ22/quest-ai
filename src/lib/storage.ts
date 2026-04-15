// localStorage-based persistence. All data stays local & private.
const STORAGE_KEY = 'quest-ai:v1'
const DAILY_LOG_KEY = 'quest-ai:dailylog:v1'

export interface StorageShape {
  character: unknown
  tasks: unknown
  quests: unknown
  achievements: unknown
  mood: unknown
  ai: unknown
  settings: unknown
  lastDailyReset: string
}

export function loadState(): Partial<StorageShape> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveState(data: Partial<StorageShape>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save state', e)
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(DAILY_LOG_KEY)
}

export function exportState(): string {
  const data = loadState() ?? {}
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)
}

export function importState(json: string): boolean {
  try {
    const parsed = JSON.parse(json)
    if (!parsed || !parsed.data) return false
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data))
    return true
  } catch {
    return false
  }
}

export function downloadBackup() {
  const blob = new Blob([exportState()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `quest-ai-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
