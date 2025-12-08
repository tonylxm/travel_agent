"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          {/* Headline - White Serif Font */}
          <h1 className="text-4xl font-serif tracking-tight text-white sm:text-5xl lg:text-7xl text-balance font-bold leading-tight drop-shadow-lg">
            The Ultimate All-In-One AI-Powered Travel Planner
          </h1>
          
          {/* Sub-headline - White Serif */}
          <p className="mt-6 text-lg text-white text-balance sm:text-xl font-serif drop-shadow-md">
            Create personalized travel itineraries, and get activities tailored to your preferences.
            Book the best flights and accommodation automatically with agentic AI.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planner">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-lg px-8 font-serif"
              >
                Start Planning
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-lg px-8 font-serif"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Section - Bottom of Section */}
        <div className="mt-auto mx-auto max-w-5xl w-full px-4 pb-8">
          <div className="rounded-lg p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-700/50 rounded-lg p-4 sm:p-6 text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white font-['Lustria']">5K+</p> 
                <p className="mt-2 text-sm text-white/80 font-serif">Trips Planned</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 sm:p-6 text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white font-['Lustria']">50+</p>
                <p className="mt-2 text-sm text-white/80 font-serif">Countries Explored</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 sm:p-6 text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white font-['Lustria']">98%</p>
                <p className="mt-2 text-sm text-white/80 font-serif">User Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
