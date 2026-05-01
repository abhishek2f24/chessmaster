export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="w-40 h-7 rounded-lg bg-white/[0.06] mb-2 animate-pulse" />
        <div className="w-64 h-4 rounded bg-white/[0.04] animate-pulse" />
      </div>
      {/* Mode selector */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-28 h-10 rounded-xl bg-white/[0.06] animate-pulse" />
        ))}
      </div>
      {/* Board + panel */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="aspect-square bg-[#111118] border border-white/[0.06] rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="bg-[#111118] border border-white/[0.06] rounded-xl h-40 animate-pulse" />
          <div className="bg-[#111118] border border-white/[0.06] rounded-xl h-20 animate-pulse" />
          <div className="bg-[#111118] border border-white/[0.06] rounded-xl h-24 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
