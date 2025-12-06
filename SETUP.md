# 🚀 Quick Setup Guide

Follow these steps to get the AI Travel Agent up and running:

## 1. Install Dependencies

```bash
npm install
```

## 2. Get API Keys

### OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

### Stripe API Keys (Test Mode)
1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your "Publishable key" (starts with `pk_test_`)
3. Reveal and copy your "Secret key" (starts with `sk_test_`)

### Resend API Key
1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `re_`)

## 3. Create Environment File

Create a file named `.env.local` in the root directory:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-key-here

# Stripe Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here

# Resend API Key
RESEND_API_KEY=re_your-resend-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace the placeholder values with your actual API keys.

## 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Test the Application

### Test a Trip
1. Fill out the form:
   - Origin: "New York"
   - Destination: "Paris"
   - Travelers: 2
   - Pick dates at least 2 weeks in the future
2. Click "Plan My Trip with AI"
3. Wait for the AI to generate your trip (15-30 seconds)

### Test Payment
1. Click "Pay & Book Now"
2. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
3. Complete the checkout

### Test Email
1. After successful payment, enter your email
2. Check your inbox for the confirmation email

## 🎯 What to Expect

### Performance
- Trip planning: 15-30 seconds (OpenAI API call)
- Payment: Instant redirect to Stripe
- Email: Delivered within seconds

### Pricing (for your info)
- OpenAI: ~$0.01-0.02 per trip plan
- Stripe: No fees in test mode
- Resend: Free tier (100 emails/day)

## 🐛 Troubleshooting

### "Failed to generate trip plan"
- Check your OpenAI API key
- Ensure you have credits in your OpenAI account
- Check the browser console for detailed errors

### "Failed to create payment session"
- Verify your Stripe secret key
- Make sure you're using Test Mode keys
- Check the terminal/console for errors

### Email not received
- Verify your Resend API key
- With Resend free tier, you can only send to verified emails
- Check spam folder

### TypeScript errors
```bash
npm run build
```
This will show any type errors before running.

## 📝 Notes

- **Demo Only**: This is a proof-of-concept, not a production app
- **No Database**: Trip data is stored in sessionStorage only
- **Test Mode**: All payments are simulated
- **AI Variance**: OpenAI responses may vary between requests

## 🎉 You're Ready!

Your AI Travel Agent should now be fully functional. Happy hacking!

---

Need help? Check the main README.md for more detailed information.
