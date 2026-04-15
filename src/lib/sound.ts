// Web Audio API based sound effects. No external assets needed.
// Each sound has randomized variation so it feels alive, never the same twice.

let ctx: AudioContext | null = null
let enabled = true
let masterVolume = 0.35
let tapCounter = 0 // cycles through tap variants

function getCtx() {
  if (!ctx) {
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AudioCtx()
    } catch {
      ctx = null
    }
  }
  // Auto-resume if suspended (browsers block autoplay until user interaction)
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

export function setSoundEnabled(on: boolean) {
  enabled = on
}
export function setMasterVolume(v: number) {
  masterVolume = Math.max(0, Math.min(1, v))
}

// Unlock audio context on first user interaction (required by browsers)
if (typeof window !== 'undefined') {
  const unlock = () => {
    getCtx()
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock)
  window.addEventListener('keydown', unlock)
}

interface ToneOpts {
  freq: number
  duration: number
  type?: OscillatorType
  volume?: number
  attack?: number
  decay?: number
  delay?: number
  detune?: number
  bend?: number // frequency bend towards the end
}

function tone({ freq, duration, type = 'sine', volume = 0.15, attack = 0.005, decay = 0.25, delay = 0, detune = 0, bend = 0 }: ToneOpts) {
  if (!enabled) return
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  o.detune.value = detune
  o.connect(g)
  g.connect(c.destination)
  const t = c.currentTime + delay
  const vol = volume * masterVolume
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  if (bend) {
    o.frequency.setValueAtTime(freq, t)
    o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + bend), t + duration)
  }
  o.start(t)
  o.stop(t + duration + decay)
}

function noise(duration: number, volume = 0.08, delay = 0, filter = 4000) {
  if (!enabled) return
  const c = getCtx()
  if (!c) return
  const bufferSize = Math.floor(c.sampleRate * duration)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  const source = c.createBufferSource()
  source.buffer = buffer
  const filterNode = c.createBiquadFilter()
  filterNode.type = 'lowpass'
  filterNode.frequency.value = filter
  const g = c.createGain()
  g.gain.value = volume * masterVolume
  source.connect(filterNode)
  filterNode.connect(g)
  g.connect(c.destination)
  source.start(c.currentTime + delay)
  source.stop(c.currentTime + delay + duration)
}

// Helper: pick a random value from an array
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
// Random in range
const rand = (min: number, max: number) => min + Math.random() * (max - min)

// ---------- SOUND BANK ----------
// Every tap on the UI calls `sfx.tap()` which rotates through 6 distinct variants.
const TAP_VARIANTS = [
  () => tone({ freq: rand(680, 780), duration: 0.06, type: 'triangle', volume: 0.08, decay: 0.1, bend: -60 }),
  () => tone({ freq: rand(820, 920), duration: 0.04, type: 'sine', volume: 0.07, decay: 0.08 }),
  () => tone({ freq: rand(560, 640), duration: 0.05, type: 'square', volume: 0.05, decay: 0.1 }),
  () => { tone({ freq: 900, duration: 0.03, type: 'sine', volume: 0.06 }); tone({ freq: 1200, duration: 0.04, type: 'sine', volume: 0.06, delay: 0.02 }) },
  () => tone({ freq: rand(740, 860), duration: 0.05, type: 'triangle', volume: 0.08, decay: 0.12, detune: rand(-30, 30) }),
  () => { noise(0.025, 0.04, 0, 6000); tone({ freq: 1000, duration: 0.04, type: 'sine', volume: 0.05, delay: 0.01 }) },
]

const POP_VARIANTS = [
  () => tone({ freq: rand(440, 520), duration: 0.08, type: 'sine', volume: 0.1, bend: 200 }),
  () => tone({ freq: rand(500, 600), duration: 0.07, type: 'triangle', volume: 0.1, bend: 260 }),
  () => tone({ freq: 480, duration: 0.1, type: 'sine', volume: 0.1, bend: 300 }),
]

