"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Lock, Shield, X } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"
import { useAccommodation } from "@/contexts/accommodation-context"

interface MockCheckoutProps {
  tripData?: {
    startDate?: string
    endDate?: string
  }
  onBack: () => void
  onPaymentSuccess: () => void
}

export default function MockCheckout({ tripData, onBack, onPaymentSuccess }: MockCheckoutProps) {
  const { selectedFlight, setBookingRef } = useBooking()
  const { selectedHotel, setBookingRef: setAccommodationBookingRef } = useAccommodation()
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  })

  // Calculate price based on what's being booked
  let price = 0
  if (selectedFlight) {
    // For flights, calculate total from segments or use price
    if (selectedFlight.segments) {
      price = selectedFlight.segments.reduce((sum: number, seg: any) => sum + (seg.price || 0), 0)
    } else {
      price = selectedFlight.price || 850
    }
  } else if (selectedHotel) {
    // For hotels, calculate total from nights
    const nights = tripData?.startDate && tripData?.endDate
      ? Math.ceil(
          (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0
    price = selectedHotel.extracted_price && nights ? selectedHotel.extracted_price * nights : 0
  } else {
    price = 850 // Fallback
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a random booking reference
    const bookingRef = Math.random().toString(36).substring(2, 8).toUpperCase()
    if (selectedFlight) {
      setBookingRef(bookingRef)
    } else if (selectedHotel) {
      setAccommodationBookingRef(bookingRef)
    }
    onPaymentSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Third-party styled header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Secure Payment</h1>
              <p className="text-xs text-gray-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Powered by SecurePay</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Information */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Card Information</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                    <Input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      autoComplete="off"
                      required
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                      <Input
                        type="text"
                        value={cardData.expiryDate}
                        onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                        autoComplete="off"
                        required
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                      <Input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={4}
                        autoComplete="off"
                        required
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
                    <Input
                      type="text"
                      value={cardData.nameOnCard}
                      onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                      placeholder="John Doe"
                      autoComplete="off"
                      required
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Billing Address</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <Input
                      type="text"
                      value={cardData.billingAddress}
                      onChange={(e) => setCardData({ ...cardData, billingAddress: e.target.value })}
                      placeholder="123 Main Street"
                      autoComplete="off"
                      required
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <Input
                        type="text"
                        value={cardData.city}
                        onChange={(e) => setCardData({ ...cardData, city: e.target.value })}
                        placeholder="City"
                        autoComplete="off"
                        required
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                      <Input
                        type="text"
                        value={cardData.zipCode}
                        onChange={(e) => setCardData({ ...cardData, zipCode: e.target.value })}
                        placeholder="12345"
                        autoComplete="off"
                        required
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <Input
                      type="text"
                      value={cardData.country}
                      onChange={(e) => setCardData({ ...cardData, country: e.target.value })}
                      placeholder="Country"
                      autoComplete="off"
                      required
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-semibold"
                  >
                    Pay ${price}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-4 border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Flight</span>
                    <span className="text-gray-900 font-medium">${price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="text-gray-900 font-medium">$0.00</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${price}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">256-bit SSL Encryption</p>
                      <p className="mt-1">Your payment information is secure and encrypted</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="h-3 w-3" />
                    <span>PCI DSS Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

