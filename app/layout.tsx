import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ChessAcademy Pro — Train Like a Grandmaster',
    template: '%s | ChessAcademy Pro',
  },
  description:
    'Premium chess learning platform with interactive courses, unlimited tactical puzzles, and structured improvement plans. Train like a grandmaster.',
  keywords: ['chess', 'chess training', 'chess courses', 'chess puzzles', 'tactics', 'chess academy'],
  openGraph: {
    title: 'ChessAcademy Pro — Train Like a Grandmaster',
    description: 'Premium chess learning platform with interactive courses, unlimited tactical puzzles, and structured improvement plans.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="bg-[#0A0A0F] text-white antialiased min-h-screen">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#16161F',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
