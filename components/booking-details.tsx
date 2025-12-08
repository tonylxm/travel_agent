"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, ArrowLeft, Calendar, Clock, MapPin, Plane } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"

interface BookingDetailsProps {
  onBack: () => void
  onViewItinerary: () => void
}

export default function BookingDetails({ onBack, onViewItinerary }: BookingDetailsProps) {
  const { bookingRef, userInfo, selectedFlight } = useBooking()

  // Extract flight details from selectedFlight
  const isPackage = selectedFlight?.segments && selectedFlight.segments.length > 0
  const cabin = selectedFlight?.cabin || "Economy"
  const totalPrice = selectedFlight?.price || 0

  // Calculate total with currency conversion (NZD)
  const totalPriceNZD = (totalPrice * 1.5).toFixed(2) // Rough conversion

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Success Header */}
      <div className="text-center space-y-2 pb-6 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground">Your Flight is Booked!</h1>
        <p className="text-lg font-semibold text-primary">Booking Ref: {bookingRef || "Q8F2LK"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passenger Information */}
        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Passenger</h2>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {userInfo.fullName || "William Tay"}
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              {userInfo.email && <p>Email: {userInfo.email}</p>}
              {userInfo.phoneNumber && <p>Phone: {userInfo.phoneNumber}</p>}
            </div>
          </div>
        </div>

        {/* Flight Information */}
        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Flight</h2>
          <div className="space-y-4">
            {isPackage && selectedFlight.segments ? (
              // Package with multiple segments
              selectedFlight.segments.map((segment: any, idx: number) => (
                <div key={idx} className={idx > 0 ? "pt-4 border-t border-border" : ""}>
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      {segment.airline || "Airline"} {segment.flightNumber || "N/A"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
                      {cabin}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground">
                      {segment.departure_airport?.name || segment.from || "N/A"} → {segment.arrival_airport?.name || segment.to || "N/A"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {segment.date || "N/A"} — {segment.departure_time || "N/A"} → {segment.arrival_time || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {formatDuration(segment.duration || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : selectedFlight?.flights && selectedFlight.flights.length > 0 ? (
              // Single destination with flights array
              selectedFlight.flights.map((flight: any, idx: number) => (
                <div key={idx} className={idx > 0 ? "pt-4 border-t border-border" : ""}>
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      {flight.airline || "Airline"} {flight.flightNumber || "N/A"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
                      {cabin}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground">
                      {flight.departure_airport?.name || "N/A"} → {flight.arrival_airport?.name || "N/A"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {flight.departure_date || "N/A"} — {flight.departure_time || "N/A"} → {flight.arrival_time || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {formatDuration(flight.duration || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback if no flight data
              <div className="text-muted-foreground">No flight details available</div>
            )}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Price</h2>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Paid:</span>
          <span className="text-2xl font-bold text-primary">NZD ${totalPriceNZD}</span>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="border border-border rounded-lg p-6 bg-card space-y-4">
        <h2 className="text-xl font-semibold text-foreground">What Happens Next</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">Your e-ticket has been sent to your email</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">You can check-in online 24 hours before departure</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">Bring your passport for verification</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => {}} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download E-Ticket (PDF)
        </Button>
        <Button onClick={onViewItinerary} className="flex-1" size="lg">
          View Itinerary
        </Button>
      </div>
    </div>
  )
}

