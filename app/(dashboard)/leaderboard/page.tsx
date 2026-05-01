export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LeaderboardClient } from './LeaderboardClient'

export const metadata = { title: 'Leaderboard' }

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)

  // Build live leaderboard from user data
  const topUsers = await prisma.user.findMany({
    orderBy: { puzzleRating: 'desc' },
    take: 50,
    select: {
      id: true, name: true, image: true,
      puzzleRating: true, totalPuzzlesSolved: true,
      totalPuzzlesAttempted: true, currentStreak: true,
    },
  })

  const leaderboard = topUsers.map((u, i) => ({
    rank: i + 1,
    userId: u.id,
    name: u.name,
    image: u.image,
    puzzleRating: u.puzzleRating,
    puzzlesSolved: u.totalPuzzlesSolved,
    accuracy: u.totalPuzzlesAttempted > 0 ? Math.round((u.totalPuzzlesSolved / u.totalPuzzlesAttempted) * 100) : 0,
    streak: u.currentStreak,
  }))

  const myRank = session ? leaderboard.findIndex((u) => u.userId === session.user.id) + 1 : 0

  return <LeaderboardClient leaderboard={leaderboard} myUserId={session?.user.id} myRank={myRank} />
}
