import * as React from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md',
  outline: 'border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10 hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  gradient:
    'relative overflow-hidden bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 before:absolute before:inset-0 before:translate-x-[-150%] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent hover:before:translate-x-[150%] before:transition-transform before:duration-700',
  success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-emerald-500/40 shadow-md',
  danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-red-500/40 shadow-md',
} as const

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3 text-sm',
  lg: 'h-11 rounded-md px-8 text-base',
  icon: 'h-10 w-10',
  xs: 'h-7 px-2 text-xs',
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
          'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] [&>*]:relative',
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
