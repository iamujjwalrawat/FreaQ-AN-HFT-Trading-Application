'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, PieChart, Shield, Zap, Target, Copy } from 'lucide-react';

const HEDGE_FUNDS = [
  {
    name: 'Renaissance Technologies (Medallion)',
    strategy: 'Quantitative / Statistical Arbitrage',
    aum: '$130B+',
    returnYTD: '+32.4%',
    topHoldings: ['NVO', 'VRTX', 'GILD', 'AMZN'],
    riskProfile: 'High',
  },
  {
    name: 'Citadel',
    strategy: 'Multi-Strategy High Frequency',
    aum: '$62B+',
    returnYTD: '+28.1%',
    topHoldings: ['SPY Puts', 'MSFT', 'NVDA', 'AMZN'],
    riskProfile: 'Medium-High',
  },
  {
    name: 'Two Sigma',
    strategy: 'AI Driven Systematic',
    aum: '$60B+',
    returnYTD: '+24.7%',
    topHoldings: ['AAPL', 'GOOGL', 'META', 'TSLA'],
    riskProfile: 'Medium',
  },
  {
    name: 'HRT (Hudson River Trading)',
    strategy: 'Algorithmic Market Making',
    aum: 'Undisclosed',
    returnYTD: '+41.2%',
    topHoldings: ['High Frequency Index Arbs', 'Options Volatility'],
    riskProfile: 'Very High',
  }
];

export default function SmartInvest() {
  const [selectedFund, setSelectedFund] = useState(HEDGE_FUNDS[0]);
  const [copying, setCopying] = useState(false);
  const [amount, setAmount] = useState('10000');

  const handleCopy = () => {
    setCopying(true);
    setTimeout(() => {
      setCopying(false);
      alert(`Successfully allocated $${amount} to ${selectedFund.name} copy-trade algorithm! (Simulation)`);
    }, 1500);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2 flex items-center gap-3">
          <Target className="text-accent-blue" size={32} />
          Smart Invest & Copy Trading
        </h1>
        <p className="text-text-secondary">
          Track and instantly copy the advanced strategies of top-tier quantitative hedge funds. Empowered by FreaQ Nano-Second Market Maker algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funds List */}
        <div className="col-span-1 border border-border rounded-2xl glass p-4 flex flex-col gap-3">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Shield className="text-accent-green" size={20} />
            Elite Hedge Funds
          </h2>
          {HEDGE_FUNDS.map((fund, idx) => (
            <motion.div
              key={fund.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedFund(fund)}
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                selectedFund.name === fund.name
                  ? 'bg-accent-blue/10 border-accent-blue'
                  : 'bg-surface hover:bg-surface-elevated border-transparent hover:border-border'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-text-primary text-sm">{fund.name}</span>
                <span className="text-accent-green font-mono text-xs font-semibold">{fund.returnYTD}</span>
              </div>
              <p className="text-xs text-text-muted">{fund.strategy}</p>
            </motion.div>
          ))}
        </div>

        {/* Selected Fund Details */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <motion.div
            key={selectedFund.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-border rounded-2xl glass p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-text-primary mb-1">{selectedFund.name}</h2>
                <span className="text-sm text-accent-blue font-medium bg-accent-blue/10 px-3 py-1 rounded-full">
                  {selectedFund.strategy}
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono text-accent-green font-bold">{selectedFund.returnYTD}</div>
                <div className="text-xs text-text-muted">YTD Return</div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-surface p-4 rounded-xl border border-border">
                <div className="text-xs text-text-muted mb-1">Assets Under Mgmt</div>
                <div className="font-mono font-bold text-text-primary">{selectedFund.aum}</div>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-border">
                <div className="text-xs text-text-muted mb-1">Risk Profile</div>
                <div className="font-bold text-accent-yellow">{selectedFund.riskProfile}</div>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-border col-span-2">
                <div className="text-xs text-text-muted mb-1">Top Holdings</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedFund.topHoldings.map(h => (
                    <span key={h} className="text-xs border border-border px-2 py-1 rounded bg-surface-elevated font-mono text-text-primary">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-surface-elevated border border-border p-5 rounded-xl">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Zap className="text-accent-yellow" size={16} />
                Instant Nano-Second Copy Trade
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue transition-colors font-mono"
                  />
                </div>
                <button
                  onClick={handleCopy}
                  disabled={copying}
                  className="bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {copying ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Copy size={18} />
                      Start Copying
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-3">
                FreaQ's algorithmic bridge replicates {selectedFund.name}'s trades within 0.0003ms latency.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-2xl p-5 glass">
              <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                <Activity size={18} className="text-accent-red" />
                Market Maker Dynamics
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Experience full proprietary software capabilities. Enable <strong>Smart Routing</strong> to sweep liquidity across 15+ dark pools. Provide liquidity and earn rebates just like HRT or Citadel. FreaQ completely democratizes order book manipulation.
              </p>
            </div>
            <div className="border border-border rounded-2xl p-5 glass">
              <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-accent-green" />
                API Ecosystem Intact
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Connects directly to global feeds via customized generic APIs. Replicates proprietary connections for high-frequency low-latency updates. Join, fetch, and execute seamlessly with state-of-the-art UI/UX.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
