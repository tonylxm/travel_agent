"use client";

import { useEffect, useState } from "react";
import { useBooking } from "@/contexts/booking-context";
import FlightDetails from "@/components/flight-details";
import BookingForm from "@/components/booking-form";
import MockCheckout from "@/components/mock-checkout";
import BookingSuccess from "@/components/booking-success";
import BookingDetails from "@/components/booking-details";

type BookingStep = "list" | "details" | "form" | "checkout" | "success" | "booking-details";

export default function FlightsTab({ tripData }: { tripData: any }) {
  const { setSelectedFlight } = useBooking();
  const [bookingStep, setBookingStep] = useState<BookingStep>("list");
  // Hardcoded mock data matching Google Flights/Serp API structure
  const mockFlights = [
    {
      price: 850,
      flights: [
        {
          departure_airport: { name: "Sydney Kingsford Smith Airport (SYD)" },
          arrival_airport: { name: "Los Angeles International Airport (LAX)" },
          duration: 840, // 14 hours in minutes
        },
      ],
    },
    {
      price: 920,
      flights: [
        {
          departure_airport: { name: "Sydney Kingsford Smith Airport (SYD)" },
          arrival_airport: { name: "San Francisco International Airport (SFO)" },
          duration: 780, // 13 hours in minutes
        },
        {
          departure_airport: { name: "San Francisco International Airport (SFO)" },
          arrival_airport: { name: "Los Angeles International Airport (LAX)" },
          duration: 90, // 1.5 hours in minutes
        },
      ],
    },
    {
      price: 780,
      flights: [
        {
          departure_airport: { name: "Sydney Kingsford Smith Airport (SYD)" },
          arrival_airport: { name: "Auckland Airport (AKL)" },
          duration: 180, // 3 hours in minutes
        },
        {
          departure_airport: { name: "Auckland Airport (AKL)" },
          arrival_airport: { name: "Los Angeles International Airport (LAX)" },
          duration: 720, // 12 hours in minutes
        },
      ],
    },
    {
      price: 1050,
      flights: [
        {
          departure_airport: { name: "Sydney Kingsford Smith Airport (SYD)" },
          arrival_airport: { name: "Los Angeles International Airport (LAX)" },
          duration: 840, // 14 hours in minutes
        },
      ],
    },
    {
      price: 950,
      flights: [
        {
          departure_airport: { name: "Sydney Kingsford Smith Airport (SYD)" },
          arrival_airport: { name: "Dubai International Airport (DXB)" },
          duration: 900, // 15 hours in minutes
        },
        {
          departure_airport: { name: "Dubai International Airport (DXB)" },
          arrival_airport: { name: "Los Angeles International Airport (LAX)" },
          duration: 1020, // 17 hours in minutes
        },
      ],
    },
  ];

  const [flights, setFlights] = useState<any[]>(mockFlights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Commented out API call - using hardcoded data for now
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Sydney Australia
  //     // Tokyo Japan
  //     if (!tripData?.departure_id || !tripData?.arrival_id) {
  //       setError(
  //         `Missing airport codes. Origin: ${tripData?.departure_id || "not found"}, Destination: ${tripData?.arrival_id || "not found"}. Please check that your city names are in the format "City Country" (e.g., "Sydney Australia").`
  //       );
  //       return;
  //     }

  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const { departure_id, arrival_id, startDate, endDate, currency } = tripData;

  //       const res = await fetch("http://localhost:3001/flights", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           departure_id: departure_id,
  //           arrival_id: arrival_id,
  //           outbound_date: startDate,
  //           return_date: endDate,
  //           currency: currency,
  //         }),
  //       });

  //       if (!res.ok) {
  //         throw new Error("Failed to fetch flights");
  //       }

  //       const data = await res.json();
  //       setFlights(data?.data?.best_flights || []);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "An error occurred");
  //       setFlights([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [tripData?.departure_id, tripData?.arrival_id, tripData?.startDate, tripData?.endDate]);

  // Render different steps of booking flow
  if (bookingStep === "details") {
    return (
      <FlightDetails
        tripData={tripData}
        onBack={() => setBookingStep("list")}
        onBookWithAI={() => setBookingStep("form")}
      />
    );
  }

  if (bookingStep === "form") {
    return (
      <BookingForm
        tripData={tripData}
        onBack={() => setBookingStep("details")}
        onContinue={() => setBookingStep("checkout")}
      />
    );
  }

  if (bookingStep === "checkout") {
    return (
      <MockCheckout
        onBack={() => setBookingStep("form")}
        onPaymentSuccess={() => setBookingStep("success")}
      />
    );
  }

  if (bookingStep === "success") {
    return (
      <BookingSuccess
        onViewDetails={() => setBookingStep("booking-details")}
        onGoToItinerary={() => {
          // Navigate back to itinerary view - this will be handled by parent
          setBookingStep("list");
          // The parent component should handle showing itinerary tab
        }}
      />
    );
  }

  if (bookingStep === "booking-details") {
    return (
      <BookingDetails
        onBack={() => setBookingStep("success")}
        onViewItinerary={() => {
          setBookingStep("list");
          // The parent component should handle showing itinerary tab
        }}
      />
    )
  }

  // Default: show flight list
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Flight Options</h2>
        <p className="text-muted-foreground mb-6">
          Outbound flights from {tripData?.origin} to {tripData?.destinations?.[0]}
        </p>

        {flights.length > 0 && (
          <div className="space-y-3">
            {flights.map((flightPath, index) => {
            let total_flight_time = 0;
            return (
              <div
                key={index}
                className="border border-border rounded-lg p-4 bg-background flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-foreground">Flight Path {index + 1}</p>
                  {flightPath.flights.map((flight: any, flightIdx: number) => {
                    total_flight_time += flight.duration;
                    return (
                      <p key={flightIdx} className="text-sm text-muted-foreground">
                        Departure: {flight.departure_airport.name} {"      ------>     "} Arrival:{" "}
                        {flight.arrival_airport.name} Duration: {Math.floor(flight.duration / 60)}h{" "}
                        {flight.duration % 60}m
                      </p>
                    );
                  })}
                  <p>
                    Total flight time Duration: {Math.floor(total_flight_time / 60)}h {total_flight_time % 60}m
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary text-lg">${flightPath.price}</p>
                  <button
                    onClick={() => {
                      setSelectedFlight(flightPath);
                      setBookingStep("details");
                    }}
                    className="text-sm text-accent hover:underline mt-1"
                  >
                    Book with AI
                  </button>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
