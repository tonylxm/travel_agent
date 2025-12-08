export interface Location {
  city: string
  country: string
  airportCode: string
  airportName: string // Full airport name
}

export function formatLocation(location: Location): string {
  // Special case: if country starts with "(", don't add comma (e.g., "Hong Kong (SAR)")
  if (location.country.startsWith("(")) {
    return `${location.city} ${location.country}`
  }
  return `${location.city}, ${location.country}`
}

export function formatAirportName(location: Location): string {
  return `${location.airportName} (${location.airportCode})`
}

