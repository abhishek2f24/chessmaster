import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const samplePuzzles = [
  {
    lichessId: 'lichess_001',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    moves: ['c4f7', 'e8f7', 'd1d5'],
    rating: 1200,
    themes: ['FORK' as any],
    openingTags: ['Italian'],
    popularity: 1500,
  },
  {
    lichessId: 'lichess_002',
    fen: '2r3k1/pp3ppp/2p5/4n3/4Q3/2P5/PP3PPP/4R1K1 b - - 0 1',
    moves: ['e5c4', 'e4c4', 'c8c4'],
    rating: 1400,
    themes: ['PIN' as any],
    openingTags: [],
    popularity: 1200,
  },
  {
    lichessId: 'lichess_003',
    fen: 'r2qk2r/ppp2ppp/2n1bn2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 0 1',
    moves: ['c4f7', 'e8f7', 'f3g5', 'f7e8', 'd1h5'],
    rating: 1600,
    themes: ['SACRIFICE' as any, 'MATING_NET' as any],
    openingTags: ['Giuoco Piano'],
    popularity: 2100,
  },
  {
    lichessId: 'lichess_004',
    fen: 'r1bqkbnr/ppp2ppp/2np4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1',
    moves: ['f1b5', 'c6d4', 'f3d4', 'e5d4', 'b5d7'],
    rating: 1100,
    themes: ['FORK' as any, 'DEFLECTION' as any],
    openingTags: ['Spanish Opening'],
    popularity: 900,
  },
  {
    lichessId: 'lichess_005',
    fen: '6k1/5ppp/8/3B4/8/8/5PPP/6K1 w - - 0 1',
    moves: ['d5f7', 'g8f7', 'f2f4'],
    rating: 900,
    themes: ['ENDGAME' as any],
    openingTags: [],
    popularity: 700,
  },
  {
    lichessId: 'lichess_006',
    fen: 'r3k2r/ppp2ppp/2nqbn2/3pp3/3PP3/2NQB3/PPP2PPP/R3K2R w KQkq - 0 1',
    moves: ['d3h7', 'f6h7', 'e3h6'],
    rating: 1800,
    themes: ['SACRIFICE' as any, 'ATTRACTION' as any],
    openingTags: [],
    popularity: 800,
  },
  {
    lichessId: 'lichess_007',
    fen: '4r1k1/ppp2ppp/8/3R4/8/2P5/PP3PPP/4R1K1 w - - 0 1',
    moves: ['d5d8', 'e8d8', 'e1e8'],
    rating: 1000,
    themes: ['BACK_RANK' as any, 'DOUBLE_CHECK' as any],
    openingTags: [],
    popularity: 1800,
  },
  {
    lichessId: 'lichess_008',
    fen: 'r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N2NP1/PPQ1PPBP/R1B2RK1 b - - 0 1',
    moves: ['d5c4', 'c3d5', 'c6d4'],
    rating: 1500,
    themes: ['FORK' as any, 'ZWISCHENZUG' as any],
    openingTags: ['Catalan'],
    popularity: 600,
  },
  {
    lichessId: 'lichess_009',
    fen: 'r4rk1/ppp2ppp/8/3q4/8/2P5/PP3PPP/R2Q1RK1 b - - 0 1',
    moves: ['d5h1', 'f1h1', 'f8f1'],
    rating: 1350,
    themes: ['SKEWER' as any, 'DEFLECTION' as any],
    openingTags: [],
    popularity: 1100,
  },
  {
    lichessId: 'lichess_010',
    fen: '6k1/R7/6K1/8/8/8/8/8 w - - 0 1',
    moves: ['a7a8', 'g8h7', 'g6f7', 'h7h6', 'a8h8'],
    rating: 800,
    themes: ['ENDGAME' as any, 'MATING_NET' as any],
    openingTags: [],
    popularity: 2500,
  },
]

