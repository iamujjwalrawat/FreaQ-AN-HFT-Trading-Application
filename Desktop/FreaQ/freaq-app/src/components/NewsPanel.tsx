'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  summary?: string;
  symbols?: string[];
}

const CATEGORIES = [
  { id: 'general', label: '🌍 All Markets' },
  { id: 'forex', label: '💱 Forex' },
  { id: 'crypto', label: '₿ Crypto' },
  { id: 'merger', label: '🤝 M&A' },
  { id: 'macro', label: '📊 Macro' },
];

export default function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const fetchNews = async () => {
    try {
      const res = await fetch(`/api/news?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        setNews(data.news || []);
      }
    } catch (e) {
      console.error('News fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [category]);

  const filteredNews = news.filter(n => {
    if (filter === 'all') return true;
    return n.sentiment === filter;
  });

  const formatTime = (timeStr: string) => {
    const d = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'text-accent-green bg-accent-green';
    if (sentiment === 'negative') return 'text-accent-red bg-accent-red';
    return 'text-text-muted bg-text-muted';
  };

  const impactBadge = (impact: string) => {
    if (impact === 'high') return 'bg-accent-red bg-opacity-20 text-accent-red border-accent-red';
    if (impact === 'medium') return 'bg-accent-yellow bg-opacity-20 text-accent-yellow border-accent-yellow';
    return 'bg-border bg-opacity-50 text-text-muted border-border';
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold font-display text-text-primary">📰 Market News</h2>
          <div className="flex items-center gap-2 text-xs text-accent-green mt-1">
            <span className="w-1.5 h-1.5 bg-accent-green rounded-full live-dot"></span>
            Live news from Reuters, Bloomberg, FT, CNBC & more
          </div>
        </div>

        {/* Sentiment filter */}
        <div className="flex gap-2">
          {(['all', 'positive', 'negative'] as const).map(f => (
            <button
              key={f}
              id={`news-filter-${f}`}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                filter === f
                  ? f === 'all' ? 'border-accent-blue bg-accent-blue bg-opacity-20 text-accent-blue'
                    : f === 'positive' ? 'border-accent-green bg-accent-green bg-opacity-20 text-accent-green'
                    : 'border-accent-red bg-accent-red bg-opacity-20 text-accent-red'
                  : 'border-border text-text-muted hover:border-border/80'
              }`}
            >
              {f === 'positive' ? '📈 Bullish' : f === 'negative' ? '📉 Bearish' : '📊 All'}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            id={`news-cat-${cat.id}`}
            onClick={() => setCategory(cat.id)}
            className={`whitespace-nowrap text-sm px-4 py-2 rounded-xl border transition-colors ${
              category === cat.id
                ? 'border-accent-blue bg-accent-blue bg-opacity-20 text-accent-blue'
                : 'border-border text-text-secondary hover:text-text-primary hover:border-border/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNews.map((item, i) => (
            <a
              key={item.id || i}
              href={item.url || '#'}
              target={item.url && item.url !== '#' ? '_blank' : '_self'}
              rel="noopener noreferrer"
              id={`news-item-${i}`}
              className="block glass rounded-xl p-4 border border-border hover:border-accent-blue hover:border-opacity-50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold text-text-muted">{item.source}</span>
                    <span className="text-text-muted text-xs">•</span>
                    <span className="text-xs text-text-muted">{formatTime(item.time)}</span>
                    
                    {/* Impact badge */}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${impactBadge(item.impact)} capitalize`}>
                      {item.impact} impact
                    </span>

                    {/* Symbol tags */}
                    {item.symbols && item.symbols.slice(0, 3).map(sym => (
                      <span key={sym} className="text-xs bg-accent-blue bg-opacity-10 text-accent-blue px-2 py-0.5 rounded">
                        {sym}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-semibold text-text-primary group-hover:text-accent-blue transition-colors leading-snug">
                    {item.title}
                  </h3>
                  
                  {item.summary && (
                    <p className="text-text-secondary text-sm mt-2 leading-relaxed line-clamp-2">{item.summary}</p>
                  )}
                </div>

                {/* Sentiment indicator */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  <div className={`w-2 h-8 rounded-full ${sentimentColor(item.sentiment)} bg-opacity-60`}></div>
                  <span className={`text-xs capitalize ${
                    item.sentiment === 'positive' ? 'text-accent-green' :
                    item.sentiment === 'negative' ? 'text-accent-red' : 'text-text-muted'
                  }`}>
                    {item.sentiment === 'positive' ? '↑' : item.sentiment === 'negative' ? '↓' : '—'}
                  </span>
                </div>
              </div>
            </a>
          ))}

          {filteredNews.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <div className="text-4xl mb-3">📭</div>
              <div>No news matching current filter</div>
            </div>
          )}
        </div>
      )}

      {/* Market Sentiment Summary */}
      <div className="mt-8 glass rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-text-primary mb-4">📊 Sentiment Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Bullish', count: news.filter(n => n.sentiment === 'positive').length, color: 'text-accent-green', bg: 'bg-accent-green' },
            { label: 'Bearish', count: news.filter(n => n.sentiment === 'negative').length, color: 'text-accent-red', bg: 'bg-accent-red' },
            { label: 'Neutral', count: news.filter(n => n.sentiment === 'neutral').length, color: 'text-text-muted', bg: 'bg-text-muted' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.count}</div>
              <div className="text-text-muted text-xs">{s.label}</div>
              <div className="h-1.5 mt-2 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className={`h-full ${s.bg} bg-opacity-70 rounded-full transition-all`}
                  style={{ width: `${news.length > 0 ? (s.count / news.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
