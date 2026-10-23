'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, ChevronRight, Play, CheckCircle, 
  Lock, Menu, X, BookOpen, Clock, Star, 
  MessageSquare, FileText, Download, PlayCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Props {
  course: any
  enrollment: any
  completedLessons: Set<string>
}

export function LearnClient({ course, enrollment, completedLessons: initialCompleted }: Props) {
  const allLessons = course.chapters.flatMap((c: any) => c.lessons)
  const [currentLesson, setCurrentLesson] = useState(allLessons[0])
  const [completedLessons, setCompletedLessons] = useState(initialCompleted)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)

  const currentIndex = allLessons.findIndex((l: any) => l.id === currentLesson.id)
  const nextLesson = allLessons[currentIndex + 1]
  const prevLesson = allLessons[currentIndex - 1]

  async function toggleComplete(lessonId: string, completed: boolean) {
    setIsCompleting(true)
    try {
      const res = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, completed }),
      })
      if (res.ok) {
        const next = new Set(completedLessons)
        completed ? next.add(lessonId) : next.delete(lessonId)
        setCompletedLessons(next)
        if (completed && nextLesson) {
          toast.success('Lesson completed!')
          setCurrentLesson(nextLesson)
        }
      }
    } catch (error) {
      toast.error('Failed to update progress')
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="fixed inset-0 top-16 lg:top-0 bg-[#0A0A0F] flex z-40">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg text-black"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-80 bg-[#0D0D14] border-r border-white/[0.06] transition-transform duration-300 lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/[0.06]">
            <Link href={`/courses/${course.slug}`} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Overview</span>
            </Link>
            <h2 className="text-white font-black leading-tight">{course.title}</h2>
            <div className="mt-3 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#A8872A] transition-all duration-500"
                style={{ width: `${(completedLessons.size / allLessons.length) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">
              {completedLessons.size} / {allLessons.length} Lessons Completed
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {course.chapters.map((chapter: any) => (
              <div key={chapter.id} className="border-b border-white/[0.03]">
                <div className="px-6 py-3 bg-white/[0.02]">
                  <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1">
                    Chapter {chapter.order + 1}
                  </p>
                  <p className="text-xs font-bold text-white truncate">{chapter.title}</p>
                </div>
                <div>
                  {chapter.lessons.map((lesson: any) => {
                    const isActive = currentLesson.id === lesson.id
                    const isDone = completedLessons.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setCurrentLesson(lesson)
                          if (window.innerWidth < 1024) setSidebarOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-start gap-3 px-6 py-4 text-left transition-colors",
                          isActive ? "bg-[#D4AF37]/5 border-r-2 border-[#D4AF37]" : "hover:bg-white/[0.02]"
                        )}
                      >
                        <div className={cn(
                          "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                          isDone ? "bg-emerald-500/20 border-emerald-500/50" : "bg-white/[0.04] border-white/10",
                          isActive && !isDone && "border-[#D4AF37]/50"
                        )}>
                          {isDone ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          ) : isActive ? (
                            <Play className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]" />
                          ) : (
                            <span className="text-[10px] text-gray-600 font-bold">{lesson.order + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium transition-colors",
                            isActive ? "text-white" : isDone ? "text-gray-500" : "text-gray-400"
                          )}>
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{Math.round(lesson.duration / 60)}m</span>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Top Header */}
        <div className="h-16 border-b border-white/[0.06] flex items-center justify-between px-8 bg-[#0D0D14]/80 backdrop-blur-sm z-10 shrink-0">
          <h1 className="text-white font-bold truncate pr-4">{currentLesson.title}</h1>
          <div className="flex items-center gap-3">
            <button 
              disabled={!prevLesson}
              onClick={() => setCurrentLesson(prevLesson)}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              disabled={!nextLesson}
              onClick={() => setCurrentLesson(nextLesson)}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Video Player Placeholder */}
            {currentLesson.videoUrl ? (
              <div className="aspect-video bg-[#16161F] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl relative group">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                  <PlayCircle className="w-20 h-20 text-[#D4AF37] opacity-80 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100" />
                  <p className="mt-4 text-gray-400 font-medium">Video Player Implementation</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest">{currentLesson.videoUrl}</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-[#16161F] rounded-2xl flex flex-col items-center justify-center border border-dashed border-white/10">
                <FileText className="w-12 h-12 text-gray-700 mb-4" />
                <p className="text-gray-500 font-medium text-center px-6">This lesson contains text and study material</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between pb-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                  <MessageSquare className="w-4 h-4" />
                  <span>Discussion</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  <span>Resources</span>
                </button>
              </div>
              <button 
                onClick={() => toggleComplete(currentLesson.id, !completedLessons.has(currentLesson.id))}
                disabled={isCompleting}
                className={cn(
                  "btn-gold !py-2.5 !px-8 flex items-center gap-2",
                  completedLessons.has(currentLesson.id) && "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                )}
              >
                {completedLessons.has(currentLesson.id) ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Lesson Completed</span>
                  </>
                ) : (
                  <>
                    <span>{isCompleting ? 'Processing...' : 'Complete & Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Lesson Details */}
            <div className="space-y-6 pb-20">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-white">Lesson Overview</h2>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{Math.round((currentLesson.duration || 0) / 60)} minutes</span>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-400 leading-relaxed text-lg">
                  {currentLesson.description || "In this lesson, we will cover the key concepts and strategies for this topic. Pay close attention to the board examples and common patterns."}
                </p>
                {currentLesson.textContent && (
                  <div className="mt-8 p-6 bg-white/[0.02] rounded-xl border border-white/[0.06] text-gray-300 leading-relaxed">
                    {currentLesson.textContent}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
