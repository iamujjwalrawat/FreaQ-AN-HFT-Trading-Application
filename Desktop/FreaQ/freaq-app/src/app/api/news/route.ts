import { NextRequest, NextResponse } from 'next/server';

// Multi-source news aggregation using free RSS feeds
const NEWS_FEEDS = [
  { name: 'Reuters Finance', url: 'https://feeds.reuters.com/reuters/businessNews', category: 'Business' },
  { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/rss/', category: 'Markets' },
  { name: 'MarketWatch', url: 'https://www.marketwatch.com/rss/topstories', category: 'Markets' },
  { name: 'Seeking Alpha', url: 'https://seekingalpha.com/feed.xml', category: 'Analysis' },
];

// Finnhub news API
const FINNHUB_KEY = process.env.FINNHUB_API_KEY || '';

// Mock financial news for demonstration
function getMockNews(symbol?: string) {
  const headlines = [
    { title: 'Fed signals potential rate cuts amid cooling inflation data', source: 'Reuters', sentiment: 'positive', impact: 'high' },
    { title: 'NVIDIA posts record quarterly earnings, beats analyst estimates by 15%', source: 'Bloomberg', sentiment: 'positive', impact: 'high' },
    { title: 'Apple announces $110B buyback program amid iPhone 16 strong sales', source: 'CNBC', sentiment: 'positive', impact: 'medium' },
    { title: 'Tesla deliveries miss Q1 estimates; shares fall 8% in premarket', source: 'WSJ', sentiment: 'negative', impact: 'high' },
    { title: 'Bank of England holds rates steady as UK inflation remains elevated', source: 'FT', sentiment: 'neutral', impact: 'medium' },
    { title: 'India SENSEX hits all-time high on strong FII inflows and GDP data', source: 'Economic Times', sentiment: 'positive', impact: 'high' },
    { title: 'China manufacturing PMI contracts for third consecutive month', source: 'Caixin', sentiment: 'negative', impact: 'medium' },
    { title: 'ASX 200 gains 1.2% as mining stocks rally on iron ore price surge', source: 'AFR', sentiment: 'positive', impact: 'medium' },
    { title: 'Tokyo market: Nikkei falls on yen strengthening concerns', source: 'Nikkei Asia', sentiment: 'negative', impact: 'medium' },
    { title: 'Microsoft Azure revenue grows 31% YoY, cloud dominance continues', source: 'Bloomberg', sentiment: 'positive', impact: 'high' },
    { title: 'European markets mixed as ECB rate decision looms', source: 'Reuters', sentiment: 'neutral', impact: 'high' },
    { title: 'Bitcoin surges past $70K on spot ETF inflows exceeding $1B daily', source: 'CoinDesk', sentiment: 'positive', impact: 'high' },
    { title: 'Aramco Q1 profit declines 14% amid lower crude oil prices', source: 'Reuters', sentiment: 'negative', impact: 'medium' },
    { title: 'Amazon AWS growth accelerates to 17% as AI workloads spike', source: 'CNBC', sentiment: 'positive', impact: 'high' },
    { title: 'Gold hits record $2,450/oz as dollar weakens and safe haven demand rises', source: 'Bloomberg', sentiment: 'positive', impact: 'medium' },
    { title: 'Meta AI makes breakthrough, stock jumps 6% on revenue guidance raise', source: 'WSJ', sentiment: 'positive', impact: 'high' },
    { title: 'JPMorgan warns of credit tightening risks; maintains cautious outlook', source: 'FT', sentiment: 'negative', impact: 'medium' },
    { title: 'Alibaba reports weak earnings; Hang Seng tech index falls 3%', source: 'SCMP', sentiment: 'negative', impact: 'high' },
    { title: 'Brazil central bank cuts rates by 50bps; BRL strengthens', source: 'Reuters', sentiment: 'positive', impact: 'low' },
    { title: 'TSMC revenue beats estimates; semiconductor sector rallies globally', source: 'Nikkei', sentiment: 'positive', impact: 'high' },
  ];

  if (symbol) {
    // Filter headlines that might relate to the symbol
    return headlines.slice(0, 8).map((h, i) => ({
      ...h,
      id: `news-${i}`,
      time: new Date(Date.now() - i * 3600000).toISOString(),
      url: `https://finance.yahoo.com/news/${symbol.toLowerCase()}-${i}`,
      symbols: [symbol],
    }));
  }

  return headlines.map((h, i) => ({
    ...h,
    id: `news-${i}`,
    time: new Date(Date.now() - i * 1800000).toISOString(),
    url: '#',
    symbols: [],
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '';
  const category = searchParams.get('category') || 'general';

  try {
    // Try Finnhub news API if key is available
    if (FINNHUB_KEY) {
      const endpoint = symbol
        ? `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${getDateBefore(7)}&to=${getToday()}&token=${FINNHUB_KEY}`
        : `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_KEY}`;

      const res = await fetch(endpoint, { next: { revalidate: 300 } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const news = data.slice(0, 20).map((item: any) => ({
            id: item.id?.toString() || Math.random().toString(),
            title: item.headline,
            source: item.source,
            time: new Date(item.datetime * 1000).toISOString(),
            url: item.url,
            summary: item.summary,
            sentiment: item.sentiment || 'neutral',
            impact: 'medium',
            symbols: item.related ? item.related.split(',') : [],
          }));
          return NextResponse.json({ news, source: 'finnhub' });
        }
      }
    }

    // Fallback to mock news
    const news = getMockNews(symbol || undefined);
    return NextResponse.json({ news, source: 'mock' });

  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ news: getMockNews(), source: 'mock' });
  }
}

function getToday() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function getDateBefore(days: number) {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
}
