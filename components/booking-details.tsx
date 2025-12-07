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

  // Hardcoded flight details (matching what we used in booking form)
  const flightDetails = {
    airline: "Air New Zealand",
    flightNumber: "NZ89",
    departureAirport: "Auckland (AKL)",
    arrivalAirport: "Tokyo (NRT)",
    departureDate: "13 Jan 2025",
    departureTime: "10:05",
    arrivalDate: "14 Jan 2025",
    arrivalTime: "18:30",
    duration: "10h 25m",
    cabin: "Economy",
    price: selectedFlight?.price || 850,
  }

  // Calculate total with currency conversion (NZD)
  const totalPriceNZD = (flightDetails.price * 1.5).toFixed(2) // Rough conversion

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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">
                {flightDetails.airline} {flightDetails.flightNumber}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-foreground">
                {flightDetails.departureAirport} → {flightDetails.arrivalAirport}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {flightDetails.departureDate} — {flightDetails.departureTime} → {flightDetails.arrivalTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {flightDetails.duration}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Cabin: {flightDetails.cabin}</p>
            </div>
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

