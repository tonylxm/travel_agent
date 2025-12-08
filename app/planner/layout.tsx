"use client"

import TripContext from "@/contexts/trip-context"
import { BookingProvider } from "@/contexts/booking-context"
import { useState } from "react"

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [tripData, setTripData] = useState<any>(null)

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      <BookingProvider>
        {children}
      </BookingProvider>
    </TripContext.Provider>
  )
}

