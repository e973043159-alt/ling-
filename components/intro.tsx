'use client'

import { Reveal } from '@/components/reveal'
import { SnapText } from '@/components/snap-text'
import { LiquidGridReveal } from '@/components/liquid-grid-reveal'

const EXPERIENCE = [
  {
    company: '厦门灵致文化创意有限公司',
    role: '设计组长',
    period: '2022-07 至 2026-01',
    points: [
      {
        label: '创意与产出',
        body: '独立完成特步鞋服季度运动脚本及分镜创作等视觉策划，主导从构思到最终完稿的全流程，在团队中承担核心产出角色，负责拆分设计任务并协助组内成员完成工作。善用 AIGC 技术辅助设计工作，确保品牌视觉的高质产出。',
      },
      {
        label: '策划与物料',
        body: '承接并执行品牌促销海报、主视觉 / KV、大型围挡及公众号推文等全链路物料；协调组内成员的分工与排期，确保多个项目同时进行的视觉品质，精准把控平面到宣传的物料转化，获得客户及团队的高度认可。',
      },
      {
        label: '终端与动效',
        body: '统筹终端店铺的陈列道具、开业推广画面等营销设计；同时擅长输出动态视频创意方向与动效设计，并把控三方团队剪辑成片的节奏与画面调性。',
      },
      {
        label: '拍摄与成片',
        body: '全程跟进创意脚本的线下拍摄，具备丰富的平面拍摄经验，对接摄影团队把控布光、影调与动作要求。确保拍摄成品与创意方案的高度吻合，提升视觉项目的出片质量与效率。',
      },
    ],
  },
  {
    company: '厦门先知先觉行销策划有限公司',
    role: '平面设计',
    period: '2021-04 至 2022-03',
    points: [
      {
        label: '视觉输出',
        body: '独立负责地产类目节庆及各类营销节点的视觉策划，从创意构思到完稿输出全程把控，多套核心单图与海报输出获客户高度认可。',
      },
      {
        label: '多线物料',
        body: '负责线上线下宣发设计，涵盖系列价值稿海报、楼书、品牌手册、易拉宝、展架等物料，确保推广信息在不同渠道的视觉统一性。',
      },
      {
        label: '快速响应',
        body: '在密集的活动节点中，能准确理解上级及客户的创意需求，快速响应并配合完成视觉产出，有效保障了项目节点的按时上线。',
      },
    ],
  },
  {
    company: '厦门 BCC 洞察力广告有限公司',
    role: '平面设计',
    period: '2020-09 至 2021-03',
    points: [
      {
        label: '输出与落地',
        body: '负责泛家居品牌的视觉设计，涵盖节日节气、大促 KV、活动海报及 LED 屏投放画面。具备基本的视觉逻辑与完稿执行能力。',
      },
      {
        label: '美化与排版',
        body: '负责大型制造企业产品图像精修、电子画册、手册排版及宣传画面等物料设计，精准传递产品卖点，设计成果获客户与领导双重认可。',
      },
      {
        label: '规范与适应',
        body: '覆盖易拉宝、画册、展板等多元物料的延展设计，保障视觉输出的统一性，快速掌握各类物料制作规范，有较强的学习力与多任务适应能力。',
      },
    ],
  },
]

export function Intro() {
  return (
    <section id="intro" className="border-t border-border">
      <div className="px-6 pb-28 pt-28 md:px-10 md:pb-36 md:pt-40">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="mb-16 flex items-center gap-3">
              <span className="inline-block h-2.5 w-2.5 bg-accent-orange" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                (工作经历 / EXPERIENCE)
              </span>
            </div>
          </Reveal>

          <LiquidGridReveal>
            {EXPERIENCE.map((job, i) => (
              <Reveal key={job.company} delay={i * 0.1}>
                <article className="group grid gap-8 border-t border-border py-12 md:grid-cols-[1fr_1.6fr] md:gap-20 md:py-16">
                  {/* left: company + meta */}
                  <div className="md:sticky md:top-28 md:self-start">
                    <h3 className="text-balance text-2xl font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-accent-orange md:text-3xl">
                      {job.company}
                    </h3>
                    <div className="mt-4 flex items-center gap-4 font-mono text-xs tracking-wide text-accent-orange">
                      <span>{job.period}</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{job.role}</div>
                  </div>

                  {/* right: categorized responsibilities —— 滚动收紧文字行 */}
                  <div className="space-y-6">
                    {job.points.map((p) => (
                      <SnapText key={p.label} label={p.label} body={p.body} className="text-pretty" />
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
            <div className="border-t border-border" />
          </LiquidGridReveal>
        </div>
      </div>
    </section>
  )
}
