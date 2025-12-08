"use client"

import { useRouter } from "next/navigation"
import { useContext } from "react"
import TripForm from "@/components/trip-form"
import TripContext from "@/contexts/trip-context"
import ItineraryView from "@/components/itinerary-view"
import { getAirportCode } from "@/lib/utils/location"

export default function ItineraryPage() {
  const router = useRouter()
  const { tripData, setTripData } = useContext(TripContext)

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

  const handleNewTrip = () => {
    setTripData(null)
    router.push("/")
  }

  // If no trip data, show form
  if (!tripData) {
    return (
      <main className="min-h-screen bg-background">
        <TripForm onSubmit={handleTripSubmit} />
      </main>
    )
  }

  // Show itinerary view with tabs
  return (
    <main className="min-h-screen bg-background">
      <ItineraryView tripData={tripData} onNewTrip={handleNewTrip} />
    </main>
  )
}

