'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { EXCHANGES, MARKET_INDICES } from '@/lib/exchanges';

interface Props {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

const GLOBAL_MARKETS = [
  { name: 'S&P 500', symbol: '^GSPC', exchange: 'NYSE 🇺🇸', price: '5,248.80', change: '+0.82%', positive: true },
  { name: 'NASDAQ', symbol: '^IXIC', exchange: 'NASDAQ 🇺🇸', price: '16,482.00', change: '+1.24%', positive: true },
  { name: 'Dow Jones', symbol: '^DJI', exchange: 'NYSE 🇺🇸', price: '39,142.00', change: '+0.34%', positive: true },
  { name: 'FTSE 100', symbol: '^FTSE', exchange: 'LSE 🇬🇧', price: '8,024.44', change: '-0.28%', positive: false },
  { name: 'Nikkei 225', symbol: '^N225', exchange: 'TSE 🇯🇵', price: '38,820.00', change: '+0.56%', positive: true },
  { name: 'SENSEX', symbol: '^BSESN', exchange: 'BSE 🇮🇳', price: '74,248.00', change: '+0.94%', positive: true },
  { name: 'NIFTY 50', symbol: '^NSEI', exchange: 'NSE 🇮🇳', price: '22,514.00', change: '+0.87%', positive: true },
  { name: 'ASX 200', symbol: '^AXJO', exchange: 'ASX 🇦🇺', price: '7,846.00', change: '+1.12%', positive: true },
  { name: 'Hang Seng', symbol: '^HSI', exchange: 'HKEX 🇭🇰', price: '17,284.00', change: '-1.34%', positive: false },
  { name: 'Euro Stoxx 50', symbol: '^STOXX50E', exchange: 'Euronext 🇪🇺', price: '4,928.00', change: '+0.45%', positive: true },
  { name: 'DAX', symbol: '^GDAXI', exchange: 'XETRA 🇩🇪', price: '18,496.00', change: '+0.68%', positive: true },
  { name: 'TSX Comp.', symbol: '^GSPTSE', exchange: 'TSX 🇨🇦', price: '21,845.00', change: '+0.22%', positive: true },
];

const SECTOR_PERFORMANCE = [
  { name: 'Technology', change: '+2.4%', positive: true },
  { name: 'Healthcare', change: '+0.8%', positive: true },
  { name: 'Financials', change: '+1.2%', positive: true },
  { name: 'Energy', change: '-0.6%', positive: false },
  { name: 'Consumer', change: '+0.3%', positive: true },
  { name: 'Materials', change: '-1.1%', positive: false },
  { name: 'Industrials', change: '+0.7%', positive: true },
  { name: 'Utilities', change: '-0.2%', positive: false },
];

const TRENDING_STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA', price: '920.50', change: '+3.42%', volume: '48.2M', positive: true },
  { symbol: 'AAPL', name: 'Apple', price: '175.48', change: '+2.14%', volume: '62.1M', positive: true },
  { symbol: 'TSLA', name: 'Tesla', price: '215.30', change: '-1.23%', volume: '85.4M', positive: false },
  { symbol: 'META', name: 'Meta', price: '524.72', change: '+2.31%', volume: '22.8M', positive: true },
  { symbol: 'MSFT', name: 'Microsoft', price: '395.22', change: '+1.87%', volume: '18.3M', positive: true },
  { symbol: 'AMZN', name: 'Amazon', price: '188.44', change: '+1.56%', volume: '31.7M', positive: true },
  { symbol: 'RELIANCE.NS', name: 'Reliance', price: '₹2,945', change: '+1.45%', volume: '8.4M', positive: true },
  { symbol: 'BTC-USD', name: 'Bitcoin', price: '$68,245', change: '+4.12%', volume: '$48.2B', positive: true },
];

function generateSparkline() {
  let v = 100;
  return Array.from({ length: 20 }, (_, i) => {
    v += (Math.random() - 0.47) * 3;
    return { i, v: Math.max(50, v) };
  });
}

