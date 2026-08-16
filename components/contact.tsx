'use client'

import { Reveal } from '@/components/reveal'

export function Contact() {
  return (
    <section id="contact" className="border-t border-border px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 bg-accent-orange" />
            <h2 className="text-balance text-4xl font-semibold text-accent-orange md:text-6xl">
              联系 <span className="text-accent-orange/70">/ GET IN TOUCH</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="max-w-3xl text-pretty text-xl leading-relaxed text-accent-orange md:text-2xl">
            如果你正在寻找一位能从创意概念落地到终端现实的视觉设计师，请联系我。
          </p>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-20">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              联系方式 / CONTACT
            </span>
            <div className="mt-8 space-y-px overflow-hidden rounded-lg border border-border">
              <a
                href="mailto:307260741@qq.com"
                className="group flex items-center justify-between bg-card px-6 py-5 transition-colors duration-300 hover:bg-accent-orange"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-white/80">
                  邮箱 / EMAIL
                </span>
                <span className="text-foreground group-hover:text-white">307260741@qq.com</span>
              </a>
              <a
                href="tel:15260126617"
                className="group flex items-center justify-between bg-card px-6 py-5 transition-colors duration-300 hover:bg-accent-orange"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-white/80">
                  电话 / PHONE
                </span>
                <span className="text-foreground group-hover:text-white">152 6012 6617</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col items-end text-right">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                微信 / WECHAT
              </span>
              <div className="mt-8 h-32 w-32 overflow-hidden rounded-lg">
                <img
                  src="/wechat-qr.png"
                  alt="微信二维码"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">扫码添加微信</p>
            </div>
          </Reveal>
        </div>

        {/* footer */}
        <div className="mt-28 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            林艺玲 © 2026 · 平面设计作品集
          </span>
          <a
            href="#welcome"
            className="link-underline font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent-orange"
          >
            回到顶部 ↑
          </a>
        </div>
      </div>
    </section>
  )
}
