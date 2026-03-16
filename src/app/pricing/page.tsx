'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { PLANS } from '@/lib/stripe'

const PLAN_CARDS = [
  {
    key: 'FREE',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    highlight: false,
    features: [
      '5 checks per day',
      'Community feed access',
      'Basic verdict + signals',
      'Vote to earn accuracy score',
      'Ads in feed',
    ],
    cta: 'Get started',
    ctaAction: 'register',
  },
  {
    key: 'PRO_MONTHLY',
    name: 'Pro',
    price: '₹299',
    period: '/month',
    highlight: true,
    badge: 'Most popular',
    features: [
      'Unlimited checks',
      'Signal Feed (Trusted Voice early access)',
      'Advanced AI breakdown reports',
      'No ads',
      'Trusted Voice fast-track',
      'Priority support',
    ],
    cta: 'Start Pro',
    ctaAction: 'checkout',
  },
  {
    key: 'CREATOR_MONTHLY',
    name: 'Creator',
    price: '₹799',
    period: '/month',
    highlight: false,
    features: [
      'Everything in Pro',
      'Trend Alerts 24h before mainstream',
      'Creator analytics dashboard',
      'API access (100 req/day)',
      'White-label reports',
      'Dedicated account manager',
    ],
    cta: 'Start Creator',
    ctaAction: 'checkout',
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(plan: typeof PLAN_CARDS[0]) {
    if (plan.ctaAction === 'register') {
      router.push('/auth/register')
      return
    }
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/pricing')
      return
    }
    setLoading(plan.key)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey: plan.key }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  const currentPlan = (session?.user as any)?.plan

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold mb-4">Simple, transparent pricing</h1>
          <p className="text-muted text-sm max-w-md mx-auto">
            Start free. Upgrade when you need more checks, no ads, or early trend access.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLAN_CARDS.map(plan => (
            <div
              key={plan.key}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? 'border-accent/40 bg-accent/5'
                  : 'border-white/[0.07] bg-surface'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-accent text-bg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 text-xs ${plan.highlight ? 'text-accent' : 'text-muted'}`}>✓</span>
                    <span className={plan.highlight ? 'text-white' : 'text-muted'}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleAction(plan)}
                disabled={loading === plan.key || currentPlan === plan.key.replace('_MONTHLY', '')}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                  plan.highlight
                    ? 'bg-accent text-bg hover:opacity-90'
                    : 'border border-white/[0.12] text-white hover:bg-surface2'
                } disabled:opacity-40`}
              >
                {loading === plan.key
                  ? 'Redirecting…'
                  : currentPlan === plan.key.replace('_MONTHLY', '')
                  ? 'Current plan'
                  : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-xl font-extrabold text-center mb-8">Frequently asked questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: 'How does the Trusted Voice badge work?', a: 'Vote on 20+ checks with 85%+ accuracy vs our AI verdict and you earn the badge automatically.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your dashboard at any time. You keep access until the end of your billing period.' },
              { q: 'What payment methods are accepted?', a: 'All major credit/debit cards via Stripe. UPI and net banking coming soon.' },
              { q: 'Is the API available on free plans?', a: 'No, API access is Creator plan only. It allows 100 programmatic checks per day.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-surface border border-white/[0.07] rounded-xl p-5">
                <p className="text-sm font-bold mb-2">{q}</p>
                <p className="text-xs text-muted leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
