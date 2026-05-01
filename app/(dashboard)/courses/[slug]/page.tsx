export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CourseDetailClient } from './CourseDetailClient'

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: { id: true, title: true, duration: true, isFree: true, isPremium: true, order: true },
          },
        },
      },
    },
  })

  if (!course) notFound()

  const [enrollment, lessonProgress] = await Promise.all([
    session
      ? prisma.courseEnrollment.findUnique({
          where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
        })
      : null,
    session
      ? prisma.lessonProgress.findMany({
          where: { userId: session.user.id, lesson: { chapter: { courseId: course.id } } },
          select: { lessonId: true, completed: true },
        })
      : [],
  ])

  const completedSet = new Set(lessonProgress.filter((lp) => lp.completed).map((lp) => lp.lessonId))

  return (
    <CourseDetailClient
      course={course as any}
      enrollment={enrollment}
      completedLessons={completedSet}
      userPlan={session?.user.plan ?? 'FREE'}
    />
  )
}
