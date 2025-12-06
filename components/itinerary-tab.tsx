"use client"

export default function ItineraryTab({ tripData }: { tripData: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Itinerary</h2>
        <p className="text-muted-foreground mb-6">
          AI-generated day-by-day itinerary for your trip to {tripData?.destinations?.join(", ")}.
        </p>

        <div className="space-y-4">
          {[1, 2, 3].map((day) => (
            <div key={day} className="border border-border rounded-lg p-4 bg-background">
              <h3 className="font-semibold text-foreground">Day {day}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Morning: Explore local attractions • Lunch: Traditional cuisine • Evening: Cultural experience
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
