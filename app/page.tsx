import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsBar } from '@/components/landing/StatsBar'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { CoursesPreview } from '@/components/landing/CoursesPreview'
import { PuzzlePreview } from '@/components/landing/PuzzlePreview'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { LeaderboardPreview } from '@/components/landing/LeaderboardPreview'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <CoursesPreview />
      <PuzzlePreview />
      <LeaderboardPreview />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
