'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Crown, Zap, BookOpen, Trophy, User, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Courses', href: '/courses', icon: BookOpen },
  { label: 'Puzzles', href: '/puzzles', icon: Zap },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
]

export function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0A0A0F]/95 backdrop-blur-md border-b border-white/[0.06] shadow-premium'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#A8872A] rounded-lg flex items-center justify-center shadow-gold">
                <span className="text-black font-black text-lg leading-none">♛</span>
              </div>
            </div>
            <span className="font-black text-xl tracking-tight">
              <span className="gold-text">Chess</span>
              <span className="text-white">Academy</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150 text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                {/* Rating badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-bold">{session.user.puzzleRating ?? 800}</span>
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8872A] flex items-center justify-center text-black text-xs font-bold">
                      {session.user.name?.charAt(0) ?? 'U'}
                    </div>
                    <span className="text-sm text-gray-300">{session.user.name?.split(' ')[0]}</span>
                    <ChevronDown className={cn('w-3.5 h-3.5 text-gray-500 transition-transform', profileOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-[#16161F] border border-white/[0.08] rounded-xl shadow-premium overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-sm font-semibold text-white">{session.user.name}</p>
                          <p className="text-xs text-gray-500">{session.user.email}</p>
                          {session.user.plan !== 'FREE' && (
                            <div className="flex items-center gap-1 mt-1">
                              <Crown className="w-3 h-3 text-[#D4AF37]" />
                              <span className="text-xs text-[#D4AF37] font-medium">Premium</span>
                            </div>
                          )}
                        </div>
                        <div className="p-1.5">
                          <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            <User className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                          {session.user.role === 'ADMIN' && (
                            <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                              <Crown className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                          <hr className="my-1 border-white/[0.06]" />
                          <button
                            onClick={() => { signOut({ callbackUrl: '/' }); setProfileOpen(false) }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" prefetch={true} className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
                  Sign in
                </Link>
                <Link href="/register" prefetch={true} className="btn-gold text-sm py-2 px-5">
                  Start Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-[#0A0A0F]/98 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <hr className="border-white/[0.06] my-2" />
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5">
                    <User className="w-5 h-5" /> Dashboard
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 w-full">
                    <LogOut className="w-5 h-5" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-center text-gray-300 hover:text-white">
                    Sign in
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="block btn-gold text-center">
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
