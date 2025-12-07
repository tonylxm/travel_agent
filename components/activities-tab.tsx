"use client"

import { useState, useEffect, useContext } from "react"
import type { ActivitiesResponse, Activity, Theme } from "@/lib/types/activities"
import ThemeSection from "@/components/theme-section"
import ActivityCard from "@/components/activity-card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, Filter, Star, Info } from "lucide-react"
import TripContext from "@/contexts/trip-context"

interface ActivitiesTabProps {
  tripData: {
    origin?: string
    destinations?: string[]
    startDate?: string
    endDate?: string
    budget?: number
    travelers?: number
    interests?: string[]
    activities?: ActivitiesResponse
  }
}

type FilterType = "all" | "free" | "paid"
type SortOption = "default" | "duration" | "price"

export default function ActivitiesTab({ tripData }: ActivitiesTabProps) {
  const { setTripData } = useContext(TripContext)
  const [activitiesData, setActivitiesData] = useState<ActivitiesResponse | null>(
    tripData?.activities || null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [sortOption, setSortOption] = useState<SortOption>("default")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    // Check if activities are already cached in tripData
    if (tripData?.activities) {
      setActivitiesData(tripData.activities)
      return
    }

    // Only fetch if we have trip data and no cached activities
    if (tripData?.destinations && tripData.destinations.length > 0) {
      fetchActivities()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripData?.destinations?.join(","), tripData?.startDate, tripData?.endDate, tripData?.budget])

  const fetchActivities = async (forceRefresh = false) => {
    if (!tripData?.destinations || tripData.destinations.length === 0) {
      setError("Missing trip data")
      return
    }

    // Don't fetch if we already have cached activities (unless forcing refresh)
    if (tripData?.activities && !forceRefresh) {
      setActivitiesData(tripData.activities)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch activities")
      }

      const data = await response.json()
      setActivitiesData(data)

      // Store activities in tripData for future use
      if (setTripData) {
        setTripData((prev) => ({
          ...prev,
          activities: data,
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getFilteredAndSortedThemes = (): Theme[] => {
    if (!activitiesData) return []

    return activitiesData.themes
      .map((theme) => {
        let filteredActivities = theme.activities

        // Apply type filter
        if (filterType !== "all") {
          filteredActivities = filteredActivities.filter(
            (activity) => activity.type === filterType
          )
        }

        // Apply category filter
        if (selectedCategory !== "all") {
          filteredActivities = filteredActivities.filter(
            (activity) => activity.category.toLowerCase() === selectedCategory.toLowerCase()
          )
        }

        // Apply sorting
        if (sortOption === "duration") {
          filteredActivities = [...filteredActivities].sort(
            (a, b) => a.duration_hours - b.duration_hours
          )
        } else if (sortOption === "price") {
          filteredActivities = [...filteredActivities].sort((a, b) => {
            if (a.type === "free" && b.type === "paid") return -1
            if (a.type === "paid" && b.type === "free") return 1
            if (a.type === "free" && b.type === "free") return 0

            // Extract numeric values from price ranges (e.g., "NZD 50-100" -> 50)
            const getMinPrice = (range: string): number => {
              const match = range.match(/\d+/)
              return match ? parseInt(match[0]) : 0
            }
            return getMinPrice(a.estimated_cost.range) - getMinPrice(b.estimated_cost.range)
          })
        }

        return {
          ...theme,
          activities: filteredActivities,
        }
      })
      .filter((theme) => theme.activities.length > 0)
  }

  const getTopPicksActivities = (): Activity[] => {
    if (!activitiesData || activitiesData.top_picks.length === 0) return []

    const allActivities = activitiesData.themes.flatMap((theme) => theme.activities)
    return activitiesData.top_picks
      .map((pickName) => allActivities.find((activity) => activity.name === pickName))
      .filter((activity): activity is Activity => activity !== undefined)
  }

  const getAllCategories = (): string[] => {
    if (!activitiesData) return []
    const categories = new Set<string>()
    activitiesData.themes.forEach((theme) => {
      theme.activities.forEach((activity) => {
        categories.add(activity.category)
      })
    })
    return Array.from(categories).sort()
  }

  const filteredThemes = getFilteredAndSortedThemes()
  const topPicks = getTopPicksActivities()
  const categories = getAllCategories()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Generating activities for your trip...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <p className="text-destructive mb-4">{error}</p>
        <Button
          onClick={(e) => {
            e.preventDefault()
            fetchActivities(true)
          }}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!activitiesData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No activities data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Recommended Activities</h2>
          <p className="text-muted-foreground">
            {activitiesData.destination && (
              <>
                Activities for <span className="font-medium text-foreground">{activitiesData.destination}</span>
              </>
            )}
            {tripData?.interests && tripData.interests.length > 0 && (
              <> • Based on your interests: {tripData.interests.join(", ")}</>
            )}
          </p>
        </div>
        {tripData?.activities && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              fetchActivities(true)
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              "Refresh Activities"
            )}
          </Button>
        )}
      </div>

      {/* Assumptions Banner */}
      {activitiesData.assumptions && activitiesData.assumptions.length > 0 && (
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Assumptions Made</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {activitiesData.assumptions.map((assumption, idx) => (
                  <li key={idx}>• {assumption}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Top Picks Section */}
      {topPicks.length > 0 && (
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary fill-primary" />
            <h3 className="text-lg font-semibold text-foreground">Top Picks</h3>
          </div>
          <div className="space-y-4">
            {topPicks.map((activity, idx) => (
              <ActivityCard key={idx} activity={activity} />
            ))}
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filter:</span>
          {(filterType !== "all" || selectedCategory !== "all") && (
            <span className="text-xs text-muted-foreground">
              ({filteredThemes.reduce((sum, theme) => sum + theme.activities.length, 0)} activities)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {(["all", "free", "paid"] as FilterType[]).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
        {categories.length > 0 && (
          <>
            <span className="text-sm text-muted-foreground mx-2">|</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-border bg-background text-sm text-foreground"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </>
        )}
        <span className="text-sm text-muted-foreground mx-2">|</span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="px-3 py-1.5 rounded-md border border-border bg-background text-sm text-foreground"
        >
          <option value="default">Default</option>
          <option value="duration">Sort by Duration</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {/* Themes */}
      {filteredThemes.length > 0 ? (
        <div className="space-y-4">
          {filteredThemes.map((theme, idx) => (
            <ThemeSection key={idx} theme={theme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-lg border border-border bg-muted/30">
          <p className="text-muted-foreground">No activities match your current filters</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setFilterType("all")
              setSelectedCategory("all")
              setSortOption("default")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
