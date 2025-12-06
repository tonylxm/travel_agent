"use client";

import { useState } from "react";
import { TripSearchInput, TripPlan } from "./types";
import { formatCurrency } from "./utils";

export default function Home() {
  // Form state
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  /**
   * Handle trip search form submission
   */

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTripPlan(null);

    try {
      const searchInput: TripSearchInput = {
        origin,
        destination,
        travelers,
        startDate,
        endDate,
      };

      // Call the plan API to generate trip
      console.log("starting api call");

      const response = await fetch("https://localhost:5000");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate trip plan");
      }

      const plan = await response.json();
      console.log(plan);

      setTripPlan(plan);

      // Store in sessionStorage for success page
      sessionStorage.setItem("tripPlan", JSON.stringify(plan));
      sessionStorage.setItem("searchInput", JSON.stringify(searchInput));

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Failed to search trips");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle payment and checkout
   */
  const handlePayment = async () => {
    if (!tripPlan) return;

    setPaymentLoading(true);
    setError(null);

    try {
      // Create Stripe Checkout Session
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: tripPlan.totalPrice,
          tripDetails: {
            origin,
            destination,
            startDate,
            endDate,
            travelers,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Failed to process payment");
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">✈️</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Travel Agent</h1>
              <p className="text-sm text-gray-600">Plan your perfect trip with AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Where do you want to go?</h2>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
              {/* Origin */}
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  id="origin"
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g., New York"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Destination */}
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Paris"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Travelers */}
              <div>
                <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
                </label>
                <input
                  id="travelers"
                  type="number"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  min="1"
                  max="20"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Planning your trip...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Plan My Trip with AI
                </>
              )}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Trip Plan Results */}
        {tripPlan && (
          <div id="results" className="space-y-6">
            {/* Flights Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>✈️</span>
                Your Flights
              </h2>

              {/* Outbound Flight */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Outbound Flight</h3>
                  <span className="text-indigo-600 font-bold">
                    {formatCurrency(tripPlan.outboundFlight.price)} / person
                  </span>
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

              {/* Return Flight */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Return Flight</h3>
                  <span className="text-indigo-600 font-bold">
                    {formatCurrency(tripPlan.returnFlight.price)} / person
                  </span>
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
            </div>

            {/* Hotel Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🏨</span>
                Your Hotel
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
            </div>

            {/* Itinerary Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>📅</span>
                AI-Generated Itinerary
              </h2>

              <div className="space-y-6">
                {tripPlan.itinerary.map((day) => (
                  <div key={day.day} className="border-l-4 border-indigo-500 pl-6 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Day {day.day}: {day.title}
                    </h3>
                    <ul className="space-y-2">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="text-indigo-500 mt-1">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Total Price</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Including flights ({travelers} traveler{travelers > 1 ? "s" : ""}) and hotel
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-indigo-600">{formatCurrency(tripPlan.totalPrice)}</p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
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

              <p className="text-center text-xs text-gray-500 mt-4">Secure payment powered by Stripe (Test Mode)</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">© 2025 AI Travel Agent</p>
        </div>
      </footer>
    </div>
  );
}
