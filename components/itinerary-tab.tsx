"use client"

import { useState, useEffect, useRef } from "react"
import { formatLocationsForDisplay } from "@/lib/utils/format-location"
import { Button } from "@/components/ui/button"
import TripContext from "@/contexts/trip-context"
import { useContext } from "react"
import { RotateCcw, ArrowRight, FileText } from "lucide-react"
import { parseItinerary, type ParsedItinerary, type Activity, type Day } from "@/lib/utils/itinerary-parser"
import ItineraryMap from "@/components/itinerary-map"
import EditableItinerary from "@/components/editable-itinerary"
import WeeklyOverview from "@/components/weekly-overview"
import { useRouter } from "next/navigation"

export default function ItineraryTab({ tripData }: { tripData: any }) {
  const { setTripData } = useContext(TripContext)
  const router = useRouter()
  const [editedItinerary, setEditedItinerary] = useState(tripData?.itinerary || "")
  const [parsedItinerary, setParsedItinerary] = useState<ParsedItinerary | null>(null)
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>()
  const [showRawText, setShowRawText] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const destinationsFormatted = formatLocationsForDisplay(tripData?.destinations)

  // Parse itinerary when it changes
  useEffect(() => {
    if (editedItinerary && tripData?.startDate) {
      try {
        const parsed = parseItinerary(editedItinerary, tripData.startDate)
        setParsedItinerary(parsed)
      } catch (error) {
        console.error("Error parsing itinerary:", error)
      }
    }
  }, [editedItinerary, tripData?.startDate])

  // Update local state when tripData.itinerary changes
  useEffect(() => {
    setEditedItinerary(tripData?.itinerary || "")
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
  }

  const handleSave = () => {
    setTripData((prev: any) => ({
      ...prev,
      itinerary: editedItinerary,
    }))
  }

  const handleReset = () => {
    setEditedItinerary(tripData?.itinerary || "")
  }

  const handleRegenerate = () => {
    // Non-functional for now
    console.log("Regenerate clicked")
  }

  const handleContinueToBooking = () => {
    router.push("/summary")
  }

  const handleActivityUpdate = (activityId: string, updates: Partial<Activity>) => {
    if (!parsedItinerary) return

    const updatedDays = parsedItinerary.days.map((day) => ({
      ...day,
      activities: day.activities.map((activity) =>
        activity.id === activityId ? { ...activity, ...updates } : activity
      ),
    }))

    setParsedItinerary({ days: updatedDays })
    // TODO: Optionally regenerate text itinerary from parsed data
  }

  const handleActivityReorder = (dayNumber: number, fromIndex: number, toIndex: number) => {
    if (!parsedItinerary) return

    const updatedDays = parsedItinerary.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        const activities = [...day.activities]
        const [moved] = activities.splice(fromIndex, 1)
        activities.splice(toIndex, 0, moved)
        return { ...day, activities }
      }
      return day
    })

    setParsedItinerary({ days: updatedDays })
  }

  const handleActivityMoveToDay = (activityId: string, fromDay: number, toDay: number, toIndex: number) => {
    if (!parsedItinerary) return

    let activityToMove: Activity | null = null
    const updatedDays = parsedItinerary.days.map((day) => {
      if (day.dayNumber === fromDay) {
        const activities = day.activities.filter((a) => {
          if (a.id === activityId) {
            activityToMove = a
            return false
          }
          return true
        })
        return { ...day, activities }
      }
      if (day.dayNumber === toDay && activityToMove) {
        const activities = [...day.activities]
        activities.splice(toIndex, 0, activityToMove)
        return { ...day, activities }
      }
      return day
    })

    if (activityToMove) {
      setParsedItinerary({ days: updatedDays })
    }
  }

  // Calculate trip duration
  const getTripDuration = () => {
    if (!tripData?.startDate || !tripData?.endDate) return ""
    try {
      const start = new Date(tripData.startDate)
      const end = new Date(tripData.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return `${diffDays} days`
    } catch {
      return ""
    }
  }

  // Format date range
  const getDateRange = () => {
    if (!tripData?.startDate || !tripData?.endDate) return ""
    try {
      const start = new Date(tripData.startDate)
      const end = new Date(tripData.endDate)
      const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      return `${startStr}–${endStr}`
    } catch {
      return `${tripData?.startDate} to ${tripData?.endDate}`
    }
  }

  // Get trip title - use tripName from tripData, or default to "Tokyo Winter Wonderland"
  const getTripTitle = () => {
    return tripData?.tripName || "Tokyo Winter Wonderland"
  }

  // If no itinerary, show placeholder
  if (!editedItinerary) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">Your itinerary will appear here after generation.</p>
        </div>
      </div>
    )
  }

  // If showing raw text view
  if (showRawText) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Your Itinerary (Raw Text)</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowRawText(false)}>
              Back to Visual View
            </Button>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={editedItinerary}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-background p-4 text-sm leading-6 text-foreground resize-none"
          style={{ minHeight: "400px" }}
          placeholder="Your itinerary will appear here..."
        />
      </div>
    )
  }

  // Main visual view
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Trip Title and Details */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{getTripTitle()}</h1>
          <p className="text-base text-muted-foreground">
            {getTripDuration()} • {getDateRange()} • {tripData?.travelers || 1} {tripData?.travelers === 1 ? "traveler" : "travelers"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenerate} className="rounded-full">
            <RotateCcw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
          <Button size="sm" onClick={handleContinueToBooking} className="bg-blue-500 hover:bg-blue-600 text-white">
            Continue to Booking
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Main content: Map and Itinerary side by side */}
      {parsedItinerary && parsedItinerary.days.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Left: Map */}
            <div className="h-full min-h-[500px]">
              <ItineraryMap
                days={parsedItinerary.days}
                selectedActivityId={selectedActivityId}
                onActivityClick={setSelectedActivityId}
              />
            </div>

            {/* Right: Editable Itinerary */}
            <div className="h-full min-h-[500px] border border-gray-200 dark:border-border rounded-lg p-6 bg-white dark:bg-card overflow-hidden shadow-sm">
              <EditableItinerary
                days={parsedItinerary.days}
                selectedActivityId={selectedActivityId}
                onActivityClick={setSelectedActivityId}
                onActivityUpdate={handleActivityUpdate}
                onActivityReorder={handleActivityReorder}
                onActivityMoveToDay={handleActivityMoveToDay}
              />
            </div>
          </div>

          {/* Bottom: Weekly Overview */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <WeeklyOverview
              days={parsedItinerary.days}
              startDate={tripData?.startDate}
              onActivityClick={setSelectedActivityId}
            />
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">Parsing itinerary...</p>
        </div>
      )}
    </div>
  )
}
