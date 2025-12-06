import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

// Validation schema
const paymentSchema = z.object({
  amount: z.number().min(1),
  tripDetails: z.object({
    origin: z.string(),
    destination: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    travelers: z.number(),
  }),
});

/**
 * POST /api/pay
 * Create a Stripe Checkout Session for trip payment
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedInput = paymentSchema.parse(body);
    const { amount, tripDetails } = validatedInput;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Trip to ${tripDetails.destination}`,
              description: `${tripDetails.origin} → ${tripDetails.destination} | ${tripDetails.startDate} to ${tripDetails.endDate} | ${tripDetails.travelers} traveler(s)`,
              images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=true`,
      metadata: {
        origin: tripDetails.origin,
        destination: tripDetails.destination,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        travelers: tripDetails.travelers.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating payment session:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pay/verify
 * Verify a payment session after successful checkout
 */
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: session.payment_intent,
      metadata: session.metadata,
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
