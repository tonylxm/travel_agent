# 🌍 AI Travel Agent

A full-stack AI-powered travel booking application built for a hackathon proof-of-concept. This app demonstrates end-to-end trip planning, booking, and payment processing in under 48 hours.

## ✨ Features

- **AI Trip Planning**: Uses OpenAI GPT-4o-mini to generate personalized itineraries
- **Live Price Simulation**: Realistic flight and hotel pricing based on destinations and dates
- **Stripe Test Payments**: Secure payment processing via Stripe Checkout (Test Mode)
- **Email Confirmations**: Real confirmation emails sent via Resend
- **Beautiful UI**: Clean, responsive design with Tailwind CSS
- **No Database**: Stateless architecture perfect for hackathons

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI API (GPT-4o-mini)
- **Payments**: Stripe (Test Mode)
- **Email**: Resend
- **Validation**: Zod

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd travel_agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   
   ```env
   # OpenAI API Key
   OPENAI_API_KEY=sk-...
   
   # Stripe Keys (Test Mode)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   
   # Resend API Key
   RESEND_API_KEY=re_...
   
   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Get your API keys**:
   
   - **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - **Stripe**: [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
   - **Resend**: [https://resend.com/api-keys](https://resend.com/api-keys)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Planning a Trip

1. Fill out the trip search form:
   - **Origin**: Starting city
   - **Destination**: Where you want to go
   - **Travelers**: Number of people
   - **Departure Date**: When you leave
   - **Return Date**: When you come back

2. Click **"Plan My Trip with AI"**

3. The AI will generate:
   - Outbound and return flights
   - Hotel recommendations
   - Day-by-day itinerary

### Booking & Payment

1. Review your trip details
2. Click **"Pay & Book Now"**
3. You'll be redirected to Stripe Checkout (Test Mode)
4. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any 5-digit ZIP code

5. After successful payment:
   - You'll see a confirmation page
   - Enter your email to receive a confirmation email
   - Your booking details are displayed

## 📁 Project Structure

```
travel_agent/
├── app/
│   ├── api/
│   │   ├── plan/         # AI trip planning endpoint
│   │   ├── search/       # Trip search endpoint
│   │   ├── pay/          # Stripe payment endpoint
│   │   └── email/        # Email confirmation endpoint
│   ├── success/          # Post-payment success page
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   ├── page.tsx          # Main booking form and results
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── public/               # Static assets
├── .env.local           # Environment variables (create this)
└── package.json         # Dependencies
```

## 🔑 API Routes

### POST `/api/plan`
Generates a complete trip plan using OpenAI.

**Request Body:**
```json
{
  "origin": "New York",
  "destination": "Paris",
  "travelers": 2,
  "startDate": "2025-06-15",
  "endDate": "2025-06-22"
}
```

**Response:**
```json
{
  "outboundFlight": { ... },
  "returnFlight": { ... },
  "hotel": { ... },
  "itinerary": [ ... ],
  "totalPrice": 2500
}
```

### POST `/api/search`
Wrapper around `/api/plan` for semantic clarity.

### POST `/api/pay`
Creates a Stripe Checkout session.

**Request Body:**
```json
{
  "amount": 2500,
  "tripDetails": {
    "origin": "New York",
    "destination": "Paris",
    "startDate": "2025-06-15",
    "endDate": "2025-06-22",
    "travelers": 2
  }
}
```

### POST `/api/email`
Sends booking confirmation email via Resend.

**Request Body:**
```json
{
  "to": "user@example.com",
  "bookingConfirmation": { ... }
}
```

## 🧪 Testing

### Test Stripe Payments

Use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Authentication Required**: `4000 0025 0000 3155`

All test cards:
- Use any future expiry date
- Use any 3-digit CVC
- Use any 5-digit ZIP code

### Test Email Sending

With Resend's free tier:
- You can send to verified email addresses
- 100 emails/day limit
- No credit card required

## 🎯 Key Features Implemented

✅ Multi-step booking form  
✅ AI-generated trip plans with OpenAI  
✅ Realistic fake flight and hotel data  
✅ Day-by-day itinerary generation  
✅ Stripe Test Mode integration  
✅ Real email confirmations  
✅ Responsive design  
✅ Error handling  
✅ Loading states  
✅ Success/failure flows  

## ⚠️ Important Notes

- **This is a demo application** - All bookings are simulated
- **No database** - Data is stored in sessionStorage temporarily
- **Test Mode only** - All payments are in Stripe Test Mode
- **AI-generated content** - Itineraries are created by AI and may vary

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repo on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Update `NEXT_PUBLIC_APP_URL` to your production URL.

## 📝 License

MIT License - feel free to use this for your own hackathons!

## 🙌 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [OpenAI](https://openai.com)
- [Stripe](https://stripe.com)
- [Resend](https://resend.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built in under 48 hours for hackathon demonstration** 🚀
