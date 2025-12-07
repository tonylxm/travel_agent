"use client"

export default function FeaturesGrid() {
  const features = [
    {
      title: "Smart Itineraries",
      description: "AI generated daily itineraries. optimized for your preferences time constraints.",
      icon: "📅",
      iconColor: "text-purple-500",
    },
    {
      title: "Flight Search",
      description: "Compare prices across airlines and find the best deals for your journey.",
      icon: "✈️",
      iconColor: "text-blue-400",
    },
    {
      title: "Accommodation",
      description: "Browse and book hotels, hostels, and unique stays tailored for your budget.",
      icon: "🏨",
      iconColor: "text-red-500",
    },
    {
      title: "Activities",
      description: "Discover local attractions, tours, and experiences curated for travelers.",
      icon: "🎯",
      iconColor: "text-pink-500",
    },
    {
      title: "Budget Planning",
      description: "Track expenses and optimize spending across all components of your trip.",
      icon: "💰",
      iconColor: "text-yellow-500",
    },
    {
      title: "One-Click Booking",
      description: "Finalize your entire trip with seamless checkout and instant confirmation.",
      icon: "✓",
      iconColor: "text-white",
    },
  ]

  return (
    <section id="features" className="relative overflow-hidden px-4 py-20 sm:py-28">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-balance font-serif drop-shadow-lg">
            Everything You Need to Travel
          </h2>
          <p className="mt-4 text-lg text-white font-sans drop-shadow-md">
            Plan, book, and manage your entire trip in one platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="rounded-lg p-6 backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30 transition-all"
            >
              <div className={`text-4xl mb-4 ${feature.iconColor}`}>{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white font-serif">{feature.title}</h3>
              <p className="mt-2 text-sm text-white/90 font-sans">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
