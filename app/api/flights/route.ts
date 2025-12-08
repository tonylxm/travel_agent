import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import type { Location } from "@/lib/types/location"
import { formatLocation } from "@/lib/types/location"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface TripData {
  origin: Location | string
  destinations: (Location | string)[]
  startDate: string
  endDate: string
  travelers?: number
  itinerary?: string // Itinerary text to determine flight dates
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destinations, startDate, endDate, travelers = 1, itinerary }: TripData = body

    if (!origin || !destinations || destinations.length === 0 || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format locations
    const originFormatted = typeof origin === "object" ? formatLocation(origin as Location) : origin
    const destinationsFormatted = destinations.map((dest: Location | string) =>
      typeof dest === "object" ? formatLocation(dest as Location) : dest
    )

    // Build flight segments: origin → dest1, dest1 → dest2, etc.
    const segments: Array<{ from: Location | string; to: Location | string }> = []
    
    // First segment: origin → first destination
    segments.push({ from: origin, to: destinations[0] })
    
    // Additional segments: dest[i] → dest[i+1]
    for (let i = 0; i < destinations.length - 1; i++) {
      segments.push({ from: destinations[i], to: destinations[i + 1] })
    }

    // If single destination, generate return flight packages (outbound + return)
    if (destinations.length === 1) {
      const originLoc = typeof origin === "object" ? origin : null
      const destLoc = typeof destinations[0] === "object" ? destinations[0] : null
      
      if (!originLoc || !destLoc) {
        return NextResponse.json({ error: "Invalid location data" }, { status: 400 })
      }

      const originAirportName = originLoc.airportName
      const originAirportCode = originLoc.airportCode
      const destAirportName = destLoc.airportName
      const destAirportCode = destLoc.airportCode

      // Hardcoded return flight packages for demo (Auckland ↔ Tokyo, 4 travelers)
      // Prices are total for 4 travelers
      const hardcodedPackages = {
        packages: [
          {
            price: 2400, // $600 per person × 4
            cabin: "Economy",
            segments: [
              {
                from: originFormatted,
                to: destinationsFormatted[0],
                airline: "Air New Zealand",
                flightNumber: "NZ89",
                date: startDate, // Dec 18, 2025
                departure_time: "10:05",
                arrival_time: "18:30",
                price: 1300, // Outbound price for 4 travelers
                duration: 675, // 11h 15m in minutes
                departure_airport: { name: `${originAirportName} (${originAirportCode})` },
                arrival_airport: { name: `${destAirportName} (${destAirportCode})` },
              },
              {
                from: destinationsFormatted[0],
                to: originFormatted,
                airline: "Air New Zealand",
                flightNumber: "NZ90",
                date: endDate, // Dec 28, 2025
                departure_time: "20:15",
                arrival_time: "10:30",
                price: 1200, // Return price for 4 travelers
                duration: 675, // 11h 15m in minutes
                departure_airport: { name: `${destAirportName} (${destAirportCode})` },
                arrival_airport: { name: `${originAirportName} (${originAirportCode})` },
              },
            ],
          },
          {
            price: 2600, // $650 per person × 4
            cabin: "Economy",
            segments: [
              {
                from: originFormatted,
                to: destinationsFormatted[0],
                airline: "Qantas",
                flightNumber: "QF25",
                date: startDate,
                departure_time: "14:20",
                arrival_time: "22:35",
                price: 1400,
                duration: 675,
                departure_airport: { name: `${originAirportName} (${originAirportCode})` },
                arrival_airport: { name: `${destAirportName} (${destAirportCode})` },
              },
              {
                from: destinationsFormatted[0],
                to: originFormatted,
                airline: "Qantas",
                flightNumber: "QF26",
                date: endDate,
                departure_time: "23:45",
                arrival_time: "14:00",
                price: 1300,
                duration: 675,
                departure_airport: { name: `${destAirportName} (${destAirportCode})` },
                arrival_airport: { name: `${originAirportName} (${originAirportCode})` },
              },
            ],
          },
          {
            price: 2800, // $700 per person × 4
            cabin: "Economy",
            segments: [
              {
                from: originFormatted,
                to: destinationsFormatted[0],
                airline: "Japan Airlines",
                flightNumber: "JL60",
                date: startDate,
                departure_time: "08:30",
                arrival_time: "16:45",
                price: 1500,
                duration: 675,
                departure_airport: { name: `${originAirportName} (${originAirportCode})` },
                arrival_airport: { name: `${destAirportName} (${destAirportCode})` },
              },
              {
                from: destinationsFormatted[0],
                to: originFormatted,
                airline: "Japan Airlines",
                flightNumber: "JL61",
                date: endDate,
                departure_time: "17:00",
                arrival_time: "07:15",
                price: 1400,
                duration: 675,
                departure_airport: { name: `${destAirportName} (${destAirportCode})` },
                arrival_airport: { name: `${originAirportName} (${originAirportCode})` },
              },
            ],
          },
          {
            price: 5600, // $1400 per person × 4 (Business class)
            cabin: "Business",
            segments: [
              {
                from: originFormatted,
                to: destinationsFormatted[0],
                airline: "Air New Zealand",
                flightNumber: "NZ89",
                date: startDate,
                departure_time: "10:05",
                arrival_time: "18:30",
                price: 3000,
                duration: 675,
                departure_airport: { name: `${originAirportName} (${originAirportCode})` },
                arrival_airport: { name: `${destAirportName} (${destAirportCode})` },
              },
              {
                from: destinationsFormatted[0],
                to: originFormatted,
                airline: "Air New Zealand",
                flightNumber: "NZ90",
                date: endDate,
                departure_time: "20:15",
                arrival_time: "10:30",
                price: 2800,
                duration: 675,
                departure_airport: { name: `${destAirportName} (${destAirportCode})` },
                arrival_airport: { name: `${originAirportName} (${originAirportCode})` },
              },
            ],
          },
          {
            price: 3000, // $750 per person × 4
            cabin: "Economy",
            segments: [
              {
                from: originFormatted,
                to: destinationsFormatted[0],
                airline: "Singapore Airlines",
                flightNumber: "SQ285",
                date: startDate,
                departure_time: "12:00",
                arrival_time: "20:15",
                price: 1500,
                duration: 675,
                departure_airport: { name: `${originAirportName} (${originAirportCode})` },
                arrival_airport: { name: `${destAirportName} (${destAirportCode})` },
              },
              {
                from: destinationsFormatted[0],
                to: originFormatted,
                airline: "Singapore Airlines",
                flightNumber: "SQ286",
                date: endDate,
                departure_time: "21:30",
                arrival_time: "11:45",
                price: 1500,
                duration: 675,
                departure_airport: { name: `${destAirportName} (${destAirportCode})` },
                arrival_airport: { name: `${originAirportName} (${originAirportCode})` },
              },
            ],
          },
        ],
      }

      return NextResponse.json(hardcodedPackages)
    }

    // Multi-destination: Generate complete packages
    // Build airport info for all segments
    const segmentsInfo = segments.map((seg) => {
      const fromLoc = typeof seg.from === "object" ? seg.from : null
      const toLoc = typeof seg.to === "object" ? seg.to : null
      return {
        from: seg.from,
        to: seg.to,
        fromFormatted: typeof seg.from === "object" ? formatLocation(seg.from) : seg.from,
        toFormatted: typeof seg.to === "object" ? formatLocation(seg.to) : seg.to,
        fromAirportName: fromLoc?.airportName || "",
        fromAirportCode: fromLoc?.airportCode || "",
        toAirportName: toLoc?.airportName || "",
        toAirportCode: toLoc?.airportCode || "",
      }
    })

    // Create prompt for AI to determine flight dates based on itinerary
    const itineraryContext = itinerary
      ? `\n\nITINERARY CONTEXT (use this to determine when flights should occur):
${itinerary}

Based on the itinerary above, determine appropriate dates for each flight segment. The first flight should be on ${startDate}. Subsequent flights should align with when the itinerary indicates moving between cities.`
      : `\n\nCalculate flight dates by dividing the trip duration (${startDate} to ${endDate}) across ${destinations.length + 1} locations. The first flight should be on ${startDate}.`

    const userPrompt = `You MUST output valid JSON only, conforming exactly to the schema at the end of this prompt.

Generate 4-5 complete flight PACKAGES for a multi-city trip. Each package must include ALL flight segments:

Flight Segments Required:
${segmentsInfo
  .map(
    (seg, idx) =>
      `Segment ${idx + 1}: ${seg.fromFormatted} → ${seg.toFormatted}
  - From: "${seg.fromAirportName} (${seg.fromAirportCode})"
  - To: "${seg.toAirportName} (${seg.toAirportCode})"`
  )
  .join("\n")}

Trip Details:
- Start Date: ${startDate}
- End Date: ${endDate}
- Number of Travelers: ${travelers}
${itineraryContext}

CRITICAL REQUIREMENTS:
1. Each package must include ALL ${segmentsInfo.length} flight segments
2. All flights must be DIRECT (no connecting flights)
3. Use EXACT airport names from database:
${segmentsInfo
  .map(
    (seg) =>
      `   - ${seg.fromFormatted}: "${seg.fromAirportName} (${seg.fromAirportCode})"\n   - ${seg.toFormatted}: "${seg.toAirportName} (${seg.toAirportCode})"`
  )
  .join("\n")}
4. Generate realistic prices per segment and total package price
5. Generate realistic flight durations in minutes
6. Determine appropriate flight dates based on the itinerary (may be slightly earlier than ${startDate} if needed)
7. IMPORTANT: Include 1 business class package option (significantly more expensive, typically 2-3x economy price)
8. Generate realistic airline names and flight numbers for each segment (e.g., "Air New Zealand NZ89", "Qantas QF25")
9. Generate realistic departure and arrival times for each segment (format: "HH:MM" in 24-hour format)

--- JSON SCHEMA (required) ---
{
  "packages": [
    {
      "price": number,
      "cabin": "Economy" | "Business",
      "segments": [
        {
          "from": string,
          "to": string,
          "airline": string,
          "flightNumber": string,
          "date": string,
          "departure_time": string,
          "arrival_time": string,
          "price": number,
          "duration": number,
          "departure_airport": {
            "name": string
          },
          "arrival_airport": {
            "name": string
          }
        }
      ]
    }
  ]
}

Each package must have exactly ${segmentsInfo.length} segments. The "from" and "to" fields should be "City, Country" format.`

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // Return mock package structure
      return NextResponse.json({
        packages: [
          {
            price: segmentsInfo.reduce((sum) => sum + 500, 0),
            cabin: "Economy",
            segments: segmentsInfo.map((seg, idx) => ({
              from: seg.fromFormatted,
              to: seg.toFormatted,
              airline: "Air New Zealand",
              flightNumber: `NZ${100 + idx}`,
              date: startDate, // Mock date
              departure_time: "10:00",
              arrival_time: "14:00",
              price: 500,
              duration: 480,
              departure_airport: { name: `${seg.fromAirportName} (${seg.fromAirportCode})` },
              arrival_airport: { name: `${seg.toAirportName} (${seg.toAirportCode})` },
            })),
          },
        ],
      })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a flight search expert. You MUST respond with valid JSON only, no markdown, no explanations, just the raw JSON object. CRITICALLY: When airport names are provided from the database, you MUST use those exact names - do not modify, abbreviate, or use alternative names.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const content = completion.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "Failed to generate flights" }, { status: 500 })
    }

    let flightsData
    try {
      flightsData = JSON.parse(content)
    } catch (parseError) {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          flightsData = JSON.parse(jsonMatch[1] || jsonMatch[0])
        } catch (e) {
          return NextResponse.json({ error: "Failed to parse flight data" }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: "Invalid response format" }, { status: 500 })
      }
    }

    // Ensure the response has the correct structure
    if (destinations.length === 1) {
      if (!flightsData.flights || !Array.isArray(flightsData.flights)) {
        return NextResponse.json({ error: "Invalid flight data structure" }, { status: 500 })
      }
    } else {
      if (!flightsData.packages || !Array.isArray(flightsData.packages)) {
        return NextResponse.json({ error: "Invalid package data structure" }, { status: 500 })
      }
    }

    return NextResponse.json(flightsData)
  } catch (error) {
    console.error("Error generating flights:", error)
    return NextResponse.json({ error: "Failed to generate flights" }, { status: 500 })
  }
}
