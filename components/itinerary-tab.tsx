"use client"

export default function ItineraryTab({ tripData }: { tripData: any }) {
  const itineraryText = tripData?.itinerary

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Itinerary</h2>
        <p className="text-muted-foreground mb-6">
          AI-generated day-by-day itinerary for your trip to {tripData?.destinations?.join(", ") }.
        </p>

        {itineraryText ? (
          <div className="rounded-lg border border-border bg-background p-4 whitespace-pre-wrap text-sm leading-6 text-foreground">
            {itineraryText}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Your itinerary will appear here after generation.
          </div>
        )}
      </div>
    </div>
  )
}
