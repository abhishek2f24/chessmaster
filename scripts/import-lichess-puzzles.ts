/**
 * Lichess Puzzle CSV Importer
 *
 * Streams lichess_db_puzzle.csv directly into the database.
 *
 * Usage:
 *   npm run import:puzzles                         # 50 000 puzzles from CSV
 *   npm run import:puzzles -- --count 200000       # 200k puzzles
 *   npm run import:puzzles -- --skip 100000        # start from line 100 000
 *   npm run import:puzzles -- --min-rating 1000    # rating filter
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const prisma = new PrismaClient()

// ── CLI args ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
function arg(name: string, def: string) {
  const i = argv.indexOf(`--${name}`)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : def
}

const COUNT   = parseInt(arg('count',      '50000'))
const SKIP    = parseInt(arg('skip',       '0'))
const MIN_R   = parseInt(arg('min-rating', '400'))
const MAX_R   = parseInt(arg('max-rating', '3000'))
const CSV     = arg('file', path.join(process.cwd(), 'lichess_db_puzzle.csv'))
const BATCH   = 500   // rows per DB insert

// ── Theme map ─────────────────────────────────────────────────────────────────
const TMAP: Record<string, string> = {
  fork: 'FORK', pin: 'PIN', skewer: 'SKEWER',
  discoveredAttack: 'DISCOVERED_ATTACK', doubleCheck: 'DOUBLE_CHECK',
  backRankMate: 'BACK_RANK', smotheredMate: 'SMOTHERED_MATE',
  attraction: 'ATTRACTION', deflection: 'DEFLECTION', decoy: 'DECOY',
  interference: 'INTERFERENCE', clearance: 'CLEARANCE',
  sacrifice: 'SACRIFICE', zwischenzug: 'ZWISCHENZUG',
  endgame: 'ENDGAME', opening: 'OPENING', middlegame: 'MIDDLEGAME',
  mateIn1: 'MATING_NET', mateIn2: 'MATING_NET', mateIn3: 'MATING_NET',
  mateIn4: 'MATING_NET', mateIn5: 'MATING_NET', mate: 'MATING_NET',
  hangingPiece: 'HANGING_PIECE', long: 'LONG_PUZZLE', short: 'SHORT_PUZZLE',
  advancedPawn: 'ADVANCED_PAWN', zugzwang: 'ZUGZWANG',
  rookEndgame: 'ENDGAME', bishopEndgame: 'ENDGAME', pawnEndgame: 'ENDGAME',
  queenEndgame: 'ENDGAME', knightEndgame: 'ENDGAME',
  exposedKing: 'MATING_NET', crushing: 'SACRIFICE',
  capturingDefender: 'DEFLECTION', trappedPiece: 'PIN',
  quietMove: 'CLEARANCE', equality: 'MIDDLEGAME', advantage: 'MIDDLEGAME',
  master: 'LONG_PUZZLE', masterVsMaster: 'LONG_PUZZLE',
  superGM: 'LONG_PUZZLE', veryLong: 'LONG_PUZZLE',
}
const mapThemes = (s: string) =>
  [...new Set((s ?? '').split(' ').map(t => TMAP[t.trim()]).filter(Boolean))]

// ── CSV line → DB row ─────────────────────────────────────────────────────────
// PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
function parseLine(line: string) {
  if (!line || line.startsWith('PuzzleId')) return null
  const c = line.split(',')
  if (c.length < 8) return null
  const [id, fen, movesStr, rStr, rdStr, popStr, , thStr, gameUrl, openingRaw] = c
  if (!id || !fen || !movesStr || !rStr) return null
  const rating = parseInt(rStr)
  if (isNaN(rating) || rating < MIN_R || rating > MAX_R) return null
  const moves = movesStr.trim().split(' ')
  if (moves.length < 2) return null   // must have setup move + at least 1 player move
  return {
    lichessId:       id.trim(),
    fen:             fen.trim(),
    moves,
    rating,
    ratingDeviation: parseInt(rdStr  ?? '80')  || 80,
    popularity:      parseInt(popStr ?? '0')   || 0,
    themes:          mapThemes(thStr ?? '') as any[],
    openingTags:     openingRaw
                       ? openingRaw.trim().replace(/\r/g, '').split(' ').filter(Boolean)
                       : [] as string[],
    gameUrl:         gameUrl?.trim() ?? null,
    isActive:        true,
  }
}

// ── Batch insert (skip existing lichessIds) ───────────────────────────────────
async function flush(batch: ReturnType<typeof parseLine>[], stats: Stats) {
  const rows = batch.filter(Boolean) as NonNullable<ReturnType<typeof parseLine>>[]
  if (!rows.length) return

  // find which IDs already exist
  const ids = rows.map(r => r.lichessId)
  const existing = new Set(
    (await prisma.puzzle.findMany({ where: { lichessId: { in: ids } }, select: { lichessId: true } }))
      .map(e => e.lichessId)
  )

  const fresh = rows.filter(r => !existing.has(r.lichessId))
  if (fresh.length) {
    await prisma.puzzle.createMany({ data: fresh as any, skipDuplicates: true })
  }
  stats.imported += fresh.length
  stats.dupes    += rows.length - fresh.length
}

interface Stats { imported: number; dupes: number; errors: number; lines: number }

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(CSV)) {
    console.error(`\n❌  File not found: ${CSV}`)
    console.error(`   Place lichess_db_puzzle.csv in the project root, or pass --file <path>\n`)
    process.exit(1)
  }

  const fileSizeMB = (fs.statSync(CSV).size / 1024 / 1024).toFixed(0)
  console.log(`\n♟  Lichess Puzzle CSV Importer`)
  console.log(`   File   : ${CSV} (${fileSizeMB} MB)`)
  console.log(`   Import : ${COUNT.toLocaleString()} puzzles`)
  console.log(`   Rating : ${MIN_R}–${MAX_R}`)
  if (SKIP > 0) console.log(`   Skip   : first ${SKIP.toLocaleString()} data lines`)
  console.log()

  const stats: Stats = { imported: 0, dupes: 0, errors: 0, lines: 0 }
  const batch: ReturnType<typeof parseLine>[] = []
  const start = Date.now()

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    // skip header
    if (line.startsWith('PuzzleId')) continue

    stats.lines++
    if (stats.lines <= SKIP) continue

    const row = parseLine(line)
    if (row)  batch.push(row)
    else      stats.errors++

    if (batch.length >= BATCH) {
      await flush([...batch], stats)
      batch.length = 0

      const elapsed = ((Date.now() - start) / 1000).toFixed(0)
      const rate    = Math.round(stats.imported / Math.max(1, (Date.now() - start) / 1000))
      const eta     = rate > 0 ? Math.round((COUNT - stats.imported) / rate) : '?'
      process.stdout.write(
        `\r  ✔ ${stats.imported.toLocaleString()} / ${COUNT.toLocaleString()}` +
        `  |  ${rate}/s` +
        `  |  ETA ${eta}s` +
        `  |  dupes ${stats.dupes}` +
        `  |  line ${stats.lines.toLocaleString()}   `
      )
    }

    if (stats.imported >= COUNT) break
  }

  // flush remainder
  if (batch.length) await flush(batch, stats)

  const total = await prisma.puzzle.count()
  const secs  = ((Date.now() - start) / 1000).toFixed(1)

  console.log(`\n\n✅  Done in ${secs}s`)
  console.log(`   Imported this run : ${stats.imported.toLocaleString()}`)
  console.log(`   Dupes skipped     : ${stats.dupes.toLocaleString()}`)
  console.log(`   Parse errors      : ${stats.errors.toLocaleString()}`)
  console.log(`   Total in DB now   : ${total.toLocaleString()}\n`)
}

main()
  .catch(e => { console.error('\n', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
