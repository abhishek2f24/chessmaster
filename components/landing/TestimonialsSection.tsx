'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Club player, 1650 FIDE',
    avatar: 'R',
    rating: 5,
    text: 'My tactical rating went from 1100 to 1650 in 3 months. The spaced repetition system is absolutely genius. I never forget a tactical motif anymore.',
    gain: '+550 rating',
  },
  {
    name: 'Priya Mehta',
    role: 'Beginner, 900 → 1200',
    avatar: 'P',
    rating: 5,
    text: 'The structured courses are incredible. I went from knowing basic moves to understanding positional concepts in just 6 weeks. Worth every rupee.',
    gain: '+300 rating',
  },
  {
    name: 'Alex Chen',
    role: 'Tournament player, 1800',
    avatar: 'A',
    rating: 5,
    text: 'I\'ve tried Chessable, Chess.com, and every other platform. ChessAcademy Pro is the only one where I feel my game actually improving systematically.',
    gain: 'Tournament winner',
  },
  {
    name: 'Mohammed Al-Rashid',
    role: 'Advanced player, 2100',
    avatar: 'M',
    rating: 5,
    text: 'The puzzle difficulty matching is uncanny. It always finds positions that are challenging but solvable. Keeps me in the zone for hours.',
    gain: '+200 puzzle ELO',
  },
  {
    name: 'Sofia Rodriguez',
    role: 'Junior player, U18',
    avatar: 'S',
    rating: 5,
    text: 'The gamification makes practicing tactics feel like a game. I compete with my friends on the leaderboard daily. Best chess app ever!',
    gain: 'National champion',
  },
  {
    name: 'Kiran Patel',
    role: 'Intermediate, 1400',
    avatar: 'K',
    rating: 4,
    text: 'The mistake review system alone is worth the subscription. I solved the same 50 puzzles I kept getting wrong until I truly understood them.',
    gain: '+150 rating',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0D0D14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-3">Success Stories</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Students are{' '}
            <span className="gold-text">crushing it</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Real results from real players. Join 50,000+ students who have transformed their game.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="premium-card p-6 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8872A] flex items-center justify-center text-black font-black text-lg shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    ))}
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <span className="text-emerald-400 text-[10px] font-bold">{t.gain}</span>
                </div>
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-[#D4AF37]/20 absolute -top-1 -left-1" />
                <p className="text-gray-400 text-sm leading-relaxed pl-4">{t.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
