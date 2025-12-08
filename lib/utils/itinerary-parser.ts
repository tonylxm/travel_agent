import { findTokyoLocation, getTokyoCenter } from "@/lib/data/tokyo-locations"

export type ActivityType = 'food' | 'walking' | 'paid' | 'travel' | 'free'

export interface Activity {
  id: string
  time?: string
  name: string
  type: ActivityType
  description: string
  location: {
    name: string
    coordinates: [number, number]
  }
}

export interface Day {
  dayNumber: number
  date: string
  activities: Activity[]
}

export interface ParsedItinerary {
  days: Day[]
}

/**
 * Infer activity type from keywords
 */
function inferActivityType(text: string): ActivityType {
  const lowerText = text.toLowerCase()
  
  // Food keywords
  if (lowerText.includes('dinner') || lowerText.includes('lunch') || 
      lowerText.includes('breakfast') || lowerText.includes('restaurant') ||
      lowerText.includes('cafe') || lowerText.includes('meal') ||
      lowerText.includes('eat') || lowerText.includes('food')) {
    return 'food'
  }
  
  // Travel keywords
  if (lowerText.includes('depart') || lowerText.includes('arrive') ||
      lowerText.includes('airport') || lowerText.includes('flight') ||
      lowerText.includes('trip to') || lowerText.includes('head to')) {
    return 'travel'
  }
  
  // Walking keywords
  if (lowerText.includes('walk') || lowerText.includes('stroll') ||
      lowerText.includes('explore') || lowerText.includes('shopping')) {
    return 'walking'
  }
  
  // Paid activity keywords (museums, parks with entry fees, etc.)
  if (lowerText.includes('museum') || lowerText.includes('zoo') ||
      lowerText.includes('disney') || lowerText.includes('skytree') ||
      lowerText.includes('temple') || lowerText.includes('shrine') ||
      lowerText.includes('park') || lowerText.includes('tour')) {
    return 'paid'
  }
  
  return 'free'
}

/**
 * Extract location name from activity text
 */
function extractLocationName(text: string): string {
  // Try to find quoted names first (restaurants, places)
  const quotedMatch = text.match(/"([^"]+)"/)
  if (quotedMatch) {
    return quotedMatch[1]
  }
  
  // Common location patterns
  const locationPatterns = [
    /(?:at|to|visit|visit to|explore)\s+([A-Z][a-zA-Z\s]+?)(?:\s|,|$)/,
    /([A-Z][a-zA-Z\s]+?)\s+(?:restaurant|temple|shrine|museum|park|zoo|market|station|airport)/i,
    /([A-Z][a-zA-Z\s]+?)\s+(?:in|near|at)/,
  ]
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  // Try to find capitalized proper nouns (likely location names)
  const properNounMatch = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/)
  if (properNounMatch) {
    return properNounMatch[1]
  }
  
  // Fallback: extract first few capitalized words
  const words = text.split(/\s+/).filter(w => /^[A-Z]/.test(w)).slice(0, 3)
  return words.join(' ') || text.split(/\s+/).slice(0, 3).join(' ')
}

/**
 * Extract time from activity text and capitalize time words
 */
function extractTime(text: string): string | undefined {
  // Match patterns like "8:00 AM", "Morning", "Afternoon", "Evening"
  const timePatterns = [
    /\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\b/i,
    /\b(morning|afternoon|evening|night|midday)\b/i,
    /\b(full day|all day)\b/i,
  ]
  
  for (const pattern of timePatterns) {
    const match = text.match(pattern)
    if (match) {
      let timeStr = match[1]
      // Capitalize time words
      const timeWords: Record<string, string> = {
        'morning': 'Morning',
        'afternoon': 'Afternoon',
        'evening': 'Evening',
        'night': 'Night',
        'midday': 'Midday',
        'full day': 'Full Day',
        'all day': 'All Day',
      }
      const lowerTime = timeStr.toLowerCase()
      if (timeWords[lowerTime]) {
        timeStr = timeWords[lowerTime]
      }
      return timeStr
    }
  }
  
  return undefined
}

/**
 * Parse the hardcoded itinerary text into structured data
 */
export function parseItinerary(itineraryText: string, startDate: string): ParsedItinerary {
  const days: Day[] = []
  const lines = itineraryText.split('\n')
  
  let currentDay: Day | null = null
  let activityIdCounter = 0
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Skip empty lines and notes
    if (!trimmedLine || trimmedLine.startsWith('Please note:')) {
      continue
    }
    
    // Match day headers: "Day 1: December 18, 2025"
    const dayMatch = trimmedLine.match(/Day\s+(\d+):\s*(.+)/i)
    if (dayMatch) {
      // Save previous day if exists
      if (currentDay) {
        days.push(currentDay)
      }
      
      const dayNumber = parseInt(dayMatch[1])
      const dateText = dayMatch[2].replace(/\([^)]+\)/g, '').trim() // Remove parenthetical notes
      
      currentDay = {
        dayNumber,
        date: dateText,
        activities: [],
      }
      continue
    }
    
    // Match activity lines: "- Activity description"
    if (trimmedLine.startsWith('-') && currentDay) {
      const activityText = trimmedLine.substring(1).trim()
      
      // Extract time
      const time = extractTime(activityText)
      
      // Extract location
      const locationName = extractLocationName(activityText)
      const location = findTokyoLocation(locationName) || {
        name: locationName,
        coordinates: getTokyoCenter(),
      }
      
      // Infer type
      const type = inferActivityType(activityText)
      
      // Create activity
      const activity: Activity = {
        id: `activity-${activityIdCounter++}`,
        time,
        name: activityText.length > 60 ? activityText.substring(0, 60) + '...' : activityText,
        type,
        description: activityText,
        location: {
          name: location.name,
          coordinates: location.coordinates,
        },
      }
      
      currentDay.activities.push(activity)
    }
  }
  
  // Add last day
  if (currentDay) {
    days.push(currentDay)
  }
  
  return { days }
}

