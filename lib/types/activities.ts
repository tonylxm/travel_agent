export type ActivityType = "free" | "paid"
export type ProviderName = "GetYourGuide" | "Viator" | "Klook" | "TripAdvisor" | "Local operator"
export type ProviderType = "OTA" | "local_operator"

export interface EstimatedCost {
  currency: string
  range: string
}

export interface DealSource {
  provider_name: ProviderName
  provider_type: ProviderType
  example_links: string[]
  typical_price_notes: string
}

export interface Activity {
  type: ActivityType
  name: string
  description: string
  category: string
  why_it_matches: string
  estimated_cost: EstimatedCost
  duration_hours: number
  location: string
  best_time_to_visit: string
  booking_required: boolean
  deal_sources: DealSource[]
  accessibility_notes: string
}

export interface Theme {
  theme_name: string
  activities: Activity[]
}

export interface ActivitiesResponse {
  destination: string
  assumptions: string[]
  themes: Theme[]
  top_picks: string[]
}

