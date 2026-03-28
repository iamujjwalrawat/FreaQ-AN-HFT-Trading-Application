# FreaQ ⚡ — Open Source Global HFT Trading Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

> **Real-time High Frequency Trading platform for all major global stock exchanges. Free. Open source. For everyone.**

🌍 **Exchanges**: NYSE · NASDAQ · LSE (London) · BSE (Bombay) · NSE (India) · ASX (Australia) · TSX (Canada) · HKEX · SSE (Shanghai) · Tokyo · Euronext · Frankfurt · Crypto

---

## ✨ Features

### 📊 Real-Time Market Data
- Live quotes from 13+ global exchanges via Yahoo Finance, Finnhub & CoinGecko
- WebSocket-like auto-refresh every 5 seconds
- Professional candlestick charts with area fills
- Live order book simulation with bid/ask spread visualization
- Real-time trade feed with buy/sell direction

### 🌍 All World Exchanges
| Exchange | Country | Currency | Hours (Local) |
|----------|---------|----------|---------------|
| NYSE | 🇺🇸 USA | USD | 9:30 AM - 4:00 PM ET |
| NASDAQ | 🇺🇸 USA | USD | 9:30 AM - 4:00 PM ET |
| LSE | 🇬🇧 UK | GBP | 8:00 AM - 4:30 PM GMT |
| BSE | 🇮🇳 India | INR | 9:15 AM - 3:30 PM IST |
| NSE | 🇮🇳 India | INR | 9:15 AM - 3:30 PM IST |
| ASX | 🇦🇺 Australia | AUD | 10:00 AM - 4:00 PM AEDT |
| TSX | 🇨🇦 Canada | CAD | 9:30 AM - 4:00 PM ET |
| HKEX | 🇭🇰 Hong Kong | HKD | 9:30 AM - 4:00 PM HKT |
| SSE | 🇨🇳 China | CNY | 9:30 AM - 3:00 PM CST |
| Tokyo | 🇯🇵 Japan | JPY | 9:00 AM - 3:30 PM JST |
| Euronext | 🇪🇺 Europe | EUR | 9:00 AM - 5:30 PM CET |
| Frankfurt | 🇩🇪 Germany | EUR | 8:00 AM - 10:00 PM CET |
| Crypto | 🌐 Global | USD | 24/7 |

### ⚡ HFT Trading Features
- **Order Book**: Live bid/ask with depth visualization
- **Trade Feed**: Real-time buy/sell stream
- **Order Placement**: Buy/Sell with market & limit orders
- **Portfolio Tracking**: Real-time P&L with unrealized gains
- **Watchlist**: Customizable multi-exchange watchlist

### 🎮 Trading Simulation
- Start with $100,000 virtual capital
- Paper trade without any risk
- 5 HFT strategies: Market Making, Momentum, Statistical Arbitrage, Mean Reversion, Breakout
- Full backtesting with configurable time periods
- Performance metrics: Win Rate, Sharpe Ratio, Max Drawdown, P&L

### 🤖 AI Market Assistant
- Powered by OpenAI GPT-4o-mini (or built-in smart responses without API key)
- Market analysis, strategy explanations, global exchange info
- Educational HFT content
- Natural language interface

### 📰 Market News
- Real-time news from Reuters, Bloomberg, FT, CNBC
- Sentiment analysis (Bullish/Bearish/Neutral)
- Impact ratings (High/Medium/Low)
- Category filtering: General, Forex, Crypto, M&A, Macro

### 🏆 Trading Game
- Predict market direction UP/DOWN
- Streak multipliers for consecutive wins
- Score tracking and virtual P&L

### 🔐 Authentication
- GitHub OAuth login
- Google OAuth login
- Email/Password (any credentials work in demo mode)
- Instant demo account (no signup needed)

---

## 🚀 Quick Start

