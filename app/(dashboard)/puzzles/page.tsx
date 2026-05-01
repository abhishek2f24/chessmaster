export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getNextPuzzle } from '@/lib/puzzle-engine'
import { prisma } from '@/lib/prisma'
import { PuzzlesPageClient } from './PuzzlesPageClient'

export const metadata = { title: 'Puzzle Trainer' }

export default async function PuzzlesPage() {
  const session = await getServerSession(authOptions)!
  const userId = (session as any)!.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { puzzleRating: true, currentStreak: true, totalPuzzlesSolved: true, subscription: { select: { plan: true } } },
  })

  let limitReached = false
  if (user?.subscription?.plan === 'FREE') {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayAttempts = await prisma.puzzleAttempt.count({
      where: { userId, createdAt: { gte: todayStart } }
    })
    if (todayAttempts >= 10) limitReached = true
  }

  const puzzle = !limitReached ? await getNextPuzzle(userId, user?.puzzleRating ?? 800) : null

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Puzzle Trainer</h1>
        <p className="text-gray-500 text-sm">Find the best move. Train your tactical eye.</p>
      </div>
      <PuzzlesPageClient
        initialPuzzle={puzzle ? { ...puzzle, themes: puzzle.themes as string[] } : null}
        userRating={user?.puzzleRating ?? 800}
        userId={userId}
        initialLimitReached={limitReached}
      />
    </div>
  )
}
