'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { id: 'hello', label: '你好' },
  { id: 'intro', label: '介绍' },
  { id: 'works', label: '作品' },
  { id: 'contact', label: '联系' },
]

export function SiteNav() {
  const [active, setActive] = useState('hello')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    for (const { id } of LINKS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-background/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#hello"
          onClick={(e) => handleClick(e, 'hello')}
          className="font-mono text-xs uppercase tracking-[0.2em] text-foreground"
        >
          林艺玲<span className="text-accent-orange">.</span>
        </a>
        <nav className="flex items-center gap-6 md:gap-9">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`link-underline text-sm tracking-wide transition-colors duration-300 ${
                active === id ? 'text-accent-orange' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
