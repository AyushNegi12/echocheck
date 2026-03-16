import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 })
  }

  const { isReal } = await req.json()
  const checkId = params.id

  const check = await prisma.check.findUnique({ where: { id: checkId } })
  if (!check) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Upsert vote
  const vote = await prisma.vote.upsert({
    where: { userId_checkId: { userId: session.user.id, checkId } },
    update: { isReal },
    create: { userId: session.user.id, checkId, isReal },
  })

  // Update community score
  const votes = await prisma.vote.findMany({ where: { checkId } })
  const realVotes = votes.filter(v => v.isReal).length
  const communityScore = Math.round((realVotes / votes.length) * 100)

  await prisma.check.update({
    where: { id: checkId },
    data: { communityScore },
  })

  // Update user accuracy (compare vote to AI verdict)
  const isCorrect = isReal === (check.verdict === 'AUTHENTIC')
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      totalVotes: { increment: 1 },
      correctVotes: isCorrect ? { increment: 1 } : undefined,
    },
  })

  // Recalculate accuracy and check for Trusted Voice
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user && user.totalVotes >= 20) {
    const accuracy = (user.correctVotes / user.totalVotes) * 100
    const isTrustedVoice = accuracy >= 85
    await prisma.user.update({
      where: { id: session.user.id },
      data: { accuracyScore: accuracy, isTrustedVoice },
    })
  }

  return NextResponse.json({ vote, communityScore })
}
