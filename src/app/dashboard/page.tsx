import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/dashboard')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      _count: { select: { votes: true, submissions: true } },
    },
  })

  if (!user) redirect('/')

  const accuracy = user.totalVotes > 0
    ? Math.round((user.correctVotes / user.totalVotes) * 100)
    : 0

  const progressToBadge = Math.min(100, Math.round((accuracy / 85) * 100))

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">Dashboard</h1>
            <p className="text-sm text-muted">Welcome back, {user.name?.split(' ')[0]}</p>
          </div>
          {user.isTrustedVoice && (
            <span className="px-3 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20 text-xs font-bold">
              ★ Trusted Voice
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Accuracy score', value: `${accuracy}%`, color: 'text-accent' },
            { label: 'Total votes', value: user.totalVotes.toLocaleString(), color: 'text-white' },
            { label: 'Links submitted', value: user._count.submissions.toLocaleString(), color: 'text-white' },
            { label: 'Correct calls', value: user.correctVotes.toLocaleString(), color: 'text-teal' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-white/[0.07] rounded-xl p-4">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Trusted Voice progress */}
        {!user.isTrustedVoice && (
          <div className="bg-surface border border-white/[0.07] rounded-xl p-5 mb-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm font-bold">Progress to Trusted Voice</p>
                <p className="text-xs text-muted mt-0.5">Need 85%+ accuracy on 20+ votes</p>
              </div>
              <span className="text-xs font-bold text-accent">{accuracy}% / 85%</span>
            </div>
            <div className="h-2 bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressToBadge}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #f5c842)',
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {user.totalVotes < 20
                ? `${20 - user.totalVotes} more votes needed to qualify`
                : accuracy < 85
                ? `${85 - accuracy}% more accuracy needed`
                : 'Qualifying soon…'}
            </p>
          </div>
        )}

        {/* Plan & Billing */}
        <div className="bg-surface border border-white/[0.07] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold">Your plan</p>
              <p className="text-xs text-muted mt-0.5">
                {user.plan === 'FREE' ? 'Free — 5 checks/day, ads in feed' : `${user.plan} — Unlimited checks, no ads`}
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              user.plan === 'FREE'
                ? 'bg-surface2 text-muted'
                : user.plan === 'CREATOR'
                ? 'bg-teal/10 text-teal border border-teal/20'
                : 'bg-accent/10 text-accent border border-accent/20'
            }`}>
              {user.plan}
            </span>
          </div>

          {user.subscription && (
            <div className="border-t border-white/[0.06] pt-4 text-xs text-muted space-y-1">
              <div className="flex justify-between">
                <span>Renewal date</span>
                <span>{new Date(user.subscription.stripeCurrentPeriodEnd).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-accent">{user.subscription.status}</span>
              </div>
            </div>
          )}

          {user.plan === 'FREE' && (
            <Link
              href="/pricing"
              className="mt-4 block text-center bg-accent text-bg text-xs font-bold py-2.5 rounded-lg hover:opacity-90"
            >
              Upgrade to Pro — ₹299/mo
            </Link>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/feed" className="bg-surface border border-white/[0.07] rounded-xl p-4 hover:border-white/20 transition-colors">
            <p className="text-sm font-bold mb-1">Browse feed</p>
            <p className="text-xs text-muted">Vote on checks to improve your accuracy</p>
          </Link>
          <Link href="/submit" className="bg-surface border border-white/[0.07] rounded-xl p-4 hover:border-white/20 transition-colors">
            <p className="text-sm font-bold mb-1">Submit a link</p>
            <p className="text-xs text-muted">Get an instant authenticity score</p>
          </Link>
        </div>
      </main>
    </>
  )
}
