'use client'

import { useState, useCallback } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, User, Bot } from 'lucide-react'

interface SolutionStep {
  fen: string
  uci: string
  san: string
  isPlayer: boolean   // true = player's move, false = opponent
  moveNumber: number
}

interface Props {
  puzzleFen: string          // original FEN (before moves[0])
  moves: string[]            // full moves array from puzzle
  playerColor: 'w' | 'b'
  onNext: () => void
  loading: boolean
}

function uciToSan(chess: Chess, uci: string): string {
  try {
    const from = uci.slice(0, 2)
    const to   = uci.slice(2, 4)
    const promo = uci.length > 4 ? uci[4] : undefined
    const result = chess.move({ from, to, promotion: promo })
    return result?.san ?? uci
  } catch {
    return uci
  }
}

function buildSteps(puzzleFen: string, moves: string[], playerColor: 'w' | 'b'): SolutionStep[] {
  const chess = new Chess(puzzleFen)
  const steps: SolutionStep[] = []

  // Step 0: initial position (before anything)
  steps.push({ fen: chess.fen(), uci: '', san: '', isPlayer: false, moveNumber: 0 })

  for (let i = 0; i < moves.length; i++) {
    const san = uciToSan(chess, moves[i])
    // moves[0] is opponent setup; player moves are at odd indices (1,3,5…)
    const isPlayer = i % 2 === 1
    steps.push({
      fen: chess.fen(),
      uci: moves[i],
      san,
      isPlayer,
      moveNumber: Math.ceil((i + 1) / 2),
    })
  }

  return steps
}

export function SolutionStepper({ puzzleFen, moves, playerColor, onNext, loading }: Props) {
  const steps = buildSteps(puzzleFen, moves, playerColor)
  const [idx, setIdx] = useState(1) // start at step 1 (after setup move)

  const go = useCallback((n: number) => setIdx(Math.max(1, Math.min(steps.length - 1, n))), [steps.length])

  const current = steps[idx]
  const prev    = steps[idx - 1]
  const boardOrientation = playerColor === 'w' ? 'white' : 'black'

  // Highlight the squares of the current move
  const customSquareStyles: Record<string, React.CSSProperties> = {}
  if (current.uci) {
    const from = current.uci.slice(0, 2)
    const to   = current.uci.slice(2, 4)
    const color = current.isPlayer
      ? 'rgba(16,185,129,0.45)'   // green for player
      : 'rgba(239,68,68,0.35)'    // red for opponent
    customSquareStyles[from] = { background: color, borderRadius: '4px' }
    customSquareStyles[to]   = { background: color, borderRadius: '4px' }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
      {/* Board */}
      <div>
        <div className="chess-board-container">
          <Chessboard
            id="solution-board"
            position={current.fen}
            boardOrientation={boardOrientation}
            arePiecesDraggable={false}
            customSquareStyles={customSquareStyles}
            animationDuration={250}
            customBoardStyle={{ borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            customDarkSquareStyle={{ backgroundColor: '#9E5E28' }}
            customLightSquareStyle={{ backgroundColor: '#E8C98A' }}
          />
        </div>

        {/* Step scrubber */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-gray-600 text-xs w-6 text-right">{idx}</span>
          <input
            type="range"
            min={1}
            max={steps.length - 1}
            value={idx}
            onChange={e => go(Number(e.target.value))}
            className="flex-1 accent-[#D4AF37] cursor-pointer"
          />
          <span className="text-gray-600 text-xs w-6">{steps.length - 1}</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="space-y-4">
        {/* Current move card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={`premium-card p-5 border ${
              current.isPlayer ? 'border-emerald-500/30' : 'border-red-500/20'
            }`}
          >
            {current.uci ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  {current.isPlayer ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <User className="w-4 h-4" />
                      <span className="text-xs font-semibold">Your move</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-400">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-semibold">Opponent responds</span>
                    </div>
                  )}
                  <span className="ml-auto text-gray-600 text-xs">Move {current.moveNumber}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`text-3xl font-black ${current.isPlayer ? 'text-emerald-400' : 'text-red-400'}`}>
                    {current.san}
                  </div>
                  <div className="text-gray-600 text-xs font-mono bg-white/[0.04] px-2 py-0.5 rounded">
                    {current.uci.slice(0, 2)} → {current.uci.slice(2, 4)}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Starting position</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Full solution move list */}
        <div className="premium-card p-4">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Solution</p>
          <div className="space-y-1">
            {steps.slice(1).map((step, i) => (
              <button
                key={i}
                onClick={() => go(i + 1)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                  idx === i + 1
                    ? step.isPlayer
                      ? 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400'
                      : 'bg-red-400/10 border border-red-400/20 text-red-400'
                    : 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-300'
                }`}
              >
                <span className="text-gray-700 text-xs w-4">{step.moveNumber}.</span>
                <span className={`font-bold ${step.isPlayer ? '' : 'font-normal'}`}>
                  {step.isPlayer ? '' : '…'}{step.san}
                </span>
                {step.isPlayer ? (
                  <span className="ml-auto text-[10px] text-emerald-600">you</span>
                ) : (
                  <span className="ml-auto text-[10px] text-red-600">opp</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => go(1)} className="flex items-center justify-center py-2.5 rounded-xl border border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={() => go(idx - 1)} disabled={idx <= 1} className="flex items-center justify-center py-2.5 rounded-xl border border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => go(idx + 1)} disabled={idx >= steps.length - 1} className="flex items-center justify-center py-2.5 rounded-xl border border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => go(steps.length - 1)} className="flex items-center justify-center py-2.5 rounded-xl border border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onNext}
          disabled={loading}
          className="w-full btn-gold py-3 flex items-center justify-center gap-2 text-sm"
        >
          {loading ? 'Loading…' : <><ChevronRight className="w-4 h-4" /> Next Puzzle</>}
        </button>

        <p className="text-center text-gray-600 text-xs">
          Use ← → arrow keys or the scrubber to step through
        </p>
      </div>
    </div>
  )
}
