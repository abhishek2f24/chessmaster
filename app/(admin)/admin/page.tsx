export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { AdminDashboardClient } from './AdminDashboardClient'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const [userCount, puzzleCount, courseCount, recentUsers, recentAttempts] = await Promise.all([
    prisma.user.count(),
    prisma.puzzle.count({ where: { isActive: true } }),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, name: true, email: true, createdAt: true, puzzleRating: true, subscription: { select: { plan: true } } },
    }),
    prisma.puzzleAttempt.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ])

  return (
    <AdminDashboardClient
      stats={{ userCount, puzzleCount, courseCount, recentAttempts }}
      recentUsers={recentUsers as any}
    />
  )
}
