import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4">

        {/* Hero */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            1.2M content checks today
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-slide-up">
            Know what's real.<br />
            <span className="text-accent">Before everyone else.</span>
          </h1>

          <p className="text-lg text-muted max-w-xl mx-auto mb-10 animate-slide-up delay-100">
            Community + AI assigns an authenticity score to every viral Reel, TikTok, and article. Earn your Trusted Voice badge and get trend alerts 24 hours early.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up delay-200">
            <Link
              href="/feed"
              className="bg-accent text-bg font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Browse the feed
            </Link>
            <Link
              href="/submit"
              className="border border-white/[0.12] text-white font-semibold px-8 py-3 rounded-xl hover:bg-surface2 transition-colors text-sm"
            >
              Check a link
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20 animate-slide-up delay-300">
          {[
            { num: '1.2M', label: 'Checks today' },
            { num: '61%', label: 'AI-generated content' },
            { num: '94K', label: 'Trusted Voices' },
            { num: '24h', label: 'Early trend access' },
          ].map(({ num, label }) => (
            <div key={label} className="bg-surface border border-white/[0.07] rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-accent">{num}</p>
              <p className="text-xs text-muted mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="text-2xl font-extrabold mb-2 text-center">How it works</h2>
          <p className="text-muted text-center text-sm mb-10">Three steps to truth</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Paste any link', desc: 'Reel, TikTok, YouTube Short, or news article. We analyze the content instantly.' },
              { step: '02', title: 'AI + community score', desc: 'Our AI flags signals. The community votes. You get a combined authenticity score.' },
              { step: '03', title: 'Earn your badge', desc: 'Vote accurately enough and you join the top 5% — with early access to what\'s about to go viral.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-surface border border-white/[0.07] rounded-xl p-6">
                <p className="text-4xl font-extrabold text-white/10 mb-3">{step}</p>
                <p className="font-bold text-sm mb-2">{title}</p>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trusted Voice CTA */}
        <section className="mb-20 rounded-2xl border border-gold/20 bg-gradient-to-br from-purple/10 to-gold/5 p-8 md:p-12 text-center">
          <span className="text-3xl mb-4 block">★</span>
          <h2 className="text-2xl font-extrabold mb-3">Become a Trusted Voice</h2>
          <p className="text-muted text-sm max-w-md mx-auto mb-6">
            Top 5% of accurate truth-spotters get access to the private Signal Feed — viral trends before they hit mainstream.
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-gold text-bg font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Start earning your badge
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.07] py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© 2026 EchoCheck. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/feed" className="hover:text-white transition-colors">Feed</Link>
            <a href="mailto:hello@echocheck.app" className="hover:text-white transition-colors">Contact</a>
          </div>
        </footer>
      </main>
    </>
  )
}
