"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, MapPin, Plane } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"
import { formatLocationForDisplay } from "@/lib/utils/format-location"

interface FlightDetailsProps {
  tripData?: {
    startDate?: string
    endDate?: string
    origin?: any
    destinations?: any[]
  }
  onBack: () => void
  onBookWithAI: () => void
}

export default function FlightDetails({ tripData, onBack, onBookWithAI }: FlightDetailsProps) {
  const { selectedFlight } = useBooking()

  if (!selectedFlight) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flights
        </Button>
        <p className="text-muted-foreground">No flight selected</p>
      </div>
    )
  }

  // Check if it's a package (multi-destination) or single flight
  const isPackage = selectedFlight.segments && selectedFlight.segments.length > 0
  const cabin = selectedFlight.cabin || "Economy"
  const totalPrice = selectedFlight.price || 0

  // For single destination flights
  if (!isPackage && selectedFlight.flights && selectedFlight.flights.length > 0) {
    const firstFlight = selectedFlight.flights[0]
    const totalDuration = selectedFlight.flights.reduce(
      (sum: number, flight: any) => sum + (flight.duration || 0),
      0
    )

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flights
        </Button>

        {/* Flight Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Flight Details</h1>
            <p className="text-muted-foreground">Review your selected flight before booking</p>
          </div>
        </div>

        {/* Flight Information Card */}
        <div className="border border-border rounded-lg p-6 bg-card space-y-6">
          {/* Flight Route */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Plane className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  {firstFlight.airline || "Airline"} {firstFlight.flightNumber || "N/A"}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                  cabin === "Business" 
                    ? "bg-purple-500 text-white" 
                    : "bg-green-500 text-white"
                }`}>
                  {cabin}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {firstFlight.departure_airport?.name || "N/A"}
                  </span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {firstFlight.arrival_airport?.name || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Departure</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {firstFlight.departure_date || "N/A"} at {firstFlight.departure_time || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                {firstFlight.departure_airport?.name || "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Arrival</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {firstFlight.arrival_date || "N/A"} at {firstFlight.arrival_time || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                {firstFlight.arrival_airport?.name || "N/A"}
              </p>
            </div>
          </div>

          {/* Flight Duration */}
          <div className="flex items-center gap-2 pt-4 border-t border-border">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Duration:</span>
            <span className="font-medium text-foreground">
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </span>
          </div>

          {/* Price */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Price</span>
              <span className="text-2xl font-bold text-primary">${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Flights
          </Button>
          <Button onClick={onBookWithAI} className="flex-1" size="lg">
            Book with AI Agent
          </Button>
        </div>
      </div>
    )
  }

  // For multi-destination packages
  if (isPackage && selectedFlight.segments) {
    const segments = selectedFlight.segments
    const firstSegment = segments[0]
    const lastSegment = segments[segments.length - 1]
    const totalDuration = segments.reduce((sum: number, seg: any) => sum + (seg.duration || 0), 0)
    
    // Get origin from tripData or first segment
    const origin = tripData?.origin 
      ? formatLocationForDisplay(tripData.origin)
      : (firstSegment.departure_airport?.name || firstSegment.from || "N/A")
    
    // Build destinations list
    const destinations: string[] = []
    segments.forEach((seg: any) => {
      const dest = seg.arrival_airport?.name || seg.to
      if (dest && !destinations.includes(dest)) {
        destinations.push(dest)
      }
    })

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flights
        </Button>

        {/* Flight Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Flight Package Details</h1>
            <p className="text-muted-foreground">Review your selected flight package before booking</p>
          </div>
        </div>

        {/* Overall Journey Summary */}
        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Plane className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Overall Journey</span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
              cabin === "Business" 
                ? "bg-purple-500 text-white" 
                : "bg-green-500 text-white"
            }`}>
              {cabin}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{origin}</span>
            </div>
            {destinations.map((dest, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-muted-foreground">→</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{dest}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Duration:</span>
            <span className="font-medium text-foreground">
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </span>
          </div>
        </div>

        {/* Flight Segments */}
        <div className="border border-border rounded-lg p-6 bg-card space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Flight Segments</h2>
          {segments.map((segment: any, idx: number) => (
            <div key={idx} className="space-y-4">
              {idx > 0 && <div className="border-t border-border pt-4" />}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Plane className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">
                    {segment.airline || "Airline"} {segment.flightNumber || "N/A"}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                    cabin === "Business" 
                      ? "bg-purple-500 text-white" 
                      : "bg-green-500 text-white"
                  }`}>
                    {cabin}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {segment.departure_airport?.name || segment.from || "N/A"}
                    </span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {segment.arrival_airport?.name || segment.to || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Segment Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Departure</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {segment.date || "N/A"} at {segment.departure_time || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Duration: {Math.floor((segment.duration || 0) / 60)}h {(segment.duration || 0) % 60}m
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Arrival</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {segment.date || "N/A"} at {segment.arrival_time || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">${segment.price || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Price */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Package Price</span>
            <span className="text-2xl font-bold text-primary">
              ${segments.reduce((sum: number, seg: any) => sum + (seg.price || 0), 0)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Flights
          </Button>
          <Button onClick={onBookWithAI} className="flex-1" size="lg">
            Book with AI Agent
          </Button>
        </div>
      </div>
    )
  }

  // Fallback if no valid flight data
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Flights
      </Button>
      <p className="text-muted-foreground">Invalid flight data</p>
    </div>
  )
}
