"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
          Plan Your Journey With <span className="text-primary">AI</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground text-balance sm:text-xl">
          Create personalized travel itineraries, discover flights, accommodation, and activities tailored to your
          preferences. All powered by intelligent recommendations.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/planner">
            <Button size="lg" className="w-full sm:w-auto">
              Start Planning
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 border-t border-border pt-12">
          <div>
            <p className="text-3xl font-bold text-primary">5000+</p>
            <p className="mt-2 text-sm text-muted-foreground">Trips Planned</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">50+</p>
            <p className="mt-2 text-sm text-muted-foreground">Countries</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">98%</p>
            <p className="mt-2 text-sm text-muted-foreground">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  )
}
