export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CoursesClient } from './CoursesClient'

export const metadata = { title: 'Courses' }

const categories = ['All', 'Openings', 'Middlegame', 'Endgame', 'Tactics', 'Strategy', 'Beginner', 'Advanced']

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  const [courses, enrollments] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { enrollments: 'desc' }],
      select: {
        id: true, slug: true, title: true, description: true, thumbnail: true,
        instructorName: true, category: true, level: true, ratingMin: true, ratingMax: true,
        isPremium: true, totalLessons: true, totalHours: true, rating: true, enrollments: true, tags: true,
      },
    }),
    session
      ? prisma.courseEnrollment.findMany({
          where: { userId: session.user.id },
          select: { courseId: true, progressPercent: true },
        })
      : [],
  ])

  const enrollmentMap = Object.fromEntries(enrollments.map((e) => [e.courseId, e.progressPercent]))

  return <CoursesClient courses={courses} enrollmentMap={enrollmentMap} categories={categories} userPlan={session?.user.plan ?? 'FREE'} />
}
