'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Star, Crown, ChevronDown, ChevronRight, Check, Play, Lock } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Props {
  course: any
  enrollment: any
  completedLessons: Set<string>
  userPlan: string
}

export function CourseDetailClient({ course, enrollment, completedLessons, userPlan }: Props) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set([course.chapters[0]?.id]))
  const [enrolling, setEnrolling] = useState(false)

  function toggleChapter(id: string) {
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleEnroll() {
    setEnrolling(true)
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      })
      if (res.ok) {
        toast.success('Enrolled successfully!')
        window.location.reload()
      }
    } finally {
      setEnrolling(false)
    }
  }

  const totalCompleted = completedLessons.size
  const progressPercent = enrollment?.progressPercent ?? 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500 bg-white/[0.04] px-2 py-0.5 rounded-full">{course.category}</span>
            <span className="text-xs text-gray-500">{course.level.charAt(0) + course.level.slice(1).toLowerCase()}</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-3">{course.title}</h1>
          <p className="text-gray-400 text-base leading-relaxed mb-5">{course.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{course.totalHours} hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-white">{course.rating || 'New'} rating</span>
            </div>
            <span>By {course.instructorName}</span>
          </div>
        </div>

        {/* Enrollment card */}
        <div className="premium-card p-6">
          {enrollment ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#A8872A] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="text-gray-600 text-xs mt-1.5">{totalCompleted}/{course.totalLessons} lessons completed</p>
              </div>
              <Link href={`/courses/${course.slug}/learn`} className="block w-full btn-gold text-center py-3">
                Continue Learning →
              </Link>
            </>
          ) : (
            <>
              {course.isPremium && userPlan === 'FREE' && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-semibold">Premium course</span>
                </div>
              )}
              <button
                onClick={handleEnroll}
                disabled={enrolling || (course.isPremium && userPlan === 'FREE')}
                className="w-full btn-gold py-3 mb-3 disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : course.isPremium && userPlan === 'FREE' ? 'Unlock with Premium' : 'Enroll for Free'}
              </button>
              {course.isPremium && userPlan === 'FREE' && (
                <Link href="/#pricing" className="block text-center text-[#D4AF37] text-sm hover:text-[#F0C84A] transition-colors">
                  Upgrade to Premium →
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <h2 className="text-xl font-black text-white mb-4">Course Curriculum</h2>
        <div className="space-y-2">
          {course.chapters.map((chapter: any) => {
            const isOpen = expandedChapters.has(chapter.id)
            const chapterCompleted = chapter.lessons.filter((l: any) => completedLessons.has(l.id)).length

            return (
              <div key={chapter.id} className="premium-card overflow-hidden">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${isOpen ? '' : '-rotate-90'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{chapter.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{chapter.lessons.length} lessons · {chapterCompleted} completed</p>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/[0.06]">
                    {chapter.lessons.map((lesson: any) => {
                      const done = completedLessons.has(lesson.id)
                      const locked = !lesson.isFree && !enrollment && course.isPremium && userPlan === 'FREE'

                      return (
                        <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-emerald-400/10' : 'bg-white/[0.04]'}`}>
                            {done ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : locked ? <Lock className="w-3 h-3 text-gray-600" /> : <Play className="w-3 h-3 text-gray-500" />}
                          </div>
                          <span className={`text-sm flex-1 ${done ? 'text-gray-500 line-through' : locked ? 'text-gray-600' : 'text-gray-300'}`}>
                            {lesson.title}
                          </span>
                          {lesson.duration && (
                            <span className="text-gray-600 text-xs">{Math.round(lesson.duration / 60)}m</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
