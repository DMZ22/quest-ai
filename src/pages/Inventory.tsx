import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import { findItem } from '@/data/shopItems'
import { CLASS_INFO } from '@/lib/gamification'
import { Swords, Shield as ShieldIcon, HardHat, Shield, Cat, Rabbit, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EquipmentSlot } from '@/types'

const slotConfig: Array<{ slot: EquipmentSlot; label: string; icon: React.ReactNode }> = [
  { slot: 'weapon', label: 'Weapon', icon: <Swords className="h-4 w-4" /> },
  { slot: 'armor',  label: 'Armor',  icon: <ShieldIcon className="h-4 w-4" /> },
  { slot: 'head',   label: 'Head',   icon: <HardHat className="h-4 w-4" /> },
  { slot: 'shield', label: 'Shield', icon: <Shield className="h-4 w-4" /> },
  { slot: 'pet',    label: 'Pet',    icon: <Cat className="h-4 w-4" /> },
  { slot: 'mount',  label: 'Mount',  icon: <Rabbit className="h-4 w-4" /> },
]

export function InventoryPage() {
  const character = useStore((s) => s.character)
  const equipItem = useStore((s) => s.equipItem)
  const useConsumable = useStore((s) => s.useConsumable)
  const selectClass = useStore((s) => s.selectClass)

  const owned = character.ownedItems.map((id) => findItem(id)).filter(Boolean)
  const consumables = owned.filter((i) => i!.slot === 'consumable')

  return (
    <div className="space-y-4">
      {/* Equipped */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Equipped Gear</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {slotConfig.map(({ slot, label, icon }) => {
              const equipped = character.equipment[slot]
              const item = equipped ? findItem(equipped) : null
              return (
                <div key={slot} className="rounded-xl border border-border/40 bg-background/30 p-3 text-center">
                  <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-lg bg-card text-3xl">
                    {item?.icon ?? <span className="text-muted-foreground text-sm flex items-center gap-1">{icon}</span>}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="mt-0.5 truncate text-xs font-medium">{item?.name ?? 'Empty'}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Class Selection */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Class {character.level < 10 && <span className="ml-2 text-xs font-normal text-muted-foreground">(unlocks at Lv 10)</span>}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(['warrior', 'mage', 'healer', 'rogue'] as const).map((cls) => {
              const info = CLASS_INFO[cls]
              const active = character.class === cls
              return (
                <button
                  key={cls}
                  disabled={character.level < 10}
                  onClick={() => selectClass(cls)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition',
                    active ? 'border-violet-500/60 bg-violet-500/10' : 'border-border/40 hover:border-violet-500/40',
                    character.level < 10 && 'opacity-50'
                  )}
                >
                  <div className="mb-1 text-3xl">{info.icon}</div>
                  <div className="font-semibold">{info.name}</div>
                  <div className="text-xs text-muted-foreground">{info.desc}</div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Owned items */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Your Collection</CardTitle>
        </CardHeader>
        <CardContent>
          {owned.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">You haven't bought anything yet. Visit the Shop to buy gear.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {owned.map((item) => {
                const isEquipped = item!.slot !== 'consumable' && character.equipment[item!.slot as keyof typeof character.equipment] === item!.id
                return (
                  <Card key={item!.id} className="border-border/40 bg-card/60">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{item!.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item!.name}</span>
                            <Badge variant={item!.rarity}>{item!.rarity}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{item!.description}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        {item!.slot === 'consumable' ? (
                          <Button size="xs" variant="outline" className="w-full" onClick={() => useConsumable(item!.id)}>
                            <FlaskConical className="h-3 w-3" /> Use
                          </Button>
                        ) : (
                          <Button size="xs" variant={isEquipped ? 'gradient' : 'outline'} className="w-full" onClick={() => equipItem(item!.id)}>
                            {isEquipped ? 'Equipped' : 'Equip'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
