'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** lines typed sequentially; a line break is inserted between them */
  lines: string[]
  className?: string
  /** ms per character */
  speed?: number
  /** ms pause at line breaks */
  linePause?: number
  /** heading tag to render as */
  as?: 'h1' | 'h2'
  /** loop the typing animation */
  loop?: boolean
  /** ms to hold the finished text before restarting when looping */
  loopPause?: number
  /** override the blinking caret color class (defaults to orange) */
  caretClassName?: string
}

export function Typewriter({
  lines,
  className,
  speed = 120,
  linePause = 400,
  as = 'h2',
  loop = false,
  loopPause = 1600,
  caretClassName = 'bg-accent-orange',
}: Props) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLHeadingElement>(null)
  const Tag = as

  // full string with newline markers between lines
  const full = lines.join('\n')
  const total = full.length

  // start typing when the element scrolls into view
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setStarted(true)
      setCount(total)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [total])

  useEffect(() => {
    if (!started || count >= total) return
    const nextChar = full[count]
    const delay = nextChar === '\n' ? linePause : speed
    const id = setTimeout(() => setCount((c) => c + 1), delay)
    return () => clearTimeout(id)
  }, [started, count, total, full, speed, linePause])

  // when looping, hold the finished text, then retype from the start
  useEffect(() => {
    if (!loop || !started || count < total) return
    const id = setTimeout(() => setCount(0), loopPause)
    return () => clearTimeout(id)
  }, [loop, started, count, total, loopPause])

  const typed = full.slice(0, count)
  const done = count >= total

  return (
    <Tag ref={ref} className={className} aria-label={lines.join(' ')}>
      <span aria-hidden>
        {typed.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </span>
      {/* blinking caret */}
      <span
        aria-hidden
        className={`ml-2 inline-block w-[0.08em] self-stretch align-baseline ${caretClassName}`}
        style={{
          height: '0.85em',
          transform: 'translateY(0.06em)',
          animation: done
            ? 'caret-blink 1s steps(1) infinite'
            : 'caret-blink 0.5s steps(1) infinite',
        }}
      />
    </Tag>
  )
}
