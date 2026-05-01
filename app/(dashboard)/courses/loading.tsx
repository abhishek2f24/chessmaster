export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="w-32 h-7 rounded-lg bg-white/[0.06] mb-2 animate-pulse" />
        <div className="w-72 h-4 rounded bg-white/[0.04] animate-pulse" />
      </div>
      <div className="flex gap-3 mb-8 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-24 h-9 rounded-xl bg-white/[0.06] shrink-0 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#111118] border border-white/[0.06] rounded-xl overflow-hidden animate-pulse">
            <div className="h-36 bg-white/[0.04]" />
            <div className="p-4 space-y-2">
              <div className="w-16 h-3 rounded bg-white/[0.06]" />
              <div className="w-full h-4 rounded bg-white/[0.08]" />
              <div className="w-24 h-3 rounded bg-white/[0.04]" />
              <div className="flex justify-between mt-3">
                <div className="w-16 h-3 rounded bg-white/[0.04]" />
                <div className="w-12 h-3 rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
