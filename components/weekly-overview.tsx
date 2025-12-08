"use client"

import type { Day, Activity } from "@/lib/utils/itinerary-parser"
import { Utensils, MapPin, Ticket, Plane } from "lucide-react"

interface WeeklyOverviewProps {
  days: Day[]
  onActivityClick?: (activityId: string) => void
}

const activityTypeIcons = {
  food: Utensils,
  walking: MapPin,
  paid: Ticket,
  travel: Plane,
  free: MapPin,
}

const activityTypeColors = {
  food: "bg-blue-500",
  walking: "bg-green-500",
  paid: "bg-purple-500",
  travel: "bg-yellow-500",
  free: "bg-gray-500",
  time: "bg-orange-500", // For Morning, Afternoon, Evening
}

export default function WeeklyOverview({ days, onActivityClick }: WeeklyOverviewProps) {
  // Get day names
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Parse dates and organize by day of week
  const activitiesByDay: Record<number, Activity[]> = {}

  days.forEach((day) => {
    try {
      const date = new Date(day.date)
      const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
      // Convert to Monday = 0 format
      const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1

      if (!activitiesByDay[mondayIndex]) {
        activitiesByDay[mondayIndex] = []
      }
      activitiesByDay[mondayIndex].push(...day.activities)
    } catch {
      // If date parsing fails, use day number as fallback
      const dayIndex = (day.dayNumber - 1) % 7
      if (!activitiesByDay[dayIndex]) {
        activitiesByDay[dayIndex] = []
      }
      activitiesByDay[dayIndex].push(...day.activities)
    }
  })

  // Get dates for display
  const getDateForDay = (dayIndex: number): string => {
    if (days.length === 0) return ""
    try {
      const firstDate = new Date(days[0].date)
      const targetDate = new Date(firstDate)
      targetDate.setDate(firstDate.getDate() + dayIndex)
      return targetDate.getDate().toString()
    } catch {
      return days[dayIndex]?.dayNumber.toString() || ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Weekly Overview</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-muted-foreground">Food</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-muted-foreground">Walking</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span className="text-muted-foreground">Paid</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-muted-foreground">Travel</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((dayName, dayIndex) => {
          const activities = activitiesByDay[dayIndex] || []
          const date = getDateForDay(dayIndex)

          return (
            <div key={dayIndex} className="space-y-1">
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground">{dayName}</p>
                <p className="text-sm font-semibold text-foreground">{date}</p>
              </div>
              <div className="space-y-1 min-h-[100px]">
                {activities.map((activity) => {
                  const Icon = activityTypeIcons[activity.type]
                  return (
                    <div
                      key={activity.id}
                      onClick={() => onActivityClick?.(activity.id)}
                      className={`
                        ${activityTypeColors[activity.type]} text-white text-xs p-1.5 rounded cursor-pointer
                        hover:opacity-80 transition-opacity truncate
                      `}
                      title={activity.name}
                    >
                      <div className="flex items-center gap-1">
                        <Icon className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{activity.name}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

