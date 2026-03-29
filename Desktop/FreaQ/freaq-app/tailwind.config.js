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
        background: '#000000',
        surface: 'rgba(28, 28, 30, 0.65)',
        'surface-elevated': 'rgba(44, 44, 46, 0.65)',
        border: 'rgba(255, 255, 255, 0.1)',
        'accent-green': '#30d158',
        'accent-red': '#ff453a',
        'accent-blue': '#0a84ff',
        'accent-cyan': '#64d2ff',
        'accent-yellow': '#ffd60a',
        'accent-purple': '#bf5af2',
        'text-primary': '#f5f5f7',
        'text-secondary': '#86868b',
        'text-muted': '#515154',
        nasdaq: '#0a84ff',
        nyse: '#5e5ce6',
        lse: '#ff453a',
        bse: '#ff9f0a',
        nse: '#32ade6',
        asx: '#ffd60a',
        tsx: '#ff375f',
        hkex: '#ff453a',
        sse: '#ff375f',
        'nikkei': '#bf5af2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-red': '0 0 20px rgba(255, 51, 85, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 136, 255, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.3)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-green': 'pulse-green 2s infinite',
        'pulse-red': 'pulse-red 2s infinite',
        ticker: 'ticker 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        shimmer: 'shimmer 2s infinite',
        'count-up': 'count-up 0.5s ease-out',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,255,136,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,255,136,0.8)' },
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,51,85,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255,51,85,0.8)' },
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
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a3040' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'noise': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4t5eXlyc')",
      },
    },
  },
  plugins: [],
};
