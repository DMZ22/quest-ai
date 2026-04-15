import { useEffect, useRef } from 'react'

/** Full-screen one-shot confetti burst. Mount with a key change to re-fire. */
export function ConfettiBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#ffffff']
    const pieces = Array.from({ length: 160 }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 3,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
    }))

    let raf = 0
    const start = performance.now()
    const draw = (now: number) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.forEach((p) => {
        p.vy += 0.32 // gravity
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        p.life = elapsed
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - elapsed / 2200)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4)
        ctx.restore()
      })
      if (elapsed < 2400) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [active])

  if (!active) return null
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[300]" />
}
