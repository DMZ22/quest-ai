import type { ShopItem } from '@/types'

export const SHOP_ITEMS: ShopItem[] = [
  // Weapons
  { id: 'w_stick',    name: 'Wooden Stick',   description: 'A humble beginning.', slot: 'weapon', price: 20,  currency: 'gold', rarity: 'common',    icon: '🪵', bonus: { str: 1 } },
  { id: 'w_sword',    name: 'Iron Sword',     description: '+3 STR', slot: 'weapon', price: 80,  currency: 'gold', rarity: 'uncommon',  icon: '🗡️', bonus: { str: 3 } },
  { id: 'w_hammer',   name: 'Battle Hammer',  description: '+6 STR, warrior bonus', slot: 'weapon', price: 200, currency: 'gold', rarity: 'rare',      icon: '🔨', bonus: { str: 6 }, class: 'warrior' },
  { id: 'w_staff',    name: 'Arcane Staff',   description: '+5 INT', slot: 'weapon', price: 180, currency: 'gold', rarity: 'rare',      icon: '🪄', bonus: { int: 5 }, class: 'mage' },
  { id: 'w_bow',      name: 'Hunter\'s Bow',  description: '+4 PER, extra drops', slot: 'weapon', price: 160, currency: 'gold', rarity: 'rare',      icon: '🏹', bonus: { per: 4 }, class: 'rogue' },
  { id: 'w_mace',     name: 'Healer\'s Mace', description: '+4 CON', slot: 'weapon', price: 150, currency: 'gold', rarity: 'rare',      icon: '⚒️', bonus: { con: 4 }, class: 'healer' },
  { id: 'w_dragon',   name: 'Dragonslayer',   description: '+12 STR, +3 PER', slot: 'weapon', price: 1200,currency: 'gold', rarity: 'legendary', icon: '🐲', bonus: { str: 12, per: 3 } },

  // Armor
  { id: 'a_cloth',    name: 'Cloth Tunic',    description: '+1 CON', slot: 'armor', price: 30,  currency: 'gold', rarity: 'common',    icon: '👕', bonus: { con: 1 } },
  { id: 'a_leather',  name: 'Leather Armor',  description: '+3 CON', slot: 'armor', price: 90,  currency: 'gold', rarity: 'uncommon',  icon: '🦺', bonus: { con: 3 } },
  { id: 'a_chain',    name: 'Chainmail',      description: '+5 CON', slot: 'armor', price: 180, currency: 'gold', rarity: 'rare',      icon: '🛡️', bonus: { con: 5 } },
  { id: 'a_plate',    name: 'Full Plate',     description: '+9 CON', slot: 'armor', price: 500, currency: 'gold', rarity: 'epic',      icon: '⚔️', bonus: { con: 9 } },

  // Head
  { id: 'h_cap',      name: 'Leather Cap',    description: '+1 PER', slot: 'head', price: 25,  currency: 'gold', rarity: 'common',    icon: '🧢', bonus: { per: 1 } },
  { id: 'h_helm',     name: 'Iron Helm',      description: '+2 STR', slot: 'head', price: 80,  currency: 'gold', rarity: 'uncommon',  icon: '⛑️', bonus: { str: 2 } },
  { id: 'h_crown',    name: 'Crown of Wisdom',description: '+6 INT', slot: 'head', price: 350, currency: 'gold', rarity: 'epic',      icon: '👑', bonus: { int: 6 } },

  // Shields
  { id: 's_buckler',  name: 'Wood Buckler',   description: '+1 CON', slot: 'shield', price: 30,  currency: 'gold', rarity: 'common',    icon: '🛡️', bonus: { con: 1 } },
  { id: 's_kite',     name: 'Kite Shield',    description: '+4 CON', slot: 'shield', price: 150, currency: 'gold', rarity: 'rare',      icon: '🛡️', bonus: { con: 4 } },

  // Pets
  { id: 'p_cat',      name: 'Mystic Cat',     description: 'A loyal companion.', slot: 'pet', price: 100, currency: 'gold', rarity: 'uncommon',  icon: '🐱', bonus: { per: 2 } },
  { id: 'p_wolf',     name: 'Shadow Wolf',    description: 'Fierce ally.', slot: 'pet', price: 300, currency: 'gold', rarity: 'rare',      icon: '🐺', bonus: { str: 2, per: 2 } },
  { id: 'p_dragon',   name: 'Baby Dragon',    description: 'The ultimate pet.', slot: 'pet', price: 2000,currency: 'gold', rarity: 'legendary', icon: '🐉', bonus: { str: 4, int: 4 } },
  { id: 'p_fox',      name: 'Spirit Fox',     description: 'Cunning guide.', slot: 'pet', price: 250, currency: 'gold', rarity: 'rare',      icon: '🦊', bonus: { int: 2, per: 2 } },
  { id: 'p_owl',      name: 'Wise Owl',       description: '+INT sidekick.', slot: 'pet', price: 200, currency: 'gold', rarity: 'uncommon',  icon: '🦉', bonus: { int: 3 } },

  // Mounts
  { id: 'm_horse',    name: 'Swift Horse',    description: '+3 PER', slot: 'mount', price: 400, currency: 'gold', rarity: 'rare',      icon: '🐴', bonus: { per: 3 } },
  { id: 'm_tiger',    name: 'War Tiger',      description: '+5 STR', slot: 'mount', price: 700, currency: 'gold', rarity: 'epic',      icon: '🐯', bonus: { str: 5 } },
  { id: 'm_phoenix',  name: 'Phoenix',        description: '+6 INT, full heal on level up', slot: 'mount', price: 1500,currency: 'gold', rarity: 'legendary', icon: '🔥', bonus: { int: 6 } },

  // Consumables
  { id: 'c_potion_hp',name: 'Health Potion',  description: 'Restores 25 HP.', slot: 'consumable', price: 40,  currency: 'gold', rarity: 'common',    icon: '❤️', restoreHp: 25 },
  { id: 'c_potion_mp',name: 'Mana Potion',    description: 'Restores 15 Mana.', slot: 'consumable', price: 30,  currency: 'gold', rarity: 'common',    icon: '💙', restoreMana: 15 },
  { id: 'c_elixir',   name: 'Full Elixir',    description: 'Full HP + Mana.', slot: 'consumable', price: 120, currency: 'gold', rarity: 'uncommon',  icon: '🧪', restoreHp: 9999, restoreMana: 9999 },
]

export function findItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id)
}
