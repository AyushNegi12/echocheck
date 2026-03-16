'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import CheckCard from '@/components/CheckCard'
import Link from 'next/link'

export default function SubmitPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user) { router.push('/auth/signin'); return }
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Analysis failed')
        if (res.status === 429) {
          setError('Daily limit reached. Upgrade to Pro for unlimited checks.')
        }
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const EXAMPLES = [
    'https://www.instagram.com/reel/...',
    'https://www.tiktok.com/@user/video/...',
    'https://youtube.com/shorts/...',
    'https://twitter.com/user/status/...',
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold mb-3">Check any link</h1>
          <p className="text-muted text-sm">Paste a Reel, TikTok, YouTube Short, or article. Get an authenticity score in seconds.</p>
        </div>

        {/* Limit notice for free users */}
        {session?.user && (session.user as any).plan === 'FREE' && (
          <div className="bg-surface2 border border-white/[0.07] rounded-xl p-3 flex items-center justify-between mb-6 text-xs">
            <span className="text-muted">Free plan: 5 checks/day</span>
            <Link href="/pricing" className="text-accent font-semibold hover:underline">Upgrade for unlimited →</Link>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="flex-1 bg-surface border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/50 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="bg-accent text-bg font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 text-sm whitespace-nowrap"
            >
              {loading ? 'Analyzing...' : 'Check it'}
            </button>
          </div>

          {error && (
            <div className="mt-3 text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5 flex items-center justify-between">
              <span>{error}</span>
              {error.includes('Upgrade') && (
                <Link href="/pricing" className="font-bold underline ml-2">Upgrade</Link>
              )}
            </div>
          )}
        </form>

        {/* Loading state */}
        {loading && (
          <div className="bg-surface border border-white/[0.07] rounded-xl p-8 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full border-2 border-accent/20 border-t-accent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium mb-1">Analyzing content…</p>
            <p className="text-xs text-muted">Checking platform signals, AI patterns, and claim verifiability</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="animate-slide-up">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Analysis result</p>
            <CheckCard check={result} />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { setResult(null); setUrl('') }}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm text-muted hover:text-white transition-colors"
              >
                Check another
              </button>
              <Link
                href="/feed"
                className="flex-1 text-center py-2.5 rounded-xl bg-surface2 text-sm text-white hover:bg-surface transition-colors"
              >
                View full feed
              </Link>
            </div>
          </div>
        )}

        {/* Example links */}
        {!result && !loading && (
          <div className="mt-8">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Supported platforms</p>
            <div className="flex flex-col gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setUrl(ex)}
                  className="text-left text-xs text-muted bg-surface border border-white/[0.06] rounded-lg px-4 py-2.5 hover:border-white/20 hover:text-white transition-colors font-mono"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
