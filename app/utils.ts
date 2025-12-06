// Utility functions for generating realistic fake travel data

export const airlines = [
  'United Airlines',
  'Delta Air Lines',
  'American Airlines',
  'Southwest Airlines',
  'JetBlue Airways',
  'Alaska Airlines',
];

export const hotelChains = [
  'Marriott',
  'Hilton',
  'Hyatt',
  'InterContinental',
  'Sheraton',
  'Westin',
];

/**
 * Generate a realistic flight number
 */
export function generateFlightNumber(airline: string): string {
  const code = airline.substring(0, 2).toUpperCase();
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${code}${number}`;
}

/**
 * Calculate flight duration between cities (in hours)
 */
export function estimateFlightDuration(origin: string, destination: string): string {
  // Simple estimation based on distance tiers
  const hash = (origin + destination).length;
  const hours = 2 + (hash % 10);
  const minutes = [0, 15, 30, 45][hash % 4];
  return `${hours}h ${minutes}m`;
}

/**
 * Generate realistic flight price based on distance and dates
 */
export function generateFlightPrice(
  origin: string,
  destination: string,
  startDate: string
): number {
  const basePrice = 200;
  const distanceFactor = ((origin + destination).length % 5) * 100;
  
  // Add surge pricing for near-term bookings
  const daysUntilTrip = Math.floor(
    (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const urgencyFactor = daysUntilTrip < 14 ? 100 : 0;
  
  return Math.round(basePrice + distanceFactor + urgencyFactor);
}

/**
 * Generate hotel price per night
 */
export function generateHotelPrice(destination: string, rating: number): number {
  const basePrice = 80;
  const ratingFactor = (rating - 3) * 50;
  const locationFactor = destination.length % 3 * 30;
  
  return Math.round(basePrice + ratingFactor + locationFactor);
}

/**
 * Calculate number of nights between dates
 */
export function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format time for display (e.g., "10:30 AM")
 */
export function formatTime(baseHour: number): string {
  const hour = baseHour % 12 || 12;
  const ampm = baseHour < 12 ? 'AM' : 'PM';
  const minutes = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
  return `${hour}:${minutes} ${ampm}`;
}

/**
 * Generate a unique booking ID
 */
export function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `BK${timestamp}${random}`.toUpperCase();
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
