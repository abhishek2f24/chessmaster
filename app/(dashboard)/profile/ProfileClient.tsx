'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Session } from 'next-auth'
import {
  Crown, Zap, Target, Flame, Star, Trophy, Edit3, Check, X, ExternalLink, Shield
} from 'lucide-react'
import { getRatingTitle, getRatingColor } from '@/lib/elo'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Props { user: any; session: Session }

export function ProfileClient({ user, session }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name ?? '')
  const [saving, setSaving] = useState(false)

  const accuracy = user.totalPuzzlesAttempted > 0
    ? Math.round((user.totalPuzzlesSolved / user.totalPuzzlesAttempted) * 100)
    : 0

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        toast.success('Profile updated!')
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleManageBilling() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const stats = [
    { label: 'Puzzle Rating', value: user.puzzleRating, color: getRatingColor(user.puzzleRating), icon: Zap },
    { label: 'Best Rating', value: user.puzzleRatingBest, color: '#8B5CF6', icon: Crown },
    { label: 'Puzzles Solved', value: user.totalPuzzlesSolved.toLocaleString(), color: '#10B981', icon: Target },
    { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 70 ? '#10B981' : '#F59E0B', icon: Shield },
    { label: 'Current Streak', value: `🔥 ${user.currentStreak}`, color: '#F97316', icon: Flame },
    { label: 'Best Streak', value: `${user.longestStreak} days`, color: '#F59E0B', icon: Star },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-black text-white">My Profile</h1>

      {/* Profile card */}
      <div className="premium-card p-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8872A] flex items-center justify-center text-black font-black text-3xl shadow-gold">
              {user.name?.charAt(0) ?? 'U'}
            </div>
            {user.subscription?.plan !== 'FREE' && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-gold">
                <Crown className="w-4 h-4 text-black" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#111118] border border-[#D4AF37]/40 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
                />
                <button onClick={handleSave} disabled={saving} className="p-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditing(false); setName(user.name ?? '') }} className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-white">{user.name}</h2>
                <button onClick={() => setEditing(true)} className="p-1 text-gray-500 hover:text-white transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-gray-500 text-sm mb-2">{user.email}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${getRatingColor(user.puzzleRating)}15`, border: `1px solid ${getRatingColor(user.puzzleRating)}30` }}>
                <Zap className="w-3.5 h-3.5" style={{ color: getRatingColor(user.puzzleRating) }} />
                <span style={{ color: getRatingColor(user.puzzleRating) }} className="text-xs font-bold">
                  {user.puzzleRating} — {getRatingTitle(user.puzzleRating)}
                </span>
              </div>
              {user.subscription?.plan !== 'FREE' && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-bold">Premium</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-xs mt-2">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h3 className="text-white font-bold mb-4">Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="premium-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <p className="text-gray-500 text-xs">{stat.label}</p>
              </div>
              <p className="font-black text-lg" style={{ color: stat.color }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {user.achievements?.length > 0 && (
        <div>
          <h3 className="text-white font-bold mb-4">Achievements ({user.achievements.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {user.achievements.map((ua: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="premium-card p-4 flex items-center gap-3"
              >
                <span className="text-3xl">{ua.achievement.icon}</span>
                <div>
                  <p className="text-white text-xs font-bold">{ua.achievement.name}</p>
                  <p className="text-gray-500 text-[10px]">{ua.achievement.description}</p>
                  <p className="text-[#D4AF37] text-[10px] font-semibold">+{ua.achievement.xpReward} XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription */}
      <div className="premium-card p-6">
        <h3 className="text-white font-bold mb-4">Subscription</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">
              {user.subscription?.plan === 'FREE' ? 'Free Plan' : user.subscription?.plan === 'PREMIUM_MONTHLY' ? 'Premium Monthly' : 'Premium Yearly'}
            </p>
            {user.subscription?.currentPeriodEnd && (
              <p className="text-gray-500 text-sm">Renews {formatDate(user.subscription.currentPeriodEnd)}</p>
            )}
          </div>
          {user.subscription?.plan === 'FREE' ? (
            <Link href="/#pricing" className="btn-gold text-sm py-2.5 px-5">
              Upgrade to Premium
            </Link>
          ) : (
            <button onClick={handleManageBilling} className="btn-outline-gold text-sm py-2.5 px-5 flex items-center gap-2">
              Manage Billing <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
