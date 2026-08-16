'use client'

import { motion } from 'framer-motion'

export function WordReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(' ')

  return (
    <p className={`relative flex flex-wrap ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="mr-[0.28em] inline-block overflow-hidden py-[0.05em]">
          <motion.span
            aria-hidden="true"
            className="inline-block will-change-transform"
            initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }}
            whileInView={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.55,
              delay: delay + i * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </p>
  )
}
