export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Maps Lichess theme strings to our enum values
const THEME_MAP: Record<string, string> = {
  fork: 'FORK',
  pin: 'PIN',
  skewer: 'SKEWER',
  discoveredAttack: 'DISCOVERED_ATTACK',
  doubleCheck: 'DOUBLE_CHECK',
  backRankMate: 'BACK_RANK',
  smotheredMate: 'SMOTHERED_MATE',
  attraction: 'ATTRACTION',
  deflection: 'DEFLECTION',
  decoy: 'DECOY',
  interference: 'INTERFERENCE',
  clearance: 'CLEARANCE',
  sacrifice: 'SACRIFICE',
  zwischenzug: 'ZWISCHENZUG',
  endgame: 'ENDGAME',
  opening: 'OPENING',
  middlegame: 'MIDDLEGAME',
  mateIn1: 'MATING_NET',
  mateIn2: 'MATING_NET',
  mateIn3: 'MATING_NET',
  hangingPiece: 'HANGING_PIECE',
  long: 'LONG_PUZZLE',
  short: 'SHORT_PUZZLE',
  advancedPawn: 'ADVANCED_PAWN',
  zugzwang: 'ZUGZWANG',
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { csv } = await req.json()
  if (!csv) return NextResponse.json({ error: 'CSV data required' }, { status: 400 })

  const lines = csv.trim().split('\n')
  let imported = 0
  let errors = 0

  for (const line of lines) {
    try {
      const [puzzleId, fen, moves, rating, ratingDeviation, popularity, , themes, gameUrl, openingTags] = line.split(',')

      if (!puzzleId || !fen || !moves || !rating) {
        errors++
        continue
      }

      const parsedThemes = (themes ?? '')
        .split(' ')
        .map((t: string) => THEME_MAP[t.trim()])
        .filter(Boolean) as any[]

      await prisma.puzzle.upsert({
        where: { lichessId: puzzleId },
        create: {
          lichessId: puzzleId,
          fen,
          moves: moves.split(' '),
          rating: parseInt(rating),
          ratingDeviation: parseInt(ratingDeviation ?? '100'),
          popularity: parseInt(popularity ?? '0'),
          themes: parsedThemes,
          openingTags: openingTags ? openingTags.split(' ') : [],
          gameUrl,
        },
        update: {
          rating: parseInt(rating),
          popularity: parseInt(popularity ?? '0'),
          themes: parsedThemes,
        },
      })
      imported++
    } catch {
      errors++
    }
  }

  return NextResponse.json({ imported, errors })
}
