/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0E14',
        surface: 'rgba(11, 14, 20, 0.45)', // Liquid glass surface
        'surface-elevated': 'rgba(25, 30, 40, 0.65)',
        border: 'rgba(255, 255, 255, 0.08)',
        'accent-green': '#00F2FF', // Buy (Neon Cyan)
        'accent-red': '#FF0055', // Sell (Electric Crimson)
        'accent-blue': '#0055FF',
        'accent-cyan': '#00F2FF',
        'accent-yellow': '#FFD60A',
        'accent-purple': '#BF5AF2',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8A94A6',
        'text-muted': '#4A5568',
        nasdaq: '#0a84ff',
        nyse: '#5e5ce6',
        lse: '#FF0055',
        bse: '#ff9f0a',
        nse: '#00F2FF',
        asx: '#ffd60a',
        tsx: '#ff375f',
        hkex: '#FF0055',
        sse: '#ff375f',
        'nikkei': '#bf5af2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 242, 255, 0.3)',
        'glow-crimson': '0 0 20px rgba(255, 0, 85, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 136, 255, 0.3)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-cyan': 'pulse-cyan 2s infinite',
        'pulse-crimson': 'pulse-crimson 2s infinite',
        ticker: 'ticker 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        shimmer: 'shimmer 2s infinite',
        'count-up': 'count-up 0.5s ease-out',
        'liquid-ripple': 'liquid-ripple 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 242, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 242, 255, 0.8)' },
        },
        'pulse-crimson': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 0, 85, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 0, 85, 0.8)' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'liquid-ripple': {
          '0%': { transform: 'scale(0.95)', opacity: '0.8', background: 'rgba(255,255,255,0.1)' },
          '100%': { transform: 'scale(1)', opacity: '1', background: 'transparent' },
        }
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
