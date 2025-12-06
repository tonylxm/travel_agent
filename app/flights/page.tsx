'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TripPlan } from '../types';
import { formatCurrency } from '../utils';

export default function FlightsPage() {
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
          <p className="mt-4 text-gray-600">Loading flights...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cannot load flights</h1>
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
            <span>✈️</span>
            Confirm Your Flights
          </h2>

          <div className="mb-6 pb-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Outbound Flight</h3>
              <span className="text-indigo-600 font-bold">{formatCurrency(tripPlan.outboundFlight.price)} / person</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Airline</p>
                <p className="font-semibold">{tripPlan.outboundFlight.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Flight</p>
                <p className="font-semibold">{tripPlan.outboundFlight.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-semibold">{tripPlan.outboundFlight.departure}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrival</p>
                <p className="font-semibold">{tripPlan.outboundFlight.arrival}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Return Flight</h3>
              <span className="text-indigo-600 font-bold">{formatCurrency(tripPlan.returnFlight.price)} / person</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Airline</p>
                <p className="font-semibold">{tripPlan.returnFlight.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Flight</p>
                <p className="font-semibold">{tripPlan.returnFlight.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-semibold">{tripPlan.returnFlight.departure}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrival</p>
                <p className="font-semibold">{tripPlan.returnFlight.arrival}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push('/accom')}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Confirm Flights & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
