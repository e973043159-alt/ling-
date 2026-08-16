'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Enable on non-touch devices that don't prefer reduced motion.
    // Coarse pointers (touch) are excluded so mobile keeps the native touch UX.
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarsePointer || reduced) return

    const dot = dotRef.current
    if (!dot) return

    document.documentElement.classList.add('has-custom-cursor')

    // target (mouse) vs rendered (lerped) position for a smooth trailing feel
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = { ...target }
    let last = { x: target.x, y: target.y }
    let speed = 0
    let variant: 'default' | 'work' | 'link' = 'default'
    let visible = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      speed = Math.min(Math.sqrt(dx * dx + dy * dy), 40)
      last = { x: e.clientX, y: e.clientY }
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
      }
    }

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        '[data-cursor="work"], a, button, [role="button"]',
      ) as HTMLElement | null
      if (!el) variant = 'default'
      else if (el.getAttribute('data-cursor') === 'work') variant = 'work'
      else variant = 'link'
    }

    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
    }

    const render = () => {
      // smooth follow
      pos.x += (target.x - pos.x) * 0.2
      pos.y += (target.y - pos.y) * 0.2

      // base size grows slightly with movement speed
      let size = 16 + speed * 0.5
      let bg = 'rgba(245, 245, 240, 0.35)'
      let border = 'transparent'

      if (variant === 'work') {
        size = 68
        bg = 'rgba(234, 78, 0, 0.9)'
      } else if (variant === 'link') {
        size = 44
        bg = 'transparent'
        border = 'rgba(245, 245, 240, 0.7)'
      }

      dot.style.width = `${size}px`
      dot.style.height = `${size}px`
      dot.style.transform = `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0)`
      dot.style.backgroundColor = bg
      dot.style.borderColor = border

      // decay speed so the dot settles back to base size when still
      speed *= 0.9
      raf = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border opacity-0 mix-blend-difference"
      style={{
        transition:
          'width 0.25s ease-out, height 0.25s ease-out, background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease',
        willChange: 'transform',
      }}
    />
  )
}
