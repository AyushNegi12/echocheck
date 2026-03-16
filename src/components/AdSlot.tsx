'use client'
import { useEffect } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
  label?: string
}

export default function AdSlot({ slot, format = 'auto', className = '', label = 'Advertisement' }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (clientId && clientId !== 'ca-pub-your-adsense-id') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }
  }, [clientId])

  // Show placeholder until AdSense is configured
  if (!clientId || clientId === 'ca-pub-your-adsense-id') {
    return (
      <div className={`ad-slot ${className}`} style={{ minHeight: format === 'horizontal' ? 90 : 250 }}>
        <span>{label} — AdSense slot {slot}</span>
      </div>
    )
  }

  return (
    <div className={className}>
      <p className="text-[10px] text-white/20 text-center mb-1">{label}</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
