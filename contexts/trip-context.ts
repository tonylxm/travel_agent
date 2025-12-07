import { createContext } from "react"
import type { ActivitiesResponse } from "@/lib/types/activities"

interface TripData {
  origin?: string
  destinations?: string[]
  startDate?: string
  endDate?: string
  budget?: number
  travelers?: number
  interests?: string[]
  activities?: ActivitiesResponse
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
