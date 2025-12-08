"use client"

import { useEffect, useRef, useState } from "react"
import type { Activity, Day } from "@/lib/utils/itinerary-parser"
import { getTokyoCenter } from "@/lib/data/tokyo-locations"
import ActivityModal from "@/components/activity-modal"

interface ItineraryMapProps {
  days: Day[]
  selectedActivityId?: string
  onActivityClick?: (activityId: string) => void
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

// Global flag to track if script is being loaded
let scriptLoading = false
let scriptLoaded = false

export default function ItineraryMap({ days, selectedActivityId, onActivityClick }: ItineraryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const routesRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [modalActivity, setModalActivity] = useState<Activity | null>(null)

  useEffect(() => {
    // If already loaded, set state immediately
    if (window.google) {
      setIsLoaded(true)
      scriptLoaded = true
      return
    }

    // Check if script tag already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') as HTMLScriptElement
    if (existingScript) {
      // Script exists, wait for it to load
      if (window.google) {
        setIsLoaded(true)
        scriptLoaded = true
      } else {
        // Script exists but not loaded yet, wait for load event
        const handleLoad = () => {
          setIsLoaded(true)
          scriptLoaded = true
          existingScript.removeEventListener('load', handleLoad)
        }
        existingScript.addEventListener('load', handleLoad)
        return () => {
          existingScript.removeEventListener('load', handleLoad)
        }
      }
      return
    }

    // If script is already being loaded, wait for it
    if (scriptLoading) {
      const checkInterval = setInterval(() => {
        if (window.google) {
          setIsLoaded(true)
          scriptLoaded = true
          scriptLoading = false
          clearInterval(checkInterval)
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }

    // Load Google Maps script
    if (!window.google && !scriptLoading) {
      scriptLoading = true
      const loadMap = async () => {
        try {
          // Try to get API key from environment (client-side)
          let apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
          
          // If not found, fetch from API route (server-side env var)
          if (!apiKey) {
            const response = await fetch("/api/google-maps-key")
            if (response.ok) {
              const data = await response.json()
              apiKey = data.apiKey
            }
          }
          
          if (!apiKey) {
            console.error("Google Maps API key not found. Please set GOOGLE_API_KEY or NEXT_PUBLIC_GOOGLE_API_KEY in your .env.local file")
            scriptLoading = false
            return
          }
          
          const script = document.createElement("script")
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
          script.async = true
          script.defer = true
          script.onload = () => {
            setIsLoaded(true)
            scriptLoaded = true
            scriptLoading = false
          }
          script.onerror = () => {
            console.error("Failed to load Google Maps script")
            scriptLoading = false
          }
          document.head.appendChild(script)
        } catch (error) {
          console.error("Error loading Google Maps:", error)
          scriptLoading = false
        }
      }
      
      loadMap()
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return

    // Initialize map - start with a wider view, will be adjusted when activities load
    if (!mapInstanceRef.current) {
      const center = getTokyoCenter()
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: center[0], lng: center[1] },
        zoom: 11, // Slightly wider initial zoom, will be adjusted by fitBounds
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })
    }

    const map = mapInstanceRef.current

    // Clear existing markers and routes
    markersRef.current.forEach((marker) => marker.setMap(null))
    routesRef.current.forEach((route) => route.setMap(null))
    markersRef.current = []
    routesRef.current = []

    // Collect all activities with coordinates
    const allActivities: Array<Activity & { dayNumber: number; index: number }> = []
    days.forEach((day) => {
      day.activities.forEach((activity, index) => {
        if (activity.location.coordinates) {
          allActivities.push({ ...activity, dayNumber: day.dayNumber, index })
        }
      })
    })

    // Create markers - only for Tokyo-area activities
    let tokyoActivityIndex = 0
    allActivities.forEach((activity) => {
      const lat = activity.location.coordinates[0]
      const lng = activity.location.coordinates[1]
      // Only show markers for activities in Tokyo area
      const isInTokyo = lat >= 35.4 && lat <= 35.8 && lng >= 139.4 && lng <= 139.9
      
      if (!isInTokyo) {
        return // Skip non-Tokyo activities (e.g., "Depart from Auckland")
      }

      const isSelected = activity.id === selectedActivityId
      tokyoActivityIndex++

      const marker = new window.google.maps.Marker({
        position: {
          lat: activity.location.coordinates[0],
          lng: activity.location.coordinates[1],
        },
        map,
        label: {
          text: String(tokyoActivityIndex),
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 10 : 8,
          fillColor: isSelected ? "#3b82f6" : "#ef4444",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
        title: activity.name,
      })

      // Add click listener - show modal instead of info window
      marker.addListener("click", () => {
        setModalActivity(activity)
        if (onActivityClick) {
          onActivityClick(activity.id)
        }
      })

      markersRef.current.push(marker)
    })

    // Draw routes between consecutive activities (only for Tokyo-area activities)
    for (let i = 0; i < allActivities.length - 1; i++) {
      const from = allActivities[i]
      const to = allActivities[i + 1]

      // Check if both activities are in Tokyo area
      const fromLat = from.location.coordinates[0]
      const fromLng = from.location.coordinates[1]
      const toLat = to.location.coordinates[0]
      const toLng = to.location.coordinates[1]
      
      const fromInTokyo = fromLat >= 35.4 && fromLat <= 35.8 && fromLng >= 139.4 && fromLng <= 139.9
      const toInTokyo = toLat >= 35.4 && toLat <= 35.8 && toLng >= 139.4 && toLng <= 139.9

      // Only draw route if activities are on the same day or consecutive days AND both are in Tokyo
      const dayDiff = to.dayNumber - from.dayNumber
      if (dayDiff <= 1 && fromInTokyo && toInTokyo) {
        const route = new window.google.maps.Polyline({
          path: [
            { lat: from.location.coordinates[0], lng: from.location.coordinates[1] },
            { lat: to.location.coordinates[0], lng: to.location.coordinates[1] },
          ],
          geodesic: true,
          strokeColor: "#3b82f6",
          strokeOpacity: 0.5,
          strokeWeight: 2,
          map,
        })

        routesRef.current.push(route)
      }
    }

    // Fit bounds to show all markers, but only for Tokyo-area activities
    // Filter out travel activities that might be in other locations (e.g., Auckland departure)
    const tokyoActivities = allActivities.filter((activity) => {
      const lat = activity.location.coordinates[0]
      const lng = activity.location.coordinates[1]
      // Tokyo is roughly between 35.4-35.8°N and 139.4-139.9°E
      // Filter to only include activities within Tokyo area
      return lat >= 35.4 && lat <= 35.8 && lng >= 139.4 && lng <= 139.9
    })

    if (tokyoActivities.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      tokyoActivities.forEach((activity) => {
        bounds.extend({
          lat: activity.location.coordinates[0],
          lng: activity.location.coordinates[1],
        })
      })
      // Fit bounds with padding to show the specific area of our locations
      map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      })
    } else if (allActivities.length > 0) {
      // If no Tokyo activities found, just center on Tokyo
      const center = getTokyoCenter()
      map.setCenter({ lat: center[0], lng: center[1] })
      map.setZoom(12)
    } else {
      // No activities, center on Tokyo
      const center = getTokyoCenter()
      map.setCenter({ lat: center[0], lng: center[1] })
      map.setZoom(12)
    }
  }, [isLoaded, days, selectedActivityId, onActivityClick])

  return (
    <>
      <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
        <div ref={mapRef} className="w-full h-full" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        )}
      </div>
      <ActivityModal
        activity={modalActivity}
        onClose={() => setModalActivity(null)}
      />
    </>
  )
}

