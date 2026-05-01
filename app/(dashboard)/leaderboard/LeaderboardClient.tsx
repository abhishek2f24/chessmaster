'use client'

import { motion } from 'framer-motion'
import { Trophy, Crown, Zap, Flame, Target } from 'lucide-react'
import { getRatingTitle, getRatingColor } from '@/lib/elo'

interface LeaderboardUser {
  rank: number; userId: string; name: string | null; image: string | null
  puzzleRating: number; puzzlesSolved: number; accuracy: number; streak: number
}

interface Props {
  leaderboard: LeaderboardUser[]
  myUserId?: string
  myRank: number
}

const medals = ['🥇', '🥈', '🥉']

export function LeaderboardClient({ leaderboard, myUserId, myRank }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Leaderboard</h1>
        <p className="text-gray-500 text-sm">Top tactical players ranked by puzzle rating.</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[leaderboard[1], leaderboard[0], leaderboard[2]].map((player, i) => {
          if (!player) return <div key={i} />
          const podiumOrder = [2, 1, 3][i]
          const heights = ['h-28', 'h-36', 'h-24']
          const isMe = player.userId === myUserId

          return (
            <motion.div
              key={player.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col items-center ${i === 1 ? 'mt-0' : 'mt-8'}`}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8872A] flex items-center justify-center text-black font-black text-xl mb-2 shadow-gold">
                {player.name?.charAt(0) ?? '?'}
              </div>
              <span className="text-lg mb-1">{medals[podiumOrder - 1]}</span>
              <p className={`text-sm font-bold mb-0.5 ${isMe ? 'text-[#D4AF37]' : 'text-white'}`}>
                {player.name?.split(' ')[0]}{isMe ? ' (You)' : ''}
              </p>
              <p style={{ color: getRatingColor(player.puzzleRating) }} className="font-black text-sm">
                {player.puzzleRating}
              </p>
              <div className={`w-full ${heights[i]} mt-2 rounded-t-xl flex items-end justify-center pb-2 ${
                i === 1 ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30' : 'bg-white/[0.04] border border-white/[0.08]'
              }`}>
                <span className="text-gray-500 text-xs">#{podiumOrder}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* My rank banner */}
      {myRank > 3 && (
        <div className="mb-4 p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Your ranking</p>
              <p className="text-gray-500 text-xs">Keep solving to climb!</p>
            </div>
          </div>
          <span className="text-[#D4AF37] font-black text-xl">#{myRank}</span>
        </div>
      )}

      {/* Full list */}
      <div className="space-y-1">
        {leaderboard.map((player, i) => {
          const isMe = player.userId === myUserId
          const isTop3 = player.rank <= 3

          return (
            <motion.div
              key={player.userId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                isMe
                  ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5'
                  : 'border-white/[0.04] bg-[#111118] hover:border-white/[0.08]'
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center">
                {isTop3 ? (
                  <span className="text-lg">{medals[player.rank - 1]}</span>
                ) : (
                  <span className="text-gray-500 text-sm font-bold">#{player.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8872A] flex items-center justify-center text-black font-bold text-sm shrink-0">
                {player.name?.charAt(0) ?? '?'}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isMe ? 'text-[#D4AF37]' : 'text-white'}`}>
                  {player.name}{isMe ? ' (You)' : ''}
                </p>
                <p className="text-gray-600 text-xs">{getRatingTitle(player.puzzleRating)}</p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                  <Target className="w-3.5 h-3.5" />
                  <span>{player.accuracy}%</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{player.streak}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{player.puzzlesSolved.toLocaleString()}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="text-right">
                <p style={{ color: getRatingColor(player.puzzleRating) }} className="font-black text-sm">
                  {player.puzzleRating}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
