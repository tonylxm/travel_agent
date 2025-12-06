'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TripPlan } from '../types';
import { formatCurrency } from '../utils';

export default function AccommodationPage() {
  const router = useRouter();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('tripPlan');
      if (!stored) {
        setError('Trip plan not found. Please start from home.');
        return;
      }
      setTripPlan(JSON.parse(stored));
    } catch (err) {
      console.error('Error loading trip plan', err);
      setError('Failed to load trip plan');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accommodation...</p>
        </div>
      </div>
    );
  }

  if (error || !tripPlan) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cannot load accommodation</h1>
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
            <span>🏨</span>
            Confirm Your Accommodation
          </h2>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tripPlan.hotel.name}</h3>
              <p className="text-gray-600 mb-3">{tripPlan.hotel.address}</p>
              <div className="flex items-center gap-4">
                <span className="text-yellow-500 font-semibold">{tripPlan.hotel.rating} ⭐</span>
                <span className="text-gray-600">{formatCurrency(tripPlan.hotel.pricePerNight)} / night</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total (Hotel)</p>
              <p className="text-2xl font-bold text-indigo-600">{formatCurrency(tripPlan.hotel.totalPrice)}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/flights')}
              className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Back to Flights
            </button>
            <button
              onClick={() => router.push('/itinerary')}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Confirm Accommodation & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
