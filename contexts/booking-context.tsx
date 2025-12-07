"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface BookingContextType {
  // Selected flight
  selectedFlight: any | null
  setSelectedFlight: (flight: any | null) => void

  // User info (first-time fields)
  userInfo: {
    fullName: string
    dateOfBirth: string
    phoneNumber: string
    email: string
    passportCountry: string
  }
  setUserInfo: (info: Partial<BookingContextType["userInfo"]>) => void

  // Additional fields
  additionalInfo: {
    specialAssistance: string
  }
  setAdditionalInfo: (info: Partial<BookingContextType["additionalInfo"]>) => void

  // Booking reference (generated after payment)
  bookingRef: string | null
  setBookingRef: (ref: string | null) => void

  // Reset all booking data
  resetBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedFlight, setSelectedFlight] = useState<any | null>(null)
  const [userInfo, setUserInfoState] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    passportCountry: "",
  })
  const [additionalInfo, setAdditionalInfoState] = useState({
    specialAssistance: "",
  })
  const [bookingRef, setBookingRef] = useState<string | null>(null)

  const setUserInfo = (info: Partial<BookingContextType["userInfo"]>) => {
    setUserInfoState((prev) => ({ ...prev, ...info }))
  }

  const setAdditionalInfo = (info: Partial<BookingContextType["additionalInfo"]>) => {
    setAdditionalInfoState((prev) => ({ ...prev, ...info }))
  }

  const resetBooking = () => {
    setSelectedFlight(null)
    setUserInfoState({
      fullName: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      passportCountry: "",
    })
    setAdditionalInfoState({
      specialAssistance: "",
    })
    setBookingRef(null)
  }

  return (
    <BookingContext.Provider
      value={{
        selectedFlight,
        setSelectedFlight,
        userInfo,
        setUserInfo,
        additionalInfo,
        setAdditionalInfo,
        bookingRef,
        setBookingRef,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

