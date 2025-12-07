import type { Location } from "@/lib/types/location"
import { LOCATIONS_DATABASE } from "@/lib/data/locations"
import { formatLocation } from "@/lib/types/location"

/**
 * Search locations by city or country name (case-insensitive)
 */
export function searchLocations(query: string): Location[] {
  if (!query.trim()) {
    return []
  }

  const lowerQuery = query.toLowerCase().trim()
  
  return LOCATIONS_DATABASE.filter(
    (location) =>
      location.city.toLowerCase().includes(lowerQuery) ||
      location.country.toLowerCase().includes(lowerQuery) ||
      formatLocation(location).toLowerCase().includes(lowerQuery)
  )
}

/**
 * Find a location by exact city and country match
 */
export function findLocation(city: string, country: string): Location | null {
  return (
    LOCATIONS_DATABASE.find(
      (loc) =>
        loc.city.toLowerCase() === city.toLowerCase() &&
        loc.country.toLowerCase() === country.toLowerCase()
    ) || null
  )
}

/**
 * Get airport code for a location
 */
export function getAirportCode(location: Location): string {
  return location.airportCode
}

