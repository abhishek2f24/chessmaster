/**
 * Glicko-inspired puzzle ELO engine
 * Correct fast solve = max reward, wrong = penalty scaled to puzzle difficulty
 */

const K_FACTOR = 32
const SPEED_BONUS_THRESHOLD = 10 // seconds

export interface EloResult {
  ratingBefore: number
  ratingAfter: number
  ratingDelta: number
}

function expectedScore(playerRating: number, puzzleRating: number): number {
  return 1 / (1 + Math.pow(10, (puzzleRating - playerRating) / 400))
}

export function calculatePuzzleElo(
  playerRating: number,
  puzzleRating: number,
  solved: boolean,
  solveTimeSeconds?: number,
): EloResult {
  const expected = expectedScore(playerRating, puzzleRating)
  const actual = solved ? 1 : 0

  let delta = Math.round(K_FACTOR * (actual - expected))

  // Speed bonus: solved under threshold gets up to +5 extra
  if (solved && solveTimeSeconds !== undefined && solveTimeSeconds < SPEED_BONUS_THRESHOLD) {
    const speedMultiplier = (SPEED_BONUS_THRESHOLD - solveTimeSeconds) / SPEED_BONUS_THRESHOLD
    delta += Math.round(5 * speedMultiplier)
  }

  // Floor: never gain more than +20 or lose more than -15
  if (solved) {
    delta = Math.min(delta, 20)
    delta = Math.max(delta, 2)
  } else {
    delta = Math.max(delta, -15)
    delta = Math.min(delta, -2)
  }

  const ratingAfter = Math.max(400, playerRating + delta)

  return {
    ratingBefore: playerRating,
    ratingAfter,
    ratingDelta: ratingAfter - playerRating,
  }
}

export function getRatingTitle(rating: number): string {
  if (rating < 800) return 'Pawn'
  if (rating < 1000) return 'Knight'
  if (rating < 1200) return 'Bishop'
  if (rating < 1400) return 'Rook'
  if (rating < 1600) return 'Queen'
  if (rating < 1800) return 'King'
  if (rating < 2000) return 'Expert'
  if (rating < 2200) return 'Master'
  return 'Grandmaster'
}

export function getRatingColor(rating: number): string {
  if (rating < 1000) return '#94A3B8'
  if (rating < 1200) return '#22C55E'
  if (rating < 1400) return '#3B82F6'
  if (rating < 1600) return '#8B5CF6'
  if (rating < 1800) return '#F59E0B'
  if (rating < 2000) return '#EF4444'
  return '#D4AF37'
}

export function getPuzzleRatingRange(userRating: number): [number, number] {
  const margin = 200
  return [Math.max(400, userRating - margin), userRating + margin]
}

export function getXpForSolve(puzzleRating: number, userRating: number, solved: boolean): number {
  if (!solved) return 0
  const difficulty = puzzleRating - userRating
  if (difficulty > 200) return 25
  if (difficulty > 0) return 15
  return 10
}
