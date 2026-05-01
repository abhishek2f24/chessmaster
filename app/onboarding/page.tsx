'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { ArrowRight, Target, Brain, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const skillLevels = [
  { id: 'beginner', label: 'Beginner', desc: 'Under 1000 rating', emoji: '♙' },
  { id: 'intermediate', label: 'Intermediate', desc: '1000–1500 rating', emoji: '♞' },
  { id: 'advanced', label: 'Advanced', desc: '1500–2000 rating', emoji: '♜' },
  { id: 'expert', label: 'Expert', desc: '2000+ rating', emoji: '♛' },
]

const goals = [
  { id: 'improve_tactics', label: 'Sharpen my tactics', icon: Brain },
  { id: 'learn_openings', label: 'Master openings', icon: BookOpen },
  { id: 'beat_friends', label: 'Beat my friends', icon: Target },
  { id: 'tournament', label: 'Compete in tournaments', icon: TrendingUp },
]

import { BookOpen } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [skill, setSkill] = useState('')
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    if (!skill || !goal) return
    setLoading(true)
    try {
      await fetch('/api/users/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillLevel: skill, goal }),
      })
      toast.success('Profile set up! Time to train!')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.06)_0%,transparent_60%)]" />

      <div className="relative w-full max-w-lg mx-auto px-4 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'w-16 bg-[#D4AF37]' : 'w-8 bg-white/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white mb-2">What&apos;s your level?</h2>
                <p className="text-gray-400">We&apos;ll customize your experience accordingly</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {skillLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSkill(level.id)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      skill === level.id
                        ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 shadow-gold'
                        : 'border-white/[0.08] bg-[#111118] hover:border-white/20'
                    }`}
                  >
                    <div className="text-3xl mb-2">{level.emoji}</div>
                    <p className="text-white font-bold text-sm">{level.label}</p>
                    <p className="text-gray-500 text-xs">{level.desc}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => skill && setStep(2)}
                disabled={!skill}
                className="w-full btn-gold py-3 disabled:opacity-40 flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white mb-2">What&apos;s your goal?</h2>
                <p className="text-gray-400">We&apos;ll recommend the best path for you</p>
              </div>

              <div className="space-y-3 mb-8">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`w-full p-4 rounded-xl border flex items-center gap-4 text-left transition-all ${
                      goal === g.id
                        ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 shadow-gold'
                        : 'border-white/[0.08] bg-[#111118] hover:border-white/20'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${goal === g.id ? 'bg-[#D4AF37]/20' : 'bg-white/[0.04]'}`}>
                      <g.icon className={`w-5 h-5 ${goal === g.id ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                    </div>
                    <p className={`font-semibold text-sm ${goal === g.id ? 'text-[#D4AF37]' : 'text-white'}`}>{g.label}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-white/[0.1] text-gray-400 hover:text-white text-sm transition-colors">
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!goal || loading}
                  className="flex-1 btn-gold py-3 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? 'Setting up...' : 'Start Training'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
