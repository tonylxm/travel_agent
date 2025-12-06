"use client"

import { Button } from "@/components/ui/button"

export default function SummaryTab({ tripData }: { tripData: any }) {
  const estimatedTotal = tripData?.budget || 5000

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Trip Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trip Details */}
        <div className="space-y-4">
          <div className="rounded-lg bg-background p-4 border border-border">
            <p className="text-sm text-muted-foreground">Route</p>
            <p className="font-semibold text-foreground">
              {tripData?.origin} → {tripData?.destinations?.join(" → ")}
            </p>
          </div>
          <div className="rounded-lg bg-background p-4 border border-border">
            <p className="text-sm text-muted-foreground">Dates</p>
            <p className="font-semibold text-foreground">
              {tripData?.startDate} to {tripData?.endDate}
            </p>
          </div>
          <div className="rounded-lg bg-background p-4 border border-border">
            <p className="text-sm text-muted-foreground">Travelers</p>
            <p className="font-semibold text-foreground">{tripData?.travelers} person(s)</p>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Budget Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Flights</span>
              <span className="font-medium text-foreground">$800</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accommodation</span>
              <span className="font-medium text-foreground">$1,200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Activities</span>
              <span className="font-medium text-foreground">$400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Meals & Transport</span>
              <span className="font-medium text-foreground">$600</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-semibold text-primary text-lg">${estimatedTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Book */}
      <div className="rounded-lg bg-accent/10 border border-accent/20 p-6 text-center">
        <h3 className="font-semibold text-foreground mb-2">Ready to Book?</h3>
        <p className="text-muted-foreground mb-4">
          All your travel plans are ready. Proceed to checkout to finalize your booking.
        </p>
        <Button className="w-full sm:w-auto" size="lg">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  )
}
