"use client"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import FeaturesGrid from "@/components/features-grid"
import CTASection from "@/components/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesGrid />
      <CTASection />
    </main>
  )
}
