'use client'

import { motion } from 'framer-motion'
import { Reveal } from '@/components/reveal'
import { StatsCarousel } from '@/components/stats-carousel'

const SKILLS = ['主视觉 / KV', 'AIGC', '海报 / 排版', '动效创意', '分镜脚本']

const STATS = [
  { value: '5+', label: '年商业视觉经验' },
  { value: '10+', label: '大型品牌服务' },
  { value: 'AIGC', label: '工作流' },
]

// paragraph split into tokens; `hi` marks highlighted (foreground) chunks. Content unchanged.
const TOKENS: { t: string; hi?: boolean }[] = [
  { t: '本人拥有 ' },
  { t: '5 年商业视觉设计经验', hi: true },
  { t: '，具备成熟的创意构思与设计功底。' },
  { t: '服务深度覆盖运动鞋服、地产、卫浴等大型品牌。' },
  { t: '主导过产品视觉脚本策划、动态动效创意及其它视觉创意，并掌握 ' },
  { t: 'AIGC', hi: true },
  { t: ' 工具辅助创意构思，将其融入工作流。' },
  { t: '性格踏实稳重，工作务实高效，具备极强的多线条任务处理能力。' },
  { t: '善与外部团队协作，能适应高强度快节奏的创意执行环境。' },
]

// deterministic pseudo-random so SSR and client match (no hydration mismatch)
const rand = (n: number) => {
  const x = Math.sin(n * 99.13) * 10000
  return x - Math.floor(x)
}

export function AboutMe() {
  return (
    <section id="about" className="border-t border-border px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 bg-accent-orange" />
            <h2 className="text-balance text-4xl font-semibold text-[#EA4E00] md:text-6xl">
              关于我 <span className="text-[#EA4E00]/70">/ ABOUT</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr] md:gap-20">
          <div>
            {/* words fly in from far away and gather into the paragraph */}
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.06 }}
              className="text-pretty text-lg leading-relaxed text-foreground md:text-xl"
            >
              {TOKENS.map((tok, i) => (
                <motion.span
                  key={i}
                  className={tok.hi ? 'text-foreground' : undefined}
                  style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: (rand(i + 1) - 0.5) * 700,
                      y: (rand(i + 7) - 0.5) * 400,
                      scale: 1.8,
                      filter: 'blur(6px)',
                    },
                    show: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  {tok.t}
                </motion.span>
              ))}
            </motion.p>

            <div className="mt-10 flex flex-wrap gap-3">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors duration-300 hover:border-accent-orange hover:text-accent-orange"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <StatsCarousel stats={STATS} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
