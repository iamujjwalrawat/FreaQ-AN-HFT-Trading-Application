'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

const STRATEGIES = [
  { id: 'market_making', name: 'Market Making', icon: '⚖️', desc: 'Profit from bid-ask spread', risk: 'Low', typical: '+0.5-2%/day' },
  { id: 'momentum', name: 'Momentum', icon: '🚀', desc: 'Follow strong price trends', risk: 'Medium', typical: '+1-5%/day' },
  { id: 'stat_arb', name: 'Statistical Arb', icon: '📊', desc: 'Mean reversion strategies', risk: 'Medium', typical: '+0.8-3%/day' },
  { id: 'mean_reversion', name: 'Mean Reversion', icon: '🔄', desc: 'Trade around the average', risk: 'Low-Med', typical: '+0.5-2%/day' },
  { id: 'breakout', name: 'Breakout', icon: '💥', desc: 'Trade level breaks with volume', risk: 'High', typical: '-5 to +10%/day' },
];

function runSimulation(strategy: string, capital: number, days: number) {
  let balance = capital;
  const data = [];
  let maxBalance = capital;
  let maxDrawdown = 0;
  let wins = 0, losses = 0;

  const params: Record<string, { winRate: number; avgWin: number; avgLoss: number; tradesPerDay: number }> = {
    market_making: { winRate: 0.62, avgWin: 0.004, avgLoss: 0.002, tradesPerDay: 50 },
    momentum: { winRate: 0.52, avgWin: 0.015, avgLoss: 0.008, tradesPerDay: 10 },
    stat_arb: { winRate: 0.57, avgWin: 0.008, avgLoss: 0.005, tradesPerDay: 20 },
    mean_reversion: { winRate: 0.60, avgWin: 0.006, avgLoss: 0.004, tradesPerDay: 15 },
    breakout: { winRate: 0.40, avgWin: 0.035, avgLoss: 0.015, tradesPerDay: 5 },
  };

  const p = params[strategy] || params.momentum;
  const d = new Date();

  for (let i = 0; i < days; i++) {
    const dayDate = new Date(d);
    dayDate.setDate(d.getDate() - (days - i));
    const dayOfWeek = dayDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    let dayPnl = 0;
    for (let j = 0; j < p.tradesPerDay; j++) {
      const isWin = Math.random() < p.winRate;
      if (isWin) {
        const gain = balance * p.avgWin * (0.5 + Math.random());
        dayPnl += gain;
        wins++;
      } else {
        const loss = balance * p.avgLoss * (0.5 + Math.random());
        dayPnl -= loss;
        losses++;
      }
    }

    balance += dayPnl;
    if (balance > maxBalance) maxBalance = balance;
    const drawdown = (maxBalance - balance) / maxBalance;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    data.push({
      date: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: parseFloat(balance.toFixed(2)),
      pnl: parseFloat(dayPnl.toFixed(2)),
      drawdown: parseFloat((drawdown * 100).toFixed(2)),
    });
  }

  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? wins / totalTrades : 0;
  const returns = (balance - capital) / capital;
  const sharpe = returns / (maxDrawdown || 0.01) * Math.sqrt(252 / days);

  return {
    data,
    stats: {
      finalBalance: balance,
      totalReturn: returns,
      totalPnl: balance - capital,
      maxDrawdown,
      winRate,
      totalTrades,
      sharpeRatio: sharpe,
      wins,
      losses,
    },
  };
}

