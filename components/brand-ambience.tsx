'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/reveal'

const KEYWORDS = [
  { cn: '品牌创意', en: 'BRAND CREATIVE', no: '01' },
  { cn: '视觉系统', en: 'VISUAL IDENTITY', no: '02' },
  { cn: '物料设计', en: 'MATERIAL DESIGN', no: '03' },
  { cn: '动效编排', en: 'MOTION CHOREOGRAPHY', no: '04' },
  { cn: '策略先行', en: 'STRATEGY FIRST', no: '05' },
  { cn: '拍摄执行', en: 'PHOTOGRAPHY', no: '06' },
]

/* ────────── 可调参数 ──────────
 * 光标移动时新卡片出现的频率：数值越大，出现越频繁（越丝滑密集）。
 * 内部换算为触发间距 = BASE_SPACING / APPEAR_FREQUENCY（像素）。 */
const APPEAR_FREQUENCY = 1.15
const BASE_SPACING = 190

/* 每张卡片在完全消失之前保持可见的时长（秒）。 */
const VISIBLE_DURATION = 1.4

/* 卡片滑入 / 滑出过渡的时长（秒），营造舒缓高级的跟手节奏。 */
const TRANSITION = 0.85

/* 悬停标签（英文小标）的字体系列、大小、粗细与字间距。 */
const LABEL_FONT: React.CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.22em',
}

type Trail = { id: number; x: number; y: number; kw: (typeof KEYWORDS)[number] }

export function BrandAmbience() {
  const sectionRef = useRef<HTMLElement>(null)
  const last = useRef({ x: 0, y: 0, has: false })
  const cycle = useRef(0)
  const idSeq = useRef(0)
  const auto = useRef({ active: false, raf: 0, t: 0 })
  const [trails, setTrails] = useState<Trail[]>([])
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const spacing = BASE_SPACING / Math.max(0.25, APPEAR_FREQUENCY)

  const remove = useCallback((id: number) => {
    setTrails((t) => t.filter((item) => item.id !== id))
  }, [])

  // 在指定坐标按触发间距生成轨迹卡片（自动 / 鼠标共用）
  const spawn = useCallback(
    (x: number, y: number) => {
      if (!last.current.has) {
        last.current = { x, y, has: true }
        return
      }
      const dx = x - last.current.x
      const dy = y - last.current.y
      if (Math.hypot(dx, dy) < spacing) return

      last.current = { x, y, has: true }
      const kw = KEYWORDS[cycle.current % KEYWORDS.length]
      cycle.current += 1
      const id = idSeq.current++
      setTrails((t) => [...t.slice(-11), { id, x, y, kw }])
    },
    [spacing],
  )

  const stopAuto = useCallback(() => {
    auto.current.active = false
    if (auto.current.raf) cancelAnimationFrame(auto.current.raf)
    auto.current.raf = 0
  }, [])

  // 自动运动：沿平滑的李萨如曲线移动虚拟光标并生成卡片
  const startAuto = useCallback(() => {
    if (reduced || auto.current.active) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    auto.current.active = true
    // 重置轨迹起点，避免与之前的鼠标位置产生跳变
    last.current.has = false

    const step = () => {
      if (!auto.current.active) return
      const r = sectionRef.current?.getBoundingClientRect()
      if (r) {
        auto.current.t += 0.02
        const t = auto.current.t
        const cx = r.width / 2
        const cy = r.height / 2
        const ax = r.width * 0.34
        const ay = r.height * 0.26
        const x = cx + Math.sin(t * 0.9) * ax
        const y = cy + Math.sin(t * 0.6 + 1.3) * ay
        spawn(x, y)
      }
      auto.current.raf = requestAnimationFrame(step)
    }
    auto.current.raf = requestAnimationFrame(step)
  }, [reduced, spawn])

  // 滚动进入该屏 → 立即自动运动；离开 → 停止
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startAuto()
        else stopAuto()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      stopAuto()
    }
  }, [startAuto, stopAuto])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduced) return
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      // 用户开始移动鼠标 → 平滑接管控制权：停止自动运动，
      // 并以当前鼠标位置作为新的轨迹起点（无跳变、无感知切换）。
      if (auto.current.active) {
        stopAuto()
        last.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, has: true }
        return
      }
      spawn(e.clientX - rect.left, e.clientY - rect.top)
    },
    [reduced, spawn, stopAuto],
  )

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => (last.current.has = false)}
      className="relative min-h-screen overflow-hidden border-t border-border bg-accent-orange"
    >
      {/* 文案信息保持不变 */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col justify-center px-6 py-24 md:px-10">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-background/60">
            LIN YILING
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-6 text-balance text-5xl font-bold leading-[0.95] tracking-tight text-background md:text-8xl">
            BRAND &amp; VISUAL
            <br />
            <span className="text-background/40">DESIGN</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-background/70 md:text-xl">
            Crafting identity, visuals, and experiences that connect.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.24em] text-background/50">
            {reduced ? 'BRAND / VISUAL / MATERIAL / MOTION / STRATEGY / PHOTO' : 'Move your cursor to take control'}
          </p>
        </Reveal>
      </div>

      {/* 光标轨迹卡片：跟随鼠标横向滑入滑出 */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {trails.map((t) => (
          <TrailCard key={t.id} trail={t} onDone={() => remove(t.id)} />
        ))}
      </div>
    </section>
  )
}

function TrailCard({ trail, onDone }: { trail: Trail; onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'in' | 'out'>('enter')

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('in'))
    const t1 = setTimeout(() => setPhase('out'), VISIBLE_DURATION * 1000)
    const t2 = setTimeout(onDone, VISIBLE_DURATION * 1000 + TRANSITION * 1000 + 60)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const slide = phase === 'enter' ? -34 : phase === 'out' ? 34 : 0
  const opacity = phase === 'in' ? 1 : 0
  const { kw } = trail

  return (
    <div
      className="absolute h-[190px] w-[300px] md:h-[210px] md:w-[340px]"
      style={{
        left: trail.x,
        top: trail.y,
        transform: `translate(-50%, -50%) translateX(${slide}px)`,
        opacity,
        transition: `transform ${TRANSITION}s cubic-bezier(0.22, 1, 0.36, 1), opacity ${TRANSITION}s cubic-bezier(0.22, 1, 0.36, 1)`,
        willChange: 'transform, opacity',
      }}
    >
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-md border border-background/15 bg-background/85 p-7 backdrop-blur-sm">
        {/* 轻微半透明叠层 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent" />
        <span className="relative font-mono text-xs tracking-[0.2em] text-accent-orange">({kw.no})</span>
        <div className="relative">
          <div className="text-3xl font-semibold text-foreground md:text-4xl">{kw.cn}</div>
          <div className="mt-2 uppercase text-muted-foreground" style={LABEL_FONT}>
            {kw.en}
          </div>
        </div>
      </div>
    </div>
  )
}
