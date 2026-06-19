import { useEffect, useRef } from 'react'

/**
 * Interactive 3D neural-network field rendered on a single canvas.
 *
 * A point cloud lives in real 3D space, slowly auto-rotates around the Y axis,
 * and tilts toward the cursor (parallax). Points are perspective-projected, so
 * nearer nodes are larger and brighter; pairs that sit close together in 3D get
 * a hairline connection whose opacity falls off with both distance and depth —
 * the "synapse" look that fits an AI-systems portfolio.
 *
 * Deliberately dependency-free (no three.js) to keep the bundle tiny and the
 * first paint instant. Pauses when off-screen or the tab is hidden, caps DPR,
 * scales node count to viewport, and fully disables under prefers-reduced-motion.
 */

type Node = {
  x: number
  y: number
  z: number
  // Per-node phase so the field breathes instead of moving in lockstep.
  phase: number
  size: number
}

const ACCENT: [number, number, number] = [124, 131, 255]

type HeroCanvasProps = {
  /** Positioning / opacity classes. Defaults to a full-bleed hero layer. */
  className?: string
  /** Scales node density — lower it for quieter, secondary placements. */
  intensity?: number
}

export default function HeroCanvas({
  className = 'absolute inset-0 w-full h-full pointer-events-none',
  intensity = 1,
}: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1

    // Smoothed pointer-driven rotation targets, in radians.
    const pointer = { x: 0, y: 0 }
    const rot = { x: 0, y: 0 }
    let autoYaw = 0

    let nodes: Node[] = []
    const FIELD = 460 // half-extent of the cube the cloud occupies
    const FOCAL = 620 // perspective focal length
    const LINK_DIST = 168 // max 3D distance for a connection

    function buildNodes() {
      // Fewer nodes on small screens / low-power devices keep this buttery.
      const area = width * height
      const target = Math.round(Math.min(110, Math.max(34, area / 16000)) * intensity)
      nodes = Array.from({ length: target }, () => ({
        x: (Math.random() * 2 - 1) * FIELD,
        y: (Math.random() * 2 - 1) * FIELD * 0.62,
        z: (Math.random() * 2 - 1) * FIELD,
        phase: Math.random() * Math.PI * 2,
        size: 0.6 + Math.random() * 1.4,
      }))
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildNodes()
    }

    // Reusable projected-point buffer to avoid per-frame allocation.
    const proj = { x: 0, y: 0, scale: 0, depth: 0 }
    function project(x: number, y: number, z: number) {
      const d = FOCAL / (FOCAL + z)
      proj.x = width / 2 + x * d
      proj.y = height / 2 + y * d
      proj.scale = d
      proj.depth = z
    }

    let raf = 0
    let running = true
    let t = 0

    function draw() {
      t += 0.016

      // Ease rotation toward the pointer; keep a slow ambient yaw alive.
      autoYaw += 0.0016
      rot.y += (pointer.x * 0.5 + autoYaw - rot.y) * 0.05
      rot.x += (-pointer.y * 0.32 - rot.x) * 0.05

      const cosY = Math.cos(rot.y)
      const sinY = Math.sin(rot.y)
      const cosX = Math.cos(rot.x)
      const sinX = Math.sin(rot.x)

      ctx!.clearRect(0, 0, width, height)

      // Rotate every node once; cache screen-space results for the link pass.
      const screen = nodes.map((n) => {
        const breath = Math.sin(t * 0.6 + n.phase) * 10
        let x = n.x
        let y = n.y + breath
        let z = n.z
        // Y axis
        const nx = x * cosY - z * sinY
        let nz = x * sinY + z * cosY
        x = nx
        z = nz
        // X axis
        const ny = y * cosX - z * sinX
        nz = y * sinX + z * cosX
        y = ny
        z = nz
        project(x, y, z)
        return { sx: proj.x, sy: proj.y, scale: proj.scale, z, size: n.size }
      })

      // Links first, so nodes glow on top of the web.
      for (let i = 0; i < screen.length; i++) {
        const a = screen[i]
        for (let j = i + 1; j < screen.length; j++) {
          const b = screen[j]
          const dx = a.sx - b.sx
          const dy = a.sy - b.sy
          const dist = Math.hypot(dx, dy)
          const maxLink = LINK_DIST * ((a.scale + b.scale) / 2)
          if (dist > maxLink) continue
          const depth = (a.scale + b.scale) / 2
          const fade = (1 - dist / maxLink) * depth
          if (fade < 0.02) continue
          ctx!.strokeStyle = `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${(fade * 0.5).toFixed(3)})`
          ctx!.lineWidth = Math.max(0.4, fade * 1.1)
          ctx!.beginPath()
          ctx!.moveTo(a.sx, a.sy)
          ctx!.lineTo(b.sx, b.sy)
          ctx!.stroke()
        }
      }

      // Nodes, painted back-to-front so closer ones sit above.
      screen
        .slice()
        .sort((p, q) => q.z - p.z)
        .forEach((p) => {
          const r = p.size * p.scale * 1.7
          const alpha = Math.min(1, 0.25 + p.scale * 0.7)
          // Soft accent halo.
          const grad = ctx!.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 4)
          grad.addColorStop(0, `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${(alpha * 0.5).toFixed(3)})`)
          grad.addColorStop(1, 'rgba(124, 131, 255, 0)')
          ctx!.fillStyle = grad
          ctx!.beginPath()
          ctx!.arc(p.sx, p.sy, r * 4, 0, Math.PI * 2)
          ctx!.fill()
          // Bright core.
          ctx!.fillStyle = `rgba(220, 224, 255, ${alpha.toFixed(3)})`
          ctx!.beginPath()
          ctx!.arc(p.sx, p.sy, r, 0, Math.PI * 2)
          ctx!.fill()
        })
    }

    function frame() {
      if (!running) return
      raf = requestAnimationFrame(frame)
      draw()
    }

    function onPointerMove(e: PointerEvent) {
      // Normalise to roughly [-1, 1] around the viewport centre.
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    // Only animate while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) {
          if (!running) {
            running = true
            frame()
          }
        } else {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    function onVisibility() {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else {
        running = true
        frame()
      }
    }

    resize()

    if (reduceMotion) {
      // Paint a single static frame — no loop, no pointer/visibility listeners.
      draw()
      return () => io.disconnect()
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    frame()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [intensity])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
