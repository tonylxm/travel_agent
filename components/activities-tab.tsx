"use client"

export default function ActivitiesTab({ tripData }: { tripData: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recommended Activities</h2>
        <p className="text-muted-foreground mb-6">Based on your interests: {tripData?.interests?.join(", ")}</p>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((activity) => (
            <div
              key={activity}
              className="border border-border rounded-lg p-4 bg-background hover:bg-muted transition flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-foreground">Activity {activity}</h3>
                <p className="text-sm text-muted-foreground mt-1">Duration: 3-4 hours • Group activity</p>
                <p className="text-sm text-accent mt-2">4.8★ (240 reviews)</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">${50 + activity * 20}</p>
                <button className="text-sm text-accent hover:underline mt-2">Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
