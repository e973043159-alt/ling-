'use client'

import { motion } from 'framer-motion'
import { PixelTrail } from '@/components/pixel-trail'
import { Typewriter } from '@/components/typewriter'
import { Welcome } from '@/components/welcome'

export function Hero() {
  return (
    <div id="hello">
      {/* 前导部分：合并自原第一屏的字符墙头图 */}
      <Welcome />

      <section
        className="relative flex min-h-screen flex-col overflow-hidden px-6 pb-4 pt-28 md:px-10 md:pt-32"
      >
      <PixelTrail targetId="hello" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        {/* top row: title (left) + nav (right) */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-balance text-[16vw] font-bold uppercase leading-[0.86] tracking-tight text-accent-orange md:text-[8vw] lg:text-[7rem]">
              CONTACT
            </h1>
            <Typewriter
              lines={['(WITH ME)']}
              speed={150}
              loop
              loopPause={2000}
              caretClassName="bg-accent-orange"
              className="block text-balance text-[13vw] font-bold uppercase leading-[0.86] tracking-tight text-accent-orange md:text-[6.5vw] lg:text-[5.5rem]"
            />
          </motion.div>

          <motion.a
            href="mailto:307260741@qq.com"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="shrink-0 text-balance text-sm font-bold uppercase tracking-tight text-foreground transition-colors duration-300 hover:text-accent-orange md:text-base"
          >
            307260741@qq.com
          </motion.a>
        </div>

        {/* spacer pushes wordmark down */}
        <div className="flex-1" />
      </div>

      {/* giant bottom wordmark */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="pointer-events-none relative z-10 mt-6 w-full select-none whitespace-nowrap text-center text-[20.5vw] font-bold uppercase leading-[0.74] tracking-[-0.045em] text-foreground"
        style={{ transform: 'scaleY(1.3)', transformOrigin: 'center bottom' }}
      >
        LINYILING
      </motion.p>
      </section>
    </div>
  )
}
