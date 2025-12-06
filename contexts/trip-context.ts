import { createContext } from "react"

const TripContext = createContext({
  tripData: null,
  setTripData: () => {},
})

export default TripContext
