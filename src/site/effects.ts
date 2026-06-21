// Port of the design export's vanilla-JS runtime (support.js / DCLogic) into
// framework-agnostic functions driven by a React hook. Each function attaches
// listeners / timers / rAF loops and returns a disposer for cleanup (important
// under React StrictMode, which mounts effects twice in development).

type Disposer = () => void

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Apply `data-hover` style overrides on pointer enter, restore on leave. */
export function wireHover(root: ParentNode): Disposer {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-hover]'))
  const cleanups: Disposer[] = []
  els.forEach((el) => {
    const hover = el.getAttribute('data-hover') || ''
    const enter = () => {
      el.dataset.baseStyle = el.getAttribute('style') || ''
      el.style.cssText = el.dataset.baseStyle + ';' + hover
    }
    const leave = () => {
      el.style.cssText = el.dataset.baseStyle || ''
    }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    cleanups.push(() => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
    })
  })
  return () => cleanups.forEach((c) => c())
}

/** Translucent blur background on the fixed nav once the page is scrolled. */
export function wireNav(nav: HTMLElement): Disposer {
  const onScroll = () => {
    const sc = window.scrollY || document.documentElement.scrollTop
    if (sc > 40) {
      nav.style.background = 'rgba(10,11,13,.72)'
      nav.style.backdropFilter = 'blur(14px)'
      ;(nav.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter =
        'blur(14px)'
      nav.style.borderBottomColor = 'rgba(255,255,255,.08)'
    } else {
      nav.style.background = 'transparent'
      nav.style.backdropFilter = 'none'
      nav.style.borderBottomColor = 'transparent'
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  return () => window.removeEventListener('scroll', onScroll)
}

/** Reveal-on-scroll, count-up, terminal, live pipeline, spotlight, canvas. */
export function runKoneisto(): Disposer {
  const reduce = prefersReduced()
  const disposers: Disposer[] = []
  const timers: number[] = []
  const T = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.push(id)
    return id
  }

  // ---- Reveal + count-up ----------------------------------------------------
  const root = document.getElementById('site-root')
  let reveals: HTMLElement[] = []

  const animateCount = (el: HTMLElement) => {
    const node = el as HTMLElement & { _counted?: boolean }
    if (node._counted) return
    node._counted = true
    const to = parseFloat(el.getAttribute('data-count-to') || '0')
    if (reduce) {
      el.textContent = String(to)
      return
    }
    const dur = 1500
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      el.textContent = String(Math.round(to * e))
      if (p < 1) requestAnimationFrame(step)
      else el.textContent = String(to)
    }
    requestAnimationFrame(step)
  }
  const maybeCount = (el: HTMLElement, delay?: number) => {
    const targets = el.matches('[data-count-to]')
      ? [el]
      : Array.from(el.querySelectorAll<HTMLElement>('[data-count-to]'))
    targets.forEach((t) => T(() => animateCount(t), (delay || 0) + 120))
  }
  const animateReveal = (el: HTMLElement, delay: number) => {
    const begin = () => {
      const dur = 680
      const t0 = performance.now()
      el.style.willChange = 'opacity, transform'
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur)
        const e = 1 - Math.pow(1 - p, 3)
        el.style.opacity = String(e)
        el.style.transform = 'translateY(' + 30 * (1 - e) + 'px)'
        if (p < 1) requestAnimationFrame(tick)
        else {
          el.style.opacity = '1'
          el.style.transform = 'none'
          el.style.willChange = 'auto'
        }
      }
      requestAnimationFrame(tick)
    }
    if (delay) T(begin, delay)
    else begin()
  }
  const checkReveal = () => {
    if (!reveals.length) return
    const wh = window.innerHeight || document.documentElement.clientHeight
    reveals = reveals.filter((el) => {
      const r = el.getBoundingClientRect()
      const inView = r.top < wh * 0.92 && r.bottom > 0
      if (!inView) return true
      const d = parseInt(el.getAttribute('data-delay') || '0', 10)
      animateReveal(el, d)
      maybeCount(el, d)
      return false
    })
  }
  if (root) {
    reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (reduce) {
      reveals.forEach((el) => maybeCount(el))
      reveals = []
    } else {
      reveals.forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(30px)'
        el.style.willChange = 'opacity, transform'
      })
      checkReveal()
      requestAnimationFrame(() => checkReveal())
      const safety = T(() => {
        Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.9) {
            el.style.animation = 'none'
            el.style.transition = 'none'
            el.style.opacity = '1'
            el.style.transform = 'none'
          }
        })
      }, 3500)
      disposers.push(() => clearTimeout(safety))
    }
  }

  // ---- Scrollbar progress + reveal trigger ---------------------------------
  const bar = document.getElementById('scrollbar')
  const onScroll = () => {
    const sc = window.scrollY || document.documentElement.scrollTop
    const h = document.documentElement.scrollHeight - window.innerHeight
    if (bar) bar.style.width = (h > 0 ? (sc / h) * 100 : 0) + '%'
    checkReveal()
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  disposers.push(() => window.removeEventListener('scroll', onScroll))

  // ---- Hero terminal --------------------------------------------------------
  const termOut = document.getElementById('term-output')
  if (termOut) {
    const script = [
      { p: '$', t: 'deploy rascal-ai --prod' },
      { p: '→', t: 'booting multi-tenant runtime' },
      { p: '✓', t: 'n8n workflows · 50 active' },
      { p: '✓', t: 'supabase RLS · enforced' },
      { p: '→', t: 'voice-ai · dialing 128 leads' },
      { p: '✓', t: 'aikasäästö · 8–10h / asiakas / vko' },
      { p: '$', t: 'status: tuotannossa ✓' },
    ]
    const newRow = (p: string) => {
      const row = document.createElement('div')
      row.style.cssText = 'display:flex;gap:10px;'
      const s = document.createElement('span')
      s.style.cssText = 'color:rgba(255,255,255,.32);min-width:14px;'
      s.textContent = p
      const wrap = document.createElement('span')
      const tx = document.createElement('span')
      tx.style.color = 'rgba(255,255,255,.85)'
      tx.className = 'tx'
      const cur = document.createElement('span')
      cur.className = 'cur'
      cur.style.cssText =
        'display:inline-block;width:8px;height:15px;background:#f2f3f4;margin-left:2px;transform:translateY(2px);animation:blink 1s step-end infinite;'
      wrap.appendChild(tx)
      wrap.appendChild(cur)
      row.appendChild(s)
      row.appendChild(wrap)
      termOut.appendChild(row)
      return row
    }
    if (reduce) {
      script.forEach((l) => {
        const r = newRow(l.p)
        const tx = r.querySelector<HTMLElement>('.tx')!
        tx.textContent = l.t
        tx.style.color = 'rgba(255,255,255,.72)'
        r.querySelector('.cur')?.remove()
      })
    } else {
      let li = 0
      let ci = 0
      let row: HTMLElement | null = null
      const tick = () => {
        if (li >= script.length) {
          T(() => {
            termOut.innerHTML = ''
            li = 0
            ci = 0
            row = null
            T(tick, 400)
          }, 2800)
          return
        }
        const line = script[li]
        if (ci === 0) row = newRow(line.p)
        ci++
        row!.querySelector<HTMLElement>('.tx')!.textContent = line.t.slice(0, ci)
        if (ci >= line.t.length) {
          row!.querySelector('.cur')?.remove()
          row!.querySelector<HTMLElement>('.tx')!.style.color = 'rgba(255,255,255,.72)'
          li++
          ci = 0
          T(tick, 540)
        } else {
          T(tick, 22 + Math.random() * 44)
        }
      }
      T(tick, 800)
    }
  }

  // ---- Live pipeline --------------------------------------------------------
  const pipe = document.getElementById('live-pipe')
  if (pipe) {
    const nodes = Array.from(pipe.querySelectorAll<HTMLElement>('[data-node]'))
    const packet = document.getElementById('live-packet')
    const log = document.getElementById('live-log')
    const counterEl = document.getElementById('live-count')
    const setIc = (n: HTMLElement, col: string, bg: string, bord: string) => {
      const ic = n.querySelector<HTMLElement>('.nic')
      if (ic) {
        ic.style.color = col
        ic.style.background = bg
        ic.style.borderColor = bord
      }
    }
    const setDot = (n: HTMLElement, bg: string, sh: string) => {
      const d = n.querySelector<HTMLElement>('.ndot')
      if (d) {
        d.style.background = bg
        d.style.boxShadow = sh
      }
    }
    const idle = (n: HTMLElement) => {
      n.style.borderColor = 'rgba(255,255,255,.1)'
      n.style.background = 'rgba(255,255,255,.015)'
      setDot(n, 'rgba(255,255,255,.2)', 'none')
      setIc(n, 'rgba(255,255,255,.4)', '#0c0d10', 'rgba(255,255,255,.14)')
    }
    const active = (n: HTMLElement) => {
      n.style.borderColor = 'rgba(255,255,255,.5)'
      n.style.background = 'rgba(255,255,255,.05)'
      setDot(n, '#f2f3f4', '0 0 10px rgba(255,255,255,.7)')
      setIc(n, '#0a0b0d', '#f2f3f4', '#f2f3f4')
    }
    const done = (n: HTMLElement) => {
      n.style.borderColor = 'rgba(255,255,255,.22)'
      n.style.background = 'rgba(255,255,255,.025)'
      setDot(n, 'rgba(255,255,255,.55)', 'none')
      setIc(n, 'rgba(255,255,255,.78)', 'transparent', 'rgba(255,255,255,.32)')
    }
    const movePacket = (n: HTMLElement) => {
      if (!packet) return
      const ic = n.querySelector<HTMLElement>('.nic')!
      const pr = pipe.getBoundingClientRect()
      const ir = ic.getBoundingClientRect()
      packet.style.left = ir.left - pr.left + ir.width / 2 + 'px'
      packet.style.top = ir.top - pr.top + ir.height / 2 + 'px'
    }
    const pad = (x: number) => String(x).padStart(2, '0')
    const stamp = () => {
      const d = new Date()
      return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
    }
    let lead = 1043
    let processed = 127
    const lines = (id: number): [string, string][] => [
      ['webhook ', 'liidi #' + id + ' vastaanotettu'],
      ['enrich  ', 'kuka · mitä · missä — scrapattu'],
      ['claude  ', 'pisteytys 0.92 → KUUMA'],
      ['reititys', 'kanava: AI-soitto · 0:42 · tapaaminen'],
      ['supabase', 'tila: tapaaminen_sovittu · RLS ok'],
      ['done    ', '✓ läpimeno 17s'],
    ]
    const addLog = (sym: string, txt: string) => {
      if (!log) return
      const row = document.createElement('div')
      row.style.cssText =
        'display:flex;gap:10px;opacity:0;transition:opacity .3s;white-space:nowrap;'
      row.innerHTML =
        '<span style="color:rgba(255,255,255,.3)">' +
        stamp() +
        '</span><span style="color:rgba(255,255,255,.45);display:inline-block;min-width:64px">' +
        sym.trim() +
        '</span><span style="color:rgba(255,255,255,.72)">' +
        txt +
        '</span>'
      log.appendChild(row)
      requestAnimationFrame(() => {
        row.style.opacity = '1'
      })
      while (log.children.length > 6) log.removeChild(log.firstChild!)
    }
    const run = () => {
      nodes.forEach(idle)
      if (packet) packet.style.opacity = '0'
      const L = lines(lead)
      const step = (i: number) => {
        if (i >= nodes.length) {
          processed++
          if (counterEl) counterEl.textContent = String(processed)
          lead++
          T(run, 1500)
          return
        }
        if (i > 0) done(nodes[i - 1])
        active(nodes[i])
        if (packet) {
          packet.style.opacity = '1'
          movePacket(nodes[i])
        }
        addLog(L[i][0], L[i][1])
        T(() => step(i + 1), 920)
      }
      step(0)
    }
    if (reduce) {
      nodes.forEach(done)
      lines(lead).forEach((l) => addLog(l[0], l[1]))
      if (counterEl) counterEl.textContent = String(processed)
    } else {
      T(run, 700)
    }
  }

  // ---- Hero spotlight (follows cursor) -------------------------------------
  const sp = document.getElementById('spotlight')
  const header = document.getElementById('top')
  if (!reduce && sp && header) {
    const onMove = (ev: MouseEvent) => {
      const r = header.getBoundingClientRect()
      if (ev.clientY < r.top || ev.clientY > r.bottom) return
      const x = ev.clientX - r.left
      const y = ev.clientY - r.top
      sp.style.background =
        'radial-gradient(440px circle at ' +
        x +
        'px ' +
        y +
        'px, rgba(255,255,255,.07), transparent 60%)'
    }
    document.addEventListener('mousemove', onMove, { passive: true })
    disposers.push(() => document.removeEventListener('mousemove', onMove))
  }

  // ---- Hero flow-field particle canvas -------------------------------------
  const cv = document.getElementById('hero-canvas') as HTMLCanvasElement | null
  if (!reduce && cv && header) {
    const ctx = cv.getContext('2d')!
    let W = 0
    let H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
    type P = {
      x: number; y: number; px: number; py: number; sp: number
      life: number; max: number; a: number; w: number; bright: boolean
    }
    let particles: P[] = []
    let t = 0
    let raf = 0
    const mouse = { x: -9999, y: -9999, on: false }
    const mk = (): P => {
      const bright = Math.random() < 0.08
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        px: 0,
        py: 0,
        sp: 0.4 + Math.random() * 0.95,
        life: 0,
        max: 90 + Math.random() * 160,
        a: bright ? 0.32 + Math.random() * 0.3 : 0.025 + Math.random() * 0.065,
        w: bright ? 1.4 : 1,
        bright,
      }
    }
    const resize = () => {
      const r = header.getBoundingClientRect()
      W = r.width
      H = r.height
      cv.width = Math.floor(W * dpr)
      cv.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#0a0b0d'
      ctx.fillRect(0, 0, W, H)
      particles = []
      const n = Math.min(820, Math.floor((W * H) / 1700))
      for (let i = 0; i < n; i++) particles.push(mk())
    }
    const flow = (x: number, y: number) =>
      (Math.sin(x * 0.0016 + t * 0.6) +
        Math.cos(y * 0.0019 - t * 0.5) +
        Math.sin((x + y) * 0.001 + t * 0.3)) *
      Math.PI
    const frame = () => {
      t += 0.0025
      ctx.fillStyle = 'rgba(10,11,13,0.06)'
      ctx.fillRect(0, 0, W, H)
      for (const p of particles) {
        p.px = p.x
        p.py = p.y
        const ang = flow(p.x, p.y)
        p.x += Math.cos(ang) * p.sp
        p.y += Math.sin(ang) * p.sp
        if (mouse.on) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < 22500) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / 150) * 2.4
            p.x += (dx / d) * f
            p.y += (dy / d) * f
          }
        }
        p.life++
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,255,255,' + p.a + ')'
        ctx.lineWidth = p.w
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
        if (p.bright) {
          ctx.beginPath()
          ctx.fillStyle = 'rgba(255,255,255,' + p.a * 0.6 + ')'
          ctx.arc(p.x, p.y, 1.3, 0, 6.2832)
          ctx.fill()
        }
        if (p.x < -12 || p.x > W + 12 || p.y < -12 || p.y > H + 12 || p.life > p.max)
          Object.assign(p, mk())
      }
      raf = requestAnimationFrame(frame)
    }
    const onHeroMove = (e: MouseEvent) => {
      const r = header.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.on = true
    }
    const onHeroLeave = () => {
      mouse.on = false
    }
    header.addEventListener('mousemove', onHeroMove, { passive: true })
    header.addEventListener('mouseleave', onHeroLeave)
    window.addEventListener('resize', resize)
    disposers.push(() => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      header.removeEventListener('mousemove', onHeroMove)
      header.removeEventListener('mouseleave', onHeroLeave)
    })
    resize()
    frame()
  }

  return () => {
    timers.forEach((id) => clearTimeout(id))
    disposers.forEach((d) => d())
  }
}
