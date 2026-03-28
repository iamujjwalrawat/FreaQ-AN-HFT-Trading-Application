import { NextRequest, NextResponse } from 'next/server';

// Finnhub free API - 60 req/min
const FINNHUB_KEY = process.env.FINNHUB_API_KEY || 'd1234567890abcdef'; // fallback demo
// Alpha Vantage free API - 25 req/day on free tier
const ALPHA_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';

// NSE/BSE India symbols mapping
const INDIA_SYMBOLS: Record<string, string> = {
  'RELIANCE.NS': 'RELIANCE', 'TCS.NS': 'TCS', 'INFY.NS': 'INFY',
  'HDFCBANK.NS': 'HDFCBANK', 'WIPRO.NS': 'WIPRO', 'ICICIBANK.NS': 'ICICIBANK',
};

// Generate realistic mock data for any symbol
function generateMockQuote(symbol: string) {
  const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const base = 50 + (seed % 500);
  const price = base + (Math.random() - 0.5) * base * 0.05;
  const prevClose = base + (Math.random() - 0.5) * base * 0.03;
  const change = price - prevClose;
  const changePercent = (change / prevClose) * 100;
  
  return {
    symbol,
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    open: parseFloat((prevClose + (Math.random() - 0.5) * 2).toFixed(2)),
    high: parseFloat((price * 1.02).toFixed(2)),
    low: parseFloat((price * 0.98).toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 500000,
    prevClose: parseFloat(prevClose.toFixed(2)),
    marketCap: Math.floor(price * (Math.random() * 5000000000 + 1000000000)),
    pe: parseFloat((Math.random() * 40 + 10).toFixed(1)),
    week52High: parseFloat((price * 1.35).toFixed(2)),
    week52Low: parseFloat((price * 0.70).toFixed(2)),
    timestamp: Date.now(),
    source: 'mock',
  };
}

// Generate historical OHLCV data
function generateHistoricalData(symbol: string, days: number = 30) {
  const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  let price = 50 + (seed % 500);
  const data = [];
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
    
    const open = price;
    const change = (Math.random() - 0.48) * price * 0.025; // Slight upward bias
    const close = Math.max(1, price + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(Math.random() * 5000000 + 1000000);
    
    data.push({
      time: Math.floor(date.getTime() / 1000),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
    
    price = close;
  }
  
  return data;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'quote';
  const symbol = searchParams.get('symbol') || 'AAPL';
  const days = parseInt(searchParams.get('days') || '30');

  try {
    if (type === 'quote') {
      // Try Finnhub first
      if (FINNHUB_KEY && FINNHUB_KEY !== 'd1234567890abcdef') {
        try {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`,
            { next: { revalidate: 5 } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data.c && data.c > 0) {
              return NextResponse.json({
                symbol,
                price: data.c,
                change: parseFloat((data.c - data.pc).toFixed(2)),
                changePercent: parseFloat(((data.c - data.pc) / data.pc * 100).toFixed(2)),
                open: data.o,
                high: data.h,
                low: data.l,
                prevClose: data.pc,
                volume: data.v || 0,
                timestamp: data.t * 1000,
                source: 'finnhub',
              });
            }
          }
        } catch (e) { /* fall through to mock */ }
      }

      // Try Yahoo Finance proxy (unofficial, no key needed)
      try {
        const yahooSymbol = symbol.includes('.')
          ? symbol
          : symbol;
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=2d`,
          {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 10 },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const result = data?.chart?.result?.[0];
          if (result) {
            const meta = result.meta;
            const quote = result.indicators?.quote?.[0];
            const closes = quote?.close || [];
            const curr = closes[closes.length - 1] || meta.regularMarketPrice;
            const prev = closes[closes.length - 2] || meta.chartPreviousClose || meta.previousClose;
            const change = curr - prev;
            
            return NextResponse.json({
              symbol,
              price: parseFloat((curr || 0).toFixed(2)),
              change: parseFloat((change || 0).toFixed(2)),
              changePercent: parseFloat((prev ? (change / prev * 100) : 0).toFixed(2)),
              open: quote?.open?.[quote.open.length - 1] || meta.regularMarketOpen || 0,
              high: quote?.high?.[quote.high.length - 1] || meta.regularMarketDayHigh || 0,
              low: quote?.low?.[quote.low.length - 1] || meta.regularMarketDayLow || 0,
              prevClose: prev || 0,
              volume: quote?.volume?.[quote.volume.length - 1] || meta.regularMarketVolume || 0,
              marketCap: meta.marketCap || 0,
              week52High: meta.fiftyTwoWeekHigh || 0,
              week52Low: meta.fiftyTwoWeekLow || 0,
              timestamp: Date.now(),
              source: 'yahoo',
            });
          }
        }
      } catch (e) { /* fall through to mock */ }

      // Fallback: realistic mock data
      return NextResponse.json(generateMockQuote(symbol));

    } else if (type === 'history') {
      // Try Yahoo Finance for historical data
      try {
        const range = days <= 7 ? '5d' : days <= 30 ? '1mo' : days <= 90 ? '3mo' : '1y';
        const interval = days <= 7 ? '1d' : '1d';
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`,
          {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 60 },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const result = data?.chart?.result?.[0];
          if (result) {
            const timestamps = result.timestamp || [];
            const quote = result.indicators?.quote?.[0] || {};
            const history = timestamps.map((t: number, i: number) => ({
              time: t,
              open: parseFloat((quote.open?.[i] || 0).toFixed(2)),
              high: parseFloat((quote.high?.[i] || 0).toFixed(2)),
              low: parseFloat((quote.low?.[i] || 0).toFixed(2)),
              close: parseFloat((quote.close?.[i] || 0).toFixed(2)),
              volume: quote.volume?.[i] || 0,
            })).filter((d: any) => d.close > 0);
            
            return NextResponse.json({ symbol, data: history, source: 'yahoo' });
          }
        }
      } catch (e) { /* fall through to mock */ }

      return NextResponse.json({
        symbol,
        data: generateHistoricalData(symbol, days),
        source: 'mock',
      });

    } else if (type === 'crypto') {
      // CoinGecko free API - no key required
      const cryptoIds = symbol.toLowerCase();
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
          { next: { revalidate: 10 } }
        );
        if (res.ok) {
          const data = await res.json();
          const cryptoData = data[cryptoIds];
          if (cryptoData) {
            return NextResponse.json({
              symbol: cryptoIds.toUpperCase(),
              price: cryptoData.usd,
              change: parseFloat(((cryptoData.usd * cryptoData.usd_24h_change) / 100).toFixed(2)),
              changePercent: parseFloat((cryptoData.usd_24h_change || 0).toFixed(2)),
              volume: cryptoData.usd_24h_vol || 0,
              marketCap: cryptoData.usd_market_cap || 0,
              timestamp: Date.now(),
              source: 'coingecko',
            });
          }
        }
      } catch (e) { /* fall through */ }

      return NextResponse.json(generateMockQuote(symbol));

    } else if (type === 'search') {
      const query = searchParams.get('q') || '';
      try {
        const res = await fetch(
          `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`,
          {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 300 },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const results = (data?.quotes || []).map((q: any) => ({
            symbol: q.symbol,
            name: q.longname || q.shortname || q.symbol,
            exchange: q.exchange,
            type: q.quoteType,
          }));
          return NextResponse.json({ results, source: 'yahoo' });
        }
      } catch (e) { /* fall through */ }
      return NextResponse.json({ results: [], source: 'mock' });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Market API error:', error);
    return NextResponse.json(generateMockQuote(symbol));
  }
}
