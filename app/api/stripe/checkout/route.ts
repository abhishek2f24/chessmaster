import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession, PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()

  const planData = PLANS[plan as keyof typeof PLANS]
  if (!planData?.priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  const url = await createCheckoutSession(
    session.user.id,
    session.user.email!,
    planData.priceId,
    user?.subscription?.stripeCustomerId ?? undefined,
  )

  return NextResponse.json({ url })
}
