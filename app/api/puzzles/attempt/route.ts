import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculatePuzzleElo, getXpForSolve } from '@/lib/elo'
import { getNextReviewDate } from '@/lib/puzzle-engine'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { puzzleId, solved, timeSeconds, mode } = await req.json()
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

    const [user, puzzle] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { puzzleRating: true, currentStreak: true, longestStreak: true, lastPuzzleDate: true, totalPuzzlesSolved: true, totalPuzzlesAttempted: true, xpPoints: true } }),
      prisma.puzzle.findUnique({ where: { id: puzzleId }, select: { rating: true } }),
    ])

    if (!user || !puzzle) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const isRatedMode = mode === 'rated' || !mode
    const eloResult = isRatedMode
      ? calculatePuzzleElo(user.puzzleRating, puzzle.rating, solved, timeSeconds)
      : { ratingBefore: user.puzzleRating, ratingAfter: user.puzzleRating, ratingDelta: 0 }

    const xpGained = getXpForSolve(puzzle.rating, user.puzzleRating, solved)

    // Streak logic
    const today = new Date().toDateString()
    const lastDate = user.lastPuzzleDate ? new Date(user.lastPuzzleDate).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let newStreak = user.currentStreak
    if (solved) {
      if (lastDate === today) {
        // Already solved today, maintain streak
      } else if (lastDate === yesterday || lastDate === null) {
        newStreak += 1
      } else {
        newStreak = 1 // broke streak
      }
    }

    // Transactions
    const [attempt] = await Promise.all([
      prisma.puzzleAttempt.create({
        data: {
          userId,
          puzzleId,
          solved,
          timeSeconds,
          ratingBefore: eloResult.ratingBefore,
          ratingAfter: eloResult.ratingAfter,
          ratingDelta: eloResult.ratingDelta,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          puzzleRating: eloResult.ratingAfter,
          puzzleRatingBest: { set: Math.max(eloResult.ratingAfter, user.puzzleRating) },
          totalPuzzlesSolved: solved ? { increment: 1 } : undefined,
          totalPuzzlesAttempted: { increment: 1 },
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, user.longestStreak),
          lastPuzzleDate: solved ? new Date() : undefined,
          xpPoints: { increment: xpGained },
        },
      }),
      prisma.puzzleRatingHistory.create({
        data: { userId, rating: eloResult.ratingAfter },
      }),
      // Add to mistake review if wrong
      !solved
        ? prisma.mistakeReview.upsert({
            where: { userId_puzzleId: { userId, puzzleId } },
            create: { userId, puzzleId, nextReview: getNextReviewDate(0) },
            update: { reviewCount: { increment: 1 }, nextReview: getNextReviewDate(1) },
          })
        : // Mark mistake as solved if it was previously wrong
          prisma.mistakeReview.updateMany({
            where: { userId, puzzleId, solved: false },
            data: { solved: true },
          }),
    ])

    return NextResponse.json({
      ratingDelta: eloResult.ratingDelta,
      newRating: eloResult.ratingAfter,
      xpGained,
      streakCount: newStreak,
      solved,
    })
  } catch (error) {
    console.error('Puzzle attempt error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
