'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Work = {
  title: string
  tag: string
  img: string
  tone: 'gray' | 'white' | 'black'
  desc: string
  /** 项目详情图集：占位图，后续替换为真实图片路径即可 */
  gallery: string[]
  /** 长图模式：详情页中图片占满版心（约1200px）、高度自适应、不显示占位说明 */
  longform?: boolean
}

const WORKS: Work[] = [
  {
    title: '运动鞋服·KV',
    tag: '主视觉 / SPORTSWEAR',
    img: '/works/sportswear-kv.png',
    tone: 'gray',
    desc: '特步鞋服季度运动主视觉，从脚本、分镜到成片全流程主导，以力量感与速度线条强化品牌的运动基因。',
    // 长图详情：整组长图占满版心、纵向滚动浏览，按 1-5 顺序排列
    longform: true,
    gallery: [
      '/works/sportswear-1.png',
      '/works/sportswear-2.png',
      '/works/sportswear-3.png',
      '/works/sportswear-4.png',
      '/works/sportswear-5.png',
    ],
  },
  {
    title: '多元·海报',
    tag: '海报 / POSTER',
    img: '/works/posters.png',
    tone: 'black',
    desc: '覆盖节庆、大促与品牌传播的系列海报，探索多元排版与视觉语言，在统一调性中保持每张单图的独立张力。',
    // 长图详情：整组长图占满版心、纵向滚动浏览，按 1-2 顺序排列
    longform: true,
    gallery: ['/works/poster-1.png', '/works/poster-2.png'],
  },
  {
    title: '主视觉·KV',
    tag: '品牌 / KEY VISUAL',
    img: '/works/main-kv.png',
    tone: 'gray',
    desc: '品牌核心主视觉设计，确立整体视觉基调，并向海报、物料、终端等全链路场景稳定延展。',
    // 长图详情：整组长图占满版心、纵向滚动浏览，按 1-2 顺序排列
    longform: true,
    gallery: ['/works/main-kv-1.png', '/works/main-kv-2.png'],
  },
  {
    title: '多线物料',
    tag: '物料 / COLLATERAL',
    img: '/works/collateral.png',
    tone: 'black',
    desc: '楼书、品牌手册、易拉宝、展架等线上线下宣发物料的统一设计，确保信息在不同渠道的视觉一致性。',
    // 长图详情：整组长图占满版心、纵向滚动浏览，按 1-3 顺序排列
    longform: true,
    gallery: [
      '/works/collateral-1.png',
      '/works/collateral-2.png',
      '/works/collateral-3.png',
    ],
  },
  {
    title: '推文长图',
    tag: '社媒 / SOCIAL',
    img: '/works/motion.png',
    tone: 'gray',
    desc: '公众号推文与社媒长图排版，兼顾信息层级与阅读节奏，引导用户在纵向滚动中顺畅接收内容。',
    // 长图详情：整组长图占满版心、纵向滚动浏览
    longform: true,
    gallery: ['/works/social-1.png'],
  },
]

// 占位说明文案：后续替换为每张图的真实说明
const PLACEHOLDER_CAPTIONS = [
  '占位说明文案 · 项目背景与创意出发点简述。',
  '占位说明文案 · 主视觉构图与色彩策略说明。',
  '占位说明文案 · 关键画面的执行细节与工艺。',
  '占位说明文案 · 版式与信息层级的处理思路。',
  '占位说明文案 · 动态/延展物料的落地呈现。',
  '占位说明文案 · 终端场景与传播效果说明。',
  '占位说明文案 · 补充画面与幕后过程记录。',
  '占位说明文案 · 项目成果与数据反馈总结。',
]

const TONE = {
  gray: { bg: '#d9d9d4', fg: '#0a0a0a', sub: 'rgba(10,10,10,0.6)', card: 'rgba(10,10,10,0.06)' },
  white: { bg: '#f5f5f0', fg: '#0a0a0a', sub: 'rgba(10,10,10,0.6)', card: 'rgba(10,10,10,0.05)' },
  black: { bg: '#0a0a0a', fg: '#f5f5f0', sub: 'rgba(245,245,240,0.6)', card: 'rgba(245,245,240,0.06)' },
} as const

const N = WORKS.length

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

