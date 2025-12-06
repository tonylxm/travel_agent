// Type definitions for the travel booking app

export interface TripSearchInput {
  origin: string;
  destination: string;
  travelers: number;
  startDate: string;
  endDate: string;
}

export interface FlightOption {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
}

export interface HotelOption {
  name: string;
  rating: number;
  address: string;
  pricePerNight: number;
  totalPrice: number;
}

export interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
}

export interface TripPlan {
  outboundFlight: FlightOption;
  returnFlight: FlightOption;
  hotel: HotelOption;
  itinerary: DayItinerary[];
  totalPrice: number;
}

export interface BookingConfirmation {
  bookingId: string;
  tripPlan: TripPlan;
  searchInput: TripSearchInput;
  paymentIntentId: string;
  bookedAt: string;
}
