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
        background: '#050a0f',
        surface: '#0a1520',
        'surface-elevated': '#0f1f30',
        border: '#1a3040',
        'accent-green': '#00ff88',
        'accent-red': '#ff3355',
        'accent-blue': '#0088ff',
        'accent-cyan': '#00e5ff',
        'accent-yellow': '#ffcc00',
        'accent-purple': '#9945ff',
        'text-primary': '#e8f4ff',
        'text-secondary': '#7aa4c0',
        'text-muted': '#3a6080',
        nasdaq: '#00b4d8',
        nyse: '#0077b6',
        lse: '#c8102e',
        bse: '#f77f00',
        nse: '#023e8a',
        asx: '#ffb703',
        tsx: '#e63946',
        hkex: '#d62828',
        sse: '#e63946',
        'nikkei': '#9b5de5',
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
