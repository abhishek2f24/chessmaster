import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { skillLevel, goal } = await req.json()

  const ratingMap: Record<string, number> = {
    beginner: 800,
    intermediate: 1100,
    advanced: 1400,
    expert: 1700,
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      skillLevel,
      goal,
      onboardingDone: true,
      puzzleRating: ratingMap[skillLevel] ?? 800,
    },
  })

  return NextResponse.json({ ok: true })
}
