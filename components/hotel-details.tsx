"use client"

import { Button } from "@/components/ui/button"
import { Star, MapPin, CheckCircle2, ExternalLink, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface HotelDetailsProps {
  hotel: {
    name: string
    source: string
    source_icon?: string
    link?: string
    property_token?: string
    serpapi_property_details_link?: string
    gps_coordinates?: { latitude: number; longitude: number }
    hotel_class?: number
    thumbnail?: string
    overall_rating?: number
    reviews?: number
    price?: string
    extracted_price?: number
    amenities?: string[]
    free_cancellation?: boolean
  }
  tripData?: {
    startDate?: string
    endDate?: string
    travelers?: number
  }
  onBack: () => void
  onBookWithAI: () => void
}

export default function HotelDetails({
  hotel,
  tripData,
  onBack,
  onBookWithAI,
}: HotelDetailsProps) {
  const nights = tripData?.startDate && tripData?.endDate
    ? Math.ceil(
        (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  const totalPrice = hotel.extracted_price && nights ? hotel.extracted_price * nights : null

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Hotels
      </Button>

      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{hotel.name}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            {hotel.hotel_class && (
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.hotel_class }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            )}
            {hotel.overall_rating && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{hotel.overall_rating}</span>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {hotel.reviews && (
                  <span className="text-sm text-muted-foreground">({hotel.reviews.toLocaleString()} reviews)</span>
                )}
              </div>
            )}
            {hotel.free_cancellation && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Free cancellation</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Section */}
      {hotel.thumbnail && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border border-border">
          <Image
            src={hotel.thumbnail}
            alt={hotel.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Price and Booking Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Location */}
          {hotel.gps_coordinates && (
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {hotel.gps_coordinates.latitude.toFixed(4)}, {hotel.gps_coordinates.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          )}

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Source */}
          {hotel.source && (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">Available through:</p>
              <div className="flex items-center gap-2">
                {hotel.source_icon && (
                  <Image
                    src={hotel.source_icon}
                    alt={hotel.source}
                    width={24}
                    height={24}
                    className="rounded"
                    unoptimized
                  />
                )}
                <span className="font-medium text-foreground">{hotel.source}</span>
                {hotel.link && (
                  <a
                    href={hotel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline flex items-center gap-1 ml-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on {hotel.source}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="md:col-span-1">
          <div className="sticky top-4 border border-border rounded-lg p-6 bg-card space-y-4">
            <div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {hotel.price || `$${hotel.extracted_price || "N/A"}`}
                <span className="text-base font-normal text-muted-foreground">/night</span>
              </p>
              {totalPrice && (
                <p className="text-sm text-muted-foreground">
                  Total for {nights} {nights === 1 ? "night" : "nights"}:{" "}
                  <span className="font-semibold text-foreground">${totalPrice.toLocaleString()}</span>
                </p>
              )}
            </div>

            {tripData?.startDate && tripData?.endDate && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="text-foreground font-medium">{tripData.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="text-foreground font-medium">{tripData.endDate}</span>
                </div>
                {tripData.travelers && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="text-foreground font-medium">{tripData.travelers}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-border space-y-3">
              <Button onClick={onBookWithAI} className="w-full" size="lg">
                Book with AI Agent
              </Button>
              {hotel.link && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(hotel.link, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Book Directly
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

