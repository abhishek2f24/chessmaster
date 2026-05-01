'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, Zap, ArrowRight, Crown } from 'lucide-react'

const topPlayers = [
  { rank: 1, name: 'Magnus_Fan', rating: 2347, solved: 4521, streak: 89, badge: '♛' },
  { rank: 2, name: 'TacticalBeast', rating: 2289, solved: 3987, streak: 45, badge: '♜' },
  { rank: 3, name: 'EndgameKing', rating: 2201, solved: 3654, streak: 31, badge: '♞' },
  { rank: 4, name: 'PinMaster_96', rating: 2145, solved: 3210, streak: 18, badge: '♝' },
  { rank: 5, name: 'ForkHunter', rating: 2098, solved: 2876, streak: 22, badge: '♙' },
]

const rankColors = ['text-[#D4AF37]', 'text-gray-400', 'text-amber-600', 'text-gray-500', 'text-gray-500']
const rankBg = ['bg-[#D4AF37]/10 border-[#D4AF37]/30', 'bg-gray-500/10 border-gray-500/20', 'bg-amber-600/10 border-amber-600/20', 'bg-white/[0.04] border-white/[0.06]', 'bg-white/[0.04] border-white/[0.06]']

export function LeaderboardPreview() {
  return (
    <section className="py-24 bg-[#0D0D14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-3">Leaderboard</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Compete with the{' '}
              <span className="gold-text">best players</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Weekly and monthly leaderboards track your tactical rating, streak, and accuracy. Rise through the ranks and earn exclusive badges.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Weekly winners', value: '500+', icon: Trophy },
                { label: 'Active streaks', value: '8,200+', icon: Zap },
              ].map((item, i) => (
                <div key={i} className="glass-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{item.value}</p>
                    <p className="text-gray-500 text-xs">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/leaderboard" className="inline-flex items-center gap-2 btn-outline-gold">
              View Full Leaderboard <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Leaderboard card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-white/[0.08] bg-[#111118] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-white font-semibold text-sm">Weekly Rankings</span>
                </div>
                <span className="text-gray-500 text-xs">Top 5 this week</span>
              </div>

              <div className="p-3 space-y-1">
                {topPlayers.map((player, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${rankBg[i]} transition-all`}
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${rankColors[i]} bg-current/10`}>
                      <span className={rankColors[i]}>
                        {i === 0 ? '👑' : `#${player.rank}`}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8872A] flex items-center justify-center text-black font-bold text-sm">
                      {player.badge}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{player.name}</p>
                      <p className="text-gray-500 text-xs">{player.solved.toLocaleString()} puzzles</p>
                    </div>

                    {/* Rating */}
                    <div className="text-right">
                      <p className={`text-sm font-black ${rankColors[i]}`}>{player.rating.toLocaleString()}</p>
                      <p className="text-gray-600 text-xs">🔥 {player.streak}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Your rank: #247</span>
                  <span className="text-[#D4AF37]">Climb 10 spots today →</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
