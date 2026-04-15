import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

interface Props {
  count?: number
  className?: string
}

/** Animated ambient particle field. Sits behind content as a decorative layer. */
export function ParticleField({ count = 40, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }
    resize()

    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#22d3ee']
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 200,
        size: 0.8 + Math.random() * 1.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let raf = 0
    const loop = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life += 1
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        if (p.life > p.maxLife) p.life = 0

        const alpha = 0.3 + 0.3 * Math.sin((p.life / p.maxLife) * Math.PI * 2)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
      })
      raf = requestAnimationFrame(loop)
    }
    loop()

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [count])

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
