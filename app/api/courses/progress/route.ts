import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { lessonId, completed } = await req.json()

    if (!lessonId) return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 })

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        completed: completed,
        completedAt: completed ? new Date() : null,
      },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: {
                  include: {
                    chapters: {
                      include: {
                        lessons: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    // Update course enrollment progress percentage
    const course = progress.lesson.chapter.course
    const totalLessons = course.chapters.reduce((acc, c) => acc + c.lessons.length, 0)
    const completedCount = await prisma.lessonProgress.count({
      where: {
        userId: session.user.id,
        lesson: { chapter: { courseId: course.id } },
        completed: true,
      },
    })

    const progressPercent = Math.round((completedCount / totalLessons) * 100)

    await prisma.courseEnrollment.update({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
      data: {
        progressPercent,
        lastLesson: lessonId,
      },
    })

    return NextResponse.json({ success: true, progressPercent })
  } catch (error: any) {
    console.error('Progress update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
