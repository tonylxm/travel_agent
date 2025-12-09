"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import LocationInput from "@/components/location-input"
import type { Location } from "@/lib/types/location"
import { LOCATIONS_DATABASE } from "@/lib/data/locations"
import { Calendar, Plane, MapPin } from "lucide-react"

interface TripFormData {
  origin: Location | null
  destinations: (Location | null)[]
  startDate: string
  endDate: string
  budget: number
  travelers: number
  tripCategory: string
  interests: string[]
  additionalInformation?: string
  itinerary?: string
}

const interests = [
  { name: "Food" },
  { name: "Nightlife" },
  { name: "Outdoors" },
  { name: "Museums" },
  { name: "Shopping" },
  { name: "Wellness" },
  { name: "Beach" },
  { name: "Culture" },
  { name: "Adventure" },
  { name: "History" },
  { name: "Nature" },
  { name: "Art" },
]

export default function TripForm({ onSubmit }: { onSubmit: (data: TripFormData) => void }) {
  const [formData, setFormData] = useState<TripFormData>({
    origin: null,
    destinations: [null],
    startDate: "",
    endDate: "",
    budget: 5000,
    travelers: 1,
    tripCategory: "",
    interests: [],
    additionalInformation: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddDestination = () => {
    setFormData({
      ...formData,
      destinations: [...formData.destinations, null],
    })
  }

  const handleDestinationChange = (index: number, location: Location | null) => {
    const newDestinations = [...formData.destinations]
    newDestinations[index] = location
    setFormData({ ...formData, destinations: newDestinations })
  }

  const handleInterestToggle = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter((i) => i !== interest)
        : [...formData.interests, interest],
    })
  }

  const fillDemoData = () => {
    const auckland = LOCATIONS_DATABASE.find((loc) => loc.city === "Auckland" && loc.country === "New Zealand")
    const tokyo = LOCATIONS_DATABASE.find((loc) => loc.city === "Tokyo" && loc.country === "Japan")
    
    setFormData({
      origin: auckland || null,
      destinations: [tokyo || null],
      startDate: "2025-12-18",
      endDate: "2025-12-28",
      budget: 8000,
      travelers: 4,
      tripCategory: "Family Holiday",
      interests: interests.filter((i) => i.name !== "Beach").map((i) => i.name), // All interests except Beach
      additionalInformation: "Mum's birthday is on the 23rd, we want to eat KFC for Christmas. My older sister is vegetarian, she doesn't mind us eating meat but we do want to make sure she always has something to eat.",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate origin
      if (!formData.origin) {
        setError("Please select a departure city")
        setIsLoading(false)
        return
      }

      // Filter out null destinations
      const filteredDestinations = formData.destinations.filter((d) => d !== null) as Location[]

      if (filteredDestinations.length === 0) {
        setError("Please enter at least one destination")
        setIsLoading(false)
        return
      }

      // Validate trip category
      if (!formData.tripCategory) {
        setError("Please select a trip type")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          origin: formData.origin,
          destinations: filteredDestinations,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate itinerary")
      }

      const data = await response.json()
      onSubmit({
        ...formData,
        origin: formData.origin,
        destinations: filteredDestinations,
        itinerary: data.itinerary,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Error generating itinerary:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <main className="min-h-screen px-4 py-12 flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Your all-in-one space for planning your trip.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
              No more switching between Excel, Booking.com and SkyScanner. It's all here with Obal.ai.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-4xl w-full">
          <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-8 md:p-12 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Plan Your Trip</h2>
                <p className="mt-1 text-gray-600">Tell us about your ideal journey</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={fillDemoData}
                className="text-sm bg-white"
              >
                Fill Demo Data
              </Button>
            </div>
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="pl-10 bg-white text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                    className="pl-10 bg-white text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                  <LocationInput
                    value={formData.origin}
                    onChange={(location) => setFormData({ ...formData, origin: location })}
                    placeholder="e.g. New York, USA"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                  <LocationInput
                    value={formData.destinations[0]}
                    onChange={(location) => handleDestinationChange(0, location)}
                    placeholder="e.g. Paris, France"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Destinations */}
            {formData.destinations.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Destinations</label>
                <div className="space-y-3">
                  {formData.destinations.slice(1).map((dest, idx) => (
                    <LocationInput
                      key={idx + 1}
                      value={dest}
                      onChange={(location) => handleDestinationChange(idx + 1, location)}
                      placeholder={`Destination ${idx + 2}`}
                      className="bg-white"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {formData.destinations.length === 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddDestination}
                className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                + Add Another Destination
              </Button>
            )}

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget: ${formData.budget}</label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Travelers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                required
                className="bg-white text-gray-900"
              />
            </div>

            {/* Trip Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type of Trip *</label>
              <select
                value={formData.tripCategory}
                onChange={(e) => setFormData({ ...formData, tripCategory: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select trip type...</option>
                <option value="Business Trip">Business Trip</option>
                <option value="Family Holiday">Family Holiday</option>
                <option value="Girls Trip">Girls Trip</option>
                <option value="Boys Trip">Boys Trip</option>
                <option value="Mixed Friend Group Trip">Mixed Friend Group Trip</option>
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">What are you interested in?</label>
              <div className="grid grid-cols-6 gap-3">
                {interests.slice(0, 6).map((interest) => {
                  const isSelected = formData.interests.includes(interest.name)
                  return (
                    <button
                      key={interest.name}
                      type="button"
                      onClick={() => handleInterestToggle(interest.name)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${
                        isSelected
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xs font-medium">{interest.name}</span>
                    </button>
                  )
                })}
              </div>
              {/* Additional interests in a grid below */}
              {interests.length > 6 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                  {interests.slice(6).map((interest) => {
                    const isSelected = formData.interests.includes(interest.name)
                    return (
                      <button
                        key={interest.name}
                        type="button"
                        onClick={() => handleInterestToggle(interest.name)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {interest.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anything else we should know? (eg. special plans, dietary requirements)
              </label>
              <textarea
                value={formData.additionalInformation || ""}
                onChange={(e) => setFormData({ ...formData, additionalInformation: e.target.value })}
                placeholder="e.g., Vegetarian diet, celebrating anniversary, need wheelchair accessible venues..."
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate Itinerary"}
                </Button>
                <Link href="/">
                  <Button variant="outline" size="lg" disabled={isLoading} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
