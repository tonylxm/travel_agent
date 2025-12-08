import { NextRequest, NextResponse } from "next/server"

import type { Location } from "@/lib/types/location"
import { formatLocation } from "@/lib/types/location"

interface TripData {
  origin: Location | string
  destinations: (Location | string)[]
  startDate: string
  endDate: string
  budget: number
  travelers: number
  tripCategory: string
  interests: string[]
  additionalInformation?: string
}

const ACTIVITIES_PROMPT = `For the activities page, you generate highly relevant, budget-aware activities for a user's trip. 
You MUST output valid JSON only, conforming exactly to the schema at the end of this prompt.

You must filter, rank, and design activities based on the given:
- Destination(s)
- Trip duration and dates
- User budget level (low, medium, high, OR numeric daily budget)
- Key focuses / tags
- Additional user info including preferences, constraints, and interests

The goal is to propose activities that are:
- Highly relevant to the user's interests
- Budget-appropriate
- Reasoned with clear justification for each item
- Practical, bookable, and real-world plausible

You must also:
- Split activities into "free" and "paid"
- Identify realistic price ranges for all paid activities (just use New Zealand dollars for everything)
- Recommend booking sources ONLY from this list: ["GetYourGuide", "Viator", "Klook", "TripAdvisor", "Local operator"]
- Include adventure/outdoor options where relevant
- If multiple destinations are provided, group activities by destination
- Avoid making up specific tour companies unless they are household names

If information is missing, make reasonable assumptions and state them in the \`assumptions\` field. IMPORTANT: When writing assumptions, always address the user directly using "You" (second person) instead of "the traveller" or "the traveler" (third person). For example, use "You prefer budget-friendly options" instead of "The traveller prefers budget-friendly options".

--- JSON SCHEMA (required) ---
{
  "destination": string,
  "assumptions": string[],
  "themes": [
    {
      "theme_name": string,
      "activities": [
        {
          "type": "free" | "paid",
          "name": string,
          "description": string,
          "category": string,
          "why_it_matches_you": string,
          "estimated_cost": {
            "currency": string,
            "range": string
          },
          "duration_hours": number,
          "location": string,
          "best_time_to_visit": string,
          "booking_required": boolean,
          "deal_sources": [
            {
              "provider_name": "GetYourGuide" | "Viator" | "Klook" | "TripAdvisor" | "Local operator",
              "provider_type": "OTA" | "",
              "typical_price_notes": string
            }
          ],
          "accessibility_notes": string
        }
      ]
    }
  ],
  "top_picks": [string]
}`

