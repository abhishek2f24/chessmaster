'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, Clock, BookOpen, Crown } from 'lucide-react'

const courses = [
  {
    title: 'Crushing Openings as White',
    instructor: 'GM Anish Giri Style',
    category: 'Openings',
    level: 'Intermediate',
    rating: 4.9,
    lessons: 32,
    hours: 12,
    isPremium: true,
    ratingRange: '1200–1800',
    color: 'from-blue-500/10 to-indigo-500/5',
    accent: 'text-blue-400',
    emoji: '♙',
  },
  {
    title: 'Tactical Patterns Masterclass',
    instructor: 'GM Magnus Style',
    category: 'Tactics',
    level: 'Advanced',
    rating: 4.8,
    lessons: 45,
    hours: 18,
    isPremium: true,
    ratingRange: '1400–2200',
    color: 'from-[#D4AF37]/10 to-amber-500/5',
    accent: 'text-[#D4AF37]',
    emoji: '♞',
  },
  {
    title: 'Endgame Essentials',
    instructor: 'GM Karjakin Style',
    category: 'Endgame',
    level: 'Beginner',
    rating: 4.9,
    lessons: 28,
    hours: 10,
    isPremium: false,
    ratingRange: '800–1400',
    color: 'from-emerald-500/10 to-teal-500/5',
    accent: 'text-emerald-400',
    emoji: '♚',
  },
  {
    title: 'Middlegame Strategy',
    instructor: 'GM Carlsen Style',
    category: 'Strategy',
    level: 'Advanced',
    rating: 4.7,
    lessons: 38,
    hours: 15,
    isPremium: true,
    ratingRange: '1600–2400',
    color: 'from-purple-500/10 to-pink-500/5',
    accent: 'text-purple-400',
    emoji: '♛',
  },
]

export function CoursesPreview() {
  return (
    <section className="py-24 bg-[#0D0D14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-3">Academy Courses</p>
            <h2 className="text-4xl font-black text-white">
              Structured paths to{' '}
              <span className="gold-text">mastery</span>
            </h2>
          </div>
          <Link href="/courses" className="flex items-center gap-2 text-[#D4AF37] hover:text-[#F0C84A] transition-colors text-sm font-semibold shrink-0">
            View all courses <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`group relative bg-gradient-to-br ${course.color} border border-white/[0.06] hover:border-white/[0.12] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer`}
            >
              {/* Header */}
              <div className="p-5 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-4xl`}>{course.emoji}</span>
                  {course.isPremium && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      <Crown className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] text-[10px] font-bold">PRO</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-semibold ${course.accent} uppercase tracking-wider`}>
                  {course.category}
                </span>
                <h3 className="text-white font-bold text-sm mt-1 leading-snug group-hover:text-white/90 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-xs mt-1">{course.instructor}</p>
              </div>

              {/* Stats */}
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.hours}h</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                    <span className="text-white text-xs font-semibold">{course.rating}</span>
                  </div>
                  <span className="text-gray-600 text-xs">{course.ratingRange}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
