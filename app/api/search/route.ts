import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const searchSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  travelers: z.number().min(1).max(20),
  startDate: z.string(),
  endDate: z.string(),
});

/**
 * POST /api/search
 * Search for available trips (delegates to /api/plan)
 * This endpoint exists for semantic clarity - in production,
 * you might search multiple providers here
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedInput = searchSchema.parse(body);

    // For this hackathon MVP, we directly generate a trip plan
    // In production, this would search multiple flight/hotel APIs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const planResponse = await fetch(`${baseUrl}/api/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedInput),
    });

    if (!planResponse.ok) {
      throw new Error('Failed to generate trip plan');
    }

    const tripPlan = await planResponse.json();

    return NextResponse.json({
      success: true,
      data: tripPlan,
    });

  } catch (error) {
    console.error('Error searching trips:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to search trips' },
      { status: 500 }
    );
  }
}
