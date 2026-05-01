import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Target, Star, Zap, Flame } from 'lucide-react'

export const metadata = { title: 'Daily Challenge' }

export default async function DailyChallengePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Daily Challenge</h1>
        <p className="text-gray-500 text-sm">4 puzzles, refreshed every day. Complete all for bonus XP!</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Easy', emoji: '🟢', rating: '800–1000', xp: 50, icon: Target, color: 'border-emerald-500/30 bg-emerald-500/5' },
          { label: 'Medium', emoji: '🟡', rating: '1200–1400', xp: 100, icon: Zap, color: 'border-yellow-500/30 bg-yellow-500/5' },
          { label: 'Hard', emoji: '🟠', rating: '1600–1800', xp: 200, icon: Star, color: 'border-orange-500/30 bg-orange-500/5' },
          { label: 'Insane', emoji: '🔴', rating: '2000+', xp: 500, icon: Flame, color: 'border-red-500/30 bg-red-500/5' },
        ].map((level) => (
          <div key={level.label} className={`premium-card p-6 border ${level.color}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{level.emoji}</span>
              <span className="text-xs text-gray-500 bg-white/[0.04] px-2 py-1 rounded-full">+{level.xp} XP</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{level.label}</h3>
            <p className="text-gray-500 text-sm mb-4">Rating: {level.rating}</p>
            <Link href="/puzzles" className="block text-center py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.08] transition-colors">
              Solve Now →
            </Link>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-2">
          <Flame className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-white font-bold">Complete all 4 today</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Solve all 4 difficulty puzzles today to earn <span className="text-[#D4AF37] font-bold">+850 bonus XP</span> and
          a <span className="text-[#D4AF37] font-bold">Daily Champion 🏆</span> badge!
        </p>
      </div>
    </div>
  )
}
