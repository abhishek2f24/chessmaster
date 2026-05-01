'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Chessboard } from 'react-chessboard'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Flame, RefreshCw, Lightbulb, Eye, SkipForward,
  X, ChevronRight,
} from 'lucide-react'
import { usePuzzleStore } from '@/store/puzzle-store'
import { getRatingTitle, getRatingColor } from '@/lib/elo'
import { getPuzzleDifficultyLabel, getPuzzleDifficultyColor } from '@/lib/utils'
import { SolutionStepper } from '@/components/chess/SolutionStepper'
import type { PuzzleData } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  initialPuzzle: PuzzleData
  userRating: number
  onSolve: (puzzleId: string, solved: boolean, timeSeconds: number) => Promise<{ ratingDelta: number; newRating: number }>
  onNext: () => Promise<PuzzleData | null>
}

export function PuzzleTrainer({ initialPuzzle, userRating, onSolve, onNext }: Props) {
  const {
    puzzle, chess, status, currentMoveIndex, streak,
    sessionSolved, sessionAttempted, playerColor,
    setPuzzle, makeMove, getHintSquare, revealSolution,
    resetPuzzle, nextPuzzle,
  } = usePuzzleStore()

  const [currentRating, setCurrentRating] = useState(userRating)
  const [ratingDelta, setRatingDelta] = useState<number | null>(null)
  const [showDelta, setShowDelta] = useState(false)
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hintSquare, setHintSquare] = useState<string | null>(null)
  const [solveCalled, setSolveCalled] = useState(false)
  const [showingSolution, setShowingSolution] = useState(false)

  const timerRef = useRef<NodeJS.Timeout>()

  // Load initial puzzle once
  useEffect(() => {
    setPuzzle(initialPuzzle)
    setSolveCalled(false)
    setTimer(0)
    setShowingSolution(false)
  }, [initialPuzzle.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (status === 'solving') {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [status])

  // Trigger server call when puzzle completes/fails (once)
  useEffect(() => {
    if ((status === 'complete' || status === 'wrong') && puzzle && !solveCalled) {
      setSolveCalled(true)
      handleServerSolve(status === 'complete')
    }
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleServerSolve(solved: boolean) {
    if (!puzzle) return
    try {
      const result = await onSolve(puzzle.id, solved, timer)
      setRatingDelta(result.ratingDelta)
      setCurrentRating(result.newRating)
      setShowDelta(true)
      setTimeout(() => setShowDelta(false), 2500)
      if (solved) toast.success(getEncouragement(timer, result.ratingDelta), { duration: 2000 })
    } catch {
      // non-blocking
    }
  }

  const handleDrop = useCallback(
    (sourceSquare: string, targetSquare: string, piece: string): boolean => {
      if (!puzzle || status !== 'solving') return false

      // Prevent moving opponent's pieces
      const isWhitePiece = piece[0] === 'w'
      const isPlayerWhite = playerColor === 'w'
      if (isWhitePiece !== isPlayerWhite) return false

      const result = makeMove(sourceSquare, targetSquare)

      if (result === null || result === 'wrong') {
        toast.error('Not the best move!', { duration: 1500 })
        return false
      }
      return true
    },
    [puzzle, status, playerColor, makeMove],
  )

  async function handleNext() {
    setLoading(true)
    setTimer(0)
    setHintSquare(null)
    setSolveCalled(false)
    setShowingSolution(false)
    nextPuzzle()
    try {
      const next = await onNext()
      if (next) setPuzzle(next)
    } finally {
      setLoading(false)
    }
  }

  function handleHint() {
    const sq = getHintSquare()
    if (sq) {
      setHintSquare(sq)
      toast(`Move from ${sq.toUpperCase()}`, { icon: '💡', duration: 1500 })
      setTimeout(() => setHintSquare(null), 1500)
    }
  }

  // board orientation: player color after setup move
  const boardOrientation: 'white' | 'black' = playerColor === 'w' ? 'white' : 'black'

  const fen = chess?.fen() ?? initialPuzzle.fen

  // ── Solution stepper: takes over the whole layout ──────────────────────────
  if (showingSolution && puzzle) {
    return (
      <SolutionStepper
        puzzleFen={puzzle.fen}
        moves={puzzle.moves}
        playerColor={playerColor}
        onNext={handleNext}
        loading={loading}
      />
    )
  }

  const customSquareStyles: Record<string, React.CSSProperties> = {}
  if (hintSquare) {
    customSquareStyles[hintSquare] = {
      background: 'rgba(212,175,55,0.55)',
      borderRadius: '4px',
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
      {/* ── Board column ── */}
      <div className="relative">
        {/* Solved overlay */}
        <AnimatePresence>
          {status === 'complete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center px-6"
              >
                <div className="text-6xl mb-3">✨</div>
                <p className="text-white font-black text-2xl mb-1">Puzzle Solved!</p>
                {ratingDelta !== null && (
                  <p className={`font-bold text-lg mb-4 ${ratingDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ratingDelta >= 0 ? '+' : ''}{ratingDelta} rating
                  </p>
                )}
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="btn-gold px-8 py-3 flex items-center gap-2 mx-auto"
                >
                  {loading ? 'Loading…' : <><ChevronRight className="w-4 h-4" /> Next Puzzle</>}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Board */}
        <div className={`chess-board-container transition-all duration-150 ${
          status === 'wrong' ? 'ring-2 ring-red-500/50' : ''
        }`}>
          <Chessboard
            id="puzzle-board"
            position={fen}
            onPieceDrop={handleDrop}
            boardOrientation={boardOrientation}
            customSquareStyles={customSquareStyles}
            animationDuration={180}
            arePremovesAllowed={false}
            customBoardStyle={{
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
            customDarkSquareStyle={{ backgroundColor: '#9E5E28' }}
            customLightSquareStyle={{ backgroundColor: '#E8C98A' }}
          />
        </div>

        {/* Floating rating delta */}
        <AnimatePresence>
          {showDelta && ratingDelta !== null && (
            <motion.div
              key="delta"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -60 }}
              transition={{ duration: 1.8 }}
              className={`absolute top-4 right-4 text-2xl font-black pointer-events-none ${
                ratingDelta >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {ratingDelta >= 0 ? '+' : ''}{ratingDelta}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player color indicator */}
        <div className="mt-2 flex items-center gap-2">
          <div className={`w-4 h-4 rounded-sm border-2 border-gray-600 ${boardOrientation === 'white' ? 'bg-white' : 'bg-gray-900'}`} />
          <span className="text-gray-500 text-xs">
            You are playing as <span className="text-white font-semibold capitalize">{boardOrientation}</span>
          </span>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="space-y-4">
        {/* Rating stats */}
        <div className="premium-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Your Rating</p>
              <p className="text-2xl font-black" style={{ color: getRatingColor(currentRating) }}>
                {currentRating}
              </p>
              <p className="text-gray-600 text-xs">{getRatingTitle(currentRating)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs mb-0.5">Puzzle Rating</p>
              <p className="text-xl font-black text-white">{puzzle?.rating ?? '—'}</p>
              {puzzle && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPuzzleDifficultyColor(puzzle.rating)}`}>
                  {getPuzzleDifficultyLabel(puzzle.rating)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06]">
            <div className="text-center">
              <p className="text-white font-bold text-sm">{formatTimer(timer)}</p>
              <p className="text-gray-600 text-[10px]">Time</p>
            </div>
            <div className="text-center">
              <p className="text-orange-400 font-bold text-sm">🔥 {streak}</p>
              <p className="text-gray-600 text-[10px]">Streak</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">{sessionSolved}/{sessionAttempted}</p>
              <p className="text-gray-600 text-[10px]">Session</p>
            </div>
          </div>
        </div>

        {/* Themes */}
        {puzzle?.themes && puzzle.themes.length > 0 && (
          <div className="premium-card p-4">
            <p className="text-gray-500 text-xs mb-2">Themes</p>
            <div className="flex flex-wrap gap-1.5">
              {puzzle.themes.map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400 capitalize">
                  {String(t).toLowerCase().replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Wrong-move panel */}
        <AnimatePresence>
          {status === 'wrong' && !usePuzzleStore.getState().showSolution && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="premium-card p-4 border border-red-500/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <X className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-bold text-sm">Not the best move</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={resetPuzzle}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm hover:bg-[#D4AF37]/20 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Try again
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.08] text-gray-400 text-sm hover:bg-white/[0.06] transition-colors"
                >
                  <SkipForward className="w-4 h-4" /> Skip puzzle
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hints / solution (only while solving) */}
        {status === 'solving' && (
          <div className="premium-card p-4 space-y-2">
            <button
              onClick={handleHint}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-yellow-400/20 bg-yellow-400/5 text-yellow-400 text-sm hover:bg-yellow-400/10 transition-colors"
            >
              <Lightbulb className="w-4 h-4" /> Get a hint (highlights from-square)
            </button>
            <button
              onClick={() => { setSolveCalled(true); handleServerSolve(false); setShowingSolution(true) }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-400 text-sm hover:bg-white/[0.06] transition-colors"
            >
              <Eye className="w-4 h-4" /> Show solution step by step
            </button>
          </div>
        )}

        {/* Skip while solving */}
        {status === 'solving' && (
          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full btn-outline-gold py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-30"
          >
            <SkipForward className="w-4 h-4" /> Skip to next
          </button>
        )}

        {/* "See solution" shortcut when wrong */}
        {status === 'wrong' && !showingSolution && (
          <button
            onClick={() => setShowingSolution(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-400/20 bg-blue-400/5 text-blue-400 text-sm hover:bg-blue-400/10 transition-colors"
          >
            <Eye className="w-4 h-4" /> See solution step by step
          </button>
        )}
      </div>
    </div>
  )
}

function formatTimer(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function getEncouragement(time: number, delta: number) {
  if (time < 8 && delta >= 15) return '⚡ Lightning fast! Brilliant!'
  if (time < 15) return '🎯 Excellent!'
  if (delta >= 10) return '✨ Great solve!'
  return '✅ Correct!'
}
