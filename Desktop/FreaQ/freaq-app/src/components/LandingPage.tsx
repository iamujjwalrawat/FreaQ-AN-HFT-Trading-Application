'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const TICKER_ITEMS = [
  { symbol: 'AAPL', price: '175.48', change: '+2.14%', positive: true },
  { symbol: 'MSFT', price: '395.22', change: '+1.87%', positive: true },
  { symbol: 'NVDA', price: '920.50', change: '+3.42%', positive: true },
  { symbol: 'TSLA', price: '215.30', change: '-1.23%', positive: false },
  { symbol: 'GOOGL', price: '164.82', change: '+0.95%', positive: true },
  { symbol: 'AMZN', price: '188.44', change: '+1.56%', positive: true },
  { symbol: 'META', price: '524.72', change: '+2.31%', positive: true },
  { symbol: 'BTC', price: '68,245', change: '+4.12%', positive: true },
  { symbol: 'ETH', price: '3,842', change: '+2.87%', positive: true },
  { symbol: 'RELIANCE.NS', price: '₹2,945', change: '+1.45%', positive: true },
  { symbol: 'TCS.NS', price: '₹3,682', change: '-0.34%', positive: false },
  { symbol: 'HSBA.L', price: '£640p', change: '+0.78%', positive: true },
  { symbol: 'CBA.AX', price: 'A$118', change: '+1.12%', positive: true },
  { symbol: 'JPM', price: '198.45', change: '+1.23%', positive: true },
  { symbol: 'BHP.AX', price: 'A$47', change: '+2.34%', positive: true },
  { symbol: 'SHEL.L', price: '£2,580p', change: '-0.45%', positive: false },
];

const EXCHANGES = [
  { name: 'NYSE', flag: '🇺🇸', color: 'text-[#4a9fe8]', desc: 'New York' },
  { name: 'NASDAQ', flag: '🇺🇸', color: 'text-[#00b4d8]', desc: 'Tech Hub' },
  { name: 'LSE', flag: '🇬🇧', color: 'text-[#e8405e]', desc: 'London' },
  { name: 'BSE', flag: '🇮🇳', color: 'text-[#f77f00]', desc: 'Bombay' },
  { name: 'NSE', flag: '🇮🇳', color: 'text-[#4a9fe8]', desc: 'National' },
  { name: 'ASX', flag: '🇦🇺', color: 'text-[#ffb703]', desc: 'Sydney' },
  { name: 'TSX', flag: '🇨🇦', color: 'text-[#e63946]', desc: 'Toronto' },
  { name: 'HKEX', flag: '🇭🇰', color: 'text-[#ff6b6b]', desc: 'Hong Kong' },
  { name: 'SSE', flag: '🇨🇳', color: 'text-[#ff8c8c]', desc: 'Shanghai' },
  { name: 'TSE', flag: '🇯🇵', color: 'text-[#b87ff5]', desc: 'Tokyo' },
  { name: 'Euronext', flag: '🇪🇺', color: 'text-[#0066cc]', desc: 'Paris/Amsterdam' },
  { name: 'XETRA', flag: '🇩🇪', color: 'text-[#4a9fe8]', desc: 'Frankfurt' },
  { name: 'Crypto', flag: '🌐', color: 'text-[#f7931a]', desc: '24/7 Global' },
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-Time HFT Data',
    desc: 'Sub-second market data feeds from all major global exchanges. WebSocket-powered live order books and trade feeds.',
  },
  {
    icon: '🌍',
    title: '13+ Global Exchanges',
    desc: 'NYSE, NASDAQ, LSE, BSE, NSE, ASX, TSX, HKEX, SSE, Tokyo, Euronext, Frankfurt, and Crypto all in one platform.',
  },
  {
    icon: '🎮',
    title: 'Trading Simulation',
    desc: 'Paper trade with $100K virtual balance. Test HFT strategies without risk. Complete with P&L tracking and analytics.',
  },
  {
    icon: '🤖',
    title: 'AI Market Assistant',
    desc: 'Ask FreaQ AI about any stock, strategy, or market condition. Powered by GPT technology with financial expertise.',
  },
  {
    icon: '📊',
    title: 'Advanced Charting',
    desc: 'Professional candlestick charts, technical indicators (RSI, MACD, Bollinger Bands), and order book depth visualization.',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    desc: 'Set price alerts, volume spikes, and momentum signals across all exchanges. Never miss a trading opportunity.',
  },
  {
    icon: '📰',
    title: 'Live Market News',
    desc: 'Real-time financial news aggregated from Reuters, Bloomberg, FT, WSJ, and regional financial press worldwide.',
  },
  {
    icon: '🔓',
    title: '100% Open Source',
    desc: 'MIT licensed. Free forever. Contribute on GitHub. No vendor lock-in. Self-hostable. Community driven.',
  },
];

