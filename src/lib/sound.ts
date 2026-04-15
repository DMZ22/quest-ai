// Web Audio API based sound effects. No external assets needed.
let ctx: AudioContext | null = null
let enabled = true

function getCtx() {
  if (!ctx) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AudioCtx()
    } catch {
      ctx = null
    }
  }
  return ctx
}

export function setSoundEnabled(on: boolean) {
  enabled = on
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1, startOffset = 0) {
  if (!enabled) return
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.frequency.value = freq
  o.type = type
  o.connect(g)
  g.connect(c.destination)
  const t = c.currentTime + startOffset
  g.gain.setValueAtTime(volume, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + duration)
  o.start(t)
  o.stop(t + duration)
}

export const sfx = {
  taskComplete: () => {
    playTone(523.25, 0.12, 'triangle', 0.12, 0)
    playTone(659.25, 0.14, 'triangle', 0.12, 0.06)
    playTone(783.99, 0.22, 'triangle', 0.13, 0.12)
  },
  habitPlus: () => {
    playTone(440, 0.08, 'sine', 0.12, 0)
    playTone(660, 0.12, 'sine', 0.12, 0.05)
  },
  habitMinus: () => {
    playTone(220, 0.12, 'sawtooth', 0.08, 0)
    playTone(165, 0.18, 'sawtooth', 0.08, 0.08)
  },
  levelUp: () => {
    ;[523, 659, 783, 1046].forEach((f, i) => playTone(f, 0.25, 'triangle', 0.15, i * 0.12))
  },
  buy: () => {
    playTone(880, 0.08, 'sine', 0.12, 0)
    playTone(1100, 0.12, 'sine', 0.1, 0.06)
  },
  damage: () => {
    playTone(150, 0.25, 'sawtooth', 0.12, 0)
  },
  reward: () => {
    ;[659, 784, 880, 1046, 1318].forEach((f, i) => playTone(f, 0.18, 'triangle', 0.12, i * 0.08))
  },
  click: () => {
    playTone(600, 0.04, 'square', 0.05, 0)
  },
}
