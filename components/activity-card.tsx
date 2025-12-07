"use client"

import type { Activity } from "@/lib/types/activities"
import { Clock, MapPin, DollarSign } from "lucide-react"

interface ActivityCardProps {
  activity: Activity
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const isFree = activity.type === "free"

  return (
    <div className="border border-border rounded-lg p-4 bg-background hover:bg-muted/50 transition-all">
      {/* Title and Badges */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-foreground text-lg flex-1">{activity.name}</h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isFree
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-primary/10 text-primary"
            }`}
          >
            {isFree ? "Free" : "Paid"}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
            {activity.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>

      {/* Why it matches - highlighted */}
      <p className="text-xs text-green-600 dark:text-green-400 italic mb-3">💡 {activity.why_it_matches_you}</p>

      {/* Key Details - Compact Row */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        {!isFree && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground font-medium">
              {activity.estimated_cost.range} {activity.estimated_cost.currency}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{activity.duration_hours} hours</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">{activity.location}</span>
        </div>
      </div>

      {/* Booking Sources - Condensed */}
      {activity.deal_sources.length > 0 && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Book through:</p>
          <div className="flex flex-wrap gap-2">
            {activity.deal_sources.map((source, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">{source.provider_name}</span>
                {source.provider_type && source.provider_type !== "local_operator" && (
                  <span className="text-xs text-muted-foreground">({source.provider_type})</span>
                )}
                {source.typical_price_notes && (
  <>
    <span className="text-xs text-muted-foreground italic">•</span>
    <span className="text-xs text-muted-foreground italic ml-1">{source.typical_price_notes}</span>
    </>
    )} 
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info - Compact */}
      <div className="flex items-center gap-3 pt-2 mt-2 border-t border-border">
        {activity.booking_required && (
          <p className="text-xs text-amber-600 dark:text-amber-400">⚠️ Booking required</p>
        )}
        {activity.accessibility_notes && (
          <p className="text-xs text-muted-foreground">♿ {activity.accessibility_notes}</p>
        )}
      </div>
    </div>
  )
}

