import { prisma } from '@/lib/prisma'
import { getPuzzleRatingRange } from '@/lib/elo'

export async function getNextPuzzle(userId: string, userRating: number) {
  const [minRating, maxRating] = getPuzzleRatingRange(userRating)

  // Get puzzles the user has NOT recently solved
  const recentAttempts = await prisma.puzzleAttempt.findMany({
    where: { userId, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    select: { puzzleId: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const excludeIds = recentAttempts.map((a) => a.puzzleId)

  const puzzle = await prisma.puzzle.findFirst({
    where: {
      isActive: true,
      rating: { gte: minRating, lte: maxRating },
      id: { notIn: excludeIds },
    },
    orderBy: { popularity: 'desc' },
  })

  if (puzzle) return puzzle

  // Fallback: any puzzle in range
  return prisma.puzzle.findFirst({
    where: { isActive: true, rating: { gte: minRating, lte: maxRating } },
    orderBy: { popularity: 'desc' },
  })
}

export async function getRetryPuzzles(userId: string) {
  return prisma.mistakeReview.findMany({
    where: { userId, solved: false, nextReview: { lte: new Date() } },
    include: { puzzle: true },
    orderBy: { nextReview: 'asc' },
    take: 20,
  })
}

export async function getThemePuzzles(
  userId: string,
  theme: string,
  userRating: number,
) {
  const [minRating, maxRating] = getPuzzleRatingRange(userRating)
  return prisma.puzzle.findMany({
    where: {
      isActive: true,
      themes: { has: theme as any },
      rating: { gte: minRating, lte: maxRating },
    },
    take: 10,
    orderBy: { popularity: 'desc' },
  })
}

export function getNextReviewDate(reviewCount: number): Date {
  // Spaced repetition intervals: 1 day, 3 days, 7 days, 14 days, 30 days
  const intervals = [1, 3, 7, 14, 30]
  const days = intervals[Math.min(reviewCount, intervals.length - 1)]
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}
