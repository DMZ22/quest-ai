import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore, SHOP_ITEMS } from '@/store'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useState } from 'react'
import { Coins, Lock } from 'lucide-react'
import type { ShopItem } from '@/types'

const slots = [
  { id: 'weapon', label: 'Weapons' },
  { id: 'armor', label: 'Armor' },
  { id: 'head', label: 'Head' },
  { id: 'shield', label: 'Shields' },
  { id: 'pet', label: 'Pets' },
  { id: 'mount', label: 'Mounts' },
  { id: 'consumable', label: 'Consumables' },
] as const

export function ShopPage() {
  const character = useStore((s) => s.character)
  const buyItem = useStore((s) => s.buyItem)
  const [tab, setTab] = useState<(typeof slots)[number]['id']>('weapon')
  const items = SHOP_ITEMS.filter((i) => i.slot === tab)

  return (
    <div className="space-y-4">
      <Card className="border-border/40 bg-gradient-to-br from-amber-950/30 to-slate-900/30">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="text-4xl">🏪</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Merchant's Shop</h2>
            <p className="text-sm text-muted-foreground">Spend gold on gear, pets, and potions. Equipped gear boosts your stats.</p>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <Coins className="h-5 w-5" />
            <span className="text-xl font-bold">{character.gold.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="flex w-full flex-wrap justify-start gap-1 p-1">
          {slots.map((s) => (
            <TabsTrigger key={s.id} value={s.id}>{s.label}</TabsTrigger>
          ))}
        </TabsList>
        {slots.map((s) => (
          <TabsContent key={s.id} value={s.id}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <ShopCard key={item.id} item={item} owned={character.ownedItems.includes(item.id)} canAfford={character.gold >= item.price} onBuy={() => buyItem(item.id)} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ShopCard({ item, owned, canAfford, onBuy }: { item: ShopItem; owned: boolean; canAfford: boolean; onBuy: () => void }) {
  const locked = item.class !== undefined
  return (
    <Card className="relative border-border/40 bg-card/60 transition hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="text-4xl">{item.icon}</div>
          <Badge variant={item.rarity}>{item.rarity}</Badge>
        </div>
        <CardTitle className="text-base">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">{item.description}</p>
        {item.bonus && (
          <div className="flex flex-wrap gap-1 text-[10px]">
            {item.bonus.str && <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-red-300">+{item.bonus.str} STR</span>}
            {item.bonus.int && <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-blue-300">+{item.bonus.int} INT</span>}
            {item.bonus.con && <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-300">+{item.bonus.con} CON</span>}
            {item.bonus.per && <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-300">+{item.bonus.per} PER</span>}
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-amber-300">
            <Coins className="h-3.5 w-3.5" />
            <span className="font-bold">{item.price}</span>
          </div>
          <Button
            size="xs"
            variant={owned ? 'ghost' : canAfford ? 'gradient' : 'outline'}
            onClick={onBuy}
            disabled={owned || !canAfford}
          >
            {owned ? 'Owned' : locked ? <Lock className="h-3 w-3" /> : 'Buy'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
