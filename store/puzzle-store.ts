import { create } from 'zustand'
import { Chess } from 'chess.js'
import type { PuzzleData } from '@/types'

type PuzzleStatus = 'idle' | 'solving' | 'correct' | 'wrong' | 'complete'
type PuzzleMode = 'rated' | 'learning' | 'survival' | 'theme' | 'custom' | 'retry'

interface PuzzleState {
  puzzle: PuzzleData | null
  chess: Chess | null
  status: PuzzleStatus
  mode: PuzzleMode
  // Index of the move the PLAYER needs to play next (always odd: 1, 3, 5…)
  currentMoveIndex: number
  playerColor: 'w' | 'b'
  solveStartTime: number | null
  streak: number
  sessionSolved: number
  sessionAttempted: number
  ratingChange: number | null
  showSolution: boolean
  isAnimating: boolean

  setPuzzle: (puzzle: PuzzleData) => void
  makeMove: (from: string, to: string, promotion?: string) => 'correct' | 'wrong' | 'complete' | null
  getHintSquare: () => string | null
  revealSolution: () => void
  resetPuzzle: () => void
  nextPuzzle: () => void
  setMode: (mode: PuzzleMode) => void
  setRatingChange: (delta: number) => void
  setAnimating: (val: boolean) => void
  incrementStreak: () => void
  resetStreak: () => void
}

function applyUciMove(chess: Chess, uci: string): boolean {
  try {
    const from = uci.slice(0, 2)
    const to = uci.slice(2, 4)
    const promotion = uci.length > 4 ? uci[4] : undefined
    chess.move({ from, to, promotion })
    return true
  } catch {
    return false
  }
}

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  puzzle: null,
  chess: null,
  status: 'idle',
  mode: 'rated',
  // Player always starts at moves[1] (moves[0] is opponent setup)
  currentMoveIndex: 1,
  playerColor: 'w',
  solveStartTime: null,
  streak: 0,
  sessionSolved: 0,
  sessionAttempted: 0,
  ratingChange: null,
  showSolution: false,
  isAnimating: false,

  setPuzzle: (puzzle) => {
    const chess = new Chess(puzzle.fen)

    // moves[0] is the opponent's move that sets up the puzzle position.
    // Apply it silently so the board shows the actual puzzle start.
    if (puzzle.moves.length > 0) {
      applyUciMove(chess, puzzle.moves[0])
    }

    // After the setup move the active side is the player's color.
    const playerColor = chess.turn()

    set({
      puzzle,
      chess,
      status: 'solving',
      currentMoveIndex: 1,   // player plays moves[1], [3], [5]…
      playerColor,
      solveStartTime: Date.now(),
      showSolution: false,
      ratingChange: null,
    })
  },

  makeMove: (from, to, promotion) => {
    const { puzzle, chess, currentMoveIndex } = get()
    if (!puzzle || !chess || get().status !== 'solving') return null

    const expectedUci = puzzle.moves[currentMoveIndex]
    if (!expectedUci) return null

    // Match ignoring promotion character (we accept any promotion for now,
    // but still require the square pair to be correct)
    const squarePair = `${from}${to}`
    const expectedSquarePair = expectedUci.slice(0, 4)

    if (squarePair !== expectedSquarePair) {
      set({ status: 'wrong' })
      return 'wrong'
    }

    // Apply the player's move using the promotion from the solution if any
    const promoChar = expectedUci.length > 4 ? expectedUci[4] : (promotion ?? 'q')
    const applied = applyUciMove(chess, expectedUci.slice(0, 4) + (expectedUci.length > 4 ? expectedUci[4] : ''))
    if (!applied) {
      set({ status: 'wrong' })
      return 'wrong'
    }

    const nextIdx = currentMoveIndex + 1

    // Puzzle complete — no more moves
    if (nextIdx >= puzzle.moves.length) {
      set({
        status: 'complete',
        currentMoveIndex: nextIdx,
        sessionSolved: get().sessionSolved + 1,
        sessionAttempted: get().sessionAttempted + 1,
      })
      return 'complete'
    }

    // Apply opponent's response (even index) with a short delay handled in UI
    const opponentUci = puzzle.moves[nextIdx]
    const opponentApplied = applyUciMove(chess, opponentUci)

    const afterOpponentIdx = nextIdx + 1

    if (!opponentApplied || afterOpponentIdx >= puzzle.moves.length) {
      set({
        status: 'complete',
        currentMoveIndex: afterOpponentIdx,
        sessionSolved: get().sessionSolved + 1,
        sessionAttempted: get().sessionAttempted + 1,
      })
      return 'complete'
    }

    set({ status: 'solving', currentMoveIndex: afterOpponentIdx })
    return 'correct'
  },

  getHintSquare: () => {
    const { puzzle, currentMoveIndex } = get()
    if (!puzzle) return null
    const uci = puzzle.moves[currentMoveIndex]
    return uci ? uci.slice(0, 2) : null   // "from" square of the correct move
  },

  revealSolution: () => {
    const { puzzle, chess, currentMoveIndex } = get()
    if (!puzzle || !chess) return

    // Play all remaining moves so the board shows the full solution
    const remaining = puzzle.moves.slice(currentMoveIndex)
    for (const uci of remaining) {
      applyUciMove(chess, uci)
    }

    set({
      showSolution: true,
      status: 'wrong',
      currentMoveIndex: puzzle.moves.length,
      sessionAttempted: get().sessionAttempted + 1,
    })
  },

  resetPuzzle: () => {
    const { puzzle } = get()
    if (!puzzle) return
    const chess = new Chess(puzzle.fen)
    // Re-apply the setup move
    if (puzzle.moves.length > 0) applyUciMove(chess, puzzle.moves[0])
    const playerColor = chess.turn()
    set({
      chess,
      playerColor,
      status: 'solving',
      currentMoveIndex: 1,
      solveStartTime: Date.now(),
      showSolution: false,
    })
  },

  nextPuzzle: () => {
    set({
      puzzle: null,
      chess: null,
      status: 'idle',
      currentMoveIndex: 1,
      ratingChange: null,
      showSolution: false,
    })
  },

  setMode: (mode) => set({ mode }),
  setRatingChange: (delta) => set({ ratingChange: delta }),
  setAnimating: (val) => set({ isAnimating: val }),
  incrementStreak: () => set((s) => ({ streak: s.streak + 1 })),
  resetStreak: () => set({ streak: 0 }),
}))
