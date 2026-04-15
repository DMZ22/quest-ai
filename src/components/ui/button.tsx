import * as React from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default:
    'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_4px_12px_rgba(139,92,246,0.25)]',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_4px_12px_rgba(239,68,68,0.25)]',
  outline:
    'border border-white/10 bg-white/[0.02] text-foreground hover:bg-white/[0.06] hover:border-white/20 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost:
    'hover:bg-white/[0.06] text-foreground/80 hover:text-foreground',
  link:
    'text-primary underline-offset-4 hover:underline',
  gradient:
    'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white hover:from-violet-400 hover:to-fuchsia-400 shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_6px_20px_rgba(168,85,247,0.35)]',
  success:
    'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_4px_12px_rgba(16,185,129,0.25)]',
  danger:
    'bg-red-500 text-white hover:bg-red-400 shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_4px_12px_rgba(239,68,68,0.25)]',
} as const

const sizes = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-9 rounded-lg px-3 text-sm',
  lg: 'h-11 rounded-lg px-8 text-base',
  icon: 'h-10 w-10',
  xs: 'h-7 px-2.5 text-[12px] rounded-md',
} as const

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] will-change-transform',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
