"use client"

import { useState, useEffect, useRef } from "react"
import { formatLocationsForDisplay } from "@/lib/utils/format-location"
import { Button } from "@/components/ui/button"
import TripContext from "@/contexts/trip-context"
import { useContext } from "react"
import { CheckCircle2, RotateCcw } from "lucide-react"

export default function ItineraryTab({ tripData }: { tripData: any }) {
  const { setTripData } = useContext(TripContext)
  const [editedItinerary, setEditedItinerary] = useState(tripData?.itinerary || "")
  const [isSaved, setIsSaved] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const destinationsFormatted = formatLocationsForDisplay(tripData?.destinations)

  // Update local state when tripData.itinerary changes
  useEffect(() => {
    setEditedItinerary(tripData?.itinerary || "")
    setIsSaved(true)
    setHasChanges(false)
  }, [tripData?.itinerary])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [editedItinerary])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setEditedItinerary(newValue)
    setHasChanges(newValue !== (tripData?.itinerary || ""))
    setIsSaved(false)
  }

  const handleSave = () => {
    setTripData((prev: any) => ({
      ...prev,
      itinerary: editedItinerary,
    }))
    setIsSaved(true)
    setHasChanges(false)
  }

  const handleReset = () => {
    setEditedItinerary(tripData?.itinerary || "")
    setIsSaved(true)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Your Itinerary</h2>
          {hasChanges && (
            <div className="flex items-center gap-2">
              {isSaved ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Saved</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-muted-foreground mb-6">
          AI-generated day-by-day itinerary for your trip to {destinationsFormatted.join(", ")}. You can edit it below.
        </p>

        {editedItinerary ? (
          <textarea
            ref={textareaRef}
            value={editedItinerary}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background p-4 text-sm leading-6 text-foreground resize-none overflow-hidden"
            style={{ minHeight: "200px" }}
            placeholder="Your itinerary will appear here..."
          />
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Your itinerary will appear here after generation.
          </div>
        )}
      </div>
    </div>
  )
}
