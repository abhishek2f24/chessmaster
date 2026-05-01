export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="w-40 h-8 rounded-lg shimmer" />
        </div>
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-8 space-y-4">
          <div className="w-48 h-6 rounded shimmer mx-auto mb-6" />
          <div className="w-full h-12 rounded-xl shimmer" />
          <div className="w-full h-px shimmer" />
          <div className="w-full h-12 rounded-xl shimmer" />
          <div className="w-full h-12 rounded-xl shimmer" />
          <div className="w-full h-12 rounded-xl shimmer" />
          <div className="w-full h-12 rounded-xl shimmer" />
        </div>
      </div>
    </div>
  )
}
