# EchoCheck — Full-Stack Next.js App

AI Authenticity Score platform. Community + AI scores for every viral Reel, TikTok, and article.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js (Google OAuth + Email/Password)
- **Payments**: Stripe (subscriptions + webhooks)
- **Ads**: Google AdSense
- **Hosting**: Vercel

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── feed/page.tsx         ← Main feed with ads
│   ├── submit/page.tsx       ← Submit URL for analysis
│   ├── pricing/page.tsx      ← Pricing + Stripe checkout
│   ├── dashboard/page.tsx    ← User dashboard
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── register/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── auth/register/route.ts
│       ├── checks/route.ts         ← GET feed, POST submit URL
│       ├── checks/[id]/vote/route.ts
│       ├── stripe/checkout/route.ts
│       └── stripe/webhook/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── CheckCard.tsx         ← Feed card with score ring + voting
│   ├── AdSlot.tsx            ← AdSense wrapper
│   └── Providers.tsx
└── lib/
    ├── prisma.ts             ← DB client
    ├── auth.ts               ← NextAuth config
    ├── stripe.ts             ← Stripe + plan definitions
    └── scoring.ts            ← AI analysis engine
```

---

## Step 1 — Set up the database (free)

1. Go to **https://neon.tech** → Create account → New project
2. Copy your connection string (looks like `postgresql://user:pass@host/db`)
3. That's your `DATABASE_URL`

---

## Step 2 — Google OAuth

1. Go to **https://console.cloud.google.com**
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web application
4. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret

---

## Step 3 — Stripe setup

1. Go to **https://dashboard.stripe.com** → Create account
2. Get your API keys from Developers → API Keys
3. Create Products:
   - Pro Monthly: ₹299/month recurring
   - Pro Yearly: ₹2499/year recurring
   - Creator Monthly: ₹799/month recurring
4. Copy each Price ID
5. Set up webhook: Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`

---

## Step 4 — Local development

```bash
# Clone and install
git clone <your-repo>
cd echocheck
npm install

# Copy env file
cp .env.example .env
# Fill in all values in .env

# Push database schema
npm run db:push

# Start dev server
npm run dev
```

App runs at **http://localhost:3000**

---

## Step 5 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add all environment variables in Vercel dashboard:
# Settings → Environment Variables → add each from .env
```

Or connect GitHub repo directly at **vercel.com/new**

### After deploying:
1. Update `NEXTAUTH_URL` to your production URL (e.g. `https://echocheck.vercel.app`)
2. Add production URL to Google OAuth allowed redirects
3. Add production webhook URL to Stripe dashboard
4. Run `vercel env pull` to sync env vars

---

## Step 6 — Google AdSense

1. Go to **https://adsense.google.com**
2. Add your site and verify ownership (paste snippet into `src/app/layout.tsx`)
3. Wait for approval (1–7 days)
4. Create ad units → copy slot IDs
5. Add to `.env`: `NEXT_PUBLIC_ADSENSE_CLIENT_ID` and slot IDs

---

## Step 7 — Replace mock AI with real AI

In `src/lib/scoring.ts`, replace `generateMockAnalysis()` with a real API call:

```typescript
// Using Anthropic Claude API
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY!,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-opus-4-5',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Analyze this URL for authenticity: ${url}. 
      Return JSON: { score: 0-100, verdict: AUTHENTIC|AI_GENERATED|MIXED|SCAM, signals: string[], title: string, category: string }`
    }]
  })
})
```

---

## Monetization Summary

| Stream | How | Expected revenue |
|--------|-----|-----------------|
| AdSense (feed ads) | Auto-served ads for free users | ₹50–200 per 1000 sessions |
| Pro subscriptions | ₹299/mo via Stripe | Main revenue |
| Creator subscriptions | ₹799/mo via Stripe | High-value users |
| Trend Alert API | ₹799/mo Creator plan | Creators + brands |

---

## Commands

```bash
npm run dev          # Local dev server
npm run build        # Production build
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma visual DB editor
```
