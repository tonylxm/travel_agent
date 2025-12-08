"use client"

import type { Day, Activity } from "@/lib/utils/itinerary-parser"
import { Utensils, MapPin, Ticket, Plane } from "lucide-react"

interface WeeklyOverviewProps {
  days: Day[]
  startDate?: string
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

export default function WeeklyOverview({ days, startDate, onActivityClick }: WeeklyOverviewProps) {
  // Get day names
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Calculate the start date - use startDate prop or first day's date
  let tripStartDate: Date
  try {
    if (startDate) {
      tripStartDate = new Date(startDate)
    } else if (days.length > 0) {
      tripStartDate = new Date(days[0].date)
    } else {
      tripStartDate = new Date()
    }
  } catch {
    tripStartDate = new Date()
  }

  // Get the day of week of the start date (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = tripStartDate.getDay()
  // Convert to Monday = 0 format
  const startMondayIndex = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  // Create a map of date strings to activities
  const activitiesByDate: Record<string, Activity[]> = {}
  days.forEach((day) => {
    try {
      const date = new Date(day.date)
      const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
      if (!activitiesByDate[dateKey]) {
        activitiesByDate[dateKey] = []
      }
      activitiesByDate[dateKey].push(...day.activities)
    } catch {
      // If date parsing fails, use day number
      const dateKey = `day-${day.dayNumber}`
      if (!activitiesByDate[dateKey]) {
        activitiesByDate[dateKey] = []
      }
      activitiesByDate[dateKey].push(...day.activities)
    }
  })

  // Calculate how many weeks we need to show (based on number of days)
  const totalDays = days.length
  const weeksNeeded = Math.ceil((totalDays + startMondayIndex) / 7)

  // Get date for a specific grid position
  const getDateForPosition = (weekIndex: number, dayIndex: number): { date: number; dateString: string; hasActivities: boolean } => {
    const daysFromStart = weekIndex * 7 + dayIndex - startMondayIndex
    if (daysFromStart < 0 || daysFromStart >= totalDays) {
      return { date: 0, dateString: "", hasActivities: false }
    }
    
    try {
      const targetDate = new Date(tripStartDate)
      targetDate.setDate(tripStartDate.getDate() + daysFromStart)
      const dateKey = targetDate.toISOString().split('T')[0]
      const hasActivities = !!activitiesByDate[dateKey] && activitiesByDate[dateKey].length > 0
      return {
        date: targetDate.getDate(),
        dateString: dateKey,
        hasActivities,
      }
    } catch {
      return { date: 0, dateString: "", hasActivities: false }
    }
  }

  // Get activities for a specific date
  const getActivitiesForDate = (dateString: string): Activity[] => {
    return activitiesByDate[dateString] || []
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

      <div className="space-y-4">
        {/* Render multiple weeks */}
        {Array.from({ length: weeksNeeded }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {dayNames.map((dayName, dayIndex) => {
              const dateInfo = getDateForPosition(weekIndex, dayIndex)
              const activities = dateInfo.hasActivities ? getActivitiesForDate(dateInfo.dateString) : []

              return (
                <div key={`${weekIndex}-${dayIndex}`} className="space-y-1">
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground">{dayName}</p>
                    {dateInfo.date > 0 && (
                      <p className="text-sm font-semibold text-foreground">{dateInfo.date}</p>
                    )}
                  </div>
                  <div className="space-y-1 min-h-[120px]">
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
        ))}
      </div>
    </div>
  )
}

