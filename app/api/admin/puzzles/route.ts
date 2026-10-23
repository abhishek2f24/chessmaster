import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const search = searchParams.get('search') ?? ''
  const ratingMin = parseInt(searchParams.get('ratingMin') ?? '400')
  const ratingMax = parseInt(searchParams.get('ratingMax') ?? '3500')
  const theme = searchParams.get('theme')
  const skip = (page - 1) * limit

  try {
    const where: any = {
      rating: { gte: ratingMin, lte: ratingMax },
    }

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

    return NextResponse.json({
      puzzles,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    })
  } catch (error) {
    console.error('Error fetching puzzles:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const { fen, moves, rating, themes, lichessId, openingTags, popularity } = data

    if (!fen || !moves || !Array.isArray(moves) || moves.length < 2) {
      return NextResponse.json({ error: 'Missing required fields (fen, moves)' }, { status: 400 })
    }

    const puzzle = await prisma.puzzle.create({
      data: {
        fen,
        moves,
        rating: rating ?? 1500,
        themes: themes ?? [],
        lichessId: lichessId || `custom_${Date.now()}`,
        openingTags: openingTags ?? [],
        popularity: popularity ?? 0,
        isActive: true,
      },
    })

    return NextResponse.json(puzzle)
  } catch (error) {
    console.error('Error creating puzzle:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
