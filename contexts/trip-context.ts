import { createContext } from "react"
import type { ActivitiesResponse } from "@/lib/types/activities"
import type { Location } from "@/lib/types/location"

interface FlightPackage {
  price: number
  cabin?: "Economy" | "Business"
  segments: Array<{
    from: string
    to: string
    airline?: string
    flightNumber?: string
    date: string
    departure_time?: string
    arrival_time?: string
    price: number
    duration: number
    departure_airport: { name: string }
    arrival_airport: { name: string }
  }>
}

interface FlightsResponse {
  packages?: FlightPackage[]
  flights?: Array<{
    price: number
    cabin?: "Economy" | "Business"
    flights: Array<{
      airline?: string
      flightNumber?: string
      departure_airport: { name: string }
      arrival_airport: { name: string }
      departure_date?: string
      departure_time?: string
      arrival_date?: string
      arrival_time?: string
      duration: number
    }>
  }>
}

interface TripData {
  origin?: Location | null
  destinations?: Location[]
  startDate?: string
  endDate?: string
  budget?: number
  travelers?: number
  tripCategory?: string
  interests?: string[]
  additionalInformation?: string
  itinerary?: string
  activities?: ActivitiesResponse
  flights?: FlightsResponse
  departure_id?: string
  arrival_id?: string
  currency?: string
  tripName?: string
}

interface TripContextType {
  tripData: TripData | null
  setTripData: (data: TripData | null | ((prev: TripData | null) => TripData | null)) => void
}

const TripContext = createContext<TripContextType>({
  tripData: null,
  setTripData: () => {},
})

export default TripContext
export type { TripData }
