'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DEMO_PORTFOLIO } from '@/lib/exchanges';

interface Props {
  userId: string;
}

export default function Portfolio({ userId }: Props) {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState<'positions' | 'history' | 'analytics'>('positions');
  const [pnlHistory, setPnlHistory] = useState<any[]>([]);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`/api/portfolio?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (e) {
      console.error('Portfolio fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // Generate mock P&L history
    let val = 100000;
    const history = Array.from({ length: 30 }, (_, i) => {
      val += (Math.random() - 0.42) * 2500;
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: Math.max(80000, val) };
    });
    setPnlHistory(history);
  }, [userId]);

  // Fetch live prices for positions
  useEffect(() => {
    if (!portfolio?.positions?.length) return;
    const fetchPositionPrices = async () => {
      const newPrices: Record<string, number> = {};
      for (const pos of portfolio.positions) {
        try {
          const res = await fetch(`/api/market?type=quote&symbol=${pos.symbol}`);
          if (res.ok) {
            const data = await res.json();
            newPrices[pos.symbol] = data.price;
          }
        } catch (e) {}
      }
      setPrices(newPrices);
    };
    fetchPositionPrices();
  }, [portfolio?.positions]);

  const resetPortfolio = async () => {
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'reset' }),
    });
    fetchPortfolio();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const positions = portfolio?.positions || [];
  const totalInvested = positions.reduce((sum: number, p: any) => sum + p.shares * p.avgPrice, 0);
  const currentValue = positions.reduce((sum: number, p: any) => {
    const currentPrice = prices[p.symbol] || p.avgPrice;
    return sum + p.shares * currentPrice;
  }, 0);
  const totalPnl = currentValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const totalValue = (portfolio?.balance || 0) + currentValue;
  const returnFromStart = totalValue - (portfolio?.initialBalance || 100000);
  const returnPercent = ((totalValue / (portfolio?.initialBalance || 100000)) - 1) * 100;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Portfolio Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Value',
            value: `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
            sub: `${returnPercent >= 0 ? '+' : ''}${returnPercent.toFixed(2)}% overall`,
            color: returnPercent >= 0 ? 'text-accent-green' : 'text-accent-red',
            icon: '💰',
          },
          {
            label: 'Cash Balance',
            value: `$${(portfolio?.balance || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
            sub: 'Available to trade',
            color: 'text-accent-blue',
            icon: '💵',
          },
          {
            label: 'Invested',
            value: `$${currentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
            sub: `${positions.length} positions open`,
            color: 'text-text-primary',
            icon: '📊',
          },
          {
            label: 'Unrealized P&L',
            value: `${totalPnl >= 0 ? '+' : ''}$${Math.abs(totalPnl).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
            sub: `${totalPnlPercent >= 0 ? '+' : ''}${totalPnlPercent.toFixed(2)}%`,
            color: totalPnl >= 0 ? 'text-accent-green' : 'text-accent-red',
            icon: totalPnl >= 0 ? '📈' : '📉',
          },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-border">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
            <div className={`text-xs mt-1 ${stat.color} opacity-80`}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Chart */}
      <div className="glass rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-primary">📈 Portfolio Performance</h3>
          <div className={`text-sm font-mono font-semibold ${returnPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {returnFromStart >= 0 ? '+' : ''}${Math.abs(returnFromStart).toLocaleString('en-US', { maximumFractionDigits: 0 })} ({returnPercent.toFixed(2)}%)
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={pnlHistory}>
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3040" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#7aa4c0' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9, fill: '#7aa4c0' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + (v/1000).toFixed(0) + 'K'} width={50} />
            <Tooltip
              contentStyle={{ background: '#0a1520', border: '1px solid #1a3040', borderRadius: '8px', fontSize: '12px' }}
              formatter={(v: any) => ['$' + v.toLocaleString(), 'Value']}
            />
            <Area type="monotone" dataKey="value" stroke="#00ff88" fill="url(#portfolioGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sections */}
      <div className="glass rounded-xl border border-border overflow-hidden">
        <div className="flex border-b border-border">
          {(['positions', 'history', 'analytics'] as const).map(section => (
            <button
              key={section}
              id={`portfolio-section-${section}`}
              onClick={() => setActiveSection(section)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeSection === section
                  ? 'border-accent-blue text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {section === 'positions' ? '📋 Positions' : section === 'history' ? '📝 History' : '📊 Analytics'}
            </button>
          ))}
        </div>

        {/* Positions */}
        {activeSection === 'positions' && (
          <div>
            {positions.length === 0 ? (
              <div className="text-center py-12 text-text-muted">
                <div className="text-4xl mb-3">📭</div>
                <div className="font-semibold">No open positions</div>
                <div className="text-sm mt-1">Go to Trading to place your first order</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-muted text-xs border-b border-border">
                      <th className="text-left px-5 py-3">Symbol</th>
                      <th className="text-right px-5 py-3">Shares</th>
                      <th className="text-right px-5 py-3">Avg Price</th>
                      <th className="text-right px-5 py-3">Current</th>
                      <th className="text-right px-5 py-3">Value</th>
                      <th className="text-right px-5 py-3">P&L</th>
                      <th className="text-right px-5 py-3">P&L %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos: any, i: number) => {
                      const currPrice = prices[pos.symbol] || pos.avgPrice;
                      const value = pos.shares * currPrice;
                      const pnl = value - pos.shares * pos.avgPrice;
                      const pnlPct = (pnl / (pos.shares * pos.avgPrice)) * 100;
                      return (
                        <tr key={i} className="border-b border-border/50 hover:bg-surface-elevated transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-mono font-semibold text-text-primary">{pos.symbol}</div>
                            <div className="text-xs text-text-muted">{pos.exchange || 'NASDAQ'}</div>
                          </td>
                          <td className="text-right px-5 py-4 font-mono text-text-primary">{pos.shares}</td>
                          <td className="text-right px-5 py-4 font-mono text-text-secondary">${pos.avgPrice.toFixed(2)}</td>
                          <td className="text-right px-5 py-4 font-mono text-text-primary">${currPrice.toFixed(2)}</td>
                          <td className="text-right px-5 py-4 font-mono text-text-primary">${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                          <td className={`text-right px-5 py-4 font-mono font-semibold ${pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                          </td>
                          <td className={`text-right px-5 py-4 font-mono ${pnlPct >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Transaction History */}
        {activeSection === 'history' && (
          <div>
            {(!portfolio?.transactions || portfolio.transactions.length === 0) ? (
              <div className="text-center py-12 text-text-muted">
                <div className="text-4xl mb-3">📃</div>
                <div>No transaction history yet</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-muted text-xs border-b border-border">
                      <th className="text-left px-5 py-3">Time</th>
                      <th className="text-left px-5 py-3">Type</th>
                      <th className="text-left px-5 py-3">Symbol</th>
                      <th className="text-right px-5 py-3">Shares</th>
                      <th className="text-right px-5 py-3">Price</th>
                      <th className="text-right px-5 py-3">Total</th>
                      <th className="text-right px-5 py-3">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.transactions.slice(0, 50).map((tx: any, i: number) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-surface-elevated transition-colors">
                        <td className="px-5 py-3 text-text-muted text-xs font-mono">
                          {new Date(tx.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${
                            tx.type === 'buy' ? 'bg-accent-green bg-opacity-20 text-accent-green' : 'bg-accent-red bg-opacity-20 text-accent-red'
                          }`}>{tx.type}</span>
                        </td>
                        <td className="px-5 py-3 font-mono font-semibold text-text-primary">{tx.symbol}</td>
                        <td className="text-right px-5 py-3 font-mono text-text-primary">{tx.shares}</td>
                        <td className="text-right px-5 py-3 font-mono text-text-secondary">${tx.price.toFixed(2)}</td>
                        <td className="text-right px-5 py-3 font-mono text-text-primary">${tx.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                        <td className={`text-right px-5 py-3 font-mono ${tx.pnl !== undefined ? (tx.pnl >= 0 ? 'text-accent-green' : 'text-accent-red') : 'text-text-muted'}`}>
                          {tx.pnl !== undefined ? `${tx.pnl >= 0 ? '+' : ''}$${tx.pnl.toFixed(2)}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics */}
        {activeSection === 'analytics' && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Trades', value: portfolio?.simulationStats?.totalTrades || 0 },
                { label: 'Win Rate', value: `${((portfolio?.simulationStats?.winRate || 0) * 100).toFixed(1)}%` },
                { label: 'Sharpe Ratio', value: (portfolio?.simulationStats?.sharpeRatio || 0).toFixed(2) },
                { label: 'Max Drawdown', value: `${((portfolio?.simulationStats?.maxDrawdown || 0) * 100).toFixed(1)}%` },
                { label: 'Profit Factor', value: (portfolio?.simulationStats?.profitFactor || 1).toFixed(2) },
                { label: 'Return', value: `${returnPercent.toFixed(2)}%` },
              ].map((stat, i) => (
                <div key={i} className="bg-surface-elevated rounded-xl p-4 border border-border/50">
                  <div className="text-xs text-text-muted mb-1">{stat.label}</div>
                  <div className="text-xl font-bold font-mono text-text-primary">{stat.value}</div>
                </div>
              ))}
            </div>

            <button
              id="reset-portfolio-btn"
              onClick={resetPortfolio}
              className="w-full py-3 border border-accent-red text-accent-red rounded-xl hover:bg-accent-red hover:text-white transition-colors text-sm font-semibold"
            >
              🔄 Reset Portfolio (Restore $100,000)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
