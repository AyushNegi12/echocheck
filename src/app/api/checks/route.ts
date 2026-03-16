import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeContent } from '@/lib/scoring'
import { z } from 'zod'

const submitSchema = z.object({
  url: z.string().url(),
})

// GET /api/checks — fetch feed
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') || 'all'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 10

  const where: any = {}
  if (filter === 'trending') where.isTrending = true
  if (filter === 'signal') where.isSignalFeed = true
  if (filter === 'scam') where.verdict = 'SCAM'

  const [checks, total] = await Promise.all([
    prisma.check.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { votes: true } },
        votes: { select: { isReal: true } },
      },
    }),
    prisma.check.count({ where }),
  ])

  return NextResponse.json({ checks, total, page, pages: Math.ceil(total / limit) })
}

// POST /api/checks — submit URL for analysis
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Free plan: 5 checks/day limit
  if (user.plan === 'FREE') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayChecks = await prisma.check.count({
      where: { submittedBy: user.id, createdAt: { gte: today } },
    })
    if (todayChecks >= 5) {
      return NextResponse.json(
        { error: 'Daily limit reached. Upgrade to Pro for unlimited checks.' },
        { status: 429 }
      )
    }
  }

  try {
    const body = await req.json()
    const { url } = submitSchema.parse(body)

    // Check if URL already analyzed
    const existing = await prisma.check.findFirst({ where: { url } })
    if (existing) {
      await prisma.check.update({
        where: { id: existing.id },
        data: { checkCount: { increment: 1 } },
      })
      return NextResponse.json(existing)
    }

    const analysis = await analyzeContent(url)
    const check = await prisma.check.create({
      data: {
        url,
        title: analysis.title,
        platform: analysis.platform,
        category: analysis.category,
        aiScore: analysis.score,
        verdict: analysis.verdict,
        signals: analysis.signals,
        submittedBy: user.id,
        checkCount: 1,
      },
    })

    return NextResponse.json(check, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 422 })
    }
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
