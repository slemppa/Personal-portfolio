import { useEffect, useRef } from 'react'

/**
 * Flowing aurora field rendered on a single WebGL canvas.
 *
 * A full-screen fragment shader domain-warps fractal noise into slow, liquid
 * ribbons of light in the brand's periwinkle-indigo palette — the animated
 * "mesh gradient" look (Stripe / Linear / Vercel) rather than the dated
 * particle-network motif. The field drifts on its own and leans toward the
 * cursor for a touch of parallax. Colour is emitted with alpha that tracks the
 * ribbon intensity, so it layers cleanly over the page background.
 *
 * Deliberately dependency-free (raw WebGL, no three.js) to keep the bundle tiny
 * and first paint instant. Pauses when off-screen or the tab is hidden, caps
 * DPR, and fully disables under prefers-reduced-motion (a single static frame).
 * If WebGL is unavailable the canvas stays transparent and the CSS aurora
 * behind it carries the look.
 */

type HeroCanvasProps = {
  /** Positioning / opacity classes. Defaults to a full-bleed hero layer. */
  className?: string
  /** Scales the ribbon brightness — lower it for quieter, secondary placements. */
  intensity?: number
}

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_ptr;
uniform float u_intensity;

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

const mat2 M = mat2(1.62, 1.18, -1.18, 1.62);

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = M * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Aspect-correct, centred coordinates.
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  p += u_ptr * 0.05;

  float t = u_time * 0.04;

  // Domain warp the noise twice -> liquid, flowing aurora ribbons.
  vec2 q = vec2(
    fbm(p * 1.4 + vec2(0.0, t)),
    fbm(p * 1.4 + vec2(3.2, -t) + 5.0)
  );
  vec2 r = vec2(
    fbm(p * 1.4 + 1.7 * q + vec2(1.7, 9.2) + 0.10 * t),
    fbm(p * 1.4 + 1.7 * q + vec2(8.3, 2.8) - 0.08 * t)
  );
  float f = fbm(p * 1.4 + 1.9 * r);

  // Shape the noise into mid-tone bands plus brighter highlight cores.
  float ribbon = smoothstep(0.35, 0.85, f);
  float glow = smoothstep(0.55, 1.0, f + 0.3 * length(r));

  // Brand palette: deep violet -> accent indigo -> lilac highlight.
  vec3 violet = vec3(0.33, 0.27, 0.78);
  vec3 indigo = vec3(0.486, 0.514, 1.0);
  vec3 lilac = vec3(0.62, 0.65, 1.0);

  vec3 col = mix(violet, indigo, ribbon);
  col = mix(col, lilac, glow);

  // Concentrate the light toward the upper-centre and fade to nothing at the
  // edges, so the layer melts seamlessly into the page background.
  float falloff = smoothstep(1.15, 0.15, length(p - vec2(0.0, -0.25)));

  float a = (ribbon * 0.55 + glow * 0.65) * falloff * u_intensity;
  a = clamp(a, 0.0, 0.92);

  // Ordered-ish dither to kill banding on the dark gradient.
  a += (hash(gl_FragCoord.xy + t) - 0.5) * 0.02;

  gl_FragColor = vec4(col, a);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
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

    const gl =
      (canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false }) as
        | WebGLRenderingContext
        | null) ||
      (canvas.getContext('experimental-webgl', {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
      }) as WebGLRenderingContext | null)

    // No WebGL — leave the canvas transparent; the CSS aurora behind it shows.
    if (!gl) return

    const vert = compile(gl, gl.VERTEX_SHADER, VERT)
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vert || !frag) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vert)
    gl.attachShader(prog, frag)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    // Full-screen quad as a triangle strip.
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uPtr = gl.getUniformLocation(prog, 'u_ptr')
    const uIntensity = gl.getUniformLocation(prog, 'u_intensity')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.uniform1f(uIntensity, intensity)

    let width = 0
    let height = 0

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.max(1, Math.round(width * dpr))
      canvas!.height = Math.max(1, Math.round(height * dpr))
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
      gl!.uniform2f(uRes, canvas!.width, canvas!.height)
    }

    // Smoothed pointer parallax target, normalised to roughly [-1, 1].
    const ptr = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }

    let raf = 0
    let running = true
    const start = performance.now()

    function draw(now: number) {
      cur.x += (ptr.x - cur.x) * 0.04
      cur.y += (ptr.y - cur.y) * 0.04
      gl!.uniform1f(uTime, (now - start) / 1000)
      gl!.uniform2f(uPtr, cur.x, cur.y)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
    }

    function frame(now: number) {
      if (!running) return
      raf = requestAnimationFrame(frame)
      draw(now)
    }

    function onPointerMove(e: PointerEvent) {
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1
      ptr.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    function onContextLost(e: Event) {
      e.preventDefault()
      running = false
      cancelAnimationFrame(raf)
    }

    // Only animate while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) {
          if (!running) {
            running = true
            raf = requestAnimationFrame(frame)
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
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    canvas.addEventListener('webglcontextlost', onContextLost, false)

    if (reduceMotion) {
      // Paint a single static frame — no loop, no listeners.
      draw(start)
      return () => {
        io.disconnect()
        canvas.removeEventListener('webglcontextlost', onContextLost)
      }
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
    }
  }, [intensity])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
