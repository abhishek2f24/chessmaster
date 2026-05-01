'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard, Zap, BookOpen, Trophy, User, Settings,
  Crown, Flame, Star, BarChart3, RefreshCw, Target, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/puzzles', label: 'Puzzle Trainer', icon: Zap },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

const secondaryItems = [
  { href: '/puzzles/retry', label: 'Mistake Review', icon: RefreshCw },
  { href: '/puzzles/daily', label: 'Daily Challenge', icon: Target },
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/profile/settings', label: 'Settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#0D0D14] border-r border-white/[0.06] py-6 px-3 overflow-y-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#A8872A] rounded-lg flex items-center justify-center shadow-gold">
          <span className="text-black font-black text-lg">♛</span>
        </div>
        <span className="font-black text-lg">
          <span className="gold-text">Chess</span>
          <span className="text-white">Academy</span>
        </span>
      </Link>

      {/* User card */}
      {session && (
        <div className="mx-1 mb-6 p-3 rounded-xl bg-[#111118] border border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8872A] flex items-center justify-center text-black font-black text-sm">
              {session.user.name?.charAt(0) ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{session.user.name}</p>
              {session.user.plan !== 'FREE' && (
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-medium">Premium</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Rating', value: session.user.puzzleRating ?? 800, icon: Star },
              { label: 'Streak', value: `🔥 ${session.user.currentStreak ?? 0}`, icon: Flame },
              { label: 'XP', value: session.user.xpPoints ?? 0, icon: BarChart3 },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg py-1.5">
                <p className="text-white text-xs font-bold">{stat.value}</p>
                <p className="text-gray-600 text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1">
        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Training</p>
        <div className="space-y-0.5 mb-6">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('sidebar-link', active && 'active')}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            )
          })}
        </div>

        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Account</p>
        <div className="space-y-0.5 mb-6">
          {secondaryItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('sidebar-link', active && 'active')}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Premium CTA */}
        {session?.user.plan === 'FREE' && (
          <div className="mx-1 p-4 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20">
            <Crown className="w-5 h-5 text-[#D4AF37] mb-2" />
            <p className="text-white text-xs font-bold mb-1">Unlock Premium</p>
            <p className="text-gray-500 text-[11px] mb-3">Unlimited puzzles, all courses, advanced analytics</p>
            <Link href="/#pricing" className="block text-center py-2 px-3 rounded-lg bg-[#D4AF37] text-black text-xs font-bold hover:bg-[#F0C84A] transition-colors">
              Upgrade Now
            </Link>
          </div>
        )}
      </nav>
    </aside>
  )
}
