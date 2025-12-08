"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"

interface BookingFormProps {
  tripData?: {
    startDate?: string
    endDate?: string
  }
  onBack: () => void
  onContinue: () => void
}

export default function BookingForm({ tripData, onBack, onContinue }: BookingFormProps) {
  const { userInfo, setUserInfo, additionalInfo, setAdditionalInfo, selectedFlight } = useBooking()
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [fieldUpdates, setFieldUpdates] = useState<Record<string, boolean>>({})
  const [validationError, setValidationError] = useState<string | null>(null)

  // Check if this is first time (all fields empty)
  const isFirstTime = !Object.values(userInfo).some((val) => val.trim() !== "")

  const handleFieldChange = (field: string, value: string) => {
    if (field.startsWith("additional_")) {
      const key = field.replace("additional_", "") as keyof typeof additionalInfo
      setAdditionalInfo({ [key]: value })
    } else {
      setUserInfo({ [field]: value })
    }

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
    
    // If not showing additional fields yet, validate and show them
    if (!showAdditionalFields) {
      // Validate all first-time fields are filled
      const allFieldsFilled = 
        userInfo.fullName.trim() !== "" &&
        userInfo.dateOfBirth.trim() !== "" &&
        userInfo.phoneNumber.trim() !== "" &&
        userInfo.email.trim() !== "" &&
        userInfo.passportCountry.trim() !== ""
      
      if (allFieldsFilled) {
        setShowAdditionalFields(true)
        // Scroll to top to show additional fields
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      } else {
        setValidationError("Please fill in all required fields before continuing.")
        return
      }
    }
    
    // If showing additional fields, proceed to checkout (special assistance is optional)
    if (showAdditionalFields) {
      onContinue()
      return
    }
  }

  // Extract flight details from selectedFlight
  const isPackage = selectedFlight?.segments && selectedFlight.segments.length > 0
  const cabin = selectedFlight?.cabin || "Economy"
  
  // Get first flight/segment for display
  let displayFlight: any = null
  if (isPackage && selectedFlight?.segments?.[0]) {
    displayFlight = selectedFlight.segments[0]
  } else if (selectedFlight?.flights?.[0]) {
    displayFlight = selectedFlight.flights[0]
  }
  
  // Format flight details for display
  const flightDetails = displayFlight ? {
    airline: displayFlight.airline || "Airline",
    flightNumber: displayFlight.flightNumber || "N/A",
    departureAirport: displayFlight.departure_airport?.name || displayFlight.from || "N/A",
    arrivalAirport: displayFlight.arrival_airport?.name || displayFlight.to || "N/A",
    departureDate: displayFlight.date || displayFlight.departure_date || "N/A",
    departureTime: displayFlight.departure_time || "N/A",
    arrivalDate: displayFlight.date || displayFlight.arrival_date || "N/A",
    arrivalTime: displayFlight.arrival_time || "N/A",
    duration: displayFlight.duration 
      ? `${Math.floor(displayFlight.duration / 60)}h ${displayFlight.duration % 60}m`
      : "N/A",
    cabin: cabin,
  } : {
    airline: "N/A",
    flightNumber: "N/A",
    departureAirport: "N/A",
    arrivalAirport: "N/A",
    departureDate: "N/A",
    departureTime: "N/A",
    arrivalDate: "N/A",
    arrivalTime: "N/A",
    duration: "N/A",
    cabin: cabin,
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Booking Details</h1>
        {showAdditionalFields ? (
          <p className="text-muted-foreground">
            This flight requires some additional information. Please complete the fields below.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Thanks for planning your trip with us. As a first-time user, we'll need you to provide this essential
            information. We'll remember everything you give us so you don't have to provide it next time.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flight Details (Read-only) */}
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <h2 className="font-semibold text-foreground mb-3">Flight Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Flight:</span>
              <p className="font-medium text-foreground">
                {flightDetails.airline} {flightDetails.flightNumber}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Cabin:</span>
              <p className="font-medium text-foreground">{flightDetails.cabin}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Departure:</span>
              <p className="font-medium text-foreground">
                {flightDetails.departureDate} at {flightDetails.departureTime}
              </p>
              <p className="text-xs text-muted-foreground">{flightDetails.departureAirport}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Arrival:</span>
              <p className="font-medium text-foreground">
                {flightDetails.arrivalDate} at {flightDetails.arrivalTime}
              </p>
              <p className="text-xs text-muted-foreground">{flightDetails.arrivalAirport}</p>
            </div>
          </div>
        </div>

        {/* First-time User Fields */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Passenger Information</h2>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
            <Input
              value={userInfo.fullName}
              onChange={(e) => handleFieldChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              required
            />
            {!userInfo.fullName && (
              <p className="text-xs text-muted-foreground mt-1">
                We don't have this information yet — we'll remember it for next time.
              </p>
            )}
            {fieldUpdates.fullName && userInfo.fullName && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Updated — we'll remember this.
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date of Birth *</label>
            <Input
              type="date"
              value={userInfo.dateOfBirth}
              onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
              required
            />
            {!userInfo.dateOfBirth && (
              <p className="text-xs text-muted-foreground mt-1">
                We don't have this information yet — we'll remember it for next time.
              </p>
            )}
            {fieldUpdates.dateOfBirth && userInfo.dateOfBirth && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Updated — we'll remember this.
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
            <Input
              type="tel"
              value={userInfo.phoneNumber}
              onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
              placeholder="+1 234 567 8900"
              required
            />
            {!userInfo.phoneNumber && (
              <p className="text-xs text-muted-foreground mt-1">
                We don't have this information yet — we'll remember it for next time.
              </p>
            )}
            {fieldUpdates.phoneNumber && userInfo.phoneNumber && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Updated — we'll remember this.
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
            <Input
              type="email"
              value={userInfo.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="your.email@example.com"
              required
            />
            {!userInfo.email && (
              <p className="text-xs text-muted-foreground mt-1">
                We don't have this information yet — we'll remember it for next time.
              </p>
            )}
            {fieldUpdates.email && userInfo.email && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Updated — we'll remember this.
              </p>
            )}
          </div>

          {/* Passport Country */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Passport Country *</label>
            <Input
              value={userInfo.passportCountry}
              onChange={(e) => handleFieldChange("passportCountry", e.target.value)}
              placeholder="Enter your passport country"
              required
            />
            {!userInfo.passportCountry && (
              <p className="text-xs text-muted-foreground mt-1">
                We don't have this information yet — we'll remember it for next time.
              </p>
            )}
            {fieldUpdates.passportCountry && userInfo.passportCountry && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Updated — we'll remember this.
              </p>
            )}
          </div>
        </div>

        {/* Additional Fields (shown after first-time fields are filled) */}
        {showAdditionalFields && (
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-xl font-semibold text-foreground">Additional Information</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Do you need special assistance? If yes, explain what you will need
              </label>
              <textarea
                value={additionalInfo.specialAssistance}
                onChange={(e) => handleFieldChange("additional_specialAssistance", e.target.value)}
                placeholder="Enter any special assistance requirements (optional)"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground min-h-[100px] resize-y"
              />
              {!additionalInfo.specialAssistance && (
                <p className="text-xs text-muted-foreground mt-1">
                  We don't have this information yet — we'll remember it for next time.
                </p>
              )}
              {fieldUpdates.additional_specialAssistance && additionalInfo.specialAssistance && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Updated — we'll remember this.
                </p>
              )}
            </div>
          </div>
        )}

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
            {showAdditionalFields ? "Confirm Booking" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}

