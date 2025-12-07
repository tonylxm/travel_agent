"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, MapPin, Plane } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"

interface FlightDetailsProps {
  tripData?: {
    startDate?: string
    endDate?: string
  }
  onBack: () => void
  onBookWithAI: () => void
}

export default function FlightDetails({ tripData, onBack, onBookWithAI }: FlightDetailsProps) {
  const { selectedFlight } = useBooking()

  // Hardcoded flight details (based on selected flight)
  // In a real app, these would come from the selected flight data
  const flightDetails = {
    airline: "Air New Zealand",
    flightNumber: "NZ89",
    departureAirport: "Auckland (AKL)",
    arrivalAirport: "Tokyo (NRT)",
    departureDate: "2025-01-13",
    departureTime: "10:05",
    arrivalDate: "2025-01-14",
    arrivalTime: "18:30",
    duration: "10h 25m",
    cabin: "Economy",
    price: selectedFlight?.price || 850,
  }

  // Calculate total duration from flight path if available
  let totalDuration = "10h 25m"
  if (selectedFlight?.flights) {
    const totalMinutes = selectedFlight.flights.reduce(
      (sum: number, flight: any) => sum + flight.duration,
      0
    )
    totalDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
  }

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
            <div className="flex items-center gap-2 mb-2">
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">
                {flightDetails.airline} {flightDetails.flightNumber}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
                {flightDetails.cabin}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{flightDetails.departureAirport}</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{flightDetails.arrivalAirport}</span>
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
              {flightDetails.departureDate} at {flightDetails.departureTime}
            </p>
            <p className="text-sm text-muted-foreground">{flightDetails.departureAirport}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Arrival</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {flightDetails.arrivalDate} at {flightDetails.arrivalTime}
            </p>
            <p className="text-sm text-muted-foreground">{flightDetails.arrivalAirport}</p>
          </div>
        </div>

        {/* Flight Duration */}
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Duration:</span>
          <span className="font-medium text-foreground">{totalDuration}</span>
        </div>

        {/* Multi-leg flights */}
        {selectedFlight?.flights && selectedFlight.flights.length > 1 && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">Flight Segments:</p>
            <div className="space-y-3">
              {selectedFlight.flights.map((flight: any, idx: number) => (
                <div key={idx} className="pl-4 border-l-2 border-primary/20">
                  <p className="text-sm text-foreground">
                    {flight.departure_airport.name} → {flight.arrival_airport.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Duration: {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Price</span>
            <span className="text-2xl font-bold text-primary">${flightDetails.price}</span>
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

