"use client"
import HeroSection from "@/components/hero-section"
import FeaturesGrid from "@/components/features-grid"
import CTASection from "@/components/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesGrid />
      <CTASection />
    </main>
  )
}
