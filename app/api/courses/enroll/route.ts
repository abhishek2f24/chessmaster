import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId } = await req.json()
  const userId = session.user.id

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { isPremium: true } })
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  if (course.isPremium && session.user.plan === 'FREE') {
    return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
  }

  const enrollment = await prisma.courseEnrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  })

  await prisma.course.update({ where: { id: courseId }, data: { enrollments: { increment: 1 } } })

  return NextResponse.json({ enrollment })
}
