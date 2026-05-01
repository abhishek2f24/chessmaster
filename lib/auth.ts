import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) return null

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            role: true,
            puzzleRating: true,
            currentStreak: true,
            xpPoints: true,
            onboardingDone: true,
            subscription: { select: { plan: true, status: true } },
          },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.puzzleRating = dbUser.puzzleRating
          token.currentStreak = dbUser.currentStreak
          token.xpPoints = dbUser.xpPoints
          token.onboardingDone = dbUser.onboardingDone
          token.plan = dbUser.subscription?.plan ?? 'FREE'
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.puzzleRating = token.puzzleRating as number
        session.user.currentStreak = token.currentStreak as number
        session.user.xpPoints = token.xpPoints as number
        session.user.plan = token.plan as string
      }
      return session
    },
  },
}
