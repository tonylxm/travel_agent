"use client"

import { useState } from "react"
import type { Activity, Day } from "@/lib/utils/itinerary-parser"
import { Clock, Utensils, MapPin, Ticket, Plane, GripVertical, Edit2, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface EditableItineraryProps {
  days: Day[]
  selectedActivityId?: string
  onActivityClick?: (activityId: string) => void
  onActivityUpdate?: (activityId: string, updates: Partial<Activity>) => void
  onActivityReorder?: (dayNumber: number, fromIndex: number, toIndex: number) => void
  onActivityMoveToDay?: (activityId: string, fromDay: number, toDay: number, toIndex: number) => void
}

const activityTypeIcons = {
  food: Utensils,
  walking: MapPin,
  paid: Ticket,
  travel: Plane,
  free: MapPin,
}

const activityTypeColors = {
  food: "bg-blue-500 text-white",
  walking: "bg-green-500 text-white",
  paid: "bg-purple-500 text-white",
  travel: "bg-yellow-500 text-white",
  free: "bg-gray-500 text-white",
  time: "bg-orange-500 text-white", // For Morning, Afternoon, Evening
}

// Check if time is a time period (Morning, Afternoon, Evening, etc.)
const isTimePeriod = (time: string | undefined): boolean => {
  if (!time) return false
  const timePeriods = ['Morning', 'Afternoon', 'Evening', 'Night', 'Midday', 'Full Day', 'All Day']
  return timePeriods.includes(time)
}

export default function EditableItinerary({
  days,
  selectedActivityId,
  onActivityClick,
  onActivityUpdate,
  onActivityReorder,
  onActivityMoveToDay,
}: EditableItineraryProps) {
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<"name" | "time" | "description" | null>(null)
  const [editValues, setEditValues] = useState<{ name: string; time: string; description: string }>({
    name: "",
    time: "",
    description: "",
  })
  const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<{ dayNumber: number; index: number } | null>(null)

  const handleEditStart = (activity: Activity) => {
    setEditingActivityId(activity.id)
    setEditingField("name")
    setEditValues({
      name: activity.name,
      time: activity.time || "",
      description: activity.description,
    })
  }

  const handleEditSave = (activityId: string) => {
    if (onActivityUpdate) {
      onActivityUpdate(activityId, {
        name: editValues.name,
        time: editValues.time || undefined,
        description: editValues.description,
      })
    }
    setEditingActivityId(null)
    setEditingField(null)
  }

  const handleEditCancel = () => {
    setEditingActivityId(null)
    setEditingField(null)
  }

  const handleDragStart = (e: React.DragEvent, activityId: string) => {
    setDraggedActivityId(activityId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, dayNumber: number, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex({ dayNumber, index })
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetDayNumber: number, targetIndex: number) => {
    e.preventDefault()
    if (!draggedActivityId) return

    // Find the activity being dragged
    let sourceDay: Day | null = null
    let sourceIndex = -1

    for (const day of days) {
      const index = day.activities.findIndex((a) => a.id === draggedActivityId)
      if (index !== -1) {
        sourceDay = day
        sourceIndex = index
        break
      }
    }

    if (!sourceDay || sourceIndex === -1) return

    // If moving within the same day, reorder
    if (sourceDay.dayNumber === targetDayNumber && onActivityReorder) {
      onActivityReorder(targetDayNumber, sourceIndex, targetIndex)
    }
    // If moving to a different day
    else if (sourceDay.dayNumber !== targetDayNumber && onActivityMoveToDay) {
      onActivityMoveToDay(draggedActivityId, sourceDay.dayNumber, targetDayNumber, targetIndex)
    }

    setDraggedActivityId(null)
    setDragOverIndex(null)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {days.map((day) => (
        <div key={day.dayNumber} className="space-y-4">
          <div className="sticky top-0 bg-background z-10 pb-3 border-b border-gray-200 dark:border-border">
            <h3 className="text-xl font-bold text-foreground">
              Day {day.dayNumber}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{formatDate(day.date)}</p>
          </div>

          <div className="space-y-2">
            {day.activities.map((activity, index) => {
              const Icon = activityTypeIcons[activity.type]
              const isEditing = editingActivityId === activity.id
              const isSelected = selectedActivityId === activity.id
              const isDragging = draggedActivityId === activity.id
              const isDragOver =
                dragOverIndex?.dayNumber === day.dayNumber && dragOverIndex?.index === index

              return (
                <div
                  key={activity.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, activity.id)}
                  onDragOver={(e) => handleDragOver(e, day.dayNumber, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day.dayNumber, index)}
                  className={`
                    group relative border rounded-lg p-4 bg-white dark:bg-card hover:shadow-sm transition-all
                    ${isSelected ? "ring-2 ring-primary" : ""}
                    ${isDragging ? "opacity-50" : ""}
                    ${isDragOver ? "border-primary border-2" : "border-gray-200 dark:border-border"}
                    cursor-move
                  `}
                  onClick={() => onActivityClick?.(activity.id)}
                >
                  {/* Drag handle */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="ml-6 space-y-2">
                    {/* Header with time and type */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {activity.time && (
                        <>
                          {isTimePeriod(activity.time) ? (
                            // Time period badge (orange)
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${activityTypeColors.time}`}>
                              <Clock className="h-3 w-3" />
                              {isEditing && editingField === "time" ? (
                                <Input
                                  value={editValues.time}
                                  onChange={(e) => setEditValues({ ...editValues, time: e.target.value })}
                                  onBlur={() => handleEditSave(activity.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleEditSave(activity.id)
                                    if (e.key === "Escape") handleEditCancel()
                                  }}
                                  className="h-5 w-20 text-xs bg-white text-gray-900"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingActivityId(activity.id)
                                    setEditingField("time")
                                    setEditValues({
                                      name: activity.name,
                                      time: activity.time || "",
                                      description: activity.description,
                                    })
                                  }}
                                >
                                  {activity.time}
                                </span>
                              )}
                            </div>
                          ) : (
                            // Regular time display
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {isEditing && editingField === "time" ? (
                                <Input
                                  value={editValues.time}
                                  onChange={(e) => setEditValues({ ...editValues, time: e.target.value })}
                                  onBlur={() => handleEditSave(activity.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleEditSave(activity.id)
                                    if (e.key === "Escape") handleEditCancel()
                                  }}
                                  className="h-5 w-24 text-xs"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="hover:underline cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingActivityId(activity.id)
                                    setEditingField("time")
                                    setEditValues({
                                      name: activity.name,
                                      time: activity.time || "",
                                      description: activity.description,
                                    })
                                  }}
                                >
                                  {activity.time}
                                </span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${activityTypeColors[activity.type]}`}
                      >
                        <Icon className="h-3 w-3" />
                        <span className="capitalize">{activity.type}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditStart(activity)
                        }}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                      >
                        <Edit2 className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Activity name - larger, bolder */}
                    {isEditing && editingField === "name" ? (
                      <Input
                        value={editValues.name}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        onBlur={() => handleEditSave(activity.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(activity.id)
                          if (e.key === "Escape") handleEditCancel()
                        }}
                        className="text-base font-semibold"
                        autoFocus
                      />
                    ) : (
                      <h4 className="text-base font-semibold text-foreground">{activity.name}</h4>
                    )}

                    {/* Description - cleaner styling */}
                    {isEditing && editingField === "description" ? (
                      <textarea
                        value={editValues.description}
                        onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                        onBlur={() => handleEditSave(activity.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.ctrlKey) handleEditSave(activity.id)
                          if (e.key === "Escape") handleEditCancel()
                        }}
                        className="w-full text-sm text-muted-foreground resize-none rounded border border-input p-2"
                        rows={2}
                        autoFocus
                      />
                    ) : (
                      <p
                        className="text-sm text-muted-foreground line-clamp-2 hover:line-clamp-none cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingActivityId(activity.id)
                          setEditingField("description")
                          setEditValues({
                            name: activity.name,
                            time: activity.time || "",
                            description: activity.description,
                          })
                        }}
                      >
                        {activity.description}
                      </p>
                    )}

                    {/* Location - smaller, subtle */}
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location.name}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

