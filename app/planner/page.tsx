"use client";

import { useState } from "react";
import TripForm from "@/components/trip-form";
import TripContext from "@/contexts/trip-context";
import ItineraryView from "@/components/itinerary-view";

export default function PlannerPage() {
  const [tripData, setTripData] = useState(null);
  const [currentStep, setCurrentStep] = useState("form"); // 'form' or 'view'

  const countries = {
    usa: {
      "new york": "JFK",
      "los angeles": "LAX",
      chicago: "ORD",
      atlanta: "ATL",
      dallas: "DFW",
    },
    uk: {
      london: "LHR",
      manchester: "MAN",
      birmingham: "BHX",
      edinburgh: "EDI",
      glasgow: "GLA",
    },
    australia: {
      sydney: "SYD",
      melbourne: "MEL",
      brisbane: "BNE",
      perth: "PER",
      adelaide: "ADL",
    },
    new_zealand: {
      auckland: "AKL",
      wellington: "WLG",
      christchurch: "CHC",
      queenstown: "ZQN",
      dunedin: "DUD",
    },
    canada: {
      toronto: "YYZ",
      vancouver: "YVR",
      montreal: "YUL",
      calgary: "YYC",
      edmonton: "YEG",
    },
    japan: {
      tokyo: "HND",
      osaka: "KIX",
      nagoya: "NGO",
      fukuoka: "FUK",
    },
    france: {
      paris: "CDG",
      nice: "NCE",
      lyon: "LYS",
      marseille: "MRS",
    },
    germany: {
      frankfurt: "FRA",
      munich: "MUC",
      berlin: "BER",
      hamburg: "HAM",
    },
    uae: {
      dubai: "DXB",
      "abu dhabi": "AUH",
      sharjah: "SHJ",
    },
    china: {
      beijing: "PEK",
      shanghai: "PVG",
      guangzhou: "CAN",
      shenzhen: "SZX",
    },
  };

  function getAirportCode(city: string, country: string): string | null {
    const countryKey = country.toLowerCase().replace(/\s+/g, "_");
    const cityKey = city.toLowerCase();

    return countries[countryKey]?.[cityKey] || null;
  }

  const handleTripSubmit = async (data) => {
    const arrival_parts = data.destinations[0].split(" ");
    const arrival_country = arrival_parts.pop();
    const arrival_city = arrival_parts.join(" ");

    const origin_parts = data.origin.split(" ");
    const origin_country = origin_parts.pop();
    const origin_city = origin_parts.join(" ");

    // ---- Resolve codes ----
    const originCode = getAirportCode(origin_city, origin_country);
    const arrivalCode = getAirportCode(arrival_city, arrival_country);

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
      <main className="min-h-screen bg-background">
        {currentStep === "form" ? (
          <TripForm onSubmit={handleTripSubmit} />
        ) : (
          <ItineraryView tripData={tripData} onNewTrip={handleNewTrip} />
        )}
      </main>
    </TripContext.Provider>
  );
}
