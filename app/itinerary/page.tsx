'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TripPlan, TripSearchInput } from '../types';
import { formatCurrency, formatDate } from '../utils';

export default function ItineraryPage() {
  const router = useRouter();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [searchInput, setSearchInput] = useState<TripSearchInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedPlan = sessionStorage.getItem('tripPlan');
      const storedSearch = sessionStorage.getItem('searchInput');

      if (!storedPlan || !storedSearch) {
        setError('Trip details not found. Please start from home.');
        return;
      }

      setTripPlan(JSON.parse(storedPlan));
      setSearchInput(JSON.parse(storedSearch));
    } catch (err) {
      console.error('Error loading data', err);
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePayment = async () => {
    if (!tripPlan || !searchInput) return;
    setPaying(true);
    setError(null);

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: tripPlan.totalPrice,
          tripDetails: {
            origin: searchInput.origin,
            destination: searchInput.destination,
            startDate: searchInput.startDate,
            endDate: searchInput.endDate,
            travelers: searchInput.travelers,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to create payment session');

      const { url } = await response.json();
      if (!url) throw new Error('No checkout URL returned');

      window.location.href = url;
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !tripPlan || !searchInput) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cannot load itinerary</h1>
            <p className="text-gray-600 mb-6">{error || 'Please restart from the home page.'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📅</span>
            Review Itinerary & Pay
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-semibold text-gray-900">{searchInput.origin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="font-semibold text-gray-900">{searchInput.destination}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dates</p>
              <p className="font-semibold text-gray-900">{formatDate(searchInput.startDate)} - {formatDate(searchInput.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Travelers</p>
              <p className="font-semibold text-gray-900">{searchInput.travelers}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {tripPlan.itinerary.map((day) => (
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

          <div className="bg-indigo-600 rounded-lg shadow-lg p-8 text-center text-white mb-6">
            <p className="text-lg mb-2">Total to Pay</p>
            <p className="text-4xl font-bold">{formatCurrency(tripPlan.totalPrice)}</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/accom')}
              className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Back to Accommodation
            </button>
            <button
              onClick={handlePayment}
              disabled={paying}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {paying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>💳</span>
                  Pay & Book Now
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">Secure payment powered by Stripe (Test Mode)</p>
        </div>
      </div>
    </div>
  );
}
