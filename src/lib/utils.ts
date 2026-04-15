import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function daysBetween(a: string, b: string): number {
  const d1 = new Date(a).getTime()
  const d2 = new Date(b).getTime()
  return Math.round(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24))
}

export function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function pct(value: number, max: number): number {
  if (max <= 0) return 0
  return clamp((value / max) * 100, 0, 100)
}
