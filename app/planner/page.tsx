"use client"

import { useState } from "react"
import TripForm from "@/components/trip-form"
import TripContext from "@/contexts/trip-context"
import ItineraryView from "@/components/itinerary-view"

export default function PlannerPage() {
  const [tripData, setTripData] = useState(null)
  const [currentStep, setCurrentStep] = useState("form") // 'form' or 'view'

  const handleTripSubmit = (data) => {
    setTripData(data)
    setCurrentStep("view")
  }

  const handleNewTrip = () => {
    setTripData(null)
    setCurrentStep("form")
  }

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      <main className="min-h-screen bg-background">
        {currentStep === "form" ? (
          <TripForm onSubmit={handleTripSubmit} />
        ) : (
          <ItineraryView tripData={tripData} onNewTrip={handleNewTrip} />
        )}
      </main>
    </TripContext.Provider>
  )
}
