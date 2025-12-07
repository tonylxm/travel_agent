"use client"

import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Link from "next/link"
import { useState } from "react"
import ItineraryTab from "@/components/itinerary-tab"
import FlightsTab from "@/components/flights-tab"
import AccommodationTab from "@/components/accommodation-tab"
import ActivitiesTab from "@/components/activities-tab"
import SummaryTab from "@/components/summary-tab"
import { formatLocationsForDisplay, formatLocationForDisplay } from "@/lib/utils/format-location"

export default function ItineraryView({ tripData, onNewTrip }: { tripData: any; onNewTrip: () => void }) {
  const [activeTab, setActiveTab] = useState("itinerary")

  const tabs = [
    { id: "itinerary", label: "Itinerary", component: ItineraryTab },
    { id: "flights", label: "Flights", component: FlightsTab },
    { id: "accommodation", label: "Accommodation", component: AccommodationTab },
    { id: "activities", label: "Activities", component: ActivitiesTab },
    { id: "summary", label: "Summary", component: SummaryTab },
  ]

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || ItineraryTab

  const originFormatted = formatLocationForDisplay(tripData?.origin)
  const destinationsFormatted = formatLocationsForDisplay(tripData?.destinations)
  const routeString = originFormatted 
    ? `${originFormatted} → ${destinationsFormatted.join(" → ")}`
    : destinationsFormatted.join(" → ")

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Trip Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{routeString}</h1>
                <p className="mt-2 text-muted-foreground">
                  {tripData?.startDate} to {tripData?.endDate}
                </p>
              </div>
              <Button variant="outline" onClick={onNewTrip}>
                New Trip
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-border">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 border-b-2 font-medium text-sm transition ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="rounded-lg border border-border bg-card p-6">
            <ActiveComponent tripData={tripData} />
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex gap-4 justify-end">
            <Link href="/">
              <Button variant="outline">Back Home</Button>
            </Link>
            <Link href="/planner">
              <Button>Continue Planning</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
