'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Chrome } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Registration failed')
        return
      }
      toast.success('Account created! Signing you in...')
      await signIn('credentials', { email, password, callbackUrl: '/onboarding' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.06)_0%,transparent_60%)]" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-auto px-4 py-12"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#A8872A] rounded-xl flex items-center justify-center shadow-gold">
              <span className="text-black font-black text-xl">♛</span>
            </div>
            <span className="font-black text-2xl">
              <span className="gold-text">Chess</span>
              <span className="text-white">Academy</span>
            </span>
          </Link>
        </div>

        <div className="glass-card p-8 border border-white/[0.08]">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-black text-white mb-2">Start your free trial</h1>
            <p className="text-gray-500 text-sm">7 days free, no credit card required</p>
          </div>

          {/* Google */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium transition-all mb-5"
          >
            <Chrome className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-gray-600 text-xs">or create account</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Magnus Carlsen"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 text-sm mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-5 leading-relaxed">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          </p>

          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#D4AF37] hover:text-[#F0C84A] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
