"use client"

export default function FlightsTab({ tripData }: { tripData: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Flight Options</h2>
        <p className="text-muted-foreground mb-6">
          Outbound flights from {tripData?.origin} to {tripData?.destinations?.[0]}
        </p>

        <div className="space-y-3">
          {[1, 2, 3].map((flight) => (
            <div
              key={flight}
              className="border border-border rounded-lg p-4 bg-background flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-foreground">Flight {flight}</p>
                <p className="text-sm text-muted-foreground">Departure • {12 + flight}:00 AM • Duration: 5h 30m</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary text-lg">${800 + flight * 50}</p>
                <button className="text-sm text-accent hover:underline mt-1">Select</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
