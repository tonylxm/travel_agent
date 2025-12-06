"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="px-4 py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-y border-border">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">Ready to Explore the World?</h2>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Start planning your next adventure today. Create your first itinerary in minutes.
        </p>
        <div className="mt-8">
          <Link href="/planner">
            <Button size="lg" className="px-8">
              Plan Your Trip Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
