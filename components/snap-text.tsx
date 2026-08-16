'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * SnapText —— 滚动驱动的「收紧文字行」效果（参考 madewithgsap effect097）
 * 每一行文字随滚动进度从「间距大 / 略模糊 / 半透明」过渡到「正常间距 / 清晰 / 不透明」，
 * 行与行之间依次延迟，形成一行接一行收紧的节奏。
 *
 * 实现方式：先以普通文本渲染并测量换行位置，再按视觉行拆分为多个 span，
 * 逐行绑定滚动进度。仅作用于传入的文本，不影响其它内容。
 */

// —— 可调参数 ——
const START_SPACING = 0.5 // em，行初始字间距
const START_OPACITY = 0.6 // 行初始透明度
const START_BLUR = 4 // px，行初始模糊
const LINE_STAGGER = 0.12 // 每行进度偏移（依次延迟）

type Segment = { text: string; bold?: boolean }

export function SnapText({
  label,
  body,
  className,
}: {
  label: string
  body: string
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLParagraphElement>(null)
  const [lines, setLines] = useState<Segment[][] | null>(null)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // 测量换行：把「label + body」按渲染后的视觉行拆分
  useEffect(() => {
    if (reduced) return
    const measure = () => {
      const el = measureRef.current
      if (!el) return
      const words: { node: Text; text: string; bold: boolean }[] = []
      // label（加粗）+ body（常规），逐字测量以定位换行点（中文按字符、英文按词）
      const tokenize = (s: string, bold: boolean) => {
        const parts = s.match(/[A-Za-z0-9]+|[^\sA-Za-z0-9]|\s/g) ?? []
        for (const t of parts) words.push({ node: document.createTextNode(''), text: t, bold })
      }
      tokenize(label + '：', true)
      tokenize(body, false)

      el.textContent = ''
      const spans = words.map((w) => {
        const span = document.createElement('span')
        span.textContent = w.text
        span.style.fontWeight = w.bold ? '600' : 'inherit'
        el.appendChild(span)
        return span
      })

      // 依据每个 token 的 offsetTop 归组为视觉行
      const grouped: Segment[][] = []
      let currentTop: number | null = null
      let current: Segment[] = []
      spans.forEach((span, i) => {
        const top = span.offsetTop
        if (currentTop === null) currentTop = top
        if (top !== currentTop) {
          grouped.push(current)
          current = []
          currentTop = top
        }
        const seg: Segment = { text: words[i].text, bold: words[i].bold }
        current.push(seg)
      })
      if (current.length) grouped.push(current)
      setLines(grouped)
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (measureRef.current) ro.observe(measureRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [label, body, reduced])

  // 滚动进度：元素从进入视口底部到抵达视口中上部映射为 0 → 1
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const start = vh * 0.9
        const end = vh * 0.35
        const p = (start - rect.top) / (start - end)
        setProgress(Math.max(0, Math.min(1, p)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced, lines])

  // 降级：静态清晰文本
  if (reduced) {
    return (
      <div className={className}>
        <span className="mr-2 font-semibold text-foreground">{label}：</span>
        <span className="text-base leading-relaxed text-muted-foreground">{body}</span>
      </div>
    )
  }

  const totalLines = lines?.length ?? 1
  const lineProgress = (i: number) => {
    // 每行在总进度中占据一段窗口，依次延迟收紧
    const offset = i * LINE_STAGGER
    const span = 1 - LINE_STAGGER * (totalLines - 1)
    const raw = (progress - offset) / Math.max(0.15, span)
    const t = Math.max(0, Math.min(1, raw))
    // ease-out
    return 1 - Math.pow(1 - t, 2)
  }

  return (
    <div ref={wrapRef} className={className}>
      {/* 隐藏的测量层：与可见层同字号，用于探测换行 */}
      <p
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute text-base leading-relaxed"
        style={{ width: '100%', margin: 0 }}
      />

      {/* 可见层：逐行收紧 */}
      <p className="text-base leading-relaxed text-muted-foreground" style={{ margin: 0 }}>
        {lines
          ? lines.map((segs, i) => {
              const t = lineProgress(i)
              const spacing = START_SPACING * (1 - t)
              const opacity = START_OPACITY + (1 - START_OPACITY) * t
              const blur = START_BLUR * (1 - t)
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline',
                    letterSpacing: `${spacing}em`,
                    opacity,
                    filter: blur > 0.05 ? `blur(${blur}px)` : 'none',
                    transition: 'letter-spacing 0.1s linear, opacity 0.1s linear, filter 0.1s linear',
                    willChange: 'letter-spacing, opacity, filter',
                  }}
                >
                  {segs.map((s, j) =>
                    s.bold ? (
                      <span key={j} className="font-semibold text-foreground">
                        {s.text}
                      </span>
                    ) : (
                      <span key={j}>{s.text}</span>
                    ),
                  )}
                </span>
              )
            })
          : // 首帧未测量：先渲染普通文本（无闪烁）
            [
              <span key="l" className="font-semibold text-foreground">
                {label}：
              </span>,
              <span key="b">{body}</span>,
            ]}
      </p>
    </div>
  )
}