// 详情页单张图片：进入视口时淡入上移
function DetailImage({
  src,
  alt,
  caption,
  longform,
}: {
  src: string
  alt: string
  caption: string
  longform?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, root: null },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <figure
      ref={ref}
      className={`mx-auto flex w-full flex-col items-center transition-all duration-700 ease-out ${
        longform ? 'max-w-[1200px]' : 'max-w-[1100px]'
      }`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(40px)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        loading="lazy"
        className={
          longform
            ? 'h-auto w-full rounded-lg'
            : 'max-h-[88vh] w-auto max-w-full rounded-lg object-contain'
        }
      />
      {!longform && (
        <figcaption className="mt-5 w-full max-w-[1100px] text-left text-[15px] leading-relaxed text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export function Works() {
  const [viewer, setViewer] = useState<number | null>(null)
  const [active, setActive] = useState(0)
  const [scrollPct, setScrollPct] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollBoxRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const openViewer = (i: number) => {
    setScrollPct(0)
    setViewer(i)
  }

  // ---- 详情页：ESC 关闭 + 锁定 body 滚动 ----
  useEffect(() => {
    if (viewer === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewer(null)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [viewer])

  // ---- scroll-wheel-driven full-screen parallax with mask-wipe + zoom/depth ----
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const render = () => {
      const total = section.offsetHeight - window.innerHeight
      const scrolled = clamp(-section.getBoundingClientRect().top, 0, Math.max(total, 1))
      const progress = total > 0 ? scrolled / total : 0
      const floatIndex = progress * (N - 1)

      for (let i = 0; i < N; i++) {
        const slide = slideRefs.current[i]
        const img = imgRefs.current[i]
        if (!slide) continue

        // reveal (mask wipe upward) as floatIndex travels from i-1 -> i
        const t = i === 0 ? 1 : clamp(floatIndex - (i - 1), 0, 1)
        // how much the NEXT slide is covering this one (depth push-back)
        const cover = clamp(floatIndex - i, 0, 1)

        if (reduced) {
          slide.style.clipPath = 'none'
          slide.style.transform = 'none'
          slide.style.opacity = i === Math.round(floatIndex) ? '1' : '0'
        } else {
          slide.style.clipPath = `inset(${(1 - t) * 100}% 0 0 0)`
          slide.style.transform = `scale(${1 - cover * 0.14})`
          slide.style.opacity = `${1 - cover * 0.35}`
          slide.style.filter = cover > 0 ? `brightness(${1 - cover * 0.4})` : 'none'
        }
        slide.style.zIndex = String(i)

        if (img && !reduced) {
          // zoom / depth: image eases from 1.18 -> 1 as the slide reveals, then drifts on cover
          const imgScale = 1.18 - t * 0.18 + cover * 0.06
          img.style.transform = `translateY(${(1 - t) * 6 - cover * 4}%) scale(${imgScale})`
        } else if (img) {
          img.style.transform = 'none'
        }
      }

      const next = clamp(Math.round(floatIndex), 0, N - 1)
      setActive((prev) => (prev === next ? prev : next))
    }

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(render)
    }
    render()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const current = viewer !== null ? WORKS[viewer] : null

  // 详情页滚动进度
  const onBoxScroll = () => {
    const box = scrollBoxRef.current
    if (!box) return
    const max = box.scrollHeight - box.clientHeight
    setScrollPct(max > 0 ? clamp(box.scrollTop / max, 0, 1) : 0)
  }

  return (
    <section id="works" ref={sectionRef} className="relative bg-background" style={{ height: `${N * 100}vh` }}>
      {/* pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {WORKS.map((work, i) => {
          const tone = TONE[work.tone]
          return (
            <div
              key={work.title}
              ref={(el) => {
                slideRefs.current[i] = el
              }}
              className="absolute inset-0 will-change-transform"
              style={{ backgroundColor: tone.bg, color: tone.fg }}
            >
              <button
                type="button"
                data-cursor="work"
                aria-label={`查看 ${work.title}`}
                onClick={() => openViewer(i)}
                className="flex h-full w-full items-center px-6 text-left md:px-16 lg:px-24"
              >
                <div className="mx-auto grid w-full max-w-[1400px] gap-6 md:grid-cols-12 md:grid-rows-6">
                  {/* big image card */}
                  <div className="relative overflow-hidden rounded-2xl md:col-span-7 md:row-span-6">
                    <div className="aspect-[16/11] md:aspect-auto md:h-full">
                      <div
                        ref={(el) => {
                          imgRefs.current[i] = el
                        }}
                        className="relative h-full w-full will-change-transform"
                      >
                        <Image
                          src={work.img || '/placeholder.svg'}
                          alt={work.title}
                          fill
                          sizes="(max-width: 768px) 92vw, 55vw"
                          className="object-cover"
                          priority={i === 0}
                        />
                      </div>
                    </div>
                    <span
                      className="pointer-events-none absolute left-5 top-5 font-mono text-sm tracking-[0.2em]"
                      style={{ color: '#f5f5f0', mixBlendMode: 'difference' }}
                    >
                      {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                    </span>
                  </div>

                  {/* title card */}
                  <div
                    className="flex flex-col justify-center rounded-2xl p-6 md:col-span-5 md:row-span-3 md:p-9"
                    style={{ backgroundColor: tone.card }}
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-orange">
                      {work.tag}
                    </div>
                    <h3 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-tight md:text-6xl">
                      {work.title}
                    </h3>
                  </div>

                  {/* description card */}
                  <div
                    className="flex flex-col justify-between rounded-2xl p-6 md:col-span-5 md:row-span-3 md:p-9"
                    style={{ backgroundColor: tone.card }}
                  >
                    <p className="max-w-md text-sm leading-relaxed md:text-base" style={{ color: tone.sub }}>
                      {work.desc}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-orange">
                      点击查看作品详情 →
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )
        })}

        {/* fixed overlay chrome: header + progress */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] px-6 pt-24 md:px-16 lg:px-24">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between">
            <div className="flex items-center gap-3" style={{ mixBlendMode: 'difference', color: '#f5f5f0' }}>
              <span className="inline-block h-2.5 w-2.5 bg-accent-orange" />
              <span className="font-mono text-xs uppercase tracking-[0.25em]">加我好友 查看更多作品</span>
            </div>
            <span
              className="hidden font-mono text-xs uppercase tracking-[0.2em] md:block"
              style={{ mixBlendMode: 'difference', color: '#f5f5f0' }}
            >
              滚动浏览 · 点击进入
            </span>
          </div>
        </div>

        {/* progress indicator */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2">
          {WORKS.map((w, i) => (
            <span
              key={w.title}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === active ? 28 : 10,
                backgroundColor: i === active ? '#ea4e00' : 'rgba(128,128,128,0.5)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 作品详情页（全屏覆盖层，纵向滚动浏览） ── */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[130]"
            style={{ backgroundColor: '#0a0a0a' }}
          >
            {/* 可滚动内容区 */}
            <div ref={scrollBoxRef} onScroll={onBoxScroll} className="h-full w-full overflow-y-auto">
              {/* 顶部：返回按钮 + 项目标题（随内容滚动，粘顶） */}
              <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-5 md:px-4">
                  <button
                    type="button"
                    onClick={() => setViewer(null)}
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:text-accent-orange"
                  >
                    ← 返回作品集
                  </button>
                  <div className="min-w-0 text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-orange">
                      {current.tag}
                    </div>
                    <div className="truncate text-base font-semibold text-white md:text-lg">{current.title}</div>
                  </div>
                </div>
              </header>

              {/* 图片纵向排列，图片间距 ≥120px */}
              <div className="mx-auto flex max-w-[1100px] flex-col gap-[120px] px-6 py-[120px] md:px-4">
                {current.gallery.map((src, gi) => (
                  <DetailImage
                    key={src}
                    src={src}
                    alt={`${current.title} 图片 ${gi + 1}`}
                    caption={PLACEHOLDER_CAPTIONS[gi % PLACEHOLDER_CAPTIONS.length]}
                    longform={current.longform}
                  />
                ))}
              </div>

              {/* 结尾返回 */}
              <div className="flex justify-center pb-24">
                <button
                  type="button"
                  onClick={() => setViewer(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white/70 transition-colors duration-200 hover:border-accent-orange hover:text-accent-orange"
                >
                  ← 返回作品集
                </button>
              </div>
            </div>

            {/* 右侧滚动进度条 */}
            <div className="pointer-events-none absolute right-3 top-1/2 z-30 h-40 w-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/10 md:right-6 md:h-56">
              <div
                className="w-full rounded-full bg-accent-orange transition-[height] duration-100 ease-out"
                style={{ height: `${scrollPct * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
