"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, ArrowLeft, Calendar, MapPin, Bed } from "lucide-react"
import { useAccommodation } from "@/contexts/accommodation-context"

interface AccommodationBookingDetailsProps {
  tripData?: {
    startDate?: string
    endDate?: string
    travelers?: number
  }
  onBack: () => void
  onViewItinerary: () => void
}

export default function AccommodationBookingDetails({ tripData, onBack, onViewItinerary }: AccommodationBookingDetailsProps) {
  const { bookingRef, selectedHotel, additionalInfo } = useAccommodation()

  // Calculate nights
  const nights = tripData?.startDate && tripData?.endDate
    ? Math.ceil(
        (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  const totalPrice = selectedHotel?.extracted_price && nights ? selectedHotel.extracted_price * nights : 0

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Success Header */}
      <div className="text-center space-y-2 pb-6 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground">Your Accommodation is Booked!</h1>
        <p className="text-lg font-semibold text-primary">Booking Ref: {bookingRef || "N/A"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hotel Information */}
        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Accommodation</h2>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {selectedHotel?.name || "N/A"}
            </p>
            {selectedHotel?.address && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{selectedHotel.address}</span>
              </div>
            )}
            {selectedHotel?.room_configuration && (
              <p className="text-sm text-muted-foreground">
                {selectedHotel.room_configuration}
              </p>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="border border-border rounded-lg p-6 bg-card space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Booking Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-medium text-foreground">{tripData?.startDate || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="font-medium text-foreground">{tripData?.endDate || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Rooms</p>
                <p className="font-medium text-foreground">{selectedHotel?.rooms || "N/A"}</p>
              </div>
            </div>
            {tripData?.travelers && (
              <div>
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="font-medium text-foreground">{tripData.travelers}</p>
              </div>
            )}
            {additionalInfo.specialRequests && (
              <div>
                <p className="text-sm text-muted-foreground">Special Requests</p>
                <p className="font-medium text-foreground">{additionalInfo.specialRequests}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Price</h2>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Paid:</span>
          <span className="text-2xl font-bold text-primary">${totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="border border-border rounded-lg p-6 bg-card space-y-4">
        <h2 className="text-xl font-semibold text-foreground">What Happens Next</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">Your booking confirmation has been sent to your email</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">You can check-in at the hotel reception on your arrival date</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">Bring a valid ID for verification</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => {}} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download Confirmation (PDF)
        </Button>
        <Button onClick={onViewItinerary} className="flex-1" size="lg">
          View Itinerary
        </Button>
      </div>
    </div>
  )
}