const sampleCourses = [
  {
    slug: 'crushing-openings-white',
    title: 'Crushing Openings as White',
    description: 'Master the most powerful openings for White, including the Ruy Lopez, Italian Game, and London System. Build a solid, attacking repertoire that wins at every level.',
    instructorName: 'GM Alexander Petrov',
    category: 'Openings',
    level: 'INTERMEDIATE' as any,
    ratingMin: 1000,
    ratingMax: 1800,
    isPremium: true,
    isPublished: true,
    totalLessons: 24,
    totalHours: 9.5,
    rating: 4.9,
    enrollments: 3420,
    tags: ['openings', 'white', 'ruy-lopez', 'italian'],
    order: 1,
    chapters: [
      {
        title: 'Chapter 1: The Ruy Lopez',
        order: 1,
        lessons: [
          { title: 'Introduction to the Ruy Lopez', duration: 2400, isFree: true, order: 1 },
          { title: 'The Berlin Defense', duration: 3600, isFree: false, order: 2 },
          { title: 'The Morphy Defense', duration: 2800, isFree: false, order: 3 },
          { title: 'Attacking the Kingside', duration: 3200, isFree: false, order: 4 },
        ],
      },
      {
        title: 'Chapter 2: The Italian Game',
        order: 2,
        lessons: [
          { title: 'Giuoco Piano Basics', duration: 2100, isFree: true, order: 1 },
          { title: 'Evans Gambit', duration: 2700, isFree: false, order: 2 },
          { title: 'Two Knights Defense', duration: 3100, isFree: false, order: 3 },
        ],
      },
    ],
  },
  {
    slug: 'tactical-patterns-masterclass',
    title: 'Tactical Patterns Masterclass',
    description: 'Become a tactical monster! Learn 15 essential patterns that appear in 80% of all chess games. Train your tactical vision to see combinations instantly.',
    instructorName: 'IM Viktor Kozlov',
    category: 'Tactics',
    level: 'INTERMEDIATE' as any,
    ratingMin: 1200,
    ratingMax: 2000,
    isPremium: true,
    isPublished: true,
    totalLessons: 32,
    totalHours: 14,
    rating: 4.8,
    enrollments: 5680,
    tags: ['tactics', 'patterns', 'combinations'],
    order: 2,
    chapters: [
      {
        title: 'Chapter 1: Pins and Skewers',
        order: 1,
        lessons: [
          { title: 'Absolute and Relative Pins', duration: 1800, isFree: true, order: 1 },
          { title: 'Skewer Attacks', duration: 2200, isFree: false, order: 2 },
          { title: 'Practice: 20 Pin Puzzles', duration: 1500, isFree: false, order: 3 },
        ],
      },
      {
        title: 'Chapter 2: Forks',
        order: 2,
        lessons: [
          { title: 'Knight Forks', duration: 2400, isFree: true, order: 1 },
          { title: 'Pawn Forks', duration: 1900, isFree: false, order: 2 },
          { title: 'Fork Setups', duration: 2100, isFree: false, order: 3 },
        ],
      },
    ],
  },
  {
    slug: 'endgame-essentials',
    title: 'Endgame Essentials for Club Players',
    description: 'Win won endgames and save lost ones. Covers rook endgames, pawn endgames, piece activity, and the most important theoretical positions every player must know.',
    instructorName: 'FM Priya Sharma',
    category: 'Endgame',
    level: 'BEGINNER' as any,
    ratingMin: 800,
    ratingMax: 1600,
    isPremium: false,
    isPublished: true,
    totalLessons: 20,
    totalHours: 8,
    rating: 4.9,
    enrollments: 8920,
    tags: ['endgame', 'rook', 'pawn', 'technique'],
    order: 3,
    chapters: [
      {
        title: 'Chapter 1: King and Pawn Endgames',
        order: 1,
        lessons: [
          { title: 'Opposition Basics', duration: 1500, isFree: true, order: 1 },
          { title: 'The Square Rule', duration: 1800, isFree: true, order: 2 },
          { title: 'Passed Pawns', duration: 2200, isFree: false, order: 3 },
        ],
      },
    ],
  },
  {
    slug: 'middlegame-strategy',
    title: 'Middlegame Strategy & Planning',
    description: 'Think like a grandmaster. Master pawn structures, piece activity, prophylaxis, and long-term planning that separates club players from tournament winners.',
    instructorName: 'GM David Holenstein',
    category: 'Strategy',
    level: 'ADVANCED' as any,
    ratingMin: 1400,
    ratingMax: 2200,
    isPremium: true,
    isPublished: true,
    totalLessons: 28,
    totalHours: 12,
    rating: 4.7,
    enrollments: 2140,
    tags: ['strategy', 'planning', 'pawn-structure'],
    order: 4,
    chapters: [
      {
        title: 'Chapter 1: Pawn Structures',
        order: 1,
        lessons: [
          { title: 'Isolated Queen Pawn', duration: 2400, isFree: true, order: 1 },
          { title: 'Hanging Pawns', duration: 2700, isFree: false, order: 2 },
          { title: 'Pawn Majorities', duration: 2100, isFree: false, order: 3 },
        ],
      },
    ],
  },
]

