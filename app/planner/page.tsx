"use client";

import { useState } from "react";
import TripForm from "@/components/trip-form";
import TripContext from "@/contexts/trip-context";
import ItineraryView from "@/components/itinerary-view";
import { BookingProvider } from "@/contexts/booking-context";
import type { Location } from "@/lib/types/location";
import { getAirportCode } from "@/lib/utils/location";

export default function PlannerPage() {
  const [tripData, setTripData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState("form"); // 'form' or 'view'

  const handleTripSubmit = async (data: any) => {
    // Extract airport codes from Location objects
    const originCode = data.origin ? getAirportCode(data.origin) : null;
    const arrivalCode = data.destinations?.[0] ? getAirportCode(data.destinations[0]) : null;

    data.arrival_id = arrivalCode;
    data.departure_id = originCode;
    data.currency = "USD";

    setTripData(data);
    setCurrentStep("view");
  };

  const handleNewTrip = () => {
    setTripData(null);
    setCurrentStep("form");
  };

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      <BookingProvider>
        <main className="min-h-screen bg-background">
          {currentStep === "form" ? (
            <TripForm onSubmit={handleTripSubmit} />
          ) : (
            <ItineraryView tripData={tripData} onNewTrip={handleNewTrip} />
          )}
        </main>
      </BookingProvider>
    </TripContext.Provider>
  );
}
