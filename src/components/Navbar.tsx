'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.07] glass">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" />
          EchoCheck
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted">
          <Link href="/feed" className="hover:text-white transition-colors">Feed</Link>
          <Link href="/submit" className="hover:text-white transition-colors">Submit</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          {session?.user && (
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          )}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              {(session.user as any).isTrustedVoice && (
                <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 font-semibold">
                  ★ Trusted Voice
                </span>
              )}
              <span className="text-sm text-muted">{session.user.name?.split(' ')[0]}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-muted hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin" className="text-sm text-muted hover:text-white transition-colors">
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-accent text-bg font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-muted" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {menuOpen
              ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              : <path fillRule="evenodd" d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.07] px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/feed" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white">Feed</Link>
          <Link href="/submit" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white">Submit</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white">Pricing</Link>
          {session?.user
            ? <button onClick={() => signOut()} className="text-left text-muted hover:text-white">Sign out</button>
            : <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white">Sign in</Link>
          }
        </div>
      )}
    </nav>
  )
}
