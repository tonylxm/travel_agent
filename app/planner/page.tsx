"use client"

import { useRouter } from "next/navigation"
import { useContext } from "react"
import TripForm from "@/components/trip-form"
import TripContext from "@/contexts/trip-context"
import { getAirportCode } from "@/lib/utils/location"

export default function PlannerPage() {
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
    router.push("/planner/itinerary")
  }

  return (
    <main className="min-h-screen bg-background">
      <TripForm onSubmit={handleTripSubmit} />
    </main>
  )
}
