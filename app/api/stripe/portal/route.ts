import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createBillingPortalSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
  }

  const url = await createBillingPortalSession(sub.stripeCustomerId)
  return NextResponse.json({ url })
}
