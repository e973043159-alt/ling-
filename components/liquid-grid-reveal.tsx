'use client'

import { useEffect, useRef, useState } from 'react'
import LiquidGrid from '@/components/originkit/ui/liquid-grid'

/**
 * 液态网格遮罩：滚动进入后显示动态液态网格（跟随鼠标产生涟漪），
 * 点击任意处后网格与提示文字一起淡出化开，随后展示下方内容。
 */
export function LiquidGridReveal({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'grid' | 'fading' | 'done'>('grid')
  const [reduced, setReduced] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const dissolve = () => {
    if (phase !== 'grid') return
    setPhase('fading')
    // 与 CSS 过渡时长一致（约 1s），结束后卸载遮罩
    window.setTimeout(() => setPhase('done'), 1000)
  }

  // 无障碍：偏好减少动效时直接展示内容，不出现遮罩
  const showOverlay = !reduced && phase !== 'done'

  return (
    <div className="relative">
      {children}

      {showOverlay && (
        <div
          ref={overlayRef}
          onClick={dissolve}
          role="button"
          tabIndex={0}
          aria-label="点击任意处探索工作经历"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              dissolve()
            }
          }}
          className={`absolute inset-0 z-30 cursor-pointer overflow-hidden bg-[#0a0a0a] transition-[opacity,filter] duration-1000 ease-out ${
            phase === 'fading' ? 'pointer-events-none opacity-0 blur-md' : 'opacity-100 blur-0'
          }`}
        >
          <LiquidGrid
            mode="lines"
            background="#0a0a0a"
            lineColor="rgba(245,245,240,0.28)"
            glowColor="#f5f5f0"
            cellSize={34}
            lineWidth={1}
            radius={120}
            intensity={100}
            clickRipple
            collide={false}
            style={{ position: 'absolute', inset: 0 }}
          />

          {/* 提示文字 */}
          <div
            className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              phase === 'fading' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 animate-pulse bg-accent-orange" />
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-[#f5f5f0]/80">
                点击任意处探索 / Click anywhere to explore
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