export async function POST(request: NextRequest) {
  try {
    const tripData: TripData = await request.json()

    if (!tripData.destinations || tripData.destinations.length === 0) {
      return NextResponse.json({ error: "At least one destination is required" }, { status: 400 })
    }

    // Calculate trip duration in days
    const startDate = new Date(tripData.startDate)
    const endDate = new Date(tripData.endDate)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const dailyBudget = tripData.budget / (days * tripData.travelers)

    // Determine budget level
    let budgetLevel: string
    if (dailyBudget < 50) {
      budgetLevel = "low"
    } else if (dailyBudget < 150) {
      budgetLevel = "medium"
    } else {
      budgetLevel = "high"
    }

    // Format locations for prompt
    const destinationsFormatted = tripData.destinations.map((dest: Location | string) =>
      typeof dest === "object" ? formatLocation(dest as Location) : dest
    )
    const originFormatted = typeof tripData.origin === "object" 
      ? formatLocation(tripData.origin as Location) 
      : tripData.origin

    // Build the prompt with trip data
    let userPrompt = `Generate activities for:
- Destination(s): ${destinationsFormatted.join(", ")}
- Trip dates: ${tripData.startDate} to ${tripData.endDate} (${days} days)
- Budget: ${budgetLevel} ($${dailyBudget.toFixed(0)} per person per day, total: $${tripData.budget})
- Number of travelers: ${tripData.travelers}
- Type of Trip: ${tripData.tripCategory || "General travel"}
- Interests: ${tripData.interests.join(", ") || "General travel"}
- Origin: ${originFormatted}`

    if (tripData.additionalInformation && tripData.additionalInformation.trim()) {
      userPrompt += `\n- Additional Information: ${tripData.additionalInformation}`
    }

    // Hardcoded activities response for demo
    const firstDestination = tripData.destinations[0]
    const destinationFormatted = typeof firstDestination === "object" 
      ? formatLocation(firstDestination as Location) 
      : firstDestination
    
    const hardcodedActivities = {
      destination: destinationFormatted,
      assumptions: [
        "You are traveling as a family of 4, including a vegetarian family member",
        "Mum's birthday is on December 23rd and requires special celebration",
        "You want to have KFC dinner on Christmas Eve, following local tradition.",
        "All activities and restaurants have been selected to accommodate vegetarian dietary requirements",
      ],
      themes: [
        {
          theme_name: "Cultural & Historical",
          activities: [
            {
              type: "paid" as const,
              name: "Edo Tokyo Museum",
              description: "Learn about Tokyo's rich history and culture from the Edo period to modern times. Perfect for families interested in history and culture.",
              category: "Culture",
              why_it_matches_you: "Matches your interest in Culture and History, and is family-friendly",
              estimated_cost: {
                currency: "NZD",
                range: "15-25 per person",
              },
              duration_hours: 3,
              location: "Tokyo, Japan",
              best_time_to_visit: "Afternoon",
              booking_required: false,
              deal_sources: [
                {
                  provider_name: "Klook",
                  provider_type: "OTA",
                  typical_price_notes: "Skip-the-line tickets available",
                },
              ],
              accessibility_notes: "Wheelchair accessible",
            },
            {
              type: "free" as const,
              name: "Meiji Shrine",
              description: "A peaceful Shinto shrine surrounded by forest in the heart of Tokyo. Great for morning visits and experiencing traditional Japanese culture.",
              category: "Culture",
              why_it_matches_you: "Perfect for your interest in Culture and provides a serene family experience",
              estimated_cost: {
                currency: "NZD",
                range: "Free",
              },
              duration_hours: 2,
              location: "Tokyo, Japan",
              best_time_to_visit: "Morning",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Wheelchair accessible paths available",
            },
            {
              type: "free" as const,
              name: "Senso-ji Temple and Nakamise Shopping Street",
              description: "Tokyo's oldest temple with a vibrant shopping street leading to it. Experience traditional Japanese temple culture and shop for souvenirs.",
              category: "Culture",
              why_it_matches_you: "Combines your interests in Culture, History, and Shopping in one location",
              estimated_cost: {
                currency: "NZD",
                range: "Free (shopping optional)",
              },
              duration_hours: 2,
              location: "Asakusa, Tokyo, Japan",
              best_time_to_visit: "Morning or afternoon",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Main areas are wheelchair accessible",
            },
            {
              type: "paid" as const,
              name: "Ghibli Museum",
              description: "A magical museum dedicated to Studio Ghibli films. Must-book in advance. Perfect for families and fans of Japanese animation.",
              category: "Culture",
              why_it_matches_you: "Unique cultural experience that's perfect for a family holiday",
              estimated_cost: {
                currency: "NZD",
                range: "20-30 per person",
              },
              duration_hours: 3,
              location: "Mitaka, Tokyo, Japan",
              best_time_to_visit: "Morning or early afternoon",
              booking_required: true,
              deal_sources: [
                {
                  provider_name: "Local operator",
                  provider_type: "local_operator",
                  typical_price_notes: "Tickets must be purchased in advance through official channels",
                },
              ],
              accessibility_notes: "Wheelchair accessible",
            },
          ],
        },
        {
          theme_name: "Family Fun",
          activities: [
            {
              type: "paid" as const,
              name: "Tokyo Disneyland",
              description: "The magical theme park perfect for families. Full day of entertainment, rides, and Disney magic.",
              category: "Adventure",
              why_it_matches_you: "Perfect for your family holiday with 4 travelers, especially great for family bonding",
              estimated_cost: {
                currency: "NZD",
                range: "80-120 per person",
              },
              duration_hours: 8,
              location: "Tokyo, Japan",
              best_time_to_visit: "Full day",
              booking_required: true,
              deal_sources: [
                {
                  provider_name: "Klook",
                  provider_type: "OTA",
                  typical_price_notes: "Multi-day passes and fast passes available",
                },
                {
                  provider_name: "GetYourGuide",
                  provider_type: "OTA",
                  typical_price_notes: "Skip-the-line tickets available",
                },
              ],
              accessibility_notes: "Wheelchair accessible, many rides accommodate accessibility needs",
            },
            {
              type: "paid" as const,
              name: "Tokyo DisneySea",
              description: "Unique Disney theme park with nautical themes. Perfect alternative or addition to Disneyland.",
              category: "Adventure",
              why_it_matches_you: "Great family activity that offers something different from Disneyland",
              estimated_cost: {
                currency: "NZD",
                range: "80-120 per person",
              },
              duration_hours: 8,
              location: "Tokyo, Japan",
              best_time_to_visit: "Full day",
              booking_required: true,
              deal_sources: [
                {
                  provider_name: "Klook",
                  provider_type: "OTA",
                  typical_price_notes: "Multi-day passes available",
                },
              ],
              accessibility_notes: "Wheelchair accessible",
            },
            {
              type: "paid" as const,
              name: "Ueno Zoo",
              description: "Japan's oldest zoo, perfect for a family morning visit. Great for kids and adults alike.",
              category: "Nature",
              why_it_matches_you: "Family-friendly activity perfect for your family holiday, especially good for Mum's birthday morning",
              estimated_cost: {
                currency: "NZD",
                range: "8-12 per person",
              },
              duration_hours: 3,
              location: "Ueno, Tokyo, Japan",
              best_time_to_visit: "Morning",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Wheelchair accessible",
            },
          ],
        },
        {
          theme_name: "Nature & Outdoors",
          activities: [
            {
              type: "paid" as const,
              name: "Mount Fuji Day Trip",
              description: "Full day trip to see Japan's iconic Mount Fuji. Breathtaking views and nature experience. Includes traditional mountain meal.",
              category: "Nature",
              why_it_matches_you: "Perfect for your interest in Mountains and Nature, great family adventure",
              estimated_cost: {
                currency: "NZD",
                range: "100-150 per person (including transport and meal)",
              },
              duration_hours: 10,
              location: "Mount Fuji, Japan",
              best_time_to_visit: "Full day",
              booking_required: true,
              deal_sources: [
                {
                  provider_name: "GetYourGuide",
                  provider_type: "OTA",
                  typical_price_notes: "Guided tours with lunch included",
                },
                {
                  provider_name: "Klook",
                  provider_type: "OTA",
                  typical_price_notes: "Day trip packages available",
                },
              ],
              accessibility_notes: "Some areas may have limited accessibility",
            },
            {
              type: "free" as const,
              name: "Yoyogi Park",
              description: "Large public park perfect for a leisurely afternoon. Great for picnics, walking, and relaxing.",
              category: "Nature",
              why_it_matches_you: "Perfect for a relaxed family afternoon, matches your interest in Nature",
              estimated_cost: {
                currency: "NZD",
                range: "Free",
              },
              duration_hours: 2,
              location: "Shibuya, Tokyo, Japan",
              best_time_to_visit: "Afternoon",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Wheelchair accessible paths",
            },
            {
              type: "paid" as const,
              name: "Sumida River Boat Ride",
              description: "Evening boat ride on the Sumida River offering beautiful views of Tokyo's skyline and bridges.",
              category: "Nature",
              why_it_matches_you: "Scenic experience perfect for families, great way to see Tokyo from a different perspective",
              estimated_cost: {
                currency: "NZD",
                range: "15-25 per person",
              },
              duration_hours: 1,
              location: "Asakusa, Tokyo, Japan",
              best_time_to_visit: "Evening",
              booking_required: false,
              deal_sources: [
                {
                  provider_name: "Klook",
                  provider_type: "OTA",
                  typical_price_notes: "Evening cruise tickets available",
                },
              ],
              accessibility_notes: "Wheelchair accessible boats available",
            },
          ],
        },
        {
          theme_name: "Food & Markets",
          activities: [
            {
              type: "free" as const,
              name: "Tsukiji Fish Market",
              description: "Experience local food culture at Tokyo's famous fish market. Great for morning visits to see the market in action.",
              category: "Food",
              why_it_matches_you: "Perfect for your interest in Food and experiencing authentic Japanese culture",
              estimated_cost: {
                currency: "NZD",
                range: "Free (food purchases optional)",
              },
              duration_hours: 2,
              location: "Tsukiji, Tokyo, Japan",
              best_time_to_visit: "Early morning",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Market can be crowded, some areas may have limited accessibility",
            },
          ],
        },
        {
          theme_name: "Shopping & Entertainment",
          activities: [
            {
              type: "free" as const,
              name: "Akihabara District",
              description: "Famous electronics and anime district. Perfect for shopping, exploring Japanese pop culture, and finding unique souvenirs.",
              category: "Shopping",
              why_it_matches_you: "Great for Christmas Day shopping and exploring Japanese culture",
              estimated_cost: {
                currency: "NZD",
                range: "Free (shopping optional)",
              },
              duration_hours: 4,
              location: "Akihabara, Tokyo, Japan",
              best_time_to_visit: "Afternoon",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Main streets are wheelchair accessible",
            },
            {
              type: "free" as const,
              name: "Harajuku District",
              description: "Known for youth culture, fashion, and unique shopping. Great for last-minute shopping and experiencing Tokyo's vibrant street culture.",
              category: "Shopping",
              why_it_matches_you: "Perfect for your interest in Shopping and experiencing modern Japanese culture",
              estimated_cost: {
                currency: "NZD",
                range: "Free (shopping optional)",
              },
              duration_hours: 3,
              location: "Harajuku, Tokyo, Japan",
              best_time_to_visit: "Morning or afternoon",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Main shopping streets are accessible",
            },
            {
              type: "free" as const,
              name: "Roppongi Hills",
              description: "Modern shopping and entertainment complex with shops, restaurants, and nightlife. Great for evening exploration.",
              category: "Shopping",
              why_it_matches_you: "Perfect for evening shopping and entertainment, matches your interest in Shopping and Nightlife",
              estimated_cost: {
                currency: "NZD",
                range: "Free (shopping and dining optional)",
              },
              duration_hours: 3,
              location: "Roppongi, Tokyo, Japan",
              best_time_to_visit: "Evening",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Wheelchair accessible",
            },
          ],
        },
        {
          theme_name: "Landmarks & Views",
          activities: [
            {
              type: "paid" as const,
              name: "Tokyo Skytree",
              description: "Tokyo's tallest tower offering panoramic views of the city. Perfect for special occasions like Mum's birthday. Includes Sky Restaurant 634 for special dinners.",
              category: "Adventure",
              why_it_matches_you: "Perfect for celebrating Mum's birthday with a special evening experience and breathtaking views",
              estimated_cost: {
                currency: "NZD",
                range: "25-35 per person (restaurant dining additional)",
              },
              duration_hours: 2,
              location: "Sumida, Tokyo, Japan",
              best_time_to_visit: "Evening",
              booking_required: true,
              deal_sources: [
                {
                  provider_name: "Klook",
                  provider_type: "OTA",
                  typical_price_notes: "Skip-the-line tickets and restaurant reservations available",
                },
                {
                  provider_name: "GetYourGuide",
                  provider_type: "OTA",
                  typical_price_notes: "Fast-track tickets available",
                },
              ],
              accessibility_notes: "Wheelchair accessible",
            },
          ],
        },
      ],
      top_picks: [
        "Tokyo Disneyland - Perfect for family fun",
        "Mount Fuji Day Trip - Breathtaking nature experience",
        "Tokyo Skytree - Special birthday celebration spot",
        "Ghibli Museum - Unique cultural experience",
        "Senso-ji Temple - Traditional Japanese culture",
      ],
    }

    return NextResponse.json(hardcodedActivities)
  } catch (error) {
    console.error("Error generating activities:", error)
    return NextResponse.json({ error: "Failed to generate activities" }, { status: 500 })
  }
}

