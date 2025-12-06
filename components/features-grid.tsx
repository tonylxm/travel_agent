"use client"

export default function FeaturesGrid() {
  const features = [
    {
      title: "Smart Itineraries",
      description: "AI-generated daily itineraries optimized for your preferences and time constraints.",
      icon: "📅",
    },
    {
      title: "Flight Search",
      description: "Compare prices across airlines and find the best deals for your journey.",
      icon: "✈️",
    },
    {
      title: "Accommodation",
      description: "Browse and book hotels, hostels, and unique stays tailored to your budget.",
      icon: "🏨",
    },
    {
      title: "Activities",
      description: "Discover local attractions, tours, and experiences curated for travelers.",
      icon: "🎯",
    },
    {
      title: "Budget Planning",
      description: "Track expenses and optimize spending across all components of your trip.",
      icon: "💰",
    },
    {
      title: "One-Click Booking",
      description: "Finalize your entire trip with seamless checkout and instant confirmation.",
      icon: "✓",
    },
  ]

  return (
    <section id="features" className="px-4 py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">Everything You Need to Travel</h2>
          <p className="mt-4 text-lg text-muted-foreground">Plan, book, and manage your entire trip in one platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
