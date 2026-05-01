import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="border-b border-white/[0.06] bg-[#0D0D14] px-6 py-3 flex items-center gap-3">
        <div className="w-7 h-7 bg-gradient-to-br from-[#D4AF37] to-[#A8872A] rounded-lg flex items-center justify-center">
          <span className="text-black font-black text-sm">♛</span>
        </div>
        <span className="font-black text-sm text-white">Admin Panel</span>
        <span className="ml-2 text-xs text-gray-500">ChessAcademy Pro</span>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
