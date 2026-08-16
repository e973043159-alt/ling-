'use client'

import TextWall from '@/components/originkit/ui/text-reveal-wall'

/* ------------------------------------------------------------------ *
 * 头图字符墙：使用 Originkit「Text Reveal Wall」组件，一比一还原参考动效。
 * 仅占据屏幕上方三分之一，绝不覆盖底部两行文案。
 * 下列 props 对应需求中提到的可调参数：
 *  - emptyLines：墙壁上下两端保留空白行的百分比
 *  - textColor：填充（乱码）字符颜色——白色
 *  - reverse：每行从右到左显现 / 隐藏
 *  - stagger / transition.delay：逐行延迟形成连锁反应
 *  - loop：不断重复“显现—消失”循环（false 则只显示一次后保持）
 *  - font：悬停标签（导航词）的字体系列、大小、粗细与间距
 * ------------------------------------------------------------------ */

// 从墙壁中揭示出的导航文字（文案不变）
const WORDS = ['HELLO', 'WELCOME', 'INTRO', '401', 'WORKS', 'CONTACT', 'PORTFOLIO', 'DESIGN']

export function Welcome() {
  return (
    <section
      id="welcome"
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* 字符墙：占屏幕上方六分之四（约三分之二），不覆盖底部两行文字 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 w-full">
        <TextWall
          words={WORDS}
          emptyLines={12}
          textColor="rgba(245, 245, 240, 0.55)"
          wordsColor="rgb(245, 245, 240)"
          backgroundColor="#000000"
          reverse
          loop
          stagger={0.1}
          transition={{ type: 'tween', duration: 1, ease: 'easeInOut', delay: 1 }}
          font={{
            fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        />
      </div>

      {/* 副标题（保持不变） */}
      <div className="pointer-events-none absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3 px-6 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
          （欢迎光临 · WELCOME TO MY PORTFOLIO）
        </span>
      </div>

      {/* 滚动提示 */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="scroll-dot block h-8 w-px bg-gradient-to-b from-accent-orange to-transparent" />
      </div>
    </section>
  )
}
