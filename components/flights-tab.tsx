"use client";

import { useEffect, useState } from "react";
import { useBooking } from "@/contexts/booking-context";
import FlightDetails from "@/components/flight-details";
import BookingForm from "@/components/booking-form";
import MockCheckout from "@/components/mock-checkout";
import BookingSuccess from "@/components/booking-success";
import BookingDetails from "@/components/booking-details";
import { formatLocationForDisplay } from "@/lib/utils/format-location";
import TripContext from "@/contexts/trip-context";
import { useContext } from "react";

type BookingStep = "list" | "details" | "loading-ai" | "provide-info" | "loading-form" | "additional-info" | "redirecting" | "checkout" | "third-party-success" | "success" | "booking-details";

export default function FlightsTab({ tripData }: { tripData: any }) {
  const { setSelectedFlight } = useBooking();
  const { setTripData } = useContext(TripContext);
  const [bookingStep, setBookingStep] = useState<BookingStep>("list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch flights (with caching)
  useEffect(() => {
    const fetchFlights = async () => {
      if (!tripData?.origin || !tripData?.destinations || tripData.destinations.length === 0) {
        return;
      }

      // Check if flights are already cached
      if (tripData.flights) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // First, ensure we have itinerary
        let itinerary = tripData.itinerary;
        
        if (!itinerary) {
          // Fetch itinerary first
          const itineraryResponse = await fetch("/api/generate-itinerary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              origin: tripData.origin,
              destinations: tripData.destinations,
              startDate: tripData.startDate,
              endDate: tripData.endDate,
              budget: tripData.budget,
              travelers: tripData.travelers,
              interests: tripData.interests || [],
              additionalInformation: tripData.additionalInformation,
            }),
          });

          if (!itineraryResponse.ok) {
            throw new Error("Failed to fetch itinerary");
          }

          const itineraryData = await itineraryResponse.json();
          itinerary = itineraryData.itinerary;

          // Cache itinerary in context
          setTripData((prev: any) => ({
            ...prev,
            itinerary,
          }));
        }

        // Now generate flights based on itinerary
        const flightsResponse = await fetch("/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            origin: tripData.origin,
            destinations: tripData.destinations,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            travelers: tripData.travelers || 1,
            itinerary,
        }),
      });

        if (!flightsResponse.ok) {
          throw new Error("Failed to fetch flights");
        }

        const flightsData = await flightsResponse.json();

        // Cache flights in context
        setTripData((prev: any) => ({
          ...prev,
          flights: flightsData,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [tripData?.origin, tripData?.destinations, tripData?.startDate, tripData?.endDate, tripData?.flights, setTripData]);

  // Render different steps of booking flow
  if (bookingStep === "details") {
    return (
      <FlightDetails
        tripData={tripData}
        onBack={() => setBookingStep("list")}
        onBookWithAI={() => {
          setBookingStep("loading-ai");
          // Show loading for 1 second
          setTimeout(() => {
            setBookingStep("provide-info");
          }, 1000);
        }}
      />
    );
  }

  if (bookingStep === "loading-ai") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium text-foreground">Loading AI Agent</p>
        </div>
      </div>
    );
  }

  if (bookingStep === "provide-info") {
    return (
      <BookingForm
        tripData={tripData}
        mode="provide-info"
        onBack={() => setBookingStep("details")}
        onContinue={() => {
          setBookingStep("loading-form");
          // Show loading for 2 seconds
          setTimeout(() => {
            setBookingStep("additional-info");
          }, 2000);
        }}
      />
    );
  }

  if (bookingStep === "loading-form") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium text-foreground">Intelligently filling in form...</p>
        </div>
      </div>
    );
  }

  if (bookingStep === "additional-info") {
    return (
      <BookingForm
        tripData={tripData}
        mode="additional-info"
        onBack={() => setBookingStep("provide-info")}
        onContinue={() => {
          setBookingStep("redirecting");
          // Show redirecting for 1.5 seconds
          setTimeout(() => {
            setBookingStep("checkout");
          }, 1500);
        }}
      />
    );
  }

  if (bookingStep === "redirecting") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium text-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (bookingStep === "checkout") {
    return (
      <MockCheckout
        tripData={tripData}
        onBack={() => setBookingStep("additional-info")}
        onPaymentSuccess={() => {
          setBookingStep("third-party-success");
          // Show third-party success for 2 seconds, then redirect to our success page
          setTimeout(() => {
            setBookingStep("success");
          }, 2000);
        }}
      />
    );
  }

  if (bookingStep === "third-party-success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful</h2>
            <p className="text-gray-600">Your payment has been processed securely.</p>
            <p className="text-sm text-gray-500">Redirecting to your booking confirmation...</p>
            <div className="flex justify-center pt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bookingStep === "success") {
    return (
      <BookingSuccess
        onViewDetails={() => setBookingStep("booking-details")}
        onGoToItinerary={() => {
          setBookingStep("list");
        }}
      />
    );
  }

  if (bookingStep === "booking-details") {
    return (
      <BookingDetails
        onBack={() => setBookingStep("success")}
        onViewItinerary={() => {
          // Redirect to itinerary page
          window.location.href = "/itinerary";
        }}
      />
    );
  }

  // Default: show flight list
  const flightsData = tripData?.flights;
  const isMultiDestination = tripData?.destinations && tripData.destinations.length > 1;
  const packages = flightsData?.packages;
  const individualFlights = flightsData?.flights;
  const hasPackages = packages && packages.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {hasPackages ? "Flight Packages" : "Flight Options"}
        </h2>
        {loading && <p className="text-muted-foreground mb-6">Loading flights...</p>}
        {error && <p className="text-destructive mb-6">{error}</p>}

        {!loading && !error && hasPackages && (
          <div className="space-y-4">
            {packages.map((pkg: any, pkgIdx: number) => {
              // Calculate total price from segments
              const calculatedTotal = pkg.segments.reduce((sum: number, seg: any) => sum + (seg.price || 0), 0)
              const displayPrice = calculatedTotal > 0 ? calculatedTotal : pkg.price
              
              return (
              <div
                key={pkgIdx}
                className="border border-border rounded-lg p-6 bg-background"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Package {pkgIdx + 1}
                      </h3>
                      {pkg.cabin && (
                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                          pkg.cabin === "Business" 
                            ? "bg-purple-500 text-white" 
                            : "bg-green-500 text-white"
                        }`}>
                          {pkg.cabin}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pkg.segments.length} flight{pkg.segments.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${displayPrice}</p>
                    <p className="text-xs text-muted-foreground">Total Package Price</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {pkg.segments.map((segment: any, segIdx: number) => (
                    <div key={segIdx} className="pl-4 border-l-2 border-primary/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {segment.from} → {segment.to}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {segment.departure_airport.name} → {segment.arrival_airport.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Date: {segment.date}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Duration: {Math.floor(segment.duration / 60)}h {segment.duration % 60}m
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">${segment.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedFlight(pkg);
                    setBookingStep("loading-ai");
                    // Show loading for 1 second
                    setTimeout(() => {
                      setBookingStep("provide-info");
                    }, 1000);
                  }}
                  className="w-full text-sm text-accent hover:underline"
                >
                  Book with AI
                </button>
              </div>
            )})}
          </div>
        )}

        {!loading && !error && !hasPackages && individualFlights && individualFlights.length > 0 && (
        <div className="space-y-3">
            {individualFlights.map((flight: any, index: number) => {
              const totalDuration = flight.flights.reduce((sum: number, f: any) => sum + f.duration, 0);
            return (
              <div
                  key={index}
                className="border border-border rounded-lg p-4 bg-background flex justify-between items-center"
              >
                <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-foreground">Flight Option {index + 1}</p>
                      {flight.cabin && (
                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                          flight.cabin === "Business" 
                            ? "bg-purple-500 text-white" 
                            : "bg-green-500 text-white"
                        }`}>
                          {flight.cabin}
                        </span>
                      )}
                    </div>
                    {flight.flights.map((f: any, flightIdx: number) => (
                      <p key={flightIdx} className="text-sm text-muted-foreground">
                        {f.departure_airport.name} → {f.arrival_airport.name} • Duration: {Math.floor(f.duration / 60)}h {f.duration % 60}m
                      </p>
                    ))}
                    <p className="text-sm text-muted-foreground mt-1">
                      Total Duration: {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-primary text-lg">${flight.price}</p>
                    <button
                      onClick={() => {
                        setSelectedFlight(flight);
                        setBookingStep("loading-ai");
                        // Show loading for 1 second
                        setTimeout(() => {
                          setBookingStep("provide-info");
                        }, 1000);
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

        {!loading && !error && !flightsData && (
          <p className="text-muted-foreground">No flights available. Please check your trip details.</p>
        )}
      </div>
    </div>
  );
}
