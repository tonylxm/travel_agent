"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"

interface BookingSuccessProps {
  onViewDetails: () => void
  onGoToItinerary: () => void
}

export default function BookingSuccess({ onViewDetails, onGoToItinerary }: BookingSuccessProps) {
  const { bookingRef } = useBooking()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/10 p-4">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Booking Successful!</h1>
        <p className="text-muted-foreground">Your flight has been confirmed</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button onClick={onViewDetails} size="lg" className="w-full md:w-auto">
          View Booking Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

