import { prisma } from '@/lib/prisma'
import { PuzzlesListClient } from './PuzzlesListClient'

export const dynamic = 'force-dynamic'

export default async function AdminPuzzlesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; theme?: string }
}) {
  const page = parseInt(searchParams.page ?? '1')
  const limit = 20
  const skip = (page - 1) * limit
  const search = searchParams.search ?? ''
  const theme = searchParams.theme ?? ''

  const where: any = {}

  if (search) {
    where.OR = [
      { lichessId: { contains: search, mode: 'insensitive' } },
      { fen: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (theme) {
    where.themes = { has: theme as any }
  }

  const [puzzles, total] = await Promise.all([
    prisma.puzzle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.puzzle.count({ where }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Puzzle Management</h1>
          <p className="text-gray-500 text-sm">Add, edit, or remove puzzles from the database</p>
        </div>
      </div>

      <PuzzlesListClient 
        initialPuzzles={JSON.parse(JSON.stringify(puzzles))} 
        total={total}
        currentPage={page}
        limit={limit}
      />
    </div>
  )
}
