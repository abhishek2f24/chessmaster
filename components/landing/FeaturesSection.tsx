'use client'

import { motion } from 'framer-motion'
import { Zap, BookOpen, TrendingUp, Brain, Target, BarChart3, Shield, Repeat } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Unlimited Tactical Puzzles',
    description: 'Train with 5M+ Lichess puzzles, matched to your exact rating. Feel the flow.',
    color: 'from-yellow-500/20 to-orange-500/10',
    iconColor: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
  {
    icon: BookOpen,
    title: 'Structured Courses',
    description: 'Expert-crafted paths from beginner fundamentals to advanced GM prep.',
    color: 'from-blue-500/20 to-indigo-500/10',
    iconColor: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    icon: Brain,
    title: 'Spaced Repetition',
    description: 'Failed puzzles come back at the perfect interval to strengthen your memory.',
    color: 'from-purple-500/20 to-pink-500/10',
    iconColor: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  {
    icon: TrendingUp,
    title: 'ELO Rating Engine',
    description: 'Glicko-based puzzle rating tracks your tactical strength with precision.',
    color: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    icon: Target,
    title: 'Theme Training',
    description: 'Master specific motifs: pins, forks, back rank, skewers, and 20+ more.',
    color: 'from-red-500/20 to-rose-500/10',
    iconColor: 'text-red-400',
    border: 'border-red-500/20',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Know exactly where you struggle. Fix weaknesses with data-driven insights.',
    color: 'from-[#D4AF37]/20 to-amber-500/10',
    iconColor: 'text-[#D4AF37]',
    border: 'border-[#D4AF37]/20',
  },
  {
    icon: Shield,
    title: 'Daily Challenges',
    description: 'Fresh puzzles every day. Complete all 4 difficulty levels for bonus rewards.',
    color: 'from-cyan-500/20 to-blue-500/10',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  {
    icon: Repeat,
    title: 'Mistake Review',
    description: 'Never forget a failed puzzle. Practice exactly what trips you up.',
    color: 'from-orange-500/20 to-red-500/10',
    iconColor: 'text-orange-400',
    border: 'border-orange-500/20',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-3">Why ChessAcademy Pro</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Everything you need to{' '}
            <span className="gold-text">improve fast</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete chess improvement ecosystem built by grandmasters and world-class engineers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative p-5 rounded-xl bg-gradient-to-br ${feature.color} border ${feature.border} cursor-default transition-all duration-200`}
            >
              <div className={`w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center mb-4 ${feature.iconColor}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
