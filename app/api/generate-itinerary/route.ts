import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destinations, startDate, endDate, budget, travelers, interests } = body

    // Validate required fields
    if (!origin || !destinations?.length || !startDate || !endDate || !budget || !travelers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create a structured prompt for OpenAI
    const prompt = `Create a detailed travel itinerary based on the following information:

Departure City: ${origin}
Destinations: ${destinations.join(", ")}
Start Date: ${startDate}
End Date: ${endDate}
Total Budget: $${budget}
Number of Travelers: ${travelers}
Interests: ${interests.join(", ")}

Please provide a comprehensive day-by-day itinerary including:
1. Suggested daily activities based on their interests
2. Recommended restaurants and dining experiences
3. Accommodation suggestions (budget-conscious to mid-range)

Format the response as a structured itinerary that can be easily parsed and displayed to the user.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const itinerary = completion.choices[0]?.message?.content

    if (!itinerary) {
      return NextResponse.json(
        { error: "Failed to generate itinerary" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      itinerary,
      tripDetails: {
        origin,
        destinations,
        startDate,
        endDate,
        budget,
        travelers,
        interests,
      },
    })
  } catch (error) {
    console.error("Error generating itinerary:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "OpenAI API key not configured" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    )
  }
}
