'use client'

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImportPuzzlesPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; errors: number } | null>(null)
  const [csvText, setCsvText] = useState('')

  async function handleImport() {
    if (!csvText.trim()) return
    setImporting(true)
    try {
      const res = await fetch('/api/admin/puzzles/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText }),
      })
      const data = await res.json()
      setResult(data)
      if (data.imported > 0) toast.success(`Imported ${data.imported} puzzles!`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-white mb-2">Import Puzzles</h1>
      <p className="text-gray-500 text-sm mb-8">
        Paste Lichess puzzle CSV data. Format: <code className="text-[#D4AF37] text-xs">PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags</code>
      </p>

      <div className="space-y-4">
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={12}
          placeholder="PuzzleId,FEN,Moves,Rating,..."
          className="w-full bg-[#111118] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-xs font-mono placeholder:text-gray-700 focus:outline-none focus:border-[#D4AF37]/40 resize-none"
        />

        <button
          onClick={handleImport}
          disabled={importing || !csvText.trim()}
          className="btn-gold flex items-center gap-2 disabled:opacity-40"
        >
          {importing ? (
            <>Importing...</>
          ) : (
            <><Upload className="w-4 h-4" /> Import Puzzles</>
          )}
        </button>

        {result && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${
            result.imported > 0 ? 'bg-emerald-400/10 border-emerald-400/20' : 'bg-red-400/10 border-red-400/20'
          }`}>
            {result.imported > 0
              ? <CheckCircle className="w-5 h-5 text-emerald-400" />
              : <AlertCircle className="w-5 h-5 text-red-400" />
            }
            <div>
              <p className="text-white text-sm font-semibold">
                {result.imported} puzzles imported, {result.errors} errors
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