export default function TradingSimulator() {
  const [selectedStrategy, setSelectedStrategy] = useState('momentum');
  const [capital, setCapital] = useState(100000);
  const [days, setDays] = useState(30);
  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const runSim = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 800)); // Simulate computation
    const res = runSimulation(selectedStrategy, capital, days);
    setResult(res);
    setRunning(false);
  };

  const isProfit = result?.stats.totalPnl >= 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-text-primary">🎮 HFT Strategy Simulator</h2>
          <p className="text-text-secondary mt-1">Backtest real HFT strategies without any risk. Paper trade with any capital.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="lg:col-span-1 space-y-5">
          {/* Strategy Selection */}
          <div className="glass rounded-xl p-5 border border-border">
            <h3 className="font-semibold text-text-primary mb-4">📋 Strategy</h3>
            <div className="space-y-2">
              {STRATEGIES.map(s => (
                <button
                  key={s.id}
                  id={`strategy-${s.id}`}
                  onClick={() => setSelectedStrategy(s.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedStrategy === s.id
                      ? 'border-accent-blue bg-accent-blue bg-opacity-10'
                      : 'border-border hover:border-border/80 hover:bg-surface-elevated'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <span className="font-medium text-sm text-text-primary">{s.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.risk === 'Low' ? 'bg-accent-green bg-opacity-20 text-accent-green' :
                      s.risk === 'Medium' || s.risk === 'Low-Med' ? 'bg-accent-yellow bg-opacity-20 text-accent-yellow' :
                      'bg-accent-red bg-opacity-20 text-accent-red'
                    }`}>{s.risk}</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1">{s.desc}</div>
                  <div className="text-xs text-accent-cyan mt-1">Typical: {s.typical}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="glass rounded-xl p-5 border border-border">
            <h3 className="font-semibold text-text-primary mb-4">⚙️ Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Starting Capital</label>
                <select
                  id="sim-capital"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary"
                >
                  <option value={10000}>$10,000</option>
                  <option value={50000}>$50,000</option>
                  <option value={100000}>$100,000</option>
                  <option value={500000}>$500,000</option>
                  <option value={1000000}>$1,000,000</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Simulation Period</label>
                <select
                  id="sim-days"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary"
                >
                  <option value={7}>1 Week</option>
                  <option value={30}>1 Month</option>
                  <option value={90}>3 Months</option>
                  <option value={180}>6 Months</option>
                  <option value={365}>1 Year</option>
                </select>
              </div>
            </div>

            <button
              id="run-simulation-btn"
              onClick={runSim}
              disabled={running}
              className="w-full mt-4 bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-bold py-3 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? '⚙️ Simulating...' : '▶ Run Simulation'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-5">
          {!result && !running && (
            <div className="glass rounded-xl p-16 border border-border text-center">
              <div className="text-5xl mb-4">⚡</div>
              <div className="text-xl font-bold text-text-primary mb-2">Ready to Simulate</div>
              <div className="text-text-secondary">Configure your strategy and click Run Simulation</div>
            </div>
          )}

          {running && (
            <div className="glass rounded-xl p-16 border border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full border-2 border-accent-blue border-t-transparent animate-spin"></div>
              </div>
              <div className="text-text-primary font-semibold">Running HFT Simulation...</div>
              <div className="text-text-muted text-sm mt-2">Processing {days} trading days with {STRATEGIES.find(s => s.id === selectedStrategy)?.name}</div>
            </div>
          )}

          {result && !running && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: 'Total Return',
                    value: `${(result.stats.totalReturn * 100).toFixed(2)}%`,
                    color: result.stats.totalReturn >= 0 ? 'text-accent-green' : 'text-accent-red',
                    icon: result.stats.totalReturn >= 0 ? '📈' : '📉',
                  },
                  {
                    label: 'P&L',
                    value: `$${result.stats.totalPnl.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                    color: result.stats.totalPnl >= 0 ? 'text-accent-green' : 'text-accent-red',
                    icon: '💰',
                  },
                  {
                    label: 'Win Rate',
                    value: `${(result.stats.winRate * 100).toFixed(1)}%`,
                    color: result.stats.winRate >= 0.5 ? 'text-accent-green' : 'text-accent-red',
                    icon: '🎯',
                  },
                  {
                    label: 'Sharpe Ratio',
                    value: result.stats.sharpeRatio.toFixed(2),
                    color: result.stats.sharpeRatio > 1 ? 'text-accent-green' : result.stats.sharpeRatio > 0 ? 'text-accent-yellow' : 'text-accent-red',
                    icon: '⚡',
                  },
                ].map((stat, i) => (
                  <div key={i} className="glass rounded-xl p-4 border border-border text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Balance Chart */}
              <div className="glass rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-text-primary mb-3">Portfolio Performance</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={result.data}>
                    <defs>
                      <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isProfit ? '#00ff88' : '#ff3355'} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={isProfit ? '#00ff88' : '#ff3355'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a3040" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#7aa4c0' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 9, fill: '#7aa4c0' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + (v/1000).toFixed(0) + 'K'} width={50} />
                    <Tooltip
                      contentStyle={{ background: '#0a1520', border: '1px solid #1a3040', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(v: any) => ['$' + v.toLocaleString(), 'Balance']}
                    />
                    <Area type="monotone" dataKey="balance" stroke={isProfit ? '#00ff88' : '#ff3355'} fill="url(#simGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Daily P&L */}
              <div className="glass rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text-primary">Daily P&L</h3>
                  <div className="flex gap-4 text-xs text-text-muted">
                    <span>✅ {result.stats.wins} wins</span>
                    <span>❌ {result.stats.losses} losses</span>
                    <span>📊 {result.stats.totalTrades} total trades</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={result.data.slice(-20)}>
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: '#0a1520', border: '1px solid #1a3040', borderRadius: '8px', fontSize: '11px' }}
                      formatter={(v: any) => [v >= 0 ? '+$' + v.toLocaleString() : '-$' + Math.abs(v).toLocaleString(), 'P&L']}
                    />
                    <Bar dataKey="pnl" fill="#0088ff" radius={[2, 2, 0, 0]}
                      label={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Max Drawdown */}
              <div className="glass rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-text-muted">Max Drawdown</div>
                    <div className="text-xl font-bold text-accent-red font-mono">
                      -{(result.stats.maxDrawdown * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Final Balance</div>
                    <div className="text-xl font-bold font-mono text-text-primary">
                      ${result.stats.finalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Risk/Reward</div>
                    <div className="text-xl font-bold font-mono text-accent-cyan">
                      {(result.stats.totalReturn / Math.max(result.stats.maxDrawdown, 0.001)).toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
