import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { Intro } from '@/components/intro'
import { BrandAmbience } from '@/components/brand-ambience'
import { Works } from '@/components/works'
import { KeepCreating } from '@/components/keep-creating'
import { AboutMe } from '@/components/about-me'
import { Contact } from '@/components/contact'

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Intro />
        <BrandAmbience />
        <Works />
        <KeepCreating />
        <AboutMe />
        <Contact />
      </main>
    </>
  )
}
