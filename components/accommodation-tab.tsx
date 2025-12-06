"use client"

export default function AccommodationTab({ tripData }: { tripData: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Accommodation Options</h2>
        <p className="text-muted-foreground mb-6">Budget range: ${tripData?.budget / 7} per night (estimated)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((hotel) => (
            <div
              key={hotel}
              className="border border-border rounded-lg overflow-hidden bg-background hover:shadow-lg transition"
            >
              <div className="h-32 bg-gradient-to-br from-secondary to-accent"></div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">Hotel {hotel}</h3>
                <p className="text-sm text-muted-foreground mt-1">4.5★ • {20 + hotel * 5} reviews</p>
                <p className="text-primary font-semibold mt-3">${120 + hotel * 30}/night</p>
                <button className="text-sm text-accent hover:underline mt-2">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