const sampleAchievements = [
  { name: 'First Move', description: 'Solve your first puzzle', icon: '⚡', xpReward: 50, condition: 'puzzles_solved >= 1' },
  { name: 'Tactical Eye', description: 'Solve 10 puzzles', icon: '🎯', xpReward: 100, condition: 'puzzles_solved >= 10' },
  { name: 'Fork Hunter', description: 'Solve 5 fork puzzles', icon: '⚔️', xpReward: 150, condition: 'fork_puzzles >= 5' },
  { name: 'Pin Master', description: 'Solve 5 pin puzzles', icon: '📌', xpReward: 150, condition: 'pin_puzzles >= 5' },
  { name: 'Tactical Monster', description: 'Solve 100 puzzles', icon: '👹', xpReward: 500, condition: 'puzzles_solved >= 100' },
  { name: 'Endgame Ninja', description: 'Solve 20 endgame puzzles', icon: '🥷', xpReward: 300, condition: 'endgame_puzzles >= 20' },
  { name: 'Hot Streak', description: 'Achieve a 10-puzzle streak', icon: '🔥', xpReward: 200, condition: 'max_streak >= 10' },
  { name: 'Speed Demon', description: 'Solve a puzzle in under 5 seconds', icon: '⚡', xpReward: 250, condition: 'fast_solve' },
  { name: 'Scholar', description: 'Complete your first course', icon: '🎓', xpReward: 400, condition: 'courses_completed >= 1' },
  { name: 'Knight Trainer', description: 'Reach 1000 puzzle rating', icon: '♞', xpReward: 500, condition: 'puzzle_rating >= 1000' },
  { name: 'Bishop Player', description: 'Reach 1200 puzzle rating', icon: '♝', xpReward: 750, condition: 'puzzle_rating >= 1200' },
  { name: 'Rook Wielder', description: 'Reach 1400 puzzle rating', icon: '♜', xpReward: 1000, condition: 'puzzle_rating >= 1400' },
  { name: 'Queen Power', description: 'Reach 1600 puzzle rating', icon: '♛', xpReward: 1500, condition: 'puzzle_rating >= 1600' },
  { name: 'Back Rank Expert', description: 'Solve 10 back rank mate puzzles', icon: '🏰', xpReward: 200, condition: 'back_rank_puzzles >= 10' },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Achievements
  for (const achievement of sampleAchievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      create: achievement,
      update: achievement,
    })
  }
  console.log('✅ Achievements seeded')

  // Puzzles
  for (const puzzle of samplePuzzles) {
    await prisma.puzzle.upsert({
      where: { lichessId: puzzle.lichessId },
      create: puzzle,
      update: puzzle,
    })
  }
  console.log('✅ Puzzles seeded')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@chessacademy.pro' },
    create: {
      name: 'Admin',
      email: 'admin@chessacademy.pro',
      password: adminPassword,
      role: 'ADMIN',
      puzzleRating: 2000,
      subscription: { create: { plan: 'PREMIUM_YEARLY', status: 'ACTIVE' } },
    },
    update: {},
  })
  console.log('✅ Admin user created: admin@chessacademy.pro / admin123456')

  // Demo student
  const studentPassword = await bcrypt.hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    create: {
      name: 'Alex Fischer',
      email: 'student@example.com',
      password: studentPassword,
      puzzleRating: 1247,
      puzzleRatingBest: 1380,
      totalPuzzlesSolved: 342,
      totalPuzzlesAttempted: 410,
      currentStreak: 7,
      longestStreak: 23,
      xpPoints: 8450,
      level: 5,
      onboardingDone: true,
      skillLevel: 'intermediate',
      goal: 'improve_tactics',
      subscription: { create: { plan: 'PREMIUM_MONTHLY', status: 'ACTIVE' } },
    },
    update: {},
  })
  console.log('✅ Demo student created: student@example.com / student123')

  // Courses with chapters and lessons
  for (const courseData of sampleCourses) {
    const { chapters, ...courseFields } = courseData
    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      create: courseFields,
      update: { ...courseFields },
    })

    for (const chapterData of chapters) {
      const { lessons, ...chapterFields } = chapterData
      const chapter = await prisma.chapter.create({
        data: { ...chapterFields, courseId: course.id },
      }).catch(() => prisma.chapter.findFirst({ where: { courseId: course.id, order: chapterFields.order } })) as any

      if (chapter) {
        for (const lessonData of lessons) {
          await prisma.lesson.upsert({
            where: { id: `${chapter.id}_${lessonData.order}` },
            create: { ...lessonData, chapterId: chapter.id, isPremium: !lessonData.isFree, id: `${chapter.id}_${lessonData.order}` },
            update: { ...lessonData },
          }).catch(() => null)
        }
      }
    }
  }
  console.log('✅ Courses seeded')

  // Rating history for demo student
  const now = Date.now()
  for (let i = 29; i >= 0; i--) {
    await prisma.puzzleRatingHistory.create({
      data: {
        userId: student.id,
        rating: Math.round(800 + (29 - i) * 15 + Math.random() * 30 - 10),
        date: new Date(now - i * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log('✅ Rating history seeded')

  // Achievements for demo student
  const achievements = await prisma.achievement.findMany({ take: 4 })
  for (const achievement of achievements) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: student.id, achievementId: achievement.id } },
      create: { userId: student.id, achievementId: achievement.id },
      update: {},
    })
  }

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📋 Test accounts:')
  console.log('  Admin:   admin@chessacademy.pro  /  admin123456')
  console.log('  Student: student@example.com     /  student123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
