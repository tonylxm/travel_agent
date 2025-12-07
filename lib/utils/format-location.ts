import type { Location } from "@/lib/types/location"
import { formatLocation } from "@/lib/types/location"

/**
 * Format a location for display (handles both Location objects and strings for backward compatibility)
 */
export function formatLocationForDisplay(location: Location | string | null | undefined): string {
  if (!location) return ""
  if (typeof location === "string") return location
  return formatLocation(location)
}

/**
 * Format an array of locations for display
 */
export function formatLocationsForDisplay(locations: (Location | string)[] | null | undefined): string[] {
  if (!locations) return []
  return locations.map(formatLocationForDisplay)
}

