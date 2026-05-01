import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '10 puzzles per day',
      '3 free course lessons',
      'Basic progress tracking',
      'Community leaderboard',
    ],
  },
  PREMIUM_MONTHLY: {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 1499,
    priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    features: [
      'Unlimited puzzles',
      'All courses unlocked',
      'Advanced analytics',
      'Mistake review system',
      'Spaced repetition',
      'Priority support',
      'Download PGNs',
      'Premium tournaments',
    ],
  },
  PREMIUM_YEARLY: {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 9999,
    priceId: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
    features: [
      'Everything in Monthly',
      '45% savings vs monthly',
      'Early access to new courses',
      'Monthly group coaching call',
      'Personalized study plan',
    ],
  },
} as const

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  customerId?: string,
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?subscription=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?cancelled=true`,
    metadata: { userId },
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId },
    },
  })

  return session.url!
}

export async function createBillingPortalSession(customerId: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/profile`,
  })
  return session.url
}