### Option 1: Try Demo (No Setup Required)
Visit [freaq.vercel.app](https://freaq.vercel.app) and click **"Launch Demo"**

### Option 2: Run Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/freaq
cd freaq/freaq-app

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local (minimum: NEXTAUTH_URL and NEXTAUTH_SECRET)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login**: `demo@freaq.io` / `demo123` (or any email/password)

---

## 🔑 API Keys (All Optional)

FreaQ works in **demo mode without any API keys**. Add keys to unlock more features:

| Service | Purpose | Free Tier | Get Key |
|---------|---------|-----------|---------|
| Finnhub | Real-time stocks | 60 req/min | [finnhub.io](https://finnhub.io/register) |
| Yahoo Finance | Historical data | Unlimited (unofficial) | Not required |
| CoinGecko | Crypto prices | Unlimited | Not required |
| Alpha Vantage | Backup data | 25 req/day | [alphavantage.co](https://www.alphavantage.co/support/#api-key) |
| OpenAI | AI assistant | Pay per use | [platform.openai.com](https://platform.openai.com/api-keys) |
| GitHub OAuth | Social login | Free | [github.com/settings/developers](https://github.com/settings/developers) |
| Google OAuth | Social login | Free | [console.cloud.google.com](https://console.cloud.google.com/) |

---

## 🏗️ Architecture

```
freaq-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main entry (Dashboard or Landing)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Design system
│   │   ├── providers.tsx         # Session provider
│   │   ├── auth/
│   │   │   └── signin/page.tsx   # Sign in page
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts   # NextAuth
│   │       ├── market/route.ts               # Market data
│   │       ├── news/route.ts                 # News feed
│   │       ├── portfolio/route.ts            # Portfolio CRUD
│   │       └── ai/route.ts                   # AI assistant
│   ├── components/
│   │   ├── Dashboard.tsx         # Main dashboard layout
│   │   ├── LandingPage.tsx       # Marketing landing page
│   │   ├── MarketOverview.tsx    # Global markets view
│   │   ├── OrderBook.tsx         # Trading interface
│   │   ├── TradingSimulator.tsx  # HFT strategy backtester
│   │   ├── Portfolio.tsx         # Portfolio management
│   │   ├── NewsPanel.tsx         # Market news
│   │   └── AIAssistant.tsx       # AI chat interface
│   └── lib/
│       ├── exchanges.ts          # Exchange configurations
│       └── auth.ts               # Authentication config
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **NextAuth.js** | Authentication |
| **Recharts** | Data visualization |
| **Framer Motion** | Animations |
| **Finnhub** | Real-time market data |
| **Yahoo Finance** | Historical data |
| **CoinGecko** | Crypto prices |
| **OpenAI** | AI assistant |
| **Vercel** | Deployment |

---

## 🚀 Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/freaq&env=NEXTAUTH_SECRET,NEXTAUTH_URL&project-name=freaq&repository-name=freaq)

### Manual Deploy

1. Install Vercel CLI: `npm i -g vercel`
2. In `freaq-app/`: Run `vercel`
3. Set environment variables in Vercel dashboard
4. Set `NEXTAUTH_URL` to your Vercel deployment URL

**Required env vars for Vercel:**
- `NEXTAUTH_SECRET` - Random secret string
- `NEXTAUTH_URL` - Your Vercel URL (e.g. `https://freaq.vercel.app`)

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

```bash
# Fork repo
# Clone your fork
git clone https://github.com/yourusername/freaq

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes, test them
npm run dev

# Commit and push
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature

# Open Pull Request
```

---

## 📝 License

MIT License — Free for personal and commercial use.

---

## ⚠️ Disclaimer

FreaQ is an **educational platform** for learning about financial markets and HFT strategies.

- All trading simulation uses virtual money only
- Not financial advice — always do your own research
- Past performance does not indicate future results
- Real trading involves significant risk of loss

---

## 🌟 Star History

If FreaQ helped you, please ⭐ star this repo!

---

Built with ❤️ for the global trading community.
