'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Star, Users, Zap } from 'lucide-react'

const chessPieces = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟']

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Floating chess pieces */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {chessPieces.map((piece, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-[0.04] select-none"
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.04, 0.06, 0.04],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {piece}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6"
            >
              <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-semibold tracking-wide uppercase">
                World-Class Chess Training
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              Train Like a{' '}
              <span className="gold-text block">Grandmaster</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-xl leading-relaxed mb-8 max-w-lg"
            >
              Interactive courses, unlimited tactical puzzles, and structured improvement plans designed by elite players.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link href="/register" className="btn-gold flex items-center justify-center gap-2 text-base">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/puzzles" className="btn-outline-gold flex items-center justify-center gap-2 text-base">
                <Zap className="w-4 h-4" /> Solve Puzzles
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {['B', 'M', 'A', 'K', 'R'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#0A0A0F] flex items-center justify-center text-xs font-bold text-black"
                    style={{
                      background: ['#D4AF37', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][i],
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />)}
                  <span className="text-white text-sm font-semibold ml-1">4.9</span>
                </div>
                <p className="text-gray-500 text-xs">From 12,000+ happy students</p>
              </div>
            </motion.div>
          </div>

          {/* Right — Animated Chess Board Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)] blur-xl" />

              {/* Chess board decoration */}
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_0_60px_rgba(212,175,55,0.1)]">
                <div className="bg-[#111118] p-6">
                  {/* Mock puzzle interface */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                      <span className="text-[#D4AF37] text-sm font-semibold">Puzzle Rating: 1547</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10">
                      <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] text-xs font-bold">Streak: 7</span>
                    </div>
                  </div>

                  {/* Chessboard grid visual */}
                  <div className="grid grid-cols-8 rounded-xl overflow-hidden border border-white/[0.08]" style={{ aspectRatio: '1' }}>
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8)
                      const col = i % 8
                      const isLight = (row + col) % 2 === 0
                      const pieces: Record<number, string> = {
                        4: '♜', 60: '♔', 52: '♙', 51: '♙', 53: '♙',
                        12: '♟', 11: '♟', 10: '♟', 27: '♕', 36: '♞',
                      }
                      return (
                        <div
                          key={i}
                          className={`aspect-square flex items-center justify-center text-lg font-bold transition-colors ${
                            isLight ? 'bg-[#E8C98A]' : 'bg-[#9E5E28]'
                          } ${[27, 36].includes(i) ? 'ring-2 ring-[#D4AF37]/60' : ''}`}
                        >
                          {pieces[i] && (
                            <span className={`${[27].includes(i) ? 'text-white drop-shadow-lg animate-pulse' : 'drop-shadow-md'} text-base`}>
                              {pieces[i]}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-center">
                    <div className="px-4 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      <p className="text-[#D4AF37] text-sm font-semibold text-center">White to move — Find the best move!</p>
                    </div>
                  </div>
                </div>

                {/* Rating change overlay */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [-10, -30, -40, -60] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute top-16 right-8 text-emerald-400 font-black text-2xl pointer-events-none"
                >
                  +12 ↑
                </motion.div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -left-8 top-1/4 glass-card px-4 py-3 shadow-premium"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <p className="text-white text-sm font-bold">50,000+</p>
                    <p className="text-gray-500 text-xs">Active Students</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -right-8 bottom-1/4 glass-card px-4 py-3 shadow-premium"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#10B981]" />
                  <div>
                    <p className="text-white text-sm font-bold">2M+</p>
                    <p className="text-gray-500 text-xs">Puzzles Solved</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-[#D4AF37]/60" />
        </div>
      </motion.div>
    </section>
  )
}
