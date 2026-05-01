# ChessAcademy Pro

A production-grade, full-stack chess learning SaaS platform — inspired by ChessMood, Chessable, and Chess.com.

## Features

- **Premium Landing Page** — world-class dark theme with hero, features, pricing, testimonials, FAQ, leaderboard preview
- **Authentication** — email/password + Google OAuth (NextAuth), JWT sessions
- **Student Dashboard** — rating graph, stats, daily challenges, recent mistakes, course progress
- **Interactive Puzzle Trainer** — react-chessboard + chess.js, Glicko-inspired ELO engine, wrong/retry system
- **Spaced Repetition** — failed puzzles resurface automatically for reinforcement
- **Course LMS** — structured courses, chapters, lessons, progress tracking, premium gating
- **Tactical ELO System** — custom puzzle rating with speed bonuses
- **Leaderboard** — live rankings by puzzle rating, streak, accuracy
- **Profile** — achievements, subscription, stats
- **Admin CMS** — dashboard, puzzle bulk importer (Lichess CSV), user management
- **Stripe Subscriptions** — Free / Premium Monthly / Premium Yearly with webhooks
- **Daily Challenges** — 4-tier puzzles with bonus XP rewards

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS |
| UI | shadcn/ui components, Framer Motion, Lucide icons |
| Chess | react-chessboard, chess.js |
| State | Zustand |
| Charts | Recharts |
| Backend | Next.js API Routes (serverless) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (credentials + Google) |
| Payments | Stripe subscriptions + webhooks |
| Deployment | Vercel (frontend), Supabase/Railway (DB) |

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.local .env
# Fill in DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_*, STRIPE_*
```

### 3. Set up database
```bash
# Push schema to your PostgreSQL database
npm run db:push

# Seed with sample data (puzzles, courses, users)
npm run db:seed
```

### 4. Run development server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@chessacademy.pro | admin123456 |
| Student | student@example.com | student123 |

## Database Schema

```
users            → chess profile, ELO rating, streak, XP
subscriptions    → Stripe subscription state
puzzles          → FEN + moves + rating + themes
puzzle_attempts  → per-user attempt history + ELO delta
puzzle_rating_history → time-series rating graph data
mistake_reviews  → spaced repetition queue
courses          → structured learning paths
chapters         → course sections
lessons          → individual video/PGN lessons
lesson_progress  → per-user completion state
course_enrollments → enrollment + progress %
achievements     → badge definitions
user_achievements → earned badges
leaderboard_entries → weekly/monthly rankings
announcements    → admin notifications
```

## Puzzle Import (Admin)

Import puzzles from the [Lichess puzzle database](https://database.lichess.org/#puzzles):

1. Download the Lichess CSV (~200MB)
2. Go to `/admin/puzzles/import`
3. Paste CSV lines (PuzzleId,FEN,Moves,Rating,...)
4. Click "Import Puzzles"

The importer handles deduplication via `lichessId`.

## Deployment

### Vercel (Frontend)
```bash
vercel --prod
```
Set all environment variables in Vercel dashboard.

### Database
- **Supabase**: Create project → get connection string → set as `DATABASE_URL`
- **Railway**: Deploy PostgreSQL → connect

### Stripe Webhooks
Set your webhook endpoint to `https://yourdomain.com/api/webhooks/stripe` and listen for:
- `checkout.session.completed`
- `invoice.payment_failed`
- `customer.subscription.deleted`

## Project Structure

```
app/
  (auth)/          → login, register
  (dashboard)/     → dashboard, puzzles, courses, leaderboard, profile
  (admin)/         → admin CMS
  api/             → API routes
  page.tsx         → landing page

components/
  chess/           → PuzzleTrainer, ChessBoard
  landing/         → Hero, Features, Pricing, etc.
  layout/          → Navbar, Sidebar, Footer

lib/
  auth.ts          → NextAuth config
  elo.ts           → Glicko ELO engine
  stripe.ts        → Stripe integration
  puzzle-engine.ts → Puzzle matching + spaced repetition

store/
  puzzle-store.ts  → Zustand puzzle state
  user-store.ts    → Zustand user state

prisma/
  schema.prisma    → Database schema
  seed.ts          → Sample data
```
