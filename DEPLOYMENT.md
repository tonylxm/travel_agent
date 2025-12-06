# 📋 Deployment Checklist

Use this checklist when deploying your AI Travel Agent to production.

## Pre-Deployment

- [ ] All API keys are configured in `.env.local`
- [ ] Application runs successfully locally (`npm run dev`)
- [ ] Test trip planning works
- [ ] Test payment flow works
- [ ] Test email confirmation works
- [ ] Code is committed to Git
- [ ] `.env.local` is in `.gitignore` (already done)

## Vercel Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### 2. Import on Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables
In Vercel project settings, add these environment variables:

```
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key
RESEND_API_KEY=re_your-resend-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

⚠️ **Important**: Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL after deployment!

### 4. Deploy
Click "Deploy" and wait for build to complete.

### 5. Update Environment Variable
After first deployment:
1. Copy your Vercel deployment URL
2. Go to Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
4. Redeploy

### 6. Configure Stripe Redirect URLs
1. Go to Stripe Dashboard
2. Update success/cancel URLs to use your Vercel domain:
   - Success: `https://your-app.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`
   - Cancel: `https://your-app.vercel.app?canceled=true`

## Post-Deployment Testing

- [ ] Visit your deployed URL
- [ ] Test trip planning
- [ ] Test payment flow
- [ ] Test email confirmation
- [ ] Check browser console for errors
- [ ] Check Vercel logs for server errors

## Production Considerations

### Moving to Production Stripe
To use real payments (not recommended for demo):
1. Get production API keys from Stripe
2. Replace test keys with production keys
3. **⚠️ Add proper authentication and user management**
4. **⚠️ Add booking persistence (database)**
5. **⚠️ Add proper error handling and monitoring**

### Resend Email Limits
- Free tier: 100 emails/day
- For more emails, upgrade Resend plan
- Verify sender domain for better deliverability

### OpenAI API Costs
- Monitor usage at [https://platform.openai.com/usage](https://platform.openai.com/usage)
- Set spending limits if needed
- Each trip plan costs ~$0.01-0.02

## Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In Vercel:
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
3. Update `NEXT_PUBLIC_APP_URL` in environment variables

## Monitoring

### Vercel Analytics
Enable in Project Settings → Analytics

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Web Analytics

## Security Best Practices

- [ ] Never commit `.env.local` to Git
- [ ] Use environment variables for all secrets
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Use HTTPS only (automatic on Vercel)
- [ ] Validate all user inputs (already implemented)
- [ ] Use Stripe test mode for demos

## Performance Tips

- [ ] Enable Vercel Edge Network (automatic)
- [ ] Add loading states (already implemented)
- [ ] Optimize images if added
- [ ] Monitor Core Web Vitals

## Demo Day Checklist

- [ ] App is deployed and accessible
- [ ] Have test data ready (origin/destination examples)
- [ ] Prepare Stripe test card number (4242 4242 4242 4242)
- [ ] Test on mobile devices
- [ ] Prepare talking points about features
- [ ] Have backup plan if API services are down

## Common Issues

### Build Fails
```bash
# Test build locally first
npm run build
```

### API Keys Not Working
- Check they're added in Vercel settings
- Ensure no extra spaces or quotes
- Redeploy after adding variables

### Emails Not Sending
- Verify Resend API key
- Check Resend dashboard for errors
- Ensure sender email is verified

### Payment Redirect Fails
- Verify `NEXT_PUBLIC_APP_URL` is correct
- Check Stripe webhook settings
- Ensure success URL includes session_id parameter

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Stripe Test Mode](https://stripe.com/docs/testing)
- [Resend Documentation](https://resend.com/docs)

---

## 🎉 Ready to Ship!

Once all checkboxes are ✅, you're ready to demo your AI Travel Agent!

Good luck with your hackathon! 🚀