export default function MarketOverview({ selectedSymbol, onSelectSymbol }: Props) {
  const [sparklines, setSparklines] = useState<Record<string, any[]>>({});
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [portfolioChart, setPortfolioChart] = useState<any[]>([]);

  useEffect(() => {
    // Generate sparklines for indices
    const sl: Record<string, any[]> = {};
    GLOBAL_MARKETS.forEach(m => { sl[m.symbol] = generateSparkline(); });
    setSparklines(sl);

    // Generate heatmap data
    const sectors = ['Tech', 'Financials', 'Health', 'Energy', 'Consumer', 'Materials', 'Industrials', 'Utilities'];
    setHeatmapData(sectors.map(sector => ({
      sector,
      change: parseFloat(((Math.random() - 0.45) * 6).toFixed(2)),
    })));

    // Portfolio performance chart
    let val = 100000;
    setPortfolioChart(
      Array.from({ length: 30 }, (_, i) => {
        val += (Math.random() - 0.42) * 2000;
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Math.max(80000, val),
        };
      })
    );
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Global Market Indices Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary font-display">🌍 Global Markets</h2>
          <div className="text-xs text-accent-green flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-accent-green rounded-full live-dot"></span>
            Real-time data
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {GLOBAL_MARKETS.map((market, i) => (
            <div
              key={i}
              className="glass rounded-xl p-3 border border-border card-hover cursor-pointer group"
              onClick={() => onSelectSymbol(market.symbol)}
            >
              <div className="text-xs text-text-muted mb-1">{market.exchange}</div>
              <div className="font-semibold text-text-primary text-sm mb-1 truncate">{market.name}</div>
              <div className="font-mono font-bold text-text-primary text-sm">{market.price}</div>
              <div className={`text-xs font-mono mt-1 ${market.positive ? 'text-accent-green' : 'text-accent-red'}`}>
                {market.change}
              </div>
              {/* Sparkline */}
              {sparklines[market.symbol] && (
                <div className="h-8 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklines[market.symbol]}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={market.positive ? '#00ff88' : '#ff3355'}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trending + Sector Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Stocks */}
        <div className="lg:col-span-2 glass rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-text-primary">🔥 Trending Now</h3>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-xs border-b border-border">
                  <th className="text-left px-4 py-2">Symbol</th>
                  <th className="text-right px-4 py-2">Price</th>
                  <th className="text-right px-4 py-2">Change</th>
                  <th className="text-right px-4 py-2 hidden sm:table-cell">Volume</th>
                </tr>
              </thead>
              <tbody>
                {TRENDING_STOCKS.map((stock, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-surface-elevated cursor-pointer transition-colors"
                    onClick={() => onSelectSymbol(stock.symbol)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono font-semibold text-text-primary">{stock.symbol}</div>
                      <div className="text-xs text-text-muted">{stock.name}</div>
                    </td>
                    <td className="text-right px-4 py-3 font-mono text-text-primary">{stock.price}</td>
                    <td className={`text-right px-4 py-3 font-mono font-semibold ${stock.positive ? 'text-accent-green' : 'text-accent-red'}`}>
                      {stock.change}
                    </td>
                    <td className="text-right px-4 py-3 text-text-muted hidden sm:table-cell">{stock.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Heatmap */}
        <div className="glass rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-text-primary">📊 Sector Performance</h3>
          </div>
          <div className="p-4 space-y-2">
            {SECTOR_PERFORMANCE.map((sector, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-xs text-text-secondary w-24 truncate">{sector.name}</div>
                <div className="flex-1 h-6 rounded overflow-hidden bg-surface-elevated">
                  <div
                    className={`h-full transition-all duration-500 ${sector.positive ? 'bg-accent-green' : 'bg-accent-red'} bg-opacity-60`}
                    style={{ width: `${Math.abs(parseFloat(sector.change)) * 15 + 10}%` }}
                  ></div>
                </div>
                <div className={`text-xs font-mono w-12 text-right ${sector.positive ? 'text-accent-green' : 'text-accent-red'}`}>
                  {sector.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Breadth */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Advancing', value: '2,847', color: 'text-accent-green', bg: 'bg-accent-green', percent: 62 },
          { label: 'Declining', value: '1,523', color: 'text-accent-red', bg: 'bg-accent-red', percent: 33 },
          { label: 'Unchanged', value: '342', color: 'text-text-muted', bg: 'bg-text-muted', percent: 7 },
          { label: 'New Highs', value: '187', color: 'text-accent-cyan', bg: 'bg-accent-cyan', percent: 40 },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-border">
            <div className="text-xs text-text-muted mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
            <div className="mt-2 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
              <div className={`h-full ${stat.bg} bg-opacity-70 rounded-full`} style={{ width: `${stat.percent}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Fear & Greed + VIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 border border-border">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">😱 Fear & Greed Index</h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-accent-yellow mb-2">65</div>
            <div className="text-accent-yellow font-semibold mb-1">Greed</div>
            <div className="h-3 bg-gradient-to-r from-accent-red via-accent-yellow to-accent-green rounded-full relative overflow-visible">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-accent-yellow shadow-lg"
                style={{ left: '65%', transform: 'translate(-50%, -50%)' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>Extreme Fear</span>
              <span>Neutral</span>
              <span>Extreme Greed</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-border">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">📉 VIX - Volatility Index</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold text-text-primary font-mono">18.4</div>
              <div className="text-accent-green text-sm mt-1">-2.3% ↓ Low volatility</div>
            </div>
            <div className="text-right space-y-2 text-sm">
              <div className="text-text-muted">Below 15: <span className="text-accent-green">Complacent</span></div>
              <div className="text-text-muted">15-25: <span className="text-accent-yellow">Normal</span></div>
              <div className="text-text-muted">Above 30: <span className="text-accent-red">Fear</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Quick View */}
      <div className="glass rounded-xl border border-border p-4">
        <h3 className="font-bold text-text-primary mb-4">🌐 Crypto Markets (24/7)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { symbol: 'BTC', name: 'Bitcoin', price: '$68,245', change: '+4.12%', positive: true },
            { symbol: 'ETH', name: 'Ethereum', price: '$3,842', change: '+2.87%', positive: true },
            { symbol: 'SOL', name: 'Solana', price: '$178.40', change: '+5.23%', positive: true },
            { symbol: 'BNB', name: 'Binance', price: '$605.30', change: '+1.45%', positive: true },
          ].map((crypto, i) => (
            <div key={i} className="bg-surface-elevated rounded-xl p-4 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-text-primary">{crypto.symbol}</span>
                <span className={`text-xs ${crypto.positive ? 'text-accent-green' : 'text-accent-red'}`}>{crypto.change}</span>
              </div>
              <div className="font-mono text-sm text-text-primary">{crypto.price}</div>
              <div className="text-xs text-text-muted">{crypto.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}