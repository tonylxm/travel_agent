"use client"

import { useRouter } from "next/navigation"
import { useContext } from "react"
import TripForm from "@/components/trip-form"
import TripContext from "@/contexts/trip-context"
import { getAirportCode } from "@/lib/utils/location"

export default function Home() {
  const router = useRouter()
  const { setTripData } = useContext(TripContext)

  const handleTripSubmit = async (data: any) => {
    const originCode = data.origin ? getAirportCode(data.origin) : null
    const arrivalCode = data.destinations?.[0] ? getAirportCode(data.destinations[0]) : null

    data.arrival_id = arrivalCode
    data.departure_id = originCode
    data.currency = "USD"
    data.tripName = "Tokyo Winter Wonderland" // Initialize with default trip name

    setTripData(data)
    // Redirect to itinerary tab after trip is created
    router.push("/itinerary")
  }

  return (
    <main className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
        }}
      />
      <div className="fixed inset-0 z-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10">
        <TripForm onSubmit={handleTripSubmit} />
      </div>
    </main>
  )
}
