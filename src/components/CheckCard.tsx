'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getVerdictColor, getVerdictLabel } from '@/lib/scoring'

interface Check {
  id: string
  url: string
  title: string
  platform: string
  category: string
  aiScore: number
  communityScore?: number
  verdict: string
  signals: string[]
  checkCount: number
  isTrending: boolean
  isSignalFeed: boolean
  createdAt: string
  votes?: { isReal: boolean }[]
  _count?: { votes: number }
}

interface Props {
  check: Check
  locked?: boolean
}

export default function CheckCard({ check, locked }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [voted, setVoted] = useState<'real' | 'fake' | null>(null)
  const [loading, setLoading] = useState(false)

  const color = getVerdictColor(check.verdict)
  const label = getVerdictLabel(check.verdict)
  const score = Math.round(check.aiScore)
  const circumference = 125.6
  const offset = circumference - (score / 100) * circumference

  const accentColors: Record<string, string> = {
    AUTHENTIC: '#c8f542',
    AI_GENERATED: '#ff5c5c',
    SCAM: '#ff5c5c',
    MIXED: '#f5c842',
    TRENDING: '#22d3c8',
    PENDING: '#7a7a9a',
  }
  const accentColor = accentColors[check.verdict] || '#7a7a9a'

  const badgeClass: Record<string, string> = {
    AUTHENTIC: 'badge-authentic',
    AI_GENERATED: 'badge-ai',
    SCAM: 'badge-scam',
    MIXED: 'badge-mixed',
    TRENDING: 'badge-trending',
    PENDING: 'badge-pending',
  }

  async function handleVote(isReal: boolean) {
    if (!session?.user) { router.push('/auth/signin'); return }
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/checks/${check.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReal }),
      })
      if (res.ok) setVoted(isReal ? 'real' : 'fake')
    } finally {
      setLoading(false)
    }
  }

  if (locked) {
    return (
      <div className="relative rounded-xl border border-white/[0.07] bg-surface overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-bg/70 z-10 flex flex-col items-center justify-center gap-3">
          <span className="text-2xl">★</span>
          <p className="text-sm font-semibold text-gold">Trusted Voice Feed</p>
          <p className="text-xs text-muted text-center px-6">Top 5% accuracy unlocks this early-signal feed</p>
          <button
            onClick={() => router.push('/pricing')}
            className="mt-1 text-xs bg-accent text-bg font-bold px-4 py-2 rounded-lg hover:opacity-90"
          >
            Upgrade to unlock
          </button>
        </div>
        <div className="opacity-20 p-4 select-none pointer-events-none">
          <div className="h-4 bg-surface2 rounded w-3/4 mb-2" />
          <div className="h-4 bg-surface2 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <article className="rounded-xl border border-white/[0.07] bg-surface overflow-hidden hover:border-white/[0.12] transition-colors animate-slide-up">
      {/* Accent bar */}
      <div className="h-[3px]" style={{ background: accentColor }} />

      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-surface2 text-muted border border-white/[0.06]">
                {check.platform}
              </span>
              <span className="text-[11px] text-muted">{check.category}</span>
              {check.isTrending && (
                <span className="text-[11px] font-bold text-teal">↑ Trending</span>
              )}
            </div>
            <p className="text-sm font-medium leading-snug line-clamp-2">{check.title}</p>
          </div>

          {/* Score ring */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <circle
                cx="24" cy="24" r="20" fill="none"
                stroke={color} strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold" style={{ color }}>
              {score}
            </div>
          </div>
        </div>

        {/* Verdict badge */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3 ${badgeClass[check.verdict] || 'badge-pending'}`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
          {label}
        </div>

        {/* Signals */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {check.signals.map((s, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-surface2 text-muted">
              {s}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex gap-2">
            <button
              onClick={() => handleVote(true)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                voted === 'real'
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'border-white/[0.08] text-muted hover:text-white hover:border-white/20'
              }`}
            >
              ✓ Real
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                voted === 'fake'
                  ? 'bg-danger/10 text-danger border-danger/30'
                  : 'border-white/[0.08] text-muted hover:text-white hover:border-white/20'
              }`}
            >
              ✕ Fake
            </button>
          </div>
          <span className="text-[11px] text-muted">
            {(check._count?.votes || 0).toLocaleString()} checks
          </span>
        </div>
      </div>
    </article>
  )
}
