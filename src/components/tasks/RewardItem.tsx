import { Trash2, Pencil, Gift, Coins } from 'lucide-react'
import type { Reward } from '@/types'
import { useStore } from '@/store'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function RewardItem({ reward, onEdit }: { reward: Reward; onEdit: (r: Reward) => void }) {
  const redeemReward = useStore((s) => s.redeemReward)
  const deleteTask = useStore((s) => s.deleteTask)
  const gold = useStore((s) => s.character.gold)
  const canAfford = gold >= reward.cost

  return (
    <motion.div
      layout
      className="group flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 p-3 backdrop-blur transition hover:border-amber-500/40"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
        <Gift className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium">{reward.title}</div>
        {reward.notes && <div className="line-clamp-1 text-xs text-muted-foreground">{reward.notes}</div>}
        {reward.redeemedCount > 0 && (
          <div className="mt-0.5 text-xs text-muted-foreground">Redeemed {reward.redeemedCount} time{reward.redeemedCount !== 1 ? 's' : ''}</div>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
        <button onClick={() => onEdit(reward)} className="rounded p-1.5 hover:bg-accent" aria-label="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => deleteTask(reward.id, 'reward')} className="rounded p-1.5 text-red-400 hover:bg-red-500/10" aria-label="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <Button
        size="sm"
        variant={canAfford ? 'gradient' : 'ghost'}
        onClick={() => redeemReward(reward.id)}
        disabled={!canAfford}
        className="flex-shrink-0"
      >
        <Coins className="h-3.5 w-3.5" />
        {reward.cost}
      </Button>
    </motion.div>
  )
}
