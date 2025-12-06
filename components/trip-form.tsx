"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Link from "next/link"

interface TripFormData {
  origin: string
  destinations: string[]
  startDate: string
  endDate: string
  budget: number
  travelers: number
  interests: string[]
}

const interests = [
  "Beach",
  "Mountains",
  "Culture",
  "Adventure",
  "Food",
  "History",
  "Nightlife",
  "Shopping",
  "Nature",
  "Art",
]

export default function TripForm({ onSubmit }: { onSubmit: (data: TripFormData) => void }) {
  const [formData, setFormData] = useState<TripFormData>({
    origin: "",
    destinations: [""],
    startDate: "",
    endDate: "",
    budget: 5000,
    travelers: 1,
    interests: [],
  })

  const handleAddDestination = () => {
    setFormData({
      ...formData,
      destinations: [...formData.destinations, ""],
    })
  }

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...formData.destinations]
    newDestinations[index] = value
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Plan Your Trip</h1>
            <p className="mt-2 text-muted-foreground">Tell us about your ideal journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-border bg-card p-8">
            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Departure City</label>
              <Input
                placeholder="e.g., San Francisco"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              />
            </div>

            {/* Destinations */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Destinations</label>
              <div className="space-y-3">
                {formData.destinations.map((dest, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Destination ${idx + 1}`}
                    value={dest}
                    onChange={(e) => handleDestinationChange(idx, e.target.value)}
                    required
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddDestination}
                  className="w-full bg-transparent"
                >
                  + Add Another Destination
                </Button>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Budget: ${formData.budget}</label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Travelers */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Number of Travelers</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                required
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Interests (Select multiple)</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      formData.interests.includes(interest)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-border"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1">
                Generate Itinerary
              </Button>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Back
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
