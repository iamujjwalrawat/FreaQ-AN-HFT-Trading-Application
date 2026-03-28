'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { EXCHANGES, DEFAULT_WATCHLIST, MARKET_INDICES } from '@/lib/exchanges';
import MarketOverview from './MarketOverview';
import OrderBook from './OrderBook';
import TradingSimulator from './TradingSimulator';
import NewsPanel from './NewsPanel';
import AIAssistant from './AIAssistant';
import Portfolio from './Portfolio';

type Tab = 'overview' | 'trading' | 'portfolio' | 'news' | 'ai' | 'simulation' | 'game';

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedExchange, setSelectedExchange] = useState('NASDAQ');
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [prices, setPrices] = useState<Record<string, any>>({});
  const [notifications, setNotifications] = useState<string[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalVolume: '$4.2T',
    advancers: 2847,
    decliners: 1523,
    unchanged: 342,
    vix: 18.4,
    fearGreed: 65,
  });

  // Fetch prices for watchlist
  const fetchPrices = useCallback(async () => {
    const promises = watchlist.slice(0, 8).map(async (item) => {
      try {
        const res = await fetch(`/api/market?type=quote&symbol=${item.symbol}`);
        if (res.ok) {
          const data = await res.json();
          return { symbol: item.symbol, data };
        }
      } catch (e) {}
      return null;
    });

    const results = await Promise.all(promises);
    const newPrices: Record<string, any> = {};
    results.forEach(r => {
      if (r) newPrices[r.symbol] = r.data;
    });
    setPrices(prev => ({ ...prev, ...newPrices }));
  }, [watchlist]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 8000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Add notification
  useEffect(() => {
    const msgs = [
      '🔔 NVDA up 3.4% — Breaking resistance',
      '⚡ Volume spike: TSLA 2M shares in 1 min',
      '📰 Fed chair speaks at 2PM ET today',
      '🎯 Your AAPL alert: Price crossed $175',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setNotifications(prev => [msgs[idx % msgs.length], ...prev.slice(0, 4)]);
      idx++;
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: '📊' },
    { id: 'trading' as Tab, label: 'Trading', icon: '⚡' },
    { id: 'portfolio' as Tab, label: 'Portfolio', icon: '💼' },
    { id: 'simulation' as Tab, label: 'Simulate', icon: '🎮' },
    { id: 'news' as Tab, label: 'News', icon: '📰' },
    { id: 'ai' as Tab, label: 'AI Analyst', icon: '🤖' },
    { id: 'game' as Tab, label: 'Game', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="bg-surface border-b border-border z-30 sticky top-0">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-4">
            <button
              id="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="font-bold gradient-text font-display text-lg">FreaQ</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-accent-green">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full live-dot"></span>
              LIVE
            </div>
          </div>

          {/* Market quick stats */}
          <div className="hidden lg:flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-text-muted">S&P 500</span>
              <span className="text-accent-green font-mono font-semibold">5,248 +0.8%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">NASDAQ</span>
              <span className="text-accent-green font-mono font-semibold">16,482 +1.2%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">FTSE</span>
              <span className="text-accent-red font-mono font-semibold">8,024 -0.3%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">NIFTY</span>
              <span className="text-accent-green font-mono font-semibold">22,156 +0.5%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">VIX</span>
              <span className="text-accent-yellow font-mono font-semibold">{globalStats.vix}</span>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <div className="relative">
                <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors relative">
                  🔔
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center text-sm font-bold text-white">
                {session?.user?.name?.[0]?.toUpperCase() || 'T'}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-text-primary">{session?.user?.name || 'Trader'}</div>
                <div className="text-xs text-text-muted">Pro Account</div>
              </div>
            </div>
            <button
              id="signout-btn"
              onClick={() => signOut()}
              className="text-xs text-text-muted hover:text-accent-red transition-colors px-2 py-1 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center px-4 gap-1 overflow-x-auto scrollbar-hide border-t border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-accent-blue text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Live ticker */}
      <div className="bg-background border-b border-border overflow-hidden py-1.5">
        <div className="ticker-tape flex items-center gap-6 text-xs">
          {[...DEFAULT_WATCHLIST, ...DEFAULT_WATCHLIST].map((item, i) => {
            const priceData = prices[item.symbol];
            const change = priceData?.changePercent || (Math.random() - 0.45) * 5;
            const price = priceData?.price || (100 + Math.random() * 400);
            return (
              <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-text-muted">{item.symbol}</span>
                <span className="font-mono text-text-primary">${price.toFixed(2)}</span>
                <span className={`font-mono ${change >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Watchlist */}
        {sidebarOpen && (
          <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border overflow-y-auto">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Watchlist</h3>
                <button className="text-xs text-accent-blue hover:text-accent-cyan">+ Add</button>
              </div>
              
              {/* Exchange filter */}
              <select
                id="exchange-filter"
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-lg text-sm px-3 py-2 text-text-primary"
              >
                {Object.values(EXCHANGES).map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.flag} {ex.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto">
              {watchlist.map((item, i) => {
                const priceData = prices[item.symbol];
                const basePrice = 50 + (item.symbol.charCodeAt(0) % 400);
                const price = priceData?.price || basePrice;
                const change = priceData?.changePercent ?? (Math.random() - 0.45) * 5;
                const isPositive = change >= 0;
                
                return (
                  <button
                    key={i}
                    id={`watchlist-${item.symbol}`}
                    onClick={() => {
                      setSelectedSymbol(item.symbol);
                      setActiveTab('trading');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-surface-elevated transition-colors border-b border-border/50 text-left ${
                      selectedSymbol === item.symbol ? 'bg-surface-elevated border-l-2 border-l-accent-blue' : ''
                    }`}
                  >
                    <div>
                      <div className="font-mono font-semibold text-sm text-text-primary">{item.symbol}</div>
                      <div className="text-xs text-text-muted">{item.exchange}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-text-primary">${price.toFixed(2)}</div>
                      <div className={`font-mono text-xs ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                        {isPositive ? '+' : ''}{change.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Market Status */}
            <div className="p-4 border-t border-border">
              <h4 className="text-xs text-text-muted uppercase font-semibold mb-3">Market Status</h4>
              <div className="space-y-2">
                {[
                  { name: 'NYSE/NASDAQ', open: true },
                  { name: 'LSE London', open: false },
                  { name: 'BSE/NSE India', open: false },
                  { name: 'ASX Australia', open: false },
                  { name: 'Crypto', open: true },
                ].map((market, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">{market.name}</span>
                    <span className={`flex items-center gap-1 ${market.open ? 'text-accent-green' : 'text-text-muted'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${market.open ? 'bg-accent-green live-dot' : 'bg-text-muted'}`}></span>
                      {market.open ? 'Open' : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && <MarketOverview selectedSymbol={selectedSymbol} onSelectSymbol={(s) => { setSelectedSymbol(s); setActiveTab('trading'); }} />}
          {activeTab === 'trading' && <OrderBook symbol={selectedSymbol} exchange={selectedExchange} />}
          {activeTab === 'portfolio' && <Portfolio userId={session?.user?.email || 'demo'} />}
          {activeTab === 'simulation' && <TradingSimulator />}
          {activeTab === 'news' && <NewsPanel />}
          {activeTab === 'ai' && <AIAssistant selectedSymbol={selectedSymbol} />}
          {activeTab === 'game' && <TradingGame />}
        </main>
      </div>
    </div>
  );
}

// Simple Inline Trading Game Component
function TradingGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [currentChart, setCurrentChart] = useState<any[]>([]);
  const [balance, setBalance] = useState(10000);
  const [prediction, setPrediction] = useState<'up' | 'down' | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [streak, setStreak] = useState(0);

  const generateChart = () => {
    let price = 100;
    const data = [];
    for (let i = 0; i < 20; i++) {
      price += (Math.random() - 0.5) * 5;
      data.push({ time: i, price: Math.max(50, price) });
    }
    return data;
  };

  const startGame = () => {
    setScore(0);
    setBalance(10000);
    setRound(1);
    setStreak(0);
    setCurrentChart(generateChart());
    setGameState('playing');
    setPrediction(null);
    setResult(null);
  };

  const makePrediction = (dir: 'up' | 'down') => {
    setPrediction(dir);
    // Reveal: determine if next price went up or down
    const nextMove = Math.random() > 0.5 ? 'up' : 'down';
    const correct = dir === nextMove;
    const betAmount = 1000;

    if (correct) {
      setScore(s => s + 100 + streak * 10);
      setBalance(b => b + betAmount);
      setStreak(s => s + 1);
      setResult('win');
    } else {
      setBalance(b => Math.max(0, b - betAmount));
      setStreak(0);
      setResult('lose');
    }

    setTimeout(() => {
      if (balance <= 0 || round >= 10) {
        setGameState('result');
      } else {
        setRound(r => r + 1);
        setCurrentChart(generateChart());
        setPrediction(null);
        setResult(null);
      }
    }, 1500);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-display text-text-primary mb-2">🏆 Market Prediction Game</h2>
        <p className="text-text-secondary">Predict market direction. Build your streak. Compete for the high score!</p>
      </div>

      {gameState === 'idle' && (
        <div className="glass rounded-2xl p-8 border border-border text-center">
          <div className="text-6xl mb-6">📈</div>
          <h3 className="text-2xl font-bold text-text-primary mb-4">Ready to Trade?</h3>
          <p className="text-text-secondary mb-6">
            You start with <span className="text-accent-green font-bold">$10,000</span>. 
            Look at each chart and predict if the price will go UP or DOWN.
            Each correct answer earns points. Streak bonuses available!
          </p>
          <button
            id="start-game-btn"
            onClick={startGame}
            className="bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
          >
            🎮 Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="glass rounded-2xl p-6 border border-border">
          {/* Game HUD */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm">
              <span className="text-text-muted">Round </span>
              <span className="font-bold text-text-primary">{round}/10</span>
            </div>
            <div className="text-sm">
              <span className="text-text-muted">Score </span>
              <span className="font-bold text-accent-yellow">{score}</span>
            </div>
            <div className="text-sm">
              <span className="text-text-muted">Balance </span>
              <span className={`font-bold font-mono ${balance > 10000 ? 'text-accent-green' : balance < 10000 ? 'text-accent-red' : 'text-text-primary'}`}>
                ${balance.toLocaleString()}
              </span>
            </div>
            {streak > 1 && (
              <div className="text-sm flex items-center gap-1">
                <span className="text-accent-yellow">🔥</span>
                <span className="font-bold text-accent-yellow">{streak}x streak!</span>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="mb-6 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChart}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0088ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="price" stroke="#0088ff" fill="url(#priceGrad)" strokeWidth={2} dot={false} />
                <XAxis hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#0a1520', border: '1px solid #1a3040', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#7aa4c0' }}
                  itemStyle={{ color: '#0088ff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Result flash */}
          {result && (
            <div className={`text-center py-3 mb-4 rounded-xl font-bold text-lg ${
              result === 'win' 
                ? 'bg-accent-green bg-opacity-20 text-accent-green'
                : 'bg-accent-red bg-opacity-20 text-accent-red'
            }`}>
              {result === 'win' ? '✅ Correct! +$1,000' : '❌ Wrong! -$1,000'}
            </div>
          )}

          {/* Prediction buttons */}
          {!prediction && (
            <div className="text-center">
              <p className="text-text-secondary text-sm mb-4">Where will the price go next?</p>
              <div className="flex gap-4 justify-center">
                <button
                  id="predict-up-btn"
                  onClick={() => makePrediction('up')}
                  className="flex-1 max-w-40 bg-accent-green bg-opacity-20 hover:bg-opacity-30 border border-accent-green text-accent-green font-bold py-4 rounded-xl text-xl transition-all hover:scale-105"
                >
                  📈 UP
                </button>
                <button
                  id="predict-down-btn"
                  onClick={() => makePrediction('down')}
                  className="flex-1 max-w-40 bg-accent-red bg-opacity-20 hover:bg-opacity-30 border border-accent-red text-accent-red font-bold py-4 rounded-xl text-xl transition-all hover:scale-105"
                >
                  📉 DOWN
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'result' && (
        <div className="glass rounded-2xl p-8 border border-border text-center">
          <div className="text-6xl mb-4">{balance > 10000 ? '🏆' : balance === 10000 ? '🤝' : '😅'}</div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">Game Over!</h3>
          <div className="space-y-3 my-6">
            <div className="flex justify-between items-center bg-surface rounded-xl p-3">
              <span className="text-text-secondary">Final Score</span>
              <span className="font-bold text-accent-yellow text-xl">{score} pts</span>
            </div>
            <div className="flex justify-between items-center bg-surface rounded-xl p-3">
              <span className="text-text-secondary">Final Balance</span>
              <span className={`font-bold font-mono text-xl ${balance > 10000 ? 'text-accent-green' : 'text-accent-red'}`}>
                ${balance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center bg-surface rounded-xl p-3">
              <span className="text-text-secondary">P&L</span>
              <span className={`font-bold font-mono ${balance - 10000 >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                {balance - 10000 >= 0 ? '+' : ''}${(balance - 10000).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            id="play-again-btn"
            onClick={startGame}
            className="bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-bold px-8 py-3 rounded-xl text-lg transition-all hover:scale-105"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
