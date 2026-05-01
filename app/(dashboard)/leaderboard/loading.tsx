export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="w-36 h-7 rounded-lg bg-white/[0.06] mb-2 animate-pulse" />
        <div className="w-56 h-4 rounded bg-white/[0.04] animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`flex flex-col items-center ${i !== 1 ? 'mt-8' : ''}`}>
            <div className="w-14 h-14 rounded-full bg-white/[0.08] animate-pulse mb-2" />
            <div className="w-20 h-4 rounded bg-white/[0.06] animate-pulse mb-1" />
            <div className={`w-full rounded-t-xl bg-white/[0.04] animate-pulse ${i === 1 ? 'h-36' : 'h-28'} mt-2`} />
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-[#111118] border border-white/[0.04] animate-pulse" />
        ))}
      </div>
    </div>
  )
}
