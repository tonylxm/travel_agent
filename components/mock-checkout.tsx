"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"

interface MockCheckoutProps {
  onBack: () => void
  onPaymentSuccess: () => void
}

export default function MockCheckout({ onBack, onPaymentSuccess }: MockCheckoutProps) {
  const { selectedFlight, setBookingRef } = useBooking()
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

  const price = selectedFlight?.price || 850

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a random booking reference
    const bookingRef = Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingRef(bookingRef)
    onPaymentSuccess()
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Payment</h1>
        <p className="text-muted-foreground">Complete your booking with secure payment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Information */}
            <div className="border border-border rounded-lg p-6 bg-card space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Card Information</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Card Number *</label>
                <Input
                  type="text"
                  value={cardData.cardNumber}
                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Expiry Date *</label>
                  <Input
                    type="text"
                    value={cardData.expiryDate}
                    onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                    autoComplete="off"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">CVV *</label>
                  <Input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name on Card *</label>
                <Input
                  type="text"
                  value={cardData.nameOnCard}
                  onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                  placeholder="John Doe"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="border border-border rounded-lg p-6 bg-card space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Billing Address</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
                <Input
                  type="text"
                  value={cardData.billingAddress}
                  onChange={(e) => setCardData({ ...cardData, billingAddress: e.target.value })}
                  placeholder="123 Main Street"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                  <Input
                    type="text"
                    value={cardData.city}
                    onChange={(e) => setCardData({ ...cardData, city: e.target.value })}
                    placeholder="City"
                    autoComplete="off"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Zip Code *</label>
                  <Input
                    type="text"
                    value={cardData.zipCode}
                    onChange={(e) => setCardData({ ...cardData, zipCode: e.target.value })}
                    placeholder="12345"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country *</label>
                <Input
                  type="text"
                  value={cardData.country}
                  onChange={(e) => setCardData({ ...cardData, country: e.target.value })}
                  placeholder="Country"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1" size="lg">
                Pay Now
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="sticky top-4 border border-border rounded-lg p-6 bg-card space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Flight</span>
                <span className="text-foreground font-medium">${price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span className="text-foreground font-medium">$0.00</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${price}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