export const sfx = {
  // Generic tap — called on every click/tap in the UI. Rotates variants.
  tap: () => {
    const v = TAP_VARIANTS[tapCounter % TAP_VARIANTS.length]
    tapCounter++
    v()
  },

  // Quick hover tick (currently unused but available)
  hover: () => tone({ freq: rand(1200, 1400), duration: 0.02, type: 'sine', volume: 0.03 }),

  // Pop — toggle, checkbox
  pop: () => pick(POP_VARIANTS)(),

  // Task completion — ascending triad
  taskComplete: () => {
    const base = rand(500, 560)
    tone({ freq: base, duration: 0.12, type: 'triangle', volume: 0.12, decay: 0.1 })
    tone({ freq: base * 1.26, duration: 0.14, type: 'triangle', volume: 0.12, delay: 0.06 })
    tone({ freq: base * 1.5, duration: 0.22, type: 'triangle', volume: 0.13, delay: 0.12 })
  },

  // Habit positive — chirp
  habitPlus: () => {
    const base = rand(420, 500)
    tone({ freq: base, duration: 0.08, type: 'sine', volume: 0.1, bend: 200 })
    tone({ freq: base * 1.5, duration: 0.1, type: 'sine', volume: 0.1, delay: 0.04, bend: 150 })
  },

  // Habit negative — descending bop
  habitMinus: () => {
    tone({ freq: 240, duration: 0.1, type: 'sawtooth', volume: 0.08, bend: -80 })
    tone({ freq: 180, duration: 0.16, type: 'sawtooth', volume: 0.08, delay: 0.06, bend: -60 })
  },

  // Level up — grand arpeggio
  levelUp: () => {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]
    notes.forEach((f, i) => tone({ freq: f, duration: 0.28, type: 'triangle', volume: 0.16, delay: i * 0.1 }))
    tone({ freq: 1760, duration: 0.6, type: 'sine', volume: 0.1, delay: 0.55 })
  },

  // Buy — coin drop
  buy: () => {
    tone({ freq: 1320, duration: 0.05, type: 'sine', volume: 0.09 })
    tone({ freq: 1760, duration: 0.08, type: 'sine', volume: 0.09, delay: 0.04 })
    tone({ freq: 2100, duration: 0.1, type: 'sine', volume: 0.08, delay: 0.08, bend: -400 })
  },

  // Coin — single coin pickup
  coin: () => {
    tone({ freq: 988, duration: 0.06, type: 'square', volume: 0.08 })
    tone({ freq: 1319, duration: 0.1, type: 'square', volume: 0.08, delay: 0.04 })
  },

  // Reward — fanfare
  reward: () => {
    const notes = [659, 784, 880, 1046, 1318, 1568]
    notes.forEach((f, i) => tone({ freq: f, duration: 0.2, type: 'triangle', volume: 0.12, delay: i * 0.07 }))
  },

  // Damage — low thud
  damage: () => {
    noise(0.15, 0.12, 0, 800)
    tone({ freq: 120, duration: 0.18, type: 'sawtooth', volume: 0.1, bend: -40 })
  },

  // Chime — navigation, soft
  chime: () => {
    const base = pick([523, 587, 659, 698, 784])
    tone({ freq: base, duration: 0.2, type: 'sine', volume: 0.08, decay: 0.3 })
    tone({ freq: base * 2, duration: 0.3, type: 'sine', volume: 0.06, delay: 0.03, decay: 0.4 })
  },

  // Swoosh — dialog open (filtered noise)
  swoosh: () => {
    noise(0.2, 0.06, 0, 2000)
    tone({ freq: 400, duration: 0.15, type: 'sine', volume: 0.04, bend: 400 })
  },

  // Whoosh close — dialog close
  whoosh: () => {
    noise(0.15, 0.06, 0, 1500)
    tone({ freq: 800, duration: 0.12, type: 'sine', volume: 0.04, bend: -400 })
  },

  // Ding — command palette, toast
  ding: () => {
    tone({ freq: 1760, duration: 0.15, type: 'sine', volume: 0.08, decay: 0.4 })
    tone({ freq: 2637, duration: 0.2, type: 'sine', volume: 0.05, delay: 0.03, decay: 0.5 })
  },

  // Equip — metallic clink
  equip: () => {
    tone({ freq: 1760, duration: 0.05, type: 'square', volume: 0.08 })
    tone({ freq: 2349, duration: 0.08, type: 'square', volume: 0.07, delay: 0.03 })
    noise(0.06, 0.05, 0.04, 8000)
  },

  // Potion / consumable — bubbling
  potion: () => {
    for (let i = 0; i < 4; i++) {
      tone({ freq: rand(600, 900), duration: 0.05, type: 'sine', volume: 0.06, delay: i * 0.05 })
    }
    tone({ freq: 1200, duration: 0.15, type: 'sine', volume: 0.07, delay: 0.18, bend: 300 })
  },

  // Error — low buzz
  error: () => {
    tone({ freq: 180, duration: 0.2, type: 'sawtooth', volume: 0.1 })
    tone({ freq: 160, duration: 0.15, type: 'sawtooth', volume: 0.08, delay: 0.1 })
  },

  // Quest start — epic low drum + rising tone
  questStart: () => {
    tone({ freq: 80, duration: 0.3, type: 'sawtooth', volume: 0.14 })
    tone({ freq: 200, duration: 0.4, type: 'triangle', volume: 0.1, delay: 0.1, bend: 400 })
    tone({ freq: 600, duration: 0.3, type: 'triangle', volume: 0.1, delay: 0.3 })
  },

  // Boss hit — meaty punch
  bossHit: () => {
    noise(0.08, 0.14, 0, 1000)
    tone({ freq: 140, duration: 0.12, type: 'sawtooth', volume: 0.12, bend: -40 })
  },

  // Boss defeated — massive fanfare
  bossDefeat: () => {
    const notes = [261, 329, 392, 523, 659, 784, 1046]
    notes.forEach((f, i) => tone({ freq: f, duration: 0.35, type: 'triangle', volume: 0.16, delay: i * 0.09 }))
    tone({ freq: 2100, duration: 0.8, type: 'sine', volume: 0.12, delay: 0.8 })
  },

  // Achievement unlocked — 3-note chime
  achievement: () => {
    tone({ freq: 784, duration: 0.2, type: 'triangle', volume: 0.13 })
    tone({ freq: 1046, duration: 0.25, type: 'triangle', volume: 0.13, delay: 0.12 })
    tone({ freq: 1568, duration: 0.35, type: 'triangle', volume: 0.14, delay: 0.24 })
    tone({ freq: 2637, duration: 0.5, type: 'sine', volume: 0.1, delay: 0.3 })
  },

  // Typing — for inputs (subtle tick)
  type: () => tone({ freq: rand(900, 1100), duration: 0.015, type: 'square', volume: 0.03 }),
}
