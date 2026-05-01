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
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        if (!userId || !session.subscription) break

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: getPlan(subscription.items.data[0].price.id),
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          update: {
            plan: getPlan(subscription.items.data[0].price.id),
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: invoice.subscription as string } })
        if (sub) await prisma.subscription.update({ where: { id: sub.id }, data: { status: 'PAST_DUE' } })
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: 'CANCELLED', plan: 'FREE' },
        })
        break
      }
    }
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

function getPlan(priceId: string): 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY' | 'FREE' {
  if (priceId === process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID) return 'PREMIUM_MONTHLY'
  if (priceId === process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID) return 'PREMIUM_YEARLY'
  return 'FREE'
}
