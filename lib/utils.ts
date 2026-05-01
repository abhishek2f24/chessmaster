import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRating(rating: number): string {
  return rating.toLocaleString()
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export function formatPrice(cents: number): string {
  return `₹${(cents / 100).toFixed(0)}`
}

export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-emerald-400'
  if (accuracy >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getPuzzleDifficultyLabel(rating: number): string {
  if (rating < 1000) return 'Beginner'
  if (rating < 1300) return 'Intermediate'
  if (rating < 1600) return 'Advanced'
  if (rating < 1900) return 'Expert'
  return 'Master'
}

export function getPuzzleDifficultyColor(rating: number): string {
  if (rating < 1000) return 'text-emerald-400 bg-emerald-400/10'
  if (rating < 1300) return 'text-blue-400 bg-blue-400/10'
  if (rating < 1600) return 'text-purple-400 bg-purple-400/10'
  if (rating < 1900) return 'text-orange-400 bg-orange-400/10'
  return 'text-red-400 bg-red-400/10'
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
