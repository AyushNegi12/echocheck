import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const planKey = session.metadata?.planKey || 'PRO_MONTHLY'
      const plan = planKey.includes('CREATOR') ? 'CREATOR' : 'PRO'

      await prisma.user.update({
        where: { id: userId },
        data: { plan: plan as any, stripeSubId: subscription.id },
      })

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeSubId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          status: 'ACTIVE',
          plan: plan as any,
        },
        create: {
          userId,
          stripeSubId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          plan: plan as any,
        },
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      if (!userId) break

      await prisma.user.update({
        where: { id: userId },
        data: { plan: 'FREE' },
      })
      await prisma.subscription.update({
        where: { userId },
        data: { status: 'CANCELED' },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
