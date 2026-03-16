'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import CheckCard from '@/components/CheckCard'
import AdSlot from '@/components/AdSlot'
import Link from 'next/link'

const FILTERS = [
  { key: 'all',      label: 'All Checks' },
  { key: 'trending', label: 'Trending' },
  { key: 'scam',     label: 'Scam Alerts' },
  { key: 'signal',   label: '★ Signal Feed' },
]

export default function FeedPage() {
  const { data: session } = useSession()
  const [checks, setChecks] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const isTrustedVoice = (session?.user as any)?.isTrustedVoice
  const isPro = ['PRO', 'CREATOR'].includes((session?.user as any)?.plan)

  useEffect(() => {
    setChecks([])
    setPage(1)
    loadChecks(1, filter)
  }, [filter])

  async function loadChecks(p: number, f: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/checks?filter=${f}&page=${p}`)
      const data = await res.json()
      setChecks(prev => p === 1 ? data.checks : [...prev, ...data.checks])
      setTotalPages(data.pages)
    } finally {
      setLoading(false)
    }
  }

  function loadMore() {
    const next = page + 1
    setPage(next)
    loadChecks(next, filter)
  }

  const signalLocked = filter === 'signal' && !isTrustedVoice

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-extrabold">Feed</h1>
                <p className="text-xs text-muted mt-0.5">Community-powered authenticity scores</p>
              </div>
              <Link
                href="/submit"
                className="bg-accent text-bg text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                + Submit link
              </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-1 border-b border-white/[0.07] mb-5 overflow-x-auto">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    filter === f.key
                      ? 'text-accent border-accent'
                      : 'text-muted border-transparent hover:text-white'
                  } ${f.key === 'signal' ? 'text-gold' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Signal feed locked banner */}
            {signalLocked && (
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-6 text-center mb-5">
                <p className="text-2xl mb-2">★</p>
                <p className="font-bold text-gold text-sm mb-1">Trusted Voice Signal Feed</p>
                <p className="text-xs text-muted mb-4 max-w-sm mx-auto">
                  Achieve 85%+ accuracy on 20+ votes to unlock the early-trend feed. Or upgrade to Pro to fast-track access.
                </p>
                <Link href="/pricing" className="text-xs bg-gold text-bg font-bold px-5 py-2 rounded-lg hover:opacity-90">
                  Upgrade to Pro
                </Link>
              </div>
            )}

            {/* Ad slot in feed (every 5 cards) */}
            {loading && checks.length === 0 ? (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-48 rounded-xl bg-surface border border-white/[0.07] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {checks.map((check, i) => (
                  <>
                    <CheckCard
                      key={check.id}
                      check={check}
                      locked={check.isSignalFeed && !isTrustedVoice}
                    />
                    {/* Ad every 5 cards — only for FREE users */}
                    {!isPro && (i + 1) % 5 === 0 && (
                      <AdSlot
                        key={`ad-${i}`}
                        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED || '1234567890'}
                        format="rectangle"
                        className="my-1"
                        label="Sponsored"
                      />
                    )}
                  </>
                ))}

                {checks.length === 0 && !loading && (
                  <div className="text-center py-16 text-muted">
                    <p className="text-4xl mb-3">◎</p>
                    <p className="text-sm">No checks yet for this filter.</p>
                    <Link href="/submit" className="text-accent text-sm mt-2 inline-block">Submit the first one →</Link>
                  </div>
                )}

                {page < totalPages && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="mt-2 w-full py-3 rounded-xl border border-white/[0.08] text-sm text-muted hover:text-white hover:border-white/20 transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
            {/* User stats */}
            {session?.user && (
              <div className="bg-surface border border-white/[0.07] rounded-xl p-4">
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Your stats</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Accuracy</span>
                    <span className="font-bold text-accent">{Math.round((session.user as any).accuracyScore || 0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Status</span>
                    <span className={`font-bold ${isTrustedVoice ? 'text-gold' : 'text-muted'}`}>
                      {isTrustedVoice ? '★ Trusted Voice' : 'Building rep'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Plan</span>
                    <span className="font-bold">{(session.user as any).plan || 'Free'}</span>
                  </div>
                </div>
                {!isTrustedVoice && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-muted mb-1">
                      <span>Progress to Trusted Voice</span>
                      <span>{Math.round((session.user as any).accuracyScore || 0)}%/85%</span>
                    </div>
                    <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (((session.user as any).accuracyScore || 0) / 85) * 100)}%`,
                          background: 'linear-gradient(90deg, #7c3aed, #f5c842)',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upgrade CTA (free users) */}
            {!isPro && (
              <div className="bg-surface border border-accent/20 rounded-xl p-4">
                <p className="text-xs font-bold text-accent mb-2">Go Pro — ₹299/mo</p>
                <ul className="text-xs text-muted space-y-1.5 mb-4">
                  <li>✓ Unlimited checks</li>
                  <li>✓ No ads</li>
                  <li>✓ Signal Feed access</li>
                  <li>✓ Advanced AI reports</li>
                </ul>
                <Link href="/pricing" className="block text-center bg-accent text-bg text-xs font-bold py-2 rounded-lg hover:opacity-90">
                  Upgrade now
                </Link>
              </div>
            )}

            {/* Sidebar ad */}
            {!isPro && (
              <AdSlot
                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '0987654321'}
                format="rectangle"
                className="min-h-[250px]"
              />
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
