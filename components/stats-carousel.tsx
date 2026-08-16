'use client'

import { useEffect, useState } from 'react'

type Stat = { value: string; label: string }

const HIGHLIGHT = '#EA4E00'
const INTERVAL = 2500 // 每 2.5 秒滚动一次
const DURATION = 700 // 过渡时长 0.7s
const ROW_H = 96 // 每行高度（px）

export function StatsCarousel({ stats }: { stats: Stat[] }) {
  const [offset, setOffset] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // 定时向上推进一行，永不停止
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setAnimate(true)
      setOffset((o) => o + 1)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [reduced])

  const n = stats.length

  // 走完一整轮后，趁过渡结束的瞬间无动画地归零，实现无缝无限循环
  useEffect(() => {
    if (reduced || offset < n) return
    const t = setTimeout(() => {
      setAnimate(false)
      setOffset(0)
    }, DURATION)
    return () => clearTimeout(t)
  }, [offset, n, reduced])

  // 多渲染几行，保证三个可见槽位在任何 offset 下都有内容
  const rows = Array.from({ length: n + 3 }, (_, i) => ({ ...stats[i % n], key: i }))

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-border"
      style={{ height: ROW_H * 3 }}
      aria-label="核心数据指标"
    >
      <div
        style={{
          transform: `translateY(${-offset * ROW_H}px)`,
          transition: animate && !reduced ? `transform ${DURATION}ms cubic-bezier(0.22,1,0.36,1)` : 'none',
        }}
      >
        {rows.map((s, i) => {
          // 可见区中间行（第 2 行）高亮
          const isMiddle = i === offset + 1
          return (
            <div
              key={s.key}
              className="flex items-baseline justify-between px-6"
              style={{
                height: ROW_H,
                paddingTop: 24,
                paddingBottom: 24,
                background: isMiddle ? HIGHLIGHT : '#1A1A1A',
                color: isMiddle ? '#0a0a0a' : '#f5f5f0',
                transition: reduced ? undefined : `background ${DURATION}ms ease, color ${DURATION}ms ease`,
              }}
            >
              <span className="text-4xl font-bold md:text-5xl">{s.value}</span>
              <span className="text-sm" style={{ color: isMiddle ? '#0a0a0a' : 'rgba(245,245,240,0.6)' }}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
