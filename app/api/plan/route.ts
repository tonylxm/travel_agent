import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { TripPlan, DayItinerary } from '@/app/types';
import {
  airlines,
  hotelChains,
  generateFlightNumber,
  estimateFlightDuration,
  generateFlightPrice,
  generateHotelPrice,
  calculateNights,
  formatTime,
} from '@/app/utils';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validation schema
const searchSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  travelers: z.number().min(1).max(20),
  startDate: z.string(),
  endDate: z.string(),
});

/**
 * POST /api/plan
 * Generate a complete trip plan using OpenAI
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedInput = searchSchema.parse(body);
    const { origin, destination, travelers, startDate, endDate } = validatedInput;

    // Calculate trip details
    const nights = calculateNights(startDate, endDate);
    const days = nights + 1;

    // Generate flight data
    const outboundAirline = airlines[Math.floor(Math.random() * airlines.length)];
    const returnAirline = airlines[Math.floor(Math.random() * airlines.length)];
    
    const flightPrice = generateFlightPrice(origin, destination, startDate);
    
    const outboundFlight = {
      airline: outboundAirline,
      flightNumber: generateFlightNumber(outboundAirline),
      departure: `${origin} - ${formatTime(8)}`,
      arrival: `${destination} - ${formatTime(14)}`,
      duration: estimateFlightDuration(origin, destination),
      price: flightPrice,
    };

    const returnFlight = {
      airline: returnAirline,
      flightNumber: generateFlightNumber(returnAirline),
      departure: `${destination} - ${formatTime(15)}`,
      arrival: `${origin} - ${formatTime(21)}`,
      duration: estimateFlightDuration(destination, origin),
      price: flightPrice,
    };

    // Generate hotel data
    const hotelName = hotelChains[Math.floor(Math.random() * hotelChains.length)];
    const rating = 4 + Math.random(); // 4.0 to 5.0
    const pricePerNight = generateHotelPrice(destination, rating);
    
    const hotel = {
      name: `${hotelName} ${destination}`,
      rating: Math.round(rating * 10) / 10,
      address: `Downtown ${destination}`,
      pricePerNight,
      totalPrice: pricePerNight * nights,
    };

    // Use OpenAI to generate day-by-day itinerary
    // Mock OpenAI call for now - original call commented out
    /*
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
      {
        role: 'system',
        content: `You are a travel planning assistant. Generate a realistic ${days}-day itinerary for ${destination}. 
        Return ONLY a JSON array with this exact structure:
        [
        {
          "day": 1,
          "title": "Arrival & Exploration",
          "activities": ["Activity 1", "Activity 2", "Activity 3"]
        }
        ]
        
        Each day should have 3-4 activities. Be specific to ${destination}. Make it exciting and realistic.`,
      },
      {
        role: 'user',
        content: `Create a ${days}-day itinerary for ${travelers} traveler(s) visiting ${destination} from ${startDate} to ${endDate}.`,
      },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });
    */

    // Mocked response to simulate OpenAI output
    const mockedItinerary = Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      const isArrival = i === 0;
      const isDeparture = i === days - 1;
      const title = isArrival
      ? 'Arrival & Exploration'
      : isDeparture
      ? 'Departure Day'
      : `Day ${dayNum} Exploration`;

      const activities = isArrival
      ? [
        `Arrive in ${destination} and check into hotel`,
        `Lunch at a popular local spot in ${destination}`,
        `Afternoon walking tour of downtown ${destination}`,
        `Dinner at a recommended restaurant`,
        ]
      : isDeparture
      ? [
        `Breakfast at the hotel`,
        `Last-minute shopping or stroll in ${destination}`,
        `Check out and transfer to the airport`,
        ]
      : [
        `Breakfast at a local cafe in ${destination}`,
        `Visit a top attraction in ${destination}`,
        `Lunch at a well-rated local restaurant`,
        `Evening cultural activity or show`,
        ];

      return {
      day: dayNum,
      title,
      activities,
      };
    });

    // Provide the same shape the code expects from OpenAI
    const completion: any = {
      choices: [
      {
        message: {
        content: JSON.stringify(mockedItinerary),
        },
      },
      ],
    };

    // Parse the AI response
    let itinerary: DayItinerary[] = [];
    try {
      const aiResponse = completion.choices[0].message.content || '[]';
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      itinerary = JSON.parse(jsonString);
    } catch (parseError) {
      // Fallback itinerary if AI parsing fails
      console.error('Failed to parse AI itinerary:', parseError);
      itinerary = Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: i === 0 ? 'Arrival Day' : i === days - 1 ? 'Departure Day' : `Day ${i + 1} Exploration`,
        activities: [
          'Morning: Local breakfast and city tour',
          'Afternoon: Visit popular attractions',
          'Evening: Dinner at local restaurant',
        ],
      }));
    }

    // Calculate total price
    const totalFlightCost = (outboundFlight.price + returnFlight.price) * travelers;
    const totalHotelCost = hotel.totalPrice;
    const totalPrice = totalFlightCost + totalHotelCost;

    const tripPlan: TripPlan = {
      outboundFlight,
      returnFlight,
      hotel,
      itinerary,
      totalPrice,
    };

    return NextResponse.json(tripPlan);

  } catch (error) {
    console.error('Error generating trip plan:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate trip plan' },
      { status: 500 }
    );
  }
}
