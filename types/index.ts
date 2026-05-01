import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: string
      puzzleRating: number
      currentStreak: number
      xpPoints: number
      plan: string
    }
  }
}

export interface PuzzleData {
  id: string
  lichessId?: string | null
  fen: string
  moves: string[]
  rating: number
  themes: string[]
  openingTags: string[]
}

export interface CourseData {
  id: string
  slug: string
  title: string
  description: string
  thumbnail?: string | null
  instructorName: string
  category: string
  level: string
  ratingMin: number
  ratingMax: number
  isPremium: boolean
  totalLessons: number
  totalHours: number
  rating: number
  enrollments: number
  tags: string[]
}

export interface UserStats {
  puzzleRating: number
  puzzleRatingBest: number
  totalPuzzlesSolved: number
  totalPuzzlesAttempted: number
  currentStreak: number
  longestStreak: number
  accuracy: number
  xpPoints: number
  level: number
}

export interface LeaderboardUser {
  rank: number
  userId: string
  name: string | null
  image: string | null
  puzzleRating: number
  puzzlesSolved: number
  accuracy: number
  streak: number
}

export interface DailyChallenge {
  id: string
  date: string
  easy: PuzzleData | null
  medium: PuzzleData | null
  hard: PuzzleData | null
  insane: PuzzleData | null
}

export interface RatingHistoryPoint {
  date: string
  rating: number
}

export interface PuzzleAttemptResult {
  solved: boolean
  ratingDelta: number
  newRating: number
  xpGained: number
  streakCount: number
}

export interface AchievementData {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  earnedAt?: Date
}
