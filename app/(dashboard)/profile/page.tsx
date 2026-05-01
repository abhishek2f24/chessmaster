export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileClient } from './ProfileClient'

export const metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)!
  const userId = (session as any)!.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      achievements: { include: { achievement: true }, orderBy: { earnedAt: 'desc' } },
    },
  })

  const themeStats = await prisma.puzzleAttempt.groupBy({
    by: ['puzzleId'],
    where: { userId },
    _count: { solved: true },
  })

  return <ProfileClient user={user as any} session={session!} />
}
