export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LearnClient } from './LearnClient'

export default async function LearnPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!course) notFound()

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  })

  if (!enrollment && course.isPremium && session.user.plan === 'FREE') {
    redirect(`/courses/${params.slug}`)
  }

  const lessonProgress = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, lesson: { chapter: { courseId: course.id } } },
    select: { lessonId: true, completed: true },
  })

  const completedLessons = new Set(lessonProgress.filter(lp => lp.completed).map(lp => lp.lessonId))

  return (
    <LearnClient
      course={course as any}
      enrollment={enrollment}
      completedLessons={completedLessons}
    />
  )
}
