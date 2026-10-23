'use client'

import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, validateFen } from 'chess.js'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Plus, Trash2, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const THEMES = [
  'FORK', 'PIN', 'SKEWER', 'DISCOVERED_ATTACK', 'DOUBLE_CHECK',
  'BACK_RANK', 'SMOTHERED_MATE', 'ATTRACTION', 'DEFLECTION', 'DECOY',
  'INTERFERENCE', 'CLEARANCE', 'SACRIFICE', 'ZWISCHENZUG', 'ENDGAME',
  'OPENING', 'MIDDLEGAME', 'MATING_NET', 'HANGING_PIECE', 'LONG_PUZZLE',
  'SHORT_PUZZLE', 'ADVANCED_PAWN', 'ZUGZWANG'
]

export default function NewPuzzlePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  const [moves, setMoves] = useState<string[]>(['', '']) // Setup move + first player move
  const [rating, setRating] = useState(1500)
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [lichessId, setLichessId] = useState('')
  const [openingTags, setOpeningTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const [game, setGame] = useState(new Chess())

  useEffect(() => {
    try {
      // Validate FEN before setting it in chess.js
      if (validateFen(fen).valid) {
        setGame(new Chess(fen))
      }
    } catch (e) {
      // Invalid FEN
    }
  }, [fen])

  const handleAddMove = () => setMoves([...moves, ''])
  const handleRemoveMove = (index: number) => {
    if (moves.length <= 2) return
    const newMoves = [...moves]
    newMoves.splice(index, 1)
    setMoves(newMoves)
  }
  const handleMoveChange = (index: number, val: string) => {
    const newMoves = [...moves]
    newMoves[index] = val
    setMoves(newMoves)
  }

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    )
  }

  const addTag = () => {
    if (newTag && !openingTags.includes(newTag)) {
      setOpeningTags([...openingTags, newTag])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setOpeningTags(openingTags.filter(t => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fen) return toast.error('FEN is required')
    if (moves.filter(m => m.trim()).length < 2) return toast.error('At least 2 moves are required')

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen,
          moves: moves.filter(m => m.trim()),
          rating,
          themes: selectedThemes,
          lichessId,
          openingTags,
          popularity: 0
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create puzzle')
      }

      toast.success('Puzzle created successfully')
      router.push('/admin/puzzles')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity in setup
      });

      if (move === null) return false;

      setFen(game.fen());
      return true;
    } catch (e) {
      return false;
    }
  }

  const resetBoard = () => {
    const defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    setFen(defaultFen);
    setGame(new Chess(defaultFen));
  }

  const isFenValid = validateFen(fen).valid;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/puzzles" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Puzzles</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={resetBoard}
            className="btn-outline-gold !py-2 !px-4 text-xs"
          >
            Reset Board
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFenValid}
            className="btn-gold !py-2 !px-6 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Puzzle'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration */}
        <div className="space-y-6">
          <div className="premium-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Puzzle Details</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Initial FEN</label>
              <input
                type="text"
                value={fen}
                onChange={(e) => setFen(e.target.value)}
                placeholder="rnbqkbnr/..."
                className="w-full bg-[#0A0A0F] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white focus:border-[#D4AF37]/50 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Rating</label>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full bg-[#0A0A0F] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white focus:border-[#D4AF37]/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Lichess ID (Optional)</label>
                <input
                  type="text"
                  value={lichessId}
                  onChange={(e) => setLichessId(e.target.value)}
                  placeholder="e.g. 00s7x"
                  className="w-full bg-[#0A0A0F] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white focus:border-[#D4AF37]/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase">Moves (SAN or UCI)</label>
                <button onClick={handleAddMove} className="text-[#D4AF37] text-xs hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Move
                </button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {moves.map((move, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-8 flex items-center justify-center text-xs font-bold text-gray-600 bg-white/5 rounded border border-white/5">
                      {i === 0 ? 'Setup' : i}
                    </div>
                    <input
                      type="text"
                      value={move}
                      onChange={(e) => handleMoveChange(i, e.target.value)}
                      placeholder={i === 0 ? "Opponent's last move" : "Correct move"}
                      className="flex-1 bg-[#0A0A0F] border border-white/[0.06] rounded-lg px-4 py-1.5 text-sm text-white focus:border-[#D4AF37]/50 outline-none"
                    />
                    <button 
                      onClick={() => handleRemoveMove(i)} 
                      disabled={moves.length <= 2}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg disabled:opacity-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">First move is the opponent's move that sets up the puzzle.</p>
            </div>
          </div>

          <div className="premium-card p-6">
            <h2 className="text-sm font-bold text-white mb-4">Themes & Tags</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => toggleTheme(theme)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                    selectedThemes.includes(theme)
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-white/5 border-white/[0.06] text-gray-500 hover:border-white/20'
                  }`}
                >
                  {theme.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Opening Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="e.g. Italian Game"
                  className="flex-1 bg-[#0A0A0F] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white focus:border-[#D4AF37]/50 outline-none"
                />
                <button onClick={addTag} className="btn-gold !p-2 rounded-lg">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {openingTags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-white/5 border border-white/[0.06] px-2 py-1 rounded text-xs text-gray-400">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <div className="premium-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Board Preview</h2>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <HelpCircle className="w-3 h-3" />
                  <span>Previewing FEN</span>
                </div>
              </div>
              
              <div className="aspect-square w-full max-w-[450px] mx-auto rounded-lg overflow-hidden border-4 border-[#1A1A24]">
                <Chessboard 
                  position={fen} 
                  onPieceDrop={onDrop}
                  boardOrientation={fen.includes(' b ') ? 'black' : 'white'}
                  customDarkSquareStyle={{ backgroundColor: '#2B2B3D' }}
                  customLightSquareStyle={{ backgroundColor: '#454561' }}
                />
              </div>

              <div className="mt-6 p-4 bg-black/40 rounded-lg border border-white/5">
                <h3 className="text-xs font-bold text-[#D4AF37] mb-2 uppercase flex items-center justify-between">
                  <span>Current Logic</span>
                  <span className={isFenValid ? 'text-emerald-500' : 'text-red-500'}>
                    {isFenValid ? '● Valid FEN' : '● Invalid FEN'}
                  </span>
                </h3>
                <div className="text-xs text-gray-400 space-y-1">
                  <p><span className="text-white">Active Side:</span> {fen.includes(' w ') ? 'White' : 'Black'}</p>
                  <p><span className="text-white">First move:</span> {moves[0] || 'None'}</p>
                  <p><span className="text-white">Solution:</span> {moves.slice(1).filter(Boolean).join(', ') || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
