import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Navbar } from '@/components/layout/Navbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile navbar */}
        <div className="lg:hidden">
          <Navbar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:pt-8 pt-20 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  )
}
