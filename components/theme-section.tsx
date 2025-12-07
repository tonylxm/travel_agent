"use client"

import { useState } from "react"
import type { Theme } from "@/lib/types/activities"
import ActivityCard from "@/components/activity-card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ThemeSectionProps {
  theme: Theme
}

export default function ThemeSection({ theme }: ThemeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition"
      >
        <h3 className="text-lg font-semibold text-foreground">{theme.theme_name}</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{theme.activities.length} activities</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4">
          {theme.activities.map((activity, idx) => (
            <ActivityCard key={idx} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}

