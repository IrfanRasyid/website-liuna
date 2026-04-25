import { useEffect, useRef } from 'react'

export default function SnowCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Palette: pink, cyan, gold
    const COLORS = [
      (o) => `rgba(255, 107, 157, ${o})`,
      (o) => `rgba(79, 195, 247, ${o})`,
      (o) => `rgba(255, 213, 79, ${o})`,
      (o) => `rgba(100, 180, 240, ${o})`,
    ]

    const createParticles = () => {
      particles = []
      const count = Math.floor((window.innerWidth * window.innerHeight) / 16000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.8,
          speed: Math.random() * 0.5 + 0.15,
          drift: Math.random() * 0.4 - 0.2,
          opacity: Math.random() * 0.35 + 0.1,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.018 + 0.004,
          colorFn: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.wobble += p.wobbleSpeed
        p.x += p.drift + Math.sin(p.wobble) * 0.25
        p.y += p.speed

        if (p.y > canvas.height + 5) {
          p.y = -5
          p.x = Math.random() * canvas.width
        }
        if (p.x > canvas.width + 5) p.x = -5
        if (p.x < -5) p.x = canvas.width + 5

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.colorFn(p.opacity)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()

    window.addEventListener('resize', () => { resize(); createParticles() })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  )
}
