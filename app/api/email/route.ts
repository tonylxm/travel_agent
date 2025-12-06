import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { BookingConfirmation } from '@/app/types';
import { formatCurrency, formatDate } from '@/app/utils';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const emailSchema = z.object({
  to: z.string().email(),
  bookingConfirmation: z.object({
    bookingId: z.string(),
    tripPlan: z.any(),
    searchInput: z.any(),
    paymentIntentId: z.string(),
    bookedAt: z.string(),
  }),
});

/**
 * Generate HTML email template for booking confirmation
 */
function generateEmailHTML(confirmation: BookingConfirmation): string {
  const { bookingId, tripPlan, searchInput, bookedAt } = confirmation;
  const { outboundFlight, returnFlight, hotel, itinerary, totalPrice } = tripPlan;
  const { origin, destination, startDate, endDate, travelers } = searchInput;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #4F46E5;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #4F46E5;
      margin: 0;
      font-size: 28px;
    }
    .booking-id {
      background: #EEF2FF;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      margin: 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #4F46E5;
    }
    .section {
      margin: 25px 0;
      padding: 20px;
      background: #F9FAFB;
      border-radius: 6px;
    }
    .section h2 {
      margin-top: 0;
      color: #1F2937;
      font-size: 20px;
      border-bottom: 2px solid #E5E7EB;
      padding-bottom: 10px;
    }
    .flight-info, .hotel-info {
      margin: 15px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #E5E7EB;
    }
    .info-label {
      font-weight: 600;
      color: #6B7280;
    }
    .info-value {
      color: #1F2937;
      text-align: right;
    }
    .itinerary-day {
      margin: 15px 0;
      padding: 15px;
      background: white;
      border-radius: 6px;
      border-left: 4px solid #4F46E5;
    }
    .itinerary-day h3 {
      margin: 0 0 10px 0;
      color: #4F46E5;
      font-size: 16px;
    }
    .itinerary-day ul {
      margin: 5px 0;
      padding-left: 20px;
    }
    .itinerary-day li {
      margin: 5px 0;
      color: #4B5563;
    }
    .total-price {
      background: #4F46E5;
      color: white;
      padding: 20px;
      border-radius: 6px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin: 25px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #E5E7EB;
      color: #6B7280;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      background: #4F46E5;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ Booking Confirmed!</h1>
      <p>Your trip is all set. Get ready for an amazing adventure!</p>
    </div>

    <div class="booking-id">
      Booking ID: ${bookingId}
    </div>

    <div class="section">
      <h2>📍 Trip Overview</h2>
      <div class="info-row">
        <span class="info-label">From</span>
        <span class="info-value">${origin}</span>
      </div>
      <div class="info-row">
        <span class="info-label">To</span>
        <span class="info-value">${destination}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Dates</span>
        <span class="info-value">${formatDate(startDate)} - ${formatDate(endDate)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Travelers</span>
        <span class="info-value">${travelers}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Booked On</span>
        <span class="info-value">${new Date(bookedAt).toLocaleString()}</span>
      </div>
    </div>

    <div class="section">
      <h2>✈️ Outbound Flight</h2>
      <div class="flight-info">
        <div class="info-row">
          <span class="info-label">Airline</span>
          <span class="info-value">${outboundFlight.airline}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Flight Number</span>
          <span class="info-value">${outboundFlight.flightNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Departure</span>
          <span class="info-value">${outboundFlight.departure}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Arrival</span>
          <span class="info-value">${outboundFlight.arrival}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Duration</span>
          <span class="info-value">${outboundFlight.duration}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>✈️ Return Flight</h2>
      <div class="flight-info">
        <div class="info-row">
          <span class="info-label">Airline</span>
          <span class="info-value">${returnFlight.airline}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Flight Number</span>
          <span class="info-value">${returnFlight.flightNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Departure</span>
          <span class="info-value">${returnFlight.departure}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Arrival</span>
          <span class="info-value">${returnFlight.arrival}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Duration</span>
          <span class="info-value">${returnFlight.duration}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>🏨 Hotel Accommodation</h2>
      <div class="hotel-info">
        <div class="info-row">
          <span class="info-label">Hotel</span>
          <span class="info-value">${hotel.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Rating</span>
          <span class="info-value">${hotel.rating} ⭐</span>
        </div>
        <div class="info-row">
          <span class="info-label">Location</span>
          <span class="info-value">${hotel.address}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Price per Night</span>
          <span class="info-value">${formatCurrency(hotel.pricePerNight)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Total (Hotel)</span>
          <span class="info-value">${formatCurrency(hotel.totalPrice)}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>📅 Your Itinerary</h2>
      ${itinerary.map(day => `
        <div class="itinerary-day">
          <h3>Day ${day.day}: ${day.title}</h3>
          <ul>
            ${day.activities.map(activity => `<li>${activity}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <div class="total-price">
      Total Paid: ${formatCurrency(totalPrice)}
    </div>

    <div class="footer">
      <p><strong>Important:</strong> This is a simulated booking for demonstration purposes.</p>
      <p>Questions? Contact support@travelagent.com</p>
      <p style="margin-top: 20px; font-size: 12px;">
        © 2025 AI Travel Agent. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * POST /api/email
 * Send booking confirmation email
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedInput = emailSchema.parse(body);
    const { to, bookingConfirmation } = validatedInput;

    // Generate email HTML
    const htmlContent = generateEmailHTML(bookingConfirmation);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'AI Travel Agent <onboarding@resend.dev>',
      to: [to],
      subject: `✈️ Booking Confirmed - ${bookingConfirmation.bookingId}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      message: 'Confirmation email sent successfully',
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
