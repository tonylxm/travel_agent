import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import type { Location } from "@/lib/types/location"
import { formatLocation } from "@/lib/types/location"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destinations, startDate, endDate, budget, travelers, tripCategory, interests, additionalInformation } = body

    // Validate required fields
    if (!origin || !destinations?.length || !startDate || !endDate || !budget || !travelers || !tripCategory) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Hardcoded itinerary for demo
    const hardcodedItinerary = `Day 1: December 18, 2025

- Depart from Auckland, New Zealand.
- Arrive in Tokyo, Japan, check in at the budget-friendly hotel "Shinjuku Granbell Hotel" in the heart of Tokyo.
- Have dinner at T's Tantan, a vegetarian-friendly restaurant in Tokyo Station.

Day 2: December 19, 2025

- Visit the Tsukiji Fish Market in the morning to experience local food culture.
- Spend the afternoon at the Edo Tokyo Museum to learn about the city's history.
- Have dinner at Gonpachi Nishiazabu, known for its traditional Japanese cuisine. 

Day 3: December 20, 2025

- Spend the day at Tokyo Disneyland, a great adventure for the family.
- Have dinner at the vegetarian-friendly restaurant "Ain Soph.Soar" near the park.

Day 4: December 21, 2025

- Visit the Meiji Shrine in the morning.
- Enjoy a leisurely afternoon in Yoyogi Park.
- Have dinner at "Soranoiro NIPPON", known for its veggie ramen.

Day 5: December 22, 2025

- Full day trip to Mount Fuji, enjoy the breathtaking views and nature.
- Have a traditional mountain meal at one of the local huts.

Day 6: December 23, 2025 (Mum's birthday)

- Morning visit to Ueno Zoo and Park.
- Birthday lunch at "Botanica Tokyo", a vegetarian-friendly restaurant.
- Evening visit to Tokyo Skytree, followed by a special birthday dinner at the "Sky Restaurant 634".

Day 7: December 24, 2025

- Visit to Tokyo Disneyland or DisneySea (whichever was not visited on Day 3).
- Christmas Eve dinner at KFC (a popular tradition in Japan).

Day 8: December 25, 2025

- Christmas Day spent shopping and exploring in Akihabara, the famous electronics and anime district.
- Christmas dinner at "Coco Ichibanya", a well-known curry house with vegetarian options.

Day 9: December 26, 2025

- Visit to Asakusa, explore Senso-ji temple and Nakamise Shopping Street.
- Lunch at "Sometaro Okonomiyaki Asakusa" that serves vegetarian-friendly dishes.
- Evening boat ride on Sumida River.

Day 10: December 27, 2025

- Visit to Ghibli Museum (tickets must be booked in advance).
- Lunch at the museum's "Straw Hat Cafe", which offers vegetarian options.
- Spend the evening exploring Roppongi Hills' shops and nightlife.

Day 11: December 28, 2025

- Last minute shopping in Harajuku, known for its youth culture and fashion.
- Say goodbye to Tokyo and head to the airport for your flight back to Auckland.

Please note: Make sure to inform the restaurants about dietary preferences in advance.`

    return NextResponse.json({
      itinerary: hardcodedItinerary,
      tripDetails: {
        origin,
        destinations,
        startDate,
        endDate,
        budget,
        travelers,
        tripCategory,
        interests,
        additionalInformation,
      },
    })
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    )
  }
}
