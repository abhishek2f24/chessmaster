'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#10B981]/5" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#111118] to-[#0D0D14] p-12 shadow-gold-lg"
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.1)_0%,transparent_60%)]" />

          <div className="relative">
            <div className="text-5xl mb-4">♛</div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Your chess journey{' '}
              <span className="gold-text">starts today</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ students who are improving their game every day. 7-day free trial. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-gold flex items-center justify-center gap-2 text-base py-3.5 px-8">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/puzzles" className="btn-outline-gold flex items-center justify-center gap-2 text-base py-3.5 px-8">
                <Zap className="w-5 h-5" /> Try a Puzzle Now
              </Link>
            </div>

            <p className="text-gray-600 text-sm mt-6">
              No credit card required • Cancel anytime • Instant access
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
