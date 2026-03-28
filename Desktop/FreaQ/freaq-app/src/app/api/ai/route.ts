import { NextRequest, NextResponse } from 'next/server';

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

// Financial AI assistant with fallback
const MARKET_KNOWLEDGE = `You are FreaQ AI, an expert market analyst and trading assistant for the FreaQ HFT platform. 
You provide real-time market insights, trading strategies, risk analysis, and educational content.
You are knowledgeable about all global stock exchanges: NYSE, NASDAQ, LSE, BSE, NSE, ASX, TSX, HKEX, SSE, Tokyo, Euronext.
You understand HFT concepts: market making, statistical arbitrage, momentum trading, mean reversion, latency arbitrage.
Always provide balanced analysis with risk warnings. Never give direct financial advice without disclaimers.`;

// Smart fallback responses based on keywords
function getSmartFallback(query: string): string {
  const q = query.toLowerCase();
  
  if (q.includes('hft') || q.includes('high frequency')) {
    return `**High Frequency Trading (HFT) Overview:**

HFT involves executing thousands of trades per second using algorithms. Key strategies include:

1. **Market Making**: Providing liquidity by placing buy/sell orders at different prices, profiting from the spread
2. **Statistical Arbitrage**: Exploiting price differences between correlated securities
3. **Momentum Trading**: Following short-term price trends using technical signals
4. **Latency Arbitrage**: Exploiting microsecond speed advantages between venues

**Key Facts:**
- HFT accounts for ~50% of US equity volume
- Typical holding period: milliseconds to seconds
- Requires co-location, fiber optics, and FPGA hardware
- Uses order book analysis, tick data, and L2 market data

⚠️ *Disclaimer: HFT involves significant risk and regulatory compliance requirements.*`;
  }
  
  if (q.includes('nasdaq') || q.includes('nyse')) {
    return `**US Markets Overview:**

**NASDAQ** (National Association of Securities Dealers Automated Quotations):
- 3,300+ listed companies
- Heavy tech focus: AAPL, MSFT, GOOGL, NVDA, META, AMZN
- Trading hours: 9:30 AM - 4:00 PM ET (pre/after market: 4 AM - 8 PM)
- Market maker system (vs NYSE specialist system)

**NYSE** (New York Stock Exchange):
- World's largest exchange by market cap ($26+ trillion)
- Trading hours: 9:30 AM - 4:00 PM ET
- Companies: JPM, BAC, WMT, JNJ, XOM, GE, KO

**Key Indices:**
- S&P 500: Top 500 US companies (benchmark)
- Dow Jones: 30 blue-chip stocks
- NASDAQ Composite: All NASDAQ listed stocks

⚠️ *Market data refreshes every few seconds on FreaQ.*`;
  }
  
  if (q.includes('india') || q.includes('bse') || q.includes('nse') || q.includes('sensex') || q.includes('nifty')) {
    return `**Indian Markets Overview:**

**BSE (Bombay Stock Exchange):**
- Asia's oldest stock exchange (est. 1875)
- 5,000+ listed companies
- SENSEX = top 30 companies index
- Trading hours: 9:15 AM - 3:30 PM IST

**NSE (National Stock Exchange):**
- Largest by trading volume in India
- NIFTY 50 = top 50 companies index
- Modern electronic trading system

**Top Indian Stocks:** RELIANCE, TCS, INFOSYS, HDFC BANK, WIPRO, ICICI BANK
**Currency:** INR (Indian Rupee)
**Regulator:** SEBI (Securities and Exchange Board of India)

**FII Flows:** Foreign Institutional Investors significantly impact Indian markets.

⚠️ *FreaQ supports real-time BSE/NSE data via Yahoo Finance.*`;
  }
  
  if (q.includes('strategy') || q.includes('trade') || q.includes('invest')) {
    return `**Trading Strategy Framework:**

**For Beginners:**
- Start with paper trading (use FreaQ simulation!)
- Learn to read price charts and volume
- Understand risk management (never risk >2% per trade)
- Study fundamental analysis (P/E ratios, earnings, revenue)

**For Intermediate Traders:**
- Technical analysis: RSI, MACD, Bollinger Bands, Moving Averages
- Options basics, hedging strategies
- Sector rotation strategies
- Earnings plays and catalysts

**Risk Management Rules:**
1. Always use stop losses
2. Diversify across sectors and geographies
3. Keep 10-20% in cash for opportunities
4. Track your win rate and risk-reward ratio

**HFT on FreaQ:**
Use the Simulation Mode to test strategies without risking real money!

⚠️ *This is educational content, not financial advice. Past performance doesn't guarantee future results.*`;
  }
  
  if (q.includes('crypto') || q.includes('bitcoin') || q.includes('ethereum')) {
    return `**Crypto Markets Overview:**

**Major Cryptocurrencies:**
- **Bitcoin (BTC)**: Digital gold, store of value, limited to 21M coins
- **Ethereum (ETH)**: Smart contract platform, DeFi backbone
- **Solana (SOL)**: High-speed blockchain, growing ecosystem
- **BNB**: Binance native token for exchange discounts

**Market Characteristics:**
- 24/7 trading (unlike stocks)
- Highly volatile (can move 10-50% in days)
- Global, borderless, decentralized
- Spot ETFs now approved in USA (BlackRock, Fidelity)

**Trading Tips:**
- Set strict stop losses (5-15%)
- Don't invest more than you can afford to lose
- Watch Bitcoin dominance for altcoin signals
- Monitor on-chain metrics for institutional flows

**FreaQ Crypto:**
Real-time prices via CoinGecko API, 24/7 monitoring.

⚠️ *Crypto is extremely volatile. Only invest what you can afford to lose.*`;
  }
  
  return `**FreaQ AI Market Assistant**

I can help you with:
- 📊 Market analysis for any global exchange
- 📈 Trading strategies (beginner to advanced)
- 🔍 Stock/crypto research guidance
- 🌍 Global exchange information (NYSE, NASDAQ, LSE, BSE, NSE, ASX, etc.)
- ⚡ HFT concepts and strategies
- 🎮 How to use the FreaQ simulation

**Quick Examples:**
- "Explain HFT market making"
- "How does NASDAQ differ from NYSE?"
- "What is statistical arbitrage?"
- "Tell me about Indian stock markets"
- "Bitcoin trading strategies"

What would you like to know? I'm here to help! 🚀

⚠️ *All information is educational. Not financial advice.*`;
}

export async function POST(request: NextRequest) {
  const { message, context } = await request.json();

  if (!message) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 });
  }

  // Try OpenAI if key exists
  if (OPENAI_KEY) {
    try {
      const systemPrompt = context
        ? `${MARKET_KNOWLEDGE}\n\nCurrent market context: ${JSON.stringify(context)}`
        : MARKET_KNOWLEDGE;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ reply, source: 'openai' });
        }
      }
    } catch (e) { /* fall through */ }
  }

  // Smart fallback response
  const reply = getSmartFallback(message);
  return NextResponse.json({ reply, source: 'freaq-ai' });
}
