import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const puzzle = await prisma.puzzle.findUnique({
      where: { id: params.id },
    })

    if (!puzzle) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 })
    }

    return NextResponse.json(puzzle)
  } catch (error) {
    console.error('Error fetching puzzle:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const { fen, moves, rating, themes, lichessId, openingTags, popularity, isActive } = data

    const puzzle = await prisma.puzzle.update({
      where: { id: params.id },
      data: {
        fen,
        moves,
        rating,
        themes,
        lichessId,
        openingTags,
        popularity,
        isActive,
      },
    })

    return NextResponse.json(puzzle)
  } catch (error) {
    console.error('Error updating puzzle:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Instead of hard delete, maybe just deactivate? 
    // But the user said "remove", so let's allow DELETE but be careful.
    // Check if it's used in attempts first to avoid foreign key errors.
    
    const attemptsCount = await prisma.puzzleAttempt.count({
      where: { puzzleId: params.id }
    })

    if (attemptsCount > 0) {
      // Deactivate if there are attempts to preserve data integrity
      await prisma.puzzle.update({
        where: { id: params.id },
        data: { isActive: false }
      })
      return NextResponse.json({ message: 'Puzzle deactivated (has associated attempts)' })
    }

    await prisma.puzzle.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Puzzle deleted successfully' })
  } catch (error) {
    console.error('Error deleting puzzle:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
