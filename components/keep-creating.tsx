'use client'

import { Reveal } from '@/components/reveal'
import { Typewriter } from '@/components/typewriter'

export function KeepCreating() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-t border-border px-6 py-32 text-center md:px-10">
      <Reveal className="relative z-10">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-accent-orange">
          探索 · 可能
        </span>
      </Reveal>

      <div className="relative z-10 mt-10 flex justify-center">
        <Typewriter
          lines={['KEEP', 'CREATING']}
          speed={140}
          linePause={450}
          loop
          loopPause={2000}
          className="block text-center text-balance text-[16vw] font-bold uppercase leading-[0.85] tracking-tight text-foreground md:text-[13vw] lg:text-[180px]"
        />
      </div>

      <Reveal delay={0.16} className="relative z-10">
        <p className="mt-10 text-pretty text-lg leading-relaxed text-muted-foreground md:text-2xl">
          Design is a journey, not a destination.
        </p>
      </Reveal>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          林艺玲 / VISUAL DESIGNER
        </span>
      </div>
    </section>
  )
}
