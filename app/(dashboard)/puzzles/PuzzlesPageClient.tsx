'use client'

import { useState } from 'react'
import { Zap, BookOpen, Target, RotateCcw, TrendingUp, Crown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { PuzzleTrainer } from '@/components/chess/PuzzleTrainer'
import type { PuzzleData } from '@/types'

interface Props {
  initialPuzzle: PuzzleData | null
  userRating: number
  userId: string
  initialLimitReached?: boolean
}

const modes = [
  { id: 'rated', label: 'Rated', icon: Zap, color: 'text-[#D4AF37]', activeBg: 'bg-[#D4AF37]/10 border-[#D4AF37]/30' },
  { id: 'learning', label: 'Learning', icon: BookOpen, color: 'text-blue-400', activeBg: 'bg-blue-400/10 border-blue-400/30' },
  { id: 'survival', label: 'Survival', icon: Target, color: 'text-red-400', activeBg: 'bg-red-400/10 border-red-400/30' },
]

export function PuzzlesPageClient({ initialPuzzle, userRating, userId, initialLimitReached = false }: Props) {
  const { data: session, update } = useSession()
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(initialPuzzle)
  const [mode, setMode] = useState('rated')
  const [currentRating, setCurrentRating] = useState(userRating)
  const [limitReached, setLimitReached] = useState(initialLimitReached)

  if (limitReached) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
          <Crown className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Daily Limit Reached</h2>
        <p className="text-gray-400 mb-8">
          You've solved your 10 free puzzles for today. Upgrade to Premium for unlimited puzzles, advanced analytics, and all pro courses.
        </p>
        <Link 
          href="/#pricing" 
          className="w-full py-4 px-6 rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-[#F0C84A] transition-all shadow-lg shadow-[#D4AF37]/20"
        >
          Upgrade to Premium
        </Link>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-gray-500 text-sm hover:text-white transition-colors"
        >
          Maybe later
        </button>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-5xl mb-4">♟</div>
        <p className="text-white font-bold text-lg mb-2">No puzzles available</p>
        <p className="text-gray-500 text-sm">Check back soon or adjust your rating range.</p>
      </div>
    )
  }

  async function handleSolve(puzzleId: string, solved: boolean, timeSeconds: number) {
    const res = await fetch('/api/puzzles/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzleId, solved, timeSeconds, mode }),
    })
    
    if (res.status === 403) {
      const errorData = await res.json()
      if (errorData.limitReached) {
        setLimitReached(true)
        return { ratingDelta: 0, newRating: currentRating }
      }
    }

    const data = await res.json()
    if (data.newRating) {
      setCurrentRating(data.newRating)
      // Trigger NextAuth session update to refresh the sidebar rating
      update()
    }
    return { ratingDelta: data.ratingDelta ?? 0, newRating: data.newRating ?? currentRating }
  }

  async function handleNext(): Promise<PuzzleData | null> {
    const res = await fetch(`/api/puzzles/next?rating=${currentRating}`)
    
    if (res.status === 403) {
      const errorData = await res.json()
      if (errorData.limitReached) {
        setLimitReached(true)
        return null
      }
    }

    const data = await res.json()
    if (data.puzzle) {
      setPuzzle({ ...data.puzzle, themes: data.puzzle.themes ?? [] })
      return data.puzzle
    }
    return null
  }

  return (
    <div>
      {/* Mode selector */}
      <div className="flex items-center gap-2 mb-6">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              mode === m.id ? m.activeBg + ' ' + m.color : 'border-white/[0.06] text-gray-500 hover:border-white/20 hover:text-gray-300'
            }`}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#D4AF37] text-sm font-bold">{currentRating}</span>
        </div>
      </div>

      <PuzzleTrainer
        initialPuzzle={puzzle}
        userRating={currentRating}
        onSolve={handleSolve}
        onNext={handleNext}
      />
    </div>
  )
}
