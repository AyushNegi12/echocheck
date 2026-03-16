import type { Metadata } from 'next'
import { Syne, Space_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'EchoCheck — AI Authenticity Score',
  description: 'Know what\'s real. Community + AI scores for every viral Reel, TikTok, and news article.',
  keywords: ['AI detector', 'fake content', 'authenticity', 'social media', 'fact check'],
  openGraph: {
    title: 'EchoCheck',
    description: 'Know what\'s real on social media.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable}`}>
      <body className="bg-bg text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
