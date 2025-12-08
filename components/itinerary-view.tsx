"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useContext } from "react"
import TripContext from "@/contexts/trip-context"
import ItineraryTab from "@/components/itinerary-tab"
import FlightsTab from "@/components/flights-tab"
import AccommodationTab from "@/components/accommodation-tab"
import ActivitiesTab from "@/components/activities-tab"
import SummaryTab from "@/components/summary-tab"
import { Edit2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ItineraryView({ tripData, onNewTrip }: { tripData: any; onNewTrip: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { setTripData } = useContext(TripContext)
  
  // Determine active tab from pathname or default to itinerary
  const getActiveTabFromPath = () => {
    if (pathname === "/itinerary") return "itinerary"
    if (pathname === "/flights") return "flights"
    if (pathname === "/accommodation") return "accommodation"
    if (pathname === "/activities") return "activities"
    if (pathname === "/summary") return "summary"
    return "itinerary"
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath())
  const [isEditingTripName, setIsEditingTripName] = useState(false)
  const [editedTripName, setEditedTripName] = useState("")
  
  // Initialize trip name if not set
  useEffect(() => {
    if (tripData && !tripData.tripName) {
      setTripData((prev: any) => ({
        ...prev,
        tripName: "Tokyo Winter Wonderland",
      }))
    }
  }, [tripData, setTripData])
  
  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath())
  }, [pathname])
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    router.push(`/${tabId === "summary" ? "summary" : tabId}`)
  }

  const tabs = [
    { id: "itinerary", label: "Itinerary", component: ItineraryTab },
    { id: "flights", label: "Flights", component: FlightsTab },
    { id: "accommodation", label: "Accommodation", component: AccommodationTab },
    { id: "activities", label: "Activities", component: ActivitiesTab },
    { id: "summary", label: "Summary", component: SummaryTab },
  ]

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || ItineraryTab

  const tripName = tripData?.tripName || "Tokyo Winter Wonderland"

  const handleEditTripName = () => {
    setEditedTripName(tripName)
    setIsEditingTripName(true)
  }

  const handleSaveTripName = () => {
    setTripData((prev: any) => ({
      ...prev,
      tripName: editedTripName || "Tokyo Winter Wonderland",
    }))
    setIsEditingTripName(false)
  }

  const handleCancelEditTripName = () => {
    setEditedTripName(tripName)
    setIsEditingTripName(false)
  }

  return (
    <>
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Trip Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {isEditingTripName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedTripName}
                      onChange={(e) => setEditedTripName(e.target.value)}
                      className="text-3xl font-bold h-auto py-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTripName()
                        if (e.key === "Escape") handleCancelEditTripName()
                      }}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveTripName}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEditTripName}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h1 className="text-3xl font-bold text-foreground">{tripName}</h1>
                    <button
                      onClick={handleEditTripName}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                      title="Edit trip name"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                )}
                <p className="mt-2 text-muted-foreground">
                  {tripData?.startDate && tripData?.endDate
                    ? (() => {
                        try {
                          const start = new Date(tripData.startDate)
                          const end = new Date(tripData.endDate)
                          const startFormatted = start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                          const endFormatted = end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                          return `${startFormatted} to ${endFormatted}`
                        } catch {
                          return `${tripData.startDate} to ${tripData.endDate}`
                        }
                      })()
                    : "December 18, 2025 to December 28, 2025"}
                </p>
              </div>
              <Button variant="outline" onClick={onNewTrip}>
                Plan New Trip
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="rounded-lg border border-border bg-card p-6">
            <ActiveComponent tripData={tripData} />
          </div>

              {/* Footer Actions */}
              <div className="mt-8 flex gap-4 justify-end">
                <Link href="/itinerary">
                  <Button variant="outline">Back Home</Button>
                </Link>
                <Link href="/itinerary">
                  <Button>Continue Planning</Button>
                </Link>
              </div>
        </div>
      </main>
    </>
  )
}
