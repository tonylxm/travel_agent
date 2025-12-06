'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookingConfirmation } from '../types';
import { formatCurrency, formatDate, generateBookingId } from '../utils';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('Invalid session');
      setLoading(false);
      return;
    }

    // Verify payment and generate confirmation
    const processBooking = async () => {
      try {
        // Verify payment with Stripe
        const verifyResponse = await fetch(`/api/pay/verify?session_id=${sessionId}`);
        
        if (!verifyResponse.ok) {
          throw new Error('Payment verification failed');
        }

        const { paymentIntentId } = await verifyResponse.json();

        // Retrieve trip plan from sessionStorage
        const tripPlanData = sessionStorage.getItem('tripPlan');
        const searchInputData = sessionStorage.getItem('searchInput');

        if (!tripPlanData || !searchInputData) {
          throw new Error('Trip data not found');
        }

        const tripPlan = JSON.parse(tripPlanData);
        const searchInput = JSON.parse(searchInputData);

        // Generate booking confirmation
        const bookingConfirmation: BookingConfirmation = {
          bookingId: generateBookingId(),
          tripPlan,
          searchInput,
          paymentIntentId,
          bookedAt: new Date().toISOString(),
        };

        setConfirmation(bookingConfirmation);

        // Send confirmation email
        const email = prompt('Enter your email for confirmation:');
        if (email) {
          const emailResponse = await fetch('/api/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              bookingConfirmation,
            }),
          });

          if (emailResponse.ok) {
            setEmailSent(true);
          }
        }

        // Clear session storage
        sessionStorage.removeItem('tripPlan');
        sessionStorage.removeItem('searchInput');

      } catch (err) {
        console.error('Error processing booking:', err);
        setError(err instanceof Error ? err.message : 'Failed to process booking');
      } finally {
        setLoading(false);
      }
    };

    processBooking();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your booking...</p>
        </div>
      </div>
    );
  }

  if (error || !confirmation) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Failed</h1>
            <p className="text-gray-600 mb-6">{error || 'Something went wrong'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { bookingId, tripPlan, searchInput } = confirmation;
  const { outboundFlight, returnFlight, hotel, itinerary, totalPrice } = tripPlan;
  const { origin, destination, startDate, endDate, travelers } = searchInput;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">Your trip is all set. Get ready for an amazing adventure!</p>
          
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold text-indigo-600">{bookingId}</p>
          </div>

          {emailSent && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">✓ Confirmation email sent successfully!</p>
            </div>
          )}
        </div>

        {/* Trip Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Trip Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-semibold text-gray-900">{origin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="font-semibold text-gray-900">{destination}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dates</p>
              <p className="font-semibold text-gray-900">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Travelers</p>
              <p className="font-semibold text-gray-900">{travelers}</p>
            </div>
          </div>
        </div>

        {/* Flights */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✈️ Flights</h2>
          
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-semibold text-gray-700 mb-3">Outbound Flight</h3>
            <div className="space-y-2">
              <p><span className="text-gray-600">Airline:</span> <span className="font-semibold">{outboundFlight.airline}</span></p>
              <p><span className="text-gray-600">Flight:</span> <span className="font-semibold">{outboundFlight.flightNumber}</span></p>
              <p><span className="text-gray-600">Departure:</span> <span className="font-semibold">{outboundFlight.departure}</span></p>
              <p><span className="text-gray-600">Arrival:</span> <span className="font-semibold">{outboundFlight.arrival}</span></p>
              <p><span className="text-gray-600">Duration:</span> <span className="font-semibold">{outboundFlight.duration}</span></p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Return Flight</h3>
            <div className="space-y-2">
              <p><span className="text-gray-600">Airline:</span> <span className="font-semibold">{returnFlight.airline}</span></p>
              <p><span className="text-gray-600">Flight:</span> <span className="font-semibold">{returnFlight.flightNumber}</span></p>
              <p><span className="text-gray-600">Departure:</span> <span className="font-semibold">{returnFlight.departure}</span></p>
              <p><span className="text-gray-600">Arrival:</span> <span className="font-semibold">{returnFlight.arrival}</span></p>
              <p><span className="text-gray-600">Duration:</span> <span className="font-semibold">{returnFlight.duration}</span></p>
            </div>
          </div>
        </div>

        {/* Hotel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏨 Hotel</h2>
          <div className="space-y-2">
            <p><span className="text-gray-600">Name:</span> <span className="font-semibold">{hotel.name}</span></p>
            <p><span className="text-gray-600">Rating:</span> <span className="font-semibold">{hotel.rating} ⭐</span></p>
            <p><span className="text-gray-600">Location:</span> <span className="font-semibold">{hotel.address}</span></p>
            <p><span className="text-gray-600">Price per Night:</span> <span className="font-semibold">{formatCurrency(hotel.pricePerNight)}</span></p>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Your Itinerary</h2>
          <div className="space-y-4">
            {itinerary.map((day) => (
              <div key={day.day} className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Day {day.day}: {day.title}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {day.activities.map((activity, idx) => (
                    <li key={idx} className="text-sm">{activity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-indigo-600 rounded-lg shadow-lg p-8 mb-6 text-center text-white">
          <p className="text-lg mb-2">Total Paid</p>
          <p className="text-4xl font-bold">{formatCurrency(totalPrice)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Print Confirmation
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Book Another Trip
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          This is a simulated booking for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
