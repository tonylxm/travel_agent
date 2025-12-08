"use client"

import { X } from "lucide-react"
import type { Activity } from "@/lib/utils/itinerary-parser"
import { Utensils, MapPin, Ticket, Plane } from "lucide-react"

interface ActivityModalProps {
  activity: Activity | null
  onClose: () => void
}

const activityTypeIcons = {
  food: Utensils,
  walking: MapPin,
  paid: Ticket,
  travel: Plane,
  free: MapPin,
}

const activityTypeColors = {
  food: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  walking: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  paid: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  travel: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  free: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

export default function ActivityModal({ activity, onClose }: ActivityModalProps) {
  if (!activity) return null

  const Icon = activityTypeIcons[activity.type]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative border rounded-lg p-4 bg-card shadow-lg max-w-md w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Content */}
          <div className="space-y-3 pr-6">
            {/* Type badge */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${activityTypeColors[activity.type]}`}
              >
                <Icon className="h-3 w-3" />
                <span className="capitalize">{activity.type}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground pr-4">
              {activity.name}
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}

