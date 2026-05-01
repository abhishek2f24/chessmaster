'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How is ChessAcademy Pro different from Chess.com or Chessable?',
    a: 'We combine structured video courses (like ChessMood), unlimited tactical puzzles with a real ELO engine, spaced repetition for mistakes, and deep analytics — all in one premium platform. Our puzzle matching is specifically calibrated to your current level, not just a random difficulty.',
  },
  {
    q: 'What\'s included in the free plan?',
    a: 'Free members get 10 puzzles per day, access to 3 free lessons from each course, basic progress tracking, and leaderboard access. It\'s a great way to experience the platform before upgrading.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, absolutely. Cancel anytime with no questions asked. You\'ll retain access until the end of your billing period. No hidden fees, no cancellation penalties.',
  },
  {
    q: 'How does the puzzle ELO system work?',
    a: 'We use a Glicko-inspired system. Solving a puzzle harder than your rating gains more points (+5 to +20). Failing an easy puzzle loses more points (-3 to -15). Speed bonuses reward quick thinking. Your rating always reflects your true tactical strength.',
  },
  {
    q: 'Are the puzzles from Lichess?',
    a: 'Yes! We use the Lichess open puzzle database (5M+ puzzles), enriched with themes, difficulty ratings, and opening tags. Each puzzle has been played and rated by millions of real players, ensuring quality.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'ChessAcademy Pro is fully responsive and works beautifully on mobile browsers. Native iOS and Android apps are on the roadmap for Q3 2025.',
  },
  {
    q: 'What level of player is this suitable for?',
    a: 'All levels! Complete beginners start with fundamentals courses and 800-rated puzzles. Advanced players (2000+) get GM prep courses and 2200+ rated puzzles. The platform adapts to you.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="text-4xl font-black text-white">
            Got questions? We have{' '}
            <span className="gold-text">answers</span>
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/[0.06] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-[#111118] hover:bg-[#16161F] transition-colors"
              >
                <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 bg-[#111118] border-t border-white/[0.04]">
                      <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
