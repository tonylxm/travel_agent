"use client"

import { useState } from "react"
import TripContext from "@/contexts/trip-context"
import { BookingProvider } from "@/contexts/booking-context"
import { AccommodationProvider } from "@/contexts/accommodation-context"
import ConditionalNavbar from "@/components/conditional-navbar"

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [tripData, setTripData] = useState<any>(null)

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      <BookingProvider>
        <AccommodationProvider>
          <ConditionalNavbar />
          {children}
        </AccommodationProvider>
      </BookingProvider>
    </TripContext.Provider>
  )
}

