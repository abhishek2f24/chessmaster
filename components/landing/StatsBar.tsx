'use client'

import { motion } from 'framer-motion'
import { Users, Zap, BookOpen, Trophy } from 'lucide-react'

const stats = [
  { icon: Users, value: '50,000+', label: 'Active Students', color: 'text-[#D4AF37]' },
  { icon: Zap, value: '5M+', label: 'Puzzles Solved', color: 'text-[#10B981]' },
  { icon: BookOpen, value: '200+', label: 'Premium Lessons', color: 'text-blue-400' },
  { icon: Trophy, value: '98%', label: 'Rating Improvement', color: 'text-purple-400' },
]

export function StatsBar() {
  return (
    <section className="border-y border-white/[0.06] bg-[#0D0D14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
