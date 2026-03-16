export interface ScoringResult {
  score: number
  verdict: 'AUTHENTIC' | 'AI_GENERATED' | 'MIXED' | 'SCAM' | 'TRENDING'
  signals: string[]
  platform: string
  category: string
  title: string
}

// Simulates AI analysis — replace with real AI API (OpenAI, Anthropic, etc.)
export async function analyzeContent(url: string): Promise<ScoringResult> {
  await new Promise(r => setTimeout(r, 1200)) // Simulate API call

  const platform = detectPlatform(url)
  const mockResults = generateMockAnalysis(url, platform)
  return mockResults
}

function detectPlatform(url: string): string {
  if (url.includes('instagram')) return 'Instagram Reel'
  if (url.includes('tiktok')) return 'TikTok'
  if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube Short'
  if (url.includes('twitter') || url.includes('x.com')) return 'X/Twitter'
  if (url.includes('facebook')) return 'Facebook'
  return 'Web Article'
}

function generateMockAnalysis(url: string, platform: string): ScoringResult {
  // In production: call OpenAI / Anthropic API with the URL content
  const hash = url.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const score = ((hash % 80) + 10)
  
  let verdict: ScoringResult['verdict']
  let signals: string[]
  let category: string
  let title: string

  if (score < 30) {
    verdict = 'AI_GENERATED'
    signals = ['AI voiceover detected', 'Stock footage only', 'No verifiable claims', 'Affiliate links']
    category = 'Passive Income'
    title = 'Make $5,000/day with this secret AI method nobody talks about'
  } else if (score < 50) {
    verdict = 'SCAM'
    signals = ['Unverified testimonials', 'High-pressure CTA', 'No credentials shown', 'MLM pattern']
    category = 'Finance'
    title = 'This investment strategy changed my life — guaranteed returns'
  } else if (score < 70) {
    verdict = 'MIXED'
    signals = ['Real person verified', 'Some claims unverifiable', 'Affiliate links detected']
    category = 'Life Hack'
    title = 'Morning routine that boosted my productivity by 300%'
  } else {
    verdict = 'AUTHENTIC'
    signals = ['Verified creator', 'Sources cited', 'Real environment', 'No AI voice detected']
    category = 'Education'
    title = 'Researcher shares new findings from 5-year study'
  }

  return { score, verdict, signals, platform, category, title }
}

export function getVerdictColor(verdict: string) {
  const map: Record<string, string> = {
    AUTHENTIC: '#c8f542',
    AI_GENERATED: '#ff5c5c',
    MIXED: '#f5c842',
    SCAM: '#ff5c5c',
    TRENDING: '#22d3c8',
    PENDING: '#7a7a9a',
  }
  return map[verdict] || '#7a7a9a'
}

export function getVerdictLabel(verdict: string) {
  const map: Record<string, string> = {
    AUTHENTIC: 'Authentic Human Voice',
    AI_GENERATED: 'AI-Generated Content',
    MIXED: 'Mixed Signals',
    SCAM: 'Likely Scam',
    TRENDING: 'Breaking Trend',
    PENDING: 'Pending Review',
  }
  return map[verdict] || 'Unknown'
}
