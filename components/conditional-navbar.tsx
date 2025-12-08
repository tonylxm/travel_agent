"use client"

import { usePathname } from "next/navigation"
import { useContext } from "react"
import TripContext from "@/contexts/trip-context"
import Navbar from "@/components/navbar"

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const { tripData } = useContext(TripContext)

  // Hide navbar on landing page (/) or if no trip data
  if (pathname === "/" || !tripData) {
    return null
  }

  return <Navbar />
}

