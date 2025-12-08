"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface AccommodationContextType {
  // Selected hotel
  selectedHotel: any | null
  setSelectedHotel: (hotel: any | null) => void

  // Additional fields
  additionalInfo: {
    specialRequests: string
  }
  setAdditionalInfo: (info: Partial<AccommodationContextType["additionalInfo"]>) => void

  // Booking reference (generated after payment)
  bookingRef: string | null
  setBookingRef: (ref: string | null) => void

  // Reset all booking data
  resetBooking: () => void
}

const AccommodationContext = createContext<AccommodationContextType | undefined>(undefined)

export function AccommodationProvider({ children }: { children: ReactNode }) {
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null)
  const [additionalInfo, setAdditionalInfoState] = useState({
    specialRequests: "",
  })
  const [bookingRef, setBookingRef] = useState<string | null>(null)

  const setAdditionalInfo = (info: Partial<AccommodationContextType["additionalInfo"]>) => {
    setAdditionalInfoState((prev) => ({ ...prev, ...info }))
  }

  const resetBooking = () => {
    setSelectedHotel(null)
    setAdditionalInfoState({
      specialRequests: "",
    })
    setBookingRef(null)
  }

  return (
    <AccommodationContext.Provider
      value={{
        selectedHotel,
        setSelectedHotel,
        additionalInfo,
        setAdditionalInfo,
        bookingRef,
        setBookingRef,
        resetBooking,
      }}
    >
      {children}
    </AccommodationContext.Provider>
  )
}

export function useAccommodation() {
  const context = useContext(AccommodationContext)
  if (context === undefined) {
    throw new Error("useAccommodation must be used within an AccommodationProvider")
  }
  return context
}

