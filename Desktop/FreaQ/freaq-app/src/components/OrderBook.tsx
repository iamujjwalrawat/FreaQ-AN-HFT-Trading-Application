'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  symbol: string;
  exchange: string;
}

interface OrderLevel {
  price: number;
  size: number;
  total: number;
}

function generateOrderBook(midPrice: number) {
  const bids: OrderLevel[] = [];
  const asks: OrderLevel[] = [];
  let bidTotal = 0, askTotal = 0;

  for (let i = 0; i < 15; i++) {
    const bidPrice = midPrice * (1 - 0.0001 * (i + 1) - Math.random() * 0.0002);
    const askPrice = midPrice * (1 + 0.0001 * (i + 1) + Math.random() * 0.0002);
    const bidSize = Math.floor(Math.random() * 500 + 10);
    const askSize = Math.floor(Math.random() * 500 + 10);
    bidTotal += bidSize;
    askTotal += askSize;
    bids.push({ price: parseFloat(bidPrice.toFixed(2)), size: bidSize, total: bidTotal });
    asks.push({ price: parseFloat(askPrice.toFixed(2)), size: askSize, total: askTotal });
  }
  return { bids, asks };
}

function generateRecentTrades(midPrice: number) {
  return Array.from({ length: 20 }, (_, i) => ({
    price: parseFloat((midPrice * (1 + (Math.random() - 0.5) * 0.004)).toFixed(2)),
    size: Math.floor(Math.random() * 200 + 1),
    side: Math.random() > 0.5 ? 'buy' : 'sell',
    time: new Date(Date.now() - i * 800).toLocaleTimeString('en-US', { hour12: false }),
  }));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 border border-border text-sm">
        <p className="text-text-muted mb-1">{label}</p>
        <p className="font-mono font-bold text-accent-blue">${payload[0]?.value?.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function OrderBook({ symbol, exchange }: Props) {
  const [quote, setQuote] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: OrderLevel[]; asks: OrderLevel[] } | null>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'chart' | 'orderbook' | 'trades'>('chart');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderQty, setOrderQty] = useState('10');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [timeframe, setTimeframe] = useState('30');
  const prevPrice = useRef<number | null>(null);
  const [priceClass, setPriceClass] = useState('');

  const fetchData = useCallback(async () => {
    try {
      // Determine if crypto
      const isCrypto = ['bitcoin', 'ethereum', 'solana', 'BTC', 'ETH'].includes(symbol);
      const type = isCrypto ? 'crypto' : 'quote';
      const cryptoMap: Record<string, string> = { 'BTC': 'bitcoin', 'ETH': 'ethereum', 'SOL': 'solana' };
      const querySymbol = isCrypto ? (cryptoMap[symbol] || symbol.toLowerCase()) : symbol;

      const [quoteRes, historyRes] = await Promise.all([
        fetch(`/api/market?type=${type}&symbol=${querySymbol}`),
        fetch(`/api/market?type=history&symbol=${symbol}&days=${timeframe}`),
      ]);

      if (quoteRes.ok) {
        const q = await quoteRes.json();
        if (prevPrice.current !== null) {
          if (q.price > prevPrice.current) setPriceClass('price-up');
          else if (q.price < prevPrice.current) setPriceClass('price-down');
        }
        prevPrice.current = q.price;
        setQuote(q);
        setOrderBook(generateOrderBook(q.price));
        setTrades(generateRecentTrades(q.price));
        if (!orderPrice) setOrderPrice(q.price?.toFixed(2) || '');
      }

      if (historyRes.ok) {
        const h = await historyRes.json();
        if (h.data && Array.isArray(h.data)) {
          const chartData = h.data.map((d: any) => ({
            time: new Date(d.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            close: d.close,
            open: d.open,
            high: d.high,
            low: d.low,
            volume: d.volume,
          }));
          setHistory(chartData);
        }
      }
    } catch (e) {
      console.error('Error fetching trading data:', e);
    } finally {
      setLoading(false);
    }

    // Clear price flash after 500ms
    setTimeout(() => setPriceClass(''), 500);
  }, [symbol, timeframe, orderPrice]);

  useEffect(() => {
    setLoading(true);
    setOrderPrice('');
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  const submitOrder = async () => {
    const price = parseFloat(orderPrice) || quote?.price || 0;
    const qty = parseInt(orderQty) || 1;
    setOrderStatus('Submitting...');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo',
          action: orderSide,
          symbol,
          shares: qty,
          price,
          exchange,
        }),
      });
      if (res.ok) {
        setOrderStatus(`✅ ${orderSide.toUpperCase()} ${qty} ${symbol} @ $${price.toFixed(2)} — Executed!`);
        setTimeout(() => setOrderStatus(''), 4000);
      } else {
        const err = await res.json();
        setOrderStatus(`❌ ${err.error || 'Order failed'}`);
      }
    } catch (e) {
      setOrderStatus('❌ Network error');
    }
  };

  const isPositive = (quote?.changePercent || 0) >= 0;
  const maxBidTotal = orderBook ? Math.max(...orderBook.bids.map(b => b.total)) : 1;
  const maxAskTotal = orderBook ? Math.max(...orderBook.asks.map(a => a.total)) : 1;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 h-full">
      {/* Chart & Info - 2/3 width */}
      <div className="xl:col-span-2 border-r border-border">
        {/* Symbol Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold font-mono text-text-primary">{symbol}</h2>
                <span className="text-xs bg-accent-blue bg-opacity-20 text-accent-blue px-2 py-0.5 rounded-full border border-accent-blue border-opacity-30">
                  {exchange}
                </span>
              </div>
              {loading ? (
                <div className="skeleton h-8 w-40 rounded mt-2"></div>
              ) : (
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-3xl font-bold font-mono ${priceClass} transition-colors`}>
                    ${quote?.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
                  </span>
                  <div className={isPositive ? 'text-accent-green' : 'text-accent-red'}>
                    <span className="font-mono text-lg">{isPositive ? '+' : ''}{quote?.change?.toFixed(2) || '0'}</span>
                    <span className="font-mono text-sm ml-1">({isPositive ? '+' : ''}{quote?.changePercent?.toFixed(2) || '0'}%)</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-text-muted text-xs">Open</div>
                <div className="font-mono text-text-primary">${quote?.open?.toFixed(2) || '—'}</div>
              </div>
              <div>
                <div className="text-text-muted text-xs">High</div>
                <div className="font-mono text-accent-green">${quote?.high?.toFixed(2) || '—'}</div>
              </div>
              <div>
                <div className="text-text-muted text-xs">Low</div>
                <div className="font-mono text-accent-red">${quote?.low?.toFixed(2) || '—'}</div>
              </div>
              <div>
                <div className="text-text-muted text-xs">Prev Close</div>
                <div className="font-mono text-text-primary">${quote?.prevClose?.toFixed(2) || '—'}</div>
              </div>
              <div>
                <div className="text-text-muted text-xs">Volume</div>
                <div className="font-mono text-text-primary">{quote?.volume ? (quote.volume / 1e6).toFixed(1) + 'M' : '—'}</div>
              </div>
              <div>
                <div className="text-text-muted text-xs">Mkt Cap</div>
                <div className="font-mono text-text-primary">
                  {quote?.marketCap ? '$' + (quote.marketCap / 1e9).toFixed(1) + 'B' : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-border">
          {(['chart', 'orderbook', 'trades'] as const).map(view => (
            <button
              key={view}
              id={`view-${view}`}
              onClick={() => setActiveView(view)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                activeView === view
                  ? 'text-text-primary border-b-2 border-accent-blue'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {view === 'chart' ? '📈 Chart' : view === 'orderbook' ? '📋 Order Book' : '⚡ Trade Feed'}
            </button>
          ))}

          {activeView === 'chart' && (
            <div className="ml-auto flex items-center gap-1 px-4">
              {['7', '30', '90', '365'].map(d => (
                <button
                  key={d}
                  onClick={() => setTimeframe(d)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    timeframe === d ? 'bg-accent-blue text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {d === '7' ? '1W' : d === '30' ? '1M' : d === '90' ? '3M' : '1Y'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chart View */}
        {activeView === 'chart' && (
          <div className="p-4">
            {loading ? (
              <div className="skeleton h-80 rounded-xl"></div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={history} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#00ff88' : '#ff3355'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={isPositive ? '#00ff88' : '#ff3355'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a3040" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#7aa4c0' }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#7aa4c0' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v.toFixed(0)}`}
                    domain={['auto', 'auto']}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={isPositive ? '#00ff88' : '#ff3355'}
                    strokeWidth={2}
                    fill="url(#chartGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: isPositive ? '#00ff88' : '#ff3355' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Order Book View */}
        {activeView === 'orderbook' && orderBook && (
          <div className="overflow-hidden">
            <div className="grid grid-cols-2 h-80">
              {/* Bids */}
              <div className="border-r border-border overflow-hidden">
                <div className="grid grid-cols-3 text-xs text-text-muted px-3 py-2 border-b border-border">
                  <span>Price</span>
                  <span className="text-center">Size</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="overflow-y-auto">
                  {orderBook.bids.map((bid, i) => (
                    <div key={i} className="relative grid grid-cols-3 text-xs px-3 py-1 hover:bg-accent-green hover:bg-opacity-10">
                      <div
                        className="absolute inset-0 bg-accent-green opacity-10"
                        style={{ width: `${(bid.total / maxBidTotal) * 100}%`, right: 0, left: 'auto' }}
                      ></div>
                      <span className="font-mono text-accent-green relative z-10">{bid.price.toFixed(2)}</span>
                      <span className="text-center font-mono text-text-primary relative z-10">{bid.size}</span>
                      <span className="text-right font-mono text-text-secondary relative z-10">{bid.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asks */}
              <div>
                <div className="grid grid-cols-3 text-xs text-text-muted px-3 py-2 border-b border-border">
                  <span>Price</span>
                  <span className="text-center">Size</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="overflow-y-auto">
                  {orderBook.asks.map((ask, i) => (
                    <div key={i} className="relative grid grid-cols-3 text-xs px-3 py-1 hover:bg-accent-red hover:bg-opacity-10">
                      <div
                        className="absolute inset-0 bg-accent-red opacity-10"
                        style={{ width: `${(ask.total / maxAskTotal) * 100}%` }}
                      ></div>
                      <span className="font-mono text-accent-red relative z-10">{ask.price.toFixed(2)}</span>
                      <span className="text-center font-mono text-text-primary relative z-10">{ask.size}</span>
                      <span className="text-right font-mono text-text-secondary relative z-10">{ask.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trade Feed */}
        {activeView === 'trades' && (
          <div className="overflow-y-auto h-80">
            <div className="grid grid-cols-4 text-xs text-text-muted px-4 py-2 border-b border-border sticky top-0 bg-surface">
              <span>Price</span>
              <span className="text-center">Size</span>
              <span className="text-center">Side</span>
              <span className="text-right">Time</span>
            </div>
            {trades.map((trade, i) => (
              <div
                key={i}
                className={`trade-feed-item grid grid-cols-4 text-xs px-4 py-1.5 border-b border-border/30 ${
                  trade.side === 'buy' ? 'hover:bg-accent-green hover:bg-opacity-5' : 'hover:bg-accent-red hover:bg-opacity-5'
                }`}
              >
                <span className={`font-mono font-semibold ${trade.side === 'buy' ? 'text-accent-green' : 'text-accent-red'}`}>
                  {trade.price.toFixed(2)}
                </span>
                <span className="text-center font-mono text-text-primary">{trade.size}</span>
                <span className={`text-center font-semibold uppercase text-xs ${trade.side === 'buy' ? 'text-accent-green' : 'text-accent-red'}`}>
                  {trade.side}
                </span>
                <span className="text-right font-mono text-text-muted">{trade.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Panel - 1/3 width */}
      <div className="bg-surface flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-text-primary mb-3">⚡ Place Order</h3>

          {/* Buy/Sell Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-border mb-4">
            <button
              id="order-buy-btn"
              onClick={() => setOrderSide('buy')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                orderSide === 'buy' ? 'bg-accent-green text-black' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              BUY
            </button>
            <button
              id="order-sell-btn"
              onClick={() => setOrderSide('sell')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                orderSide === 'sell' ? 'bg-accent-red text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              SELL
            </button>
          </div>

          {/* Order Type */}
          <div className="flex gap-2 mb-4">
            {(['market', 'limit'] as const).map(type => (
              <button
                key={type}
                id={`order-type-${type}`}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors capitalize ${
                  orderType === type
                    ? 'border-accent-blue bg-accent-blue bg-opacity-20 text-accent-blue'
                    : 'border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Price Input (for limit orders) */}
          {orderType === 'limit' && (
            <div className="mb-3">
              <label className="text-xs text-text-muted mb-1 block">Limit Price ($)</label>
              <input
                id="order-price-input"
                type="number"
                value={orderPrice}
                onChange={(e) => setOrderPrice(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-text-primary"
                placeholder={quote?.price?.toFixed(2) || '0.00'}
                step="0.01"
              />
            </div>
          )}

          {/* Quantity */}
          <div className="mb-4">
            <label className="text-xs text-text-muted mb-1 block">Quantity (shares)</label>
            <input
              id="order-qty-input"
              type="number"
              value={orderQty}
              onChange={(e) => setOrderQty(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-text-primary"
              placeholder="10"
              min="1"
            />
          </div>

          {/* Order Total */}
          {quote && (
            <div className="bg-surface-elevated rounded-xl p-3 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Est. Total</span>
                <span className="font-mono font-semibold text-text-primary">
                  ${((quote.price || 0) * (parseInt(orderQty) || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>Bid: ${quote.prevClose?.toFixed(2)}</span>
                <span>Ask: ${(quote.price * 1.001)?.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            id="submit-order-btn"
            onClick={submitOrder}
            className={`w-full font-bold py-3 rounded-xl text-sm transition-all ${
              orderSide === 'buy'
                ? 'bg-accent-green hover:bg-green-400 text-black'
                : 'bg-accent-red hover:bg-red-500 text-white'
            }`}
          >
            {orderSide === 'buy' ? '🟢' : '🔴'} {orderType === 'market' ? 'Market' : 'Limit'} {orderSide.toUpperCase()} {symbol}
          </button>

          {orderStatus && (
            <div className={`mt-3 text-xs p-3 rounded-xl text-center ${
              orderStatus.includes('✅') ? 'bg-accent-green bg-opacity-20 text-accent-green' : 'bg-accent-red bg-opacity-20 text-accent-red'
            }`}>
              {orderStatus}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h4 className="text-xs text-text-muted uppercase font-semibold mb-3">Key Stats</h4>
          <div className="space-y-2 text-sm">
            {[
              { label: '52W High', value: `$${quote?.week52High?.toFixed(2) || '—'}`, color: 'text-accent-green' },
              { label: '52W Low', value: `$${quote?.week52Low?.toFixed(2) || '—'}`, color: 'text-accent-red' },
              { label: 'P/E Ratio', value: quote?.pe?.toFixed(1) || '—', color: 'text-text-primary' },
              { label: 'Market Cap', value: quote?.marketCap ? '$' + (quote.marketCap / 1e9).toFixed(1) + 'B' : '—', color: 'text-text-primary' },
              { label: 'Avg Volume', value: quote?.volume ? (quote.volume / 1e6).toFixed(1) + 'M' : '—', color: 'text-text-primary' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-border/50">
                <span className="text-text-muted">{stat.label}</span>
                <span className={`font-mono ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-surface-elevated rounded-xl border border-border/50">
            <div className="text-xs text-text-muted uppercase font-semibold mb-2">Data Source</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 bg-accent-green rounded-full live-dot"></span>
              <span className="text-text-secondary">{quote?.source === 'yahoo' ? 'Yahoo Finance' : quote?.source === 'finnhub' ? 'Finnhub' : 'Live Feed'}</span>
            </div>
            <div className="text-text-muted text-xs mt-1">
              Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
