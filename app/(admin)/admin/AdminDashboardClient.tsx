'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, Zap, BookOpen, Activity, Crown, Settings, Upload, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  stats: { userCount: number; puzzleCount: number; courseCount: number; recentAttempts: number }
  recentUsers: any[]
}

export function AdminDashboardClient({ stats, recentUsers }: Props) {
  const adminCards = [
    { title: 'Total Users', value: stats.userCount.toLocaleString(), icon: Users, color: 'text-blue-400', href: '/admin/users' },
    { title: 'Active Puzzles', value: stats.puzzleCount.toLocaleString(), icon: Zap, color: 'text-[#D4AF37]', href: '/admin/puzzles' },
    { title: 'Published Courses', value: stats.courseCount.toLocaleString(), icon: BookOpen, color: 'text-emerald-400', href: '/admin/courses' },
    { title: 'Attempts Today', value: stats.recentAttempts.toLocaleString(), icon: Activity, color: 'text-purple-400', href: '/admin/analytics' },
  ]

  const quickActions = [
    { label: 'Create Course', icon: BookOpen, href: '/admin/courses/new', color: 'text-blue-400' },
    { label: 'Import Puzzles', icon: Upload, href: '/admin/puzzles/import', color: 'text-[#D4AF37]' },
    { label: 'Manage Users', icon: Users, href: '/admin/users', color: 'text-emerald-400' },
    { label: 'View Analytics', icon: TrendingUp, href: '/admin/analytics', color: 'text-purple-400' },
    { label: 'Achievements', icon: Crown, href: '/admin/achievements', color: 'text-orange-400' },
    { label: 'Settings', icon: Settings, href: '/admin/settings', color: 'text-gray-400' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={card.href} className="premium-card p-5 block hover:border-white/20">
              <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-gray-500 text-xs mt-1">{card.title}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-white font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="premium-card p-4 flex flex-col items-center gap-2 hover:border-white/20 text-center">
              <action.icon className={`w-5 h-5 ${action.color}`} />
              <span className="text-white text-xs font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent users */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Recent Signups</h3>
          <Link href="/admin/users" className="text-[#D4AF37] text-sm hover:text-[#F0C84A]">View all →</Link>
        </div>
        <div className="premium-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['User', 'Email', 'Plan', 'Rating', 'Joined'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user: any, i: number) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8872A] flex items-center justify-center text-black text-xs font-bold">
                        {user.name?.charAt(0) ?? 'U'}
                      </div>
                      <span className="text-white text-sm">{user.name ?? 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.subscription?.plan !== 'FREE'
                        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                        : 'bg-white/[0.04] text-gray-500 border border-white/[0.06]'
                    }`}>
                      {user.subscription?.plan ?? 'FREE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white text-sm font-bold">{user.puzzleRating}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
