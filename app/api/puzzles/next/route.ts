import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getNextPuzzle } from '@/lib/puzzle-engine'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const rating = parseInt(searchParams.get('rating') ?? '800')
  const userId = session.user.id
  const userPlan = session.user.plan

  // Enforce daily limit for FREE plan
  if (userPlan === 'FREE') {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayAttempts = await prisma.puzzleAttempt.count({
      where: {
        userId,
        createdAt: { gte: todayStart }
      }
    })

    if (todayAttempts >= 10) {
      return NextResponse.json({ 
        error: 'Daily limit reached', 
        limitReached: true 
      }, { status: 403 })
    }
  }

  const puzzle = await getNextPuzzle(userId, rating)
  if (!puzzle) return NextResponse.json({ puzzle: null })

  return NextResponse.json({ puzzle })
}
