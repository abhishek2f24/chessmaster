'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap, Timer, TrendingUp, Check, X } from 'lucide-react'

export function PuzzlePreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(16,185,129,0.05)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#10B981] text-sm font-semibold tracking-widest uppercase mb-3">Puzzle Trainer</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              The most{' '}
              <span className="bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent">
                addictive
              </span>{' '}
              puzzle experience
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Powered by 5 million Lichess puzzles. Your tactical ELO adapts in real-time, serving puzzles perfectly calibrated to your current strength.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: Zap, title: 'Instant feedback', desc: 'Know immediately if your move is correct with smooth animations' },
                { icon: TrendingUp, title: 'Real-time ELO', desc: 'Your puzzle rating updates after every single attempt' },
                { icon: Timer, title: 'Speed bonuses', desc: 'Solve fast and earn extra rating points for quick thinking' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/puzzles" className="inline-flex items-center gap-2 btn-gold">
              Start Solving <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right — UI mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-[#111118] overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.08)]">
              {/* Top bar */}
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-gray-500 text-xs">puzzle_trainer.chess</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-xs font-bold">RATED</div>
                </div>
              </div>

              {/* Puzzle UI */}
              <div className="p-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Your Rating', value: '1,247', color: 'text-[#D4AF37]' },
                    { label: 'Puzzle Rating', value: '1,389', color: 'text-white' },
                    { label: 'Streak', value: '🔥 11', color: 'text-orange-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.03] rounded-lg p-3 text-center">
                      <p className={`font-black text-sm ${stat.color}`}>{stat.value}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Board */}
                <div className="grid grid-cols-8 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '1' }}>
                  {Array.from({ length: 64 }).map((_, i) => {
                    const row = Math.floor(i / 8)
                    const col = i % 8
                    const isLight = (row + col) % 2 === 0
                    const highlights = [19, 36]
                    const pieces: Record<number, { piece: string; isWhite: boolean }> = {
                      4: { piece: '♜', isWhite: false },
                      60: { piece: '♔', isWhite: true },
                      52: { piece: '♙', isWhite: true },
                      35: { piece: '♛', isWhite: false },
                      27: { piece: '♞', isWhite: true },
                      19: { piece: '♟', isWhite: false },
                    }
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center text-sm transition-colors ${
                          isLight ? 'bg-[#E8C98A]' : 'bg-[#9E5E28]'
                        } ${highlights.includes(i) ? 'ring-2 ring-inset ring-[#10B981]/60' : ''}`}
                      >
                        {pieces[i] && (
                          <span className={`font-bold drop-shadow-md ${pieces[i].isWhite ? 'text-white' : 'text-gray-900'}`}>
                            {pieces[i].piece}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                  <motion.div
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20"
                  >
                    <Check className="w-5 h-5 text-[#10B981] shrink-0" />
                    <div>
                      <p className="text-[#10B981] font-bold text-sm">Brilliant move! ✨</p>
                      <p className="text-gray-500 text-xs">+14 rating points</p>
                    </div>
                    <span className="ml-auto text-[#10B981] font-black text-lg">+14</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
