export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from './DashboardClient'

export const metadata = { title: 'Dashboard' }

async function getDashboardData(userId: string) {
  const [user, recentAttempts, ratingHistory, enrollments, mistakeCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        puzzleRating: true,
        puzzleRatingBest: true,
        totalPuzzlesSolved: true,
        totalPuzzlesAttempted: true,
        currentStreak: true,
        longestStreak: true,
        xpPoints: true,
        level: true,
        lastPuzzleDate: true,
        achievements: { include: { achievement: true }, orderBy: { earnedAt: 'desc' }, take: 5 },
        subscription: { select: { plan: true, status: true } },
      },
    }),
    prisma.puzzleAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { puzzle: { select: { themes: true, rating: true } } },
    }),
    prisma.puzzleRatingHistory.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    }),
    prisma.courseEnrollment.findMany({
      where: { userId },
      include: { course: { select: { title: true, thumbnail: true, category: true, totalLessons: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    }),
    prisma.mistakeReview.count({ where: { userId, solved: false } }),
  ])

  const accuracy =
    user && user.totalPuzzlesAttempted > 0
      ? Math.round((user.totalPuzzlesSolved / user.totalPuzzlesAttempted) * 100)
      : 0

  return { user, recentAttempts, ratingHistory: ratingHistory.reverse(), enrollments, mistakeCount, accuracy }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const data = await getDashboardData(session!.user.id)
  return <DashboardClient data={data} session={session!} />
}