const STATS = [
  { label: 'Exchanges Covered', value: '13+', suffix: '' },
  { label: 'Data Points/sec', value: '50K', suffix: '+' },
  { label: 'Stocks Tracked', value: '100K', suffix: '+' },
  { label: 'Uptime', value: '99.9', suffix: '%' },
];

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentPrice, setCurrentPrice] = useState(68245);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(p => p + (Math.random() - 0.48) * 100);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Live Ticker Tape */}
      <div className="bg-surface border-b border-border overflow-hidden py-2 relative z-50">
        <div className="ticker-tape flex items-center gap-8">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm whitespace-nowrap">
              <span className="font-mono font-semibold text-text-primary">{item.symbol}</span>
              <span className="font-mono text-text-secondary">{item.price}</span>
              <span className={`font-mono text-xs ${item.positive ? 'text-accent-green' : 'text-accent-red'}`}>
                {item.change}
              </span>
              <span className="text-text-muted opacity-30">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 left-0 right-0 z-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between border border-border">
            <div className="flex items-center gap-3">
              <Logo width={36} height={36} className="text-accent-cyan cursor-pointer transition-all hover:scale-105" />
              <span className="text-xl font-bold gradient-text font-display">FreaQ</span>
              <span className="hidden sm:flex items-center gap-1 text-xs text-accent-green ml-2">
                <span className="w-1.5 h-1.5 bg-accent-green rounded-full live-dot"></span>
                LIVE
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
              <a href="#exchanges" className="hover:text-text-primary transition-colors">Exchanges</a>
              <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
              <a href="#simulation" className="hover:text-text-primary transition-colors">Simulation</a>
              <Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
              <a href="https://github.com" target="_blank" className="hover:text-text-primary transition-colors">GitHub</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="landing-demo-btn"
                onClick={() => signIn('credentials', { email: 'demo@freaq.io', password: 'demo123', callbackUrl: '/' })}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Demo
              </button>
              <button
                id="landing-signin-btn"
                onClick={() => signIn()}
                className="bg-accent-blue hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent-blue/25"
              >
                Sign In →
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Animated background logo */}
        <div className="absolute inset-0 pointer-events-none flex auto items-center justify-center -z-10">
          <div className="w-[800px] h-[800px] opacity-[0.03] scale-150 animate-spin-slow mix-blend-screen filter blur-lg">
            <Logo width={800} height={800} />
          </div>
        </div>

        {/* Ambient lighting */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-accent-cyan/10 rounded-full filter blur-[120px] mix-blend-screen opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-accent-red/10 rounded-full filter blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Central Logo Display */}
          <div className="mb-8 relative group">
            <div className="absolute inset-0 bg-accent-cyan/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <Logo width={160} height={160} className="relative z-10 transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-elevated border border-border rounded-full px-5 py-2.5 text-sm text-text-primary shadow-glass mb-8 backdrop-blur-xl">
            <span className="w-2.5 h-2.5 bg-accent-cyan rounded-full live-dot shadow-[0_0_10px_#00F2FF]"></span>
            Next-Gen Architecture • Obsidian Aesthetics
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display mb-6 leading-none tracking-tight">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue drop-shadow-sm">High-Frequency</span>
          </h1>

          <p className="text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            Real-time high frequency trading across <span className="text-accent-cyan font-semibold">13+ global exchanges</span>. 
            Monitor, simulate, and analyze markets from NYSE to NSE, LSE to ASX — all in one platform.
          </p>

          {/* Live BTC price ticker */}
          <div className="inline-flex items-center gap-4 glass rounded-2xl px-6 py-4 mb-10 border border-border">
            <div className="text-text-muted text-sm">BTC/USD</div>
            <div className="text-3xl font-mono font-bold text-accent-yellow">
              ${Math.floor(currentPrice).toLocaleString()}
            </div>
            <div className="text-accent-green text-sm font-mono">+4.12% ↑</div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex items-center gap-1 text-accent-green text-xs">
              <span className="w-2 h-2 bg-accent-green rounded-full live-dot"></span>
              LIVE
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              id="hero-demo-btn"
              onClick={() => signIn('credentials', { email: 'demo@freaq.io', password: 'demo123', callbackUrl: '/' })}
              className="group relative overflow-hidden bg-surface-elevated border border-accent-cyan/50 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 transform rotate-180 transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center gap-3">
                <Logo width={24} height={24} className="opacity-80" /> Enter Terminal
              </span>
            </button>
            <button
              id="hero-signin-btn"
              onClick={() => signIn()}
              className="inline-flex items-center gap-2 glass text-text-primary font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:bg-surface-elevated hover:border-accent-cyan/30"
            >
              Secure Login →
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((stat, i) => (
              <div key={i} className="glass-light rounded-xl p-4 border border-border">
                <div className="text-2xl font-bold gradient-text font-mono">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-text-muted text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exchanges Section */}
      <section id="exchanges" className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-text-primary mb-4">
              Every Exchange. One Platform.
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              From Wall Street to Dalal Street, from London to Tokyo — track all global markets in real time.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {EXCHANGES.map((ex, i) => (
              <div
                key={i}
                className="glass rounded-xl p-4 border border-border card-hover text-center group"
              >
                <div className="text-3xl mb-2">{ex.flag}</div>
                <div className={`font-bold font-mono text-sm ${ex.color}`}>{ex.name}</div>
                <div className="text-text-muted text-xs mt-1">{ex.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-muted text-sm">
              Data sourced from <span className="text-accent-blue">Finnhub</span>, <span className="text-accent-cyan">Yahoo Finance</span>, <span className="text-accent-green">CoinGecko</span>, and <span className="text-accent-yellow">Alpha Vantage</span>
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-background grid-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-text-primary mb-4">
              Everything You Need to Trade
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Professional-grade tools designed for both beginners and institutional traders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 border border-border card-hover group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulation CTA */}
      <section id="simulation" className="py-24 px-6 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-6">🎮</div>
          <h2 className="text-4xl sm:text-5xl font-bold font-display text-text-primary mb-6">
            Paper Trade Like a Pro
          </h2>
          <p className="text-xl text-text-secondary mb-8 leading-relaxed">
            Get $100,000 in virtual money. Practice HFT strategies. 
            Track your P&L, win rate, and Sharpe ratio — all without risking a single dollar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '⚡', title: 'Market Making', desc: 'Provide liquidity on any exchange' },
              { icon: '📊', title: 'Stat Arb', desc: 'Exploit cross-market inefficiencies' },
              { icon: '🔄', title: 'Mean Reversion', desc: 'Trade statistical anomalies' },
            ].map((strategy, i) => (
              <div key={i} className="glass rounded-xl p-6 border border-border text-left">
                <div className="text-2xl mb-3">{strategy.icon}</div>
                <div className="font-semibold text-text-primary mb-1">{strategy.title}</div>
                <div className="text-text-secondary text-sm">{strategy.desc}</div>
              </div>
            ))}
          </div>

          <button
            id="simulation-cta-btn"
            onClick={() => signIn('credentials', { email: 'demo@freaq.io', password: 'demo123', callbackUrl: '/' })}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-green to-accent-cyan text-black font-bold px-10 py-5 rounded-2xl text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent-green/30"
          >
            🎮 Start Simulating Now — Free!
          </button>
          <p className="text-text-muted text-sm mt-4">No credit card. No subscription. Open source forever.</p>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-display text-text-primary mb-6">
            Built in Public. Free Forever.
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            FreaQ is 100% open source under the MIT license. Fork it, extend it, run your own instance, or contribute.
          </p>
          
          <div className="glass rounded-2xl p-8 border border-border mb-8 text-left font-mono text-sm">
            <div className="text-text-muted mb-2"># Get started in seconds</div>
            <div className="text-accent-cyan">$ git clone https://github.com/freaq/freaq</div>
            <div className="text-accent-cyan">$ cd freaq/freaq-app</div>
            <div className="text-accent-cyan">$ npm install && npm run dev</div>
            <div className="text-accent-green mt-2">✓ FreaQ running at http://localhost:3000</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com"
              target="_blank"
              id="github-star-btn"
              className="inline-flex items-center gap-2 bg-[#24292f] hover:bg-[#2f363d] text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-[#3a4550]"
            >
              ⭐ Star on GitHub
            </a>
            <button
              id="cta-launch-btn"
              onClick={() => signIn('credentials', { email: 'demo@freaq.io', password: 'demo123', callbackUrl: '/' })}
              className="inline-flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              🚀 Launch Platform
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Logo width={40} height={40} />
                <span className="font-bold text-2xl tracking-tight text-white">FreaQ</span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                Open-source HFT platform for all global exchanges.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Platform</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li><a href="#" className="hover:text-text-primary transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors">Simulation</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors">News</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Exchanges</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>NYSE / NASDAQ</li>
                <li>BSE / NSE India</li>
                <li>LSE London</li>
                <li>ASX Australia</li>
                <li>+ 9 more</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li><a href="https://github.com" target="_blank" className="hover:text-text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-text-muted text-sm">
              © 2024 FreaQ. MIT License. Built for the world.
            </div>
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <span className="w-2 h-2 bg-accent-green rounded-full live-dot"></span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
