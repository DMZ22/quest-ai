import * as React from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border border-input text-foreground',
  trivial: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  easy: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  hard: 'bg-red-500/20 text-red-300 border border-red-500/30',
  common: 'bg-slate-500/20 text-slate-200 border border-slate-500/40',
  uncommon: 'bg-green-500/20 text-green-300 border border-green-500/40',
  rare: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  epic: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
  legendary: 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 border border-amber-500/50',
} as const

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
