'use client'

import { useEffect, useRef } from 'react'

const SEGMENTS = 26
const SIZE = 16

/**
 * A snake-like trail of pixel blocks that follows the cursor while the
 * given container is hovered. Each block eases toward the one ahead of it.
 */
export function PixelTrail({ targetId }: { targetId: string }) {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    const target = document.getElementById(targetId)
    if (!layer || !target) return

    const blocks = Array.from(layer.children) as HTMLDivElement[]
    const pts = Array.from({ length: SEGMENTS }, () => ({ x: -100, y: -100 }))
    const mouse = { x: -100, y: -100 }
    let active = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      const rect = target.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onEnter = () => {
      active = true
    }
    const onLeave = () => {
      active = false
    }

    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerenter', onEnter)
    target.addEventListener('pointerleave', onLeave)

    const tick = () => {
      // lead point chases the cursor
      pts[0].x += (mouse.x - pts[0].x) * 0.35
      pts[0].y += (mouse.y - pts[0].y) * 0.35
      // each following point chases the one ahead — snake behaviour
      for (let i = 1; i < SEGMENTS; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.4
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.4
      }
      for (let i = 0; i < SEGMENTS; i++) {
        const b = blocks[i]
        const scale = 1 - (i / SEGMENTS) * 0.7
        const opacity = active ? (1 - i / SEGMENTS) * 0.9 : 0
        b.style.transform = `translate3d(${pts[i].x - SIZE / 2}px, ${pts[i].y - SIZE / 2}px, 0) scale(${scale})`
        b.style.opacity = String(opacity)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerenter', onEnter)
      target.removeEventListener('pointerleave', onLeave)
    }
  }, [targetId])

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {Array.from({ length: SEGMENTS }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 top-0 rounded-[2px] bg-[#f5f5f0]"
          style={{ width: SIZE, height: SIZE, opacity: 0, transition: 'opacity 0.3s' }}
        />
      ))}
    </div>
  )
}
