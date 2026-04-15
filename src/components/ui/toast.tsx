import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'

const variantClasses: Record<string, string> = {
  default: 'bg-card border-border',
  success: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100',
  destructive: 'bg-red-500/15 border-red-500/40 text-red-100',
  reward: 'bg-amber-500/15 border-amber-500/40 text-amber-100',
  levelup: 'bg-gradient-to-br from-fuchsia-500/20 via-violet-500/20 to-sky-500/20 border-fuchsia-400/50 text-fuchsia-100',
}

export function Toaster() {
  const toasts = useStore((s) => s.toasts)
  const dismiss = useStore((s) => s.dismissToast)
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            className={cn(
              'pointer-events-auto overflow-hidden rounded-xl border px-4 py-3 shadow-xl backdrop-blur-lg',
              variantClasses[t.variant ?? 'default']
            )}
            onClick={() => dismiss(t.id)}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description && <div className="mt-1 text-sm opacity-90">{t.description}</div>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
