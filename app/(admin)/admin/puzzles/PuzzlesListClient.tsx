'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Filter, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

interface Props {
  initialPuzzles: any[]
  total: number
  currentPage: number
  limit: number
}

export function PuzzlesListClient({ initialPuzzles, total, currentPage, limit }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const totalPages = Math.ceil(total / limit)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (search) params.set('search', search)
    else params.delete('search')
    params.set('page', '1')
    router.push(`/admin/puzzles?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/admin/puzzles?${params.toString()}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this puzzle?')) return

    setIsDeleting(id)
    try {
      const res = await fetch(`/api/admin/puzzles/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Puzzle deleted')
      router.refresh()
    } catch (error) {
      toast.error('Error deleting puzzle')
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/puzzles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (!res.ok) throw new Error('Failed to update')
      toast.success(currentStatus ? 'Deactivated' : 'Activated')
      router.refresh()
    } catch (error) {
      toast.error('Error updating status')
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by ID or FEN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111118] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-[#D4AF37]/50 outline-none transition-all"
          />
        </form>
        <div className="flex gap-2">
          <button className="premium-card px-4 py-2 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <Link href="/admin/puzzles/new" className="btn-gold flex items-center gap-2 !py-2 !px-4 text-sm whitespace-nowrap">
            <Plus className="w-4 h-4" />
            <span>Add Puzzle</span>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Puzzle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Themes</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {initialPuzzles.map((puzzle, i) => (
                <motion.tr
                  key={puzzle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-medium text-sm">
                        {puzzle.lichessId || puzzle.id.slice(0, 8)}
                      </span>
                      <span className="text-gray-500 text-[10px] truncate max-w-[200px]" title={puzzle.fen}>
                        {puzzle.fen}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded text-xs font-bold border border-[#D4AF37]/20">
                      {puzzle.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {puzzle.themes.slice(0, 3).map((theme: string) => (
                        <span key={theme} className="bg-white/[0.05] text-gray-400 px-1.5 py-0.5 rounded text-[10px] border border-white/[0.05]">
                          {theme.toLowerCase().replace('_', ' ')}
                        </span>
                      ))}
                      {puzzle.themes.length > 3 && (
                        <span className="text-gray-600 text-[10px]">+{puzzle.themes.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleActive(puzzle.id, puzzle.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          puzzle.isActive ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-gray-500 hover:bg-white/10'
                        }`}
                        title={puzzle.isActive ? 'Active' : 'Inactive'}
                      >
                        {puzzle.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <Link
                        href={`/admin/puzzles/${puzzle.id}`}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(puzzle.id)}
                        disabled={isDeleting === puzzle.id}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {initialPuzzles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No puzzles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-xs">
            Showing <span className="text-white font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
            <span className="text-white font-medium">{Math.min(currentPage * limit, total)}</span> of{' '}
            <span className="text-white font-medium">{total}</span> puzzles
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 premium-card !rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <div className="flex items-center px-4 py-2 premium-card !rounded-lg text-sm text-white font-medium">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 premium-card !rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
