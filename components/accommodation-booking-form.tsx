"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useAccommodation } from "@/contexts/accommodation-context"

interface AccommodationBookingFormProps {
  tripData?: {
    startDate?: string
    endDate?: string
  }
  onBack: () => void
  onContinue: () => void
}

export default function AccommodationBookingForm({ tripData, onBack, onContinue }: AccommodationBookingFormProps) {
  const { additionalInfo, setAdditionalInfo, selectedHotel } = useAccommodation()
  const [fieldUpdates, setFieldUpdates] = useState<Record<string, boolean>>({})
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleFieldChange = (field: string, value: string) => {
    setAdditionalInfo({ [field]: value })

    // Show update message if field becomes non-empty
    if (value.trim() !== "") {
      setFieldUpdates((prev) => ({ ...prev, [field]: true }))
      // Hide message after 3 seconds
      setTimeout(() => {
        setFieldUpdates((prev) => ({ ...prev, [field]: false }))
      }, 3000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // Special requests is required
    if (!additionalInfo.specialRequests || additionalInfo.specialRequests.trim() === "") {
      setValidationError("Please answer the special requests question. Enter 'None' if you have no special requests.")
      return
    }

    onContinue()
  }

  // Calculate nights
  const nights = tripData?.startDate && tripData?.endDate
    ? Math.ceil(
        (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  const totalPrice = selectedHotel?.extracted_price && nights ? selectedHotel.extracted_price * nights : null

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Additional Information Required</h1>
        <p className="text-muted-foreground">
          The accommodation booking form requires additional information. Please complete the fields below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hotel Details (Read-only) */}
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <h2 className="font-semibold text-foreground mb-3">Accommodation Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Hotel:</span>
              <p className="font-medium text-foreground">
                {selectedHotel?.name || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Rooms:</span>
              <p className="font-medium text-foreground">{selectedHotel?.rooms || "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Check-in:</span>
              <p className="font-medium text-foreground">
                {tripData?.startDate || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Check-out:</span>
              <p className="font-medium text-foreground">
                {tripData?.endDate || "N/A"}
              </p>
            </div>
            {totalPrice && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Total Price:</span>
                <p className="font-medium text-foreground">${totalPrice.toLocaleString()} for {nights} {nights === 1 ? "night" : "nights"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Additional Information Required</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Do you have any special requests for your stay? (e.g., early check-in, late check-out, room preferences) *
            </label>
            <textarea
              value={additionalInfo.specialRequests}
              onChange={(e) => handleFieldChange("specialRequests", e.target.value)}
              placeholder='Enter "None" if no special requests'
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground min-h-[100px] resize-y"
            />
            {!additionalInfo.specialRequests && (
              <p className="text-xs text-muted-foreground mt-1">
                We don't have this information yet — we'll remember it for next time.
              </p>
            )}
            {fieldUpdates.specialRequests && additionalInfo.specialRequests && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Updated — we'll remember this.
              </p>
            )}
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">{validationError}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} type="button" className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1" size="lg">
            Confirm Booking
          </Button>
        </div>
      </form>
    </div>
  )
}

