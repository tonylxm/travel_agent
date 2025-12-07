"use client";

import { useEffect, useState } from "react";

export default function FlightsTab({ tripData }: { tripData: any }) {
  const [flights, setFlights] = useState();

  // Sydney Australia Melbourne Australia
  // Melbourne Australia

  useEffect(() => {
    const fetchData = async () => {
      const { departure_id, arrival_id, startDate, endDate, currency } = tripData;
      console.log(departure_id);

      const res = await fetch("http://localhost:3001/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departure_id: departure_id,
          arrival_id: arrival_id,
          outbound_date: startDate,
          return_date: endDate,
          currency: currency,
        }),
      });
      const data = await res.json();
      console.log(JSON.stringify(data.data.best_flights));
      setFlights(data.data.best_flights);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Flight Options</h2>
        <p className="text-muted-foreground mb-6">
          Outbound flights from {tripData?.origin} to {tripData?.destinations?.[0]}
        </p>
        {/* <div>
          <label className="block text-sm font-medium text-foreground mb-2">Budget: ${budget}</label>
          <input
            type="range"
            min="0"
            max="3000"
            step="25"
            value={budget}
            onChange={(e) => setBudget((prev) => Number(e.target.value))}
            className="w-full"
          />
        </div> */}
        <div className="space-y-3">
          {flights.map((flightPath, index) => {
            let total_flight_time = 0;
            return (
              <div
                key={Math.random()}
                className="border border-border rounded-lg p-4 bg-background flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-foreground">Flight Path {index + 1}</p>
                  {flightPath.flights.map((flight) => {
                    total_flight_time += flight.duration;
                    return (
                      <p key={Math.random()} className="text-sm text-muted-foreground">
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
                  <button className="text-sm text-accent hover:underline mt-1">Select</button>
                </div>
              </div>
            );
            // return (
            //   <div key={Math.random()} className="border-2 border-b">
            //     {flightPath.flights.map((flight) => {
            //       return (
            //         <div key={Math.random()}>
            //           {flight.departure_airport.name} =====D {flight.arrival_airport.name}
            //         </div>
            //       );
            //     })}
            //   </div>
            // );
          })}
        </div>
      </div>
    </div>
  );
}
