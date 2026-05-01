'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Clock, Star, Crown, Search, Filter } from 'lucide-react'

interface Course {
  id: string; slug: string; title: string; description: string; thumbnail?: string | null
  instructorName: string; category: string; level: string; ratingMin: number; ratingMax: number
  isPremium: boolean; totalLessons: number; totalHours: number; rating: number; enrollments: number; tags: string[]
}

interface Props {
  courses: Course[]
  enrollmentMap: Record<string, number>
  categories: string[]
  userPlan: string
}

const levelColors: Record<string, string> = {
  BEGINNER: 'text-emerald-400',
  INTERMEDIATE: 'text-blue-400',
  ADVANCED: 'text-purple-400',
  EXPERT: 'text-red-400',
}

export function CoursesClient({ courses, enrollmentMap, categories, userPlan }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = courses.filter((c) => {
    const matchCat = activeCategory === 'All' || c.category.toLowerCase() === activeCategory.toLowerCase()
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Chess Courses</h1>
        <p className="text-gray-500 text-sm">Structured learning paths from beginner to grandmaster level.</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full bg-[#111118] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]'
                  : 'border border-white/[0.06] text-gray-500 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((course, i) => {
          const progress = enrollmentMap[course.id]
          const enrolled = progress !== undefined
          const locked = course.isPremium && userPlan === 'FREE'

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/courses/${course.slug}`} className="block premium-card overflow-hidden group">
                {/* Thumbnail */}
                <div className="relative h-36 bg-gradient-to-br from-[#1A1A26] to-[#111118] flex items-center justify-center border-b border-white/[0.06]">
                  <span className="text-5xl opacity-40">
                    {course.category === 'Openings' ? '♙' : course.category === 'Tactics' ? '⚡' : course.category === 'Endgame' ? '♚' : '♛'}
                  </span>
                  {locked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                  )}
                  {enrolled && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.06]">
                      <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#A8872A]" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  {course.isPremium && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 backdrop-blur-sm">
                      <Crown className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] text-[10px] font-bold">PRO</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{course.category}</span>
                    <span className={`text-xs font-semibold ${levelColors[course.level] ?? 'text-gray-400'}`}>
                      {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 group-hover:text-white/90">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-xs mb-3">{course.instructorName}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.totalHours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="text-white">{course.rating || '—'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">No courses found</p>
          <p className="text-gray-700 text-sm mt-1">Try a different category or search term</p>
        </div>
      )}
    </div>
  )
}
