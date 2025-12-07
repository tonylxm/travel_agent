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
- Interests: ${tripData.interests.join(", ") || "General travel"}
- Origin: ${originFormatted}`

    if (tripData.additionalInformation && tripData.additionalInformation.trim()) {
      userPrompt += `\n- Additional Information: ${tripData.additionalInformation}`
    }

    userPrompt += `\n\n${ACTIVITIES_PROMPT}`

    // TODO: Replace with actual AI agent call
    // For now, return a mock response structure
    // In production, this would call your AI agent API
    const firstDestination = tripData.destinations[0]
    const destinationFormatted = typeof firstDestination === "object" 
      ? formatLocation(firstDestination as Location) 
      : firstDestination
    
    const mockResponse = {
      destination: destinationFormatted,
      assumptions: [
        "Assuming standard travel preferences based on selected interests",
        "Activities are available during the specified travel dates",
      ],
      themes: [
        {
          theme_name: "Cultural Experiences",
          activities: [
            {
              type: "free" as const,
              name: "City Walking Tour",
              description: "Explore the historic city center on foot",
              category: "Culture",
              why_it_matches_you: "Matches your interest in Culture and History",
              estimated_cost: {
                currency: "NZD",
                range: "Free",
              },
              duration_hours: 2,
              location: destinationFormatted,
              best_time_to_visit: "Morning or late afternoon",
              booking_required: false,
              deal_sources: [],
              accessibility_notes: "Wheelchair accessible routes available",
            },
          ],
        },
      ],
      top_picks: [],
    }

    // Get OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set")
      // Fallback to mock response if API key is missing
      return NextResponse.json(mockResponse)
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // or "gpt-4" or "gpt-3.5-turbo" for cheaper option
        messages: [
          {
            role: "system",
            content:
              "You are a travel activities expert. You MUST respond with valid JSON only, no markdown, no explanations, just the raw JSON object.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }, // This ensures JSON output
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error("OpenAI API error:", errorData)
      // Fallback to mock response on error
      return NextResponse.json(mockResponse)
    }

    const openaiData = await openaiResponse.json()
    const content = openaiData.choices?.[0]?.message?.content

    if (!content) {
      console.error("No content in OpenAI response")
      return NextResponse.json(mockResponse)
    }

    // Parse the JSON response
    // Sometimes OpenAI wraps JSON in markdown code blocks, so we extract it
    let activitiesData
    try {
      // Try to parse directly first
      activitiesData = JSON.parse(content)
    } catch (parseError) {
      // If that fails, try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          activitiesData = JSON.parse(jsonMatch[1] || jsonMatch[0])
        } catch (e) {
          console.error("Failed to parse JSON from OpenAI response:", e)
          return NextResponse.json(mockResponse)
        }
      } else {
        console.error("No valid JSON found in OpenAI response")
        return NextResponse.json(mockResponse)
      }
    }

    // Validate that we have the expected structure
    if (!activitiesData || typeof activitiesData !== "object") {
      console.error("Invalid activities data structure")
      return NextResponse.json(mockResponse)
    }

    return NextResponse.json(activitiesData)
  } catch (error) {
    console.error("Error generating activities:", error)
    return NextResponse.json({ error: "Failed to generate activities" }, { status: 500 })
  }
}

