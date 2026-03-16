import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const PLANS = {
  PRO_MONTHLY: {
    name: 'Pro',
    price: 299,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    interval: 'month' as const,
    features: [
      'Unlimited checks per day',
      'Signal Feed access (early trends)',
      'Advanced AI breakdown reports',
      'No ads',
      'Trusted Voice fast-track',
    ],
  },
  PRO_YEARLY: {
    name: 'Pro (Yearly)',
    price: 2499,
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    interval: 'year' as const,
    features: [
      'Everything in Pro Monthly',
      '30% discount',
      'Priority support',
    ],
  },
  CREATOR_MONTHLY: {
    name: 'Creator',
    price: 799,
    priceId: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID!,
    interval: 'month' as const,
    features: [
      'Everything in Pro',
      'Trend Alerts 24h early',
      'Creator analytics dashboard',
      'API access (100 req/day)',
      'White-label reports',
    ],
  },
}
