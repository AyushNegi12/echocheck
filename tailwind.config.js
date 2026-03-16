/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        surface2: '#1a1a24',
        border: 'rgba(255,255,255,0.07)',
        border2: 'rgba(255,255,255,0.12)',
        accent: '#c8f542',
        'accent-dim': 'rgba(200,245,66,0.1)',
        muted: '#7a7a9a',
        danger: '#ff5c5c',
        gold: '#f5c842',
        teal: '#22d3c8',
        purple: '#7c3aed',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s infinite',
        'fade-in': 'fade-in 0.4s ease forwards',
        'slide-up': 'slide-up 0.4s ease forwards',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.8)' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
