import { create } from 'zustand'
import type { UserStats, RatingHistoryPoint } from '@/types'

interface UserStore {
  stats: UserStats | null
  ratingHistory: RatingHistoryPoint[]
  isLoading: boolean
  setStats: (stats: UserStats) => void
  updateRating: (newRating: number) => void
  setRatingHistory: (history: RatingHistoryPoint[]) => void
  setLoading: (val: boolean) => void
  incrementStreak: () => void
  resetStreak: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  stats: null,
  ratingHistory: [],
  isLoading: false,

  setStats: (stats) => set({ stats }),

  updateRating: (newRating) =>
    set((state) => ({
      stats: state.stats ? { ...state.stats, puzzleRating: newRating, puzzleRatingBest: Math.max(newRating, state.stats.puzzleRatingBest) } : null,
    })),

  setRatingHistory: (history) => set({ ratingHistory: history }),
  setLoading: (val) => set({ isLoading: val }),

  incrementStreak: () =>
    set((state) => ({
      stats: state.stats ? { ...state.stats, currentStreak: state.stats.currentStreak + 1 } : null,
    })),

  resetStreak: () =>
    set((state) => ({
      stats: state.stats ? { ...state.stats, currentStreak: 0 } : null,
    })),
}))
