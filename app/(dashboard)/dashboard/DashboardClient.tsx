'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Session } from 'next-auth'
import {
  Zap, BookOpen, Trophy, RefreshCw, Target, TrendingUp,
  Flame, Star, Crown, ArrowRight, ChevronRight, BarChart3
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getRatingTitle, getRatingColor } from '@/lib/elo'
import { formatDate, getAccuracyColor } from '@/lib/utils'

interface Props {
  session: Session
  data: any
}

export function DashboardClient({ session, data }: Props) {
  const { user, ratingHistory, enrollments, mistakeCount, accuracy } = data
  if (!user) return null

  const chartData = ratingHistory.map((h: any) => ({
    date: new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    rating: h.rating,
  }))

  const stats = [
    { label: 'Puzzle Rating', value: user.puzzleRating, sub: getRatingTitle(user.puzzleRating), icon: Zap, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20' },
    { label: 'Puzzles Solved', value: user.totalPuzzlesSolved.toLocaleString(), sub: `Accuracy: ${accuracy}%`, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
    { label: 'Daily Streak', value: `🔥 ${user.currentStreak}`, sub: `Best: ${user.longestStreak} days`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
    { label: 'XP Points', value: user.xpPoints.toLocaleString(), sub: `Level ${user.level}`, icon: Star, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  ]

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            {greeting}, {user.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Ready to improve your game? Your puzzle ELO is{' '}
            <span style={{ color: getRatingColor(user.puzzleRating) }} className="font-bold">
              {user.puzzleRating} ({getRatingTitle(user.puzzleRating)})
            </span>
          </p>
        </div>
        <Link href="/puzzles" className="btn-gold text-sm py-2.5 px-5 flex items-center gap-2 whitespace-nowrap">
          <Zap className="w-4 h-4" /> Solve Puzzles
        </Link>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="premium-card p-5"
          >
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-black text-white">{stat.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
            <p className={`text-xs mt-1 ${stat.color}`}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rating chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 premium-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-bold">Tactical Rating Progress</h3>
              <p className="text-gray-500 text-xs mt-0.5">Last 30 puzzle sessions</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-bold">
                {chartData.length > 1 ? `${chartData[chartData.length - 1]?.rating - chartData[0]?.rating > 0 ? '+' : ''}${chartData[chartData.length - 1]?.rating - chartData[0]?.rating}` : '+0'}
              </span>
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#374151" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#374151" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#16161F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Area type="monotone" dataKey="rating" stroke="#D4AF37" strokeWidth={2} fill="url(#ratingGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Solve puzzles to track your progress</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Daily challenge */}
          <div className="premium-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Daily Challenge</p>
                <p className="text-gray-500 text-xs">4 puzzles, bonus XP</p>
              </div>
            </div>
            <Link href="/puzzles/daily" className="block w-full text-center py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold hover:bg-[#D4AF37]/20 transition-colors">
              Start Challenge →
            </Link>
          </div>

          {/* Mistake review */}
          <div className="premium-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Review Mistakes</p>
                <p className="text-gray-500 text-xs">{mistakeCount} puzzles to retry</p>
              </div>
            </div>
            <Link href="/puzzles/retry" className="block w-full text-center py-2.5 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-semibold hover:bg-red-400/20 transition-colors">
              Practice Now →
            </Link>
          </div>

          {/* Best rating */}
          <div className="premium-card p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
              <Crown className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Personal Best</p>
              <p className="text-white font-black text-lg">{user.puzzleRatingBest}</p>
              <p className="text-gray-600 text-[10px]">{getRatingTitle(user.puzzleRatingBest)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Courses in progress */}
      {enrollments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Continue Learning</h3>
            <Link href="/courses" className="text-[#D4AF37] text-sm flex items-center gap-1 hover:text-[#F0C84A] transition-colors">
              All courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {enrollments.map((e: any, i: number) => (
              <Link key={i} href={`/courses/${e.courseId}`} className="premium-card p-4 block">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-gray-500 bg-white/[0.04] px-2 py-0.5 rounded-full">{e.course.category}</span>
                  <span className="text-xs text-[#D4AF37]">{e.progressPercent}%</span>
                </div>
                <p className="text-white text-sm font-semibold leading-snug mb-3 line-clamp-2">{e.course.title}</p>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#A8872A] rounded-full transition-all" style={{ width: `${e.progressPercent}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      {user.achievements?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="text-white font-bold mb-4">Recent Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {user.achievements.map((ua: any, i: number) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#111118] border border-white/[0.06] hover:border-[#D4AF37]/20 transition-colors">
                <span className="text-2xl">{ua.achievement.icon}</span>
                <div>
                  <p className="text-white text-xs font-bold">{ua.achievement.name}</p>
                  <p className="text-gray-500 text-[10px]">+{ua.achievement.xpReward} XP</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
