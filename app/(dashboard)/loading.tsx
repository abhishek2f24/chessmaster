export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-48 h-7 rounded-lg bg-white/[0.06]" />
          <div className="w-72 h-4 rounded bg-white/[0.04]" />
        </div>
        <div className="w-32 h-10 rounded-lg bg-white/[0.06]" />
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#111118] border border-white/[0.06] rounded-xl p-5 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06]" />
            <div className="w-16 h-7 rounded bg-white/[0.06]" />
            <div className="w-24 h-3 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
      {/* Chart + side cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111118] border border-white/[0.06] rounded-xl h-72" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#111118] border border-white/[0.06] rounded-xl h-24" />
          ))}
        </div>
      </div>
    </div>
  )
}
