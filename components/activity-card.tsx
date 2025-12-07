"use client"

import type { Activity } from "@/lib/types/activities"
import { ExternalLink, Clock, MapPin, Calendar, DollarSign } from "lucide-react"

interface ActivityCardProps {
  activity: Activity
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const isFree = activity.type === "free"

  return (
    <div className="border border-border rounded-lg p-5 bg-background hover:bg-muted/50 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground text-lg">{activity.name}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isFree
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {isFree ? "Free" : "Paid"}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
              {activity.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
          <p className="text-xs text-accent italic mb-3">💡 {activity.why_it_matches}</p>
        </div>
      </div>

      {/* Activity Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {!isFree && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {activity.estimated_cost.range} {activity.estimated_cost.currency}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{activity.duration_hours} hours</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{activity.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{activity.best_time_to_visit}</span>
        </div>
      </div>

      {/* Booking Sources */}
      {activity.deal_sources.length > 0 && (
        <div className="mb-3 pt-3 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Book through:</p>
          <div className="flex flex-wrap gap-2">
            {activity.deal_sources.map((source, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{source.provider_name}</span>
                  <span className="text-xs text-muted-foreground">({source.provider_type})</span>
                </div>
                {source.example_links.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {source.example_links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={`https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {link}
                      </a>
                    ))}
                  </div>
                )}
                {source.typical_price_notes && (
                  <p className="text-xs text-muted-foreground italic">{source.typical_price_notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="flex flex-col gap-2 pt-3 border-t border-border">
        {activity.booking_required && (
          <p className="text-xs text-amber-600 dark:text-amber-400">⚠️ Booking required in advance</p>
        )}
        {activity.accessibility_notes && (
          <p className="text-xs text-muted-foreground">♿ {activity.accessibility_notes}</p>
        )}
      </div>
    </div>
  )
}

