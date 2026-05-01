import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getNextPuzzle } from '@/lib/puzzle-engine'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const rating = parseInt(searchParams.get('rating') ?? '800')

  const puzzle = await getNextPuzzle(session.user.id, rating)
  if (!puzzle) return NextResponse.json({ puzzle: null })

  return NextResponse.json({ puzzle })
}
