import { NextRequest, NextResponse } from 'next/server';

// Portfolio data storage (in-memory for demo; use a DB in production)
// In production, replace with Prisma/Supabase/MongoDB
const portfolioStore: Record<string, any> = {};

function getDefaultPortfolio(userId: string) {
  return {
    userId,
    balance: 100000,
    initialBalance: 100000,
    positions: [],
    transactions: [],
    watchlist: [
      { symbol: 'AAPL', exchange: 'NASDAQ', name: 'Apple Inc.' },
      { symbol: 'MSFT', exchange: 'NASDAQ', name: 'Microsoft Corp.' },
      { symbol: 'GOOGL', exchange: 'NASDAQ', name: 'Alphabet Inc.' },
      { symbol: 'NVDA', exchange: 'NASDAQ', name: 'NVIDIA Corp.' },
      { symbol: 'TSLA', exchange: 'NASDAQ', name: 'Tesla Inc.' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      defaultExchange: 'NASDAQ',
      currency: 'USD',
      notifications: true,
      theme: 'dark',
    },
    simulationStats: {
      totalTrades: 0,
      winRate: 0,
      profitFactor: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
    },
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'demo';

  if (!portfolioStore[userId]) {
    portfolioStore[userId] = getDefaultPortfolio(userId);
  }

  return NextResponse.json(portfolioStore[userId]);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId = 'demo', action, symbol, shares, price, exchange } = body;

  if (!portfolioStore[userId]) {
    portfolioStore[userId] = getDefaultPortfolio(userId);
  }

  const portfolio = portfolioStore[userId];
  const cost = shares * price;

  if (action === 'buy') {
    if (portfolio.balance < cost) {
      return NextResponse.json({ error: 'Insufficient balance', balance: portfolio.balance }, { status: 400 });
    }

    portfolio.balance -= cost;
    const existingPosition = portfolio.positions.find((p: any) => p.symbol === symbol);
    
    if (existingPosition) {
      const totalShares = existingPosition.shares + shares;
      const totalCost = existingPosition.shares * existingPosition.avgPrice + cost;
      existingPosition.avgPrice = totalCost / totalShares;
      existingPosition.shares = totalShares;
    } else {
      portfolio.positions.push({
        id: Date.now().toString(),
        symbol,
        exchange,
        shares,
        avgPrice: price,
        openDate: new Date().toISOString(),
        name: symbol,
      });
    }

    const transaction = {
      id: Date.now().toString(),
      type: 'buy',
      symbol,
      shares,
      price,
      total: cost,
      timestamp: new Date().toISOString(),
      exchange,
    };
    portfolio.transactions.unshift(transaction);
    portfolio.simulationStats.totalTrades++;

  } else if (action === 'sell') {
    const position = portfolio.positions.find((p: any) => p.symbol === symbol);
    if (!position || position.shares < shares) {
      return NextResponse.json({ error: 'Insufficient shares' }, { status: 400 });
    }

    const proceeds = shares * price;
    portfolio.balance += proceeds;
    position.shares -= shares;

    const pnl = proceeds - shares * position.avgPrice;
    portfolio.simulationStats.totalTrades++;
    
    if (position.shares === 0) {
      portfolio.positions = portfolio.positions.filter((p: any) => p.symbol !== symbol);
    }

    const transaction = {
      id: Date.now().toString(),
      type: 'sell',
      symbol,
      shares,
      price,
      total: proceeds,
      pnl: parseFloat(pnl.toFixed(2)),
      timestamp: new Date().toISOString(),
      exchange,
    };
    portfolio.transactions.unshift(transaction);

  } else if (action === 'watchlist_add') {
    if (!portfolio.watchlist.find((w: any) => w.symbol === symbol)) {
      portfolio.watchlist.push({ symbol, exchange, name: body.name || symbol });
    }
  } else if (action === 'watchlist_remove') {
    portfolio.watchlist = portfolio.watchlist.filter((w: any) => w.symbol !== symbol);
  } else if (action === 'reset') {
    portfolioStore[userId] = getDefaultPortfolio(userId);
    return NextResponse.json(portfolioStore[userId]);
  }

  portfolio.updatedAt = new Date().toISOString();
  
  return NextResponse.json(portfolio);
}
