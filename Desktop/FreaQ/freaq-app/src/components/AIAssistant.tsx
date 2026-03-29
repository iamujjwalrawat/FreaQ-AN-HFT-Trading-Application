'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  'Explain HFT market making strategy',
  'How to read an order book?',
  'What is statistical arbitrage?',
  'Tell me about BSE & NSE markets',
  'How to copy trade top hedge funds?',
  'Analyze Citadel and Two Sigma strategies',
  'How to measure latency arbitrage?',
  'Explain VIX and volatility',
];

interface Props {
  selectedSymbol: string;
}

export default function AIAssistant({ selectedSymbol }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm **FreaQ AI**, your intelligent market analyst powered by advanced AI. 🚀

I can help you with:
- 📊 **Real-time market analysis** for any stock or exchange
- ⚡ **HFT strategy explanations** and optimization tips  
- 🌍 **Global exchange information** (NYSE, NASDAQ, LSE, BSE, NSE, ASX & more)
- 📈 **Technical & fundamental analysis** concepts
- 🎯 **Trading strategy** development and backtesting

${selectedSymbol ? `You currently have **${selectedSymbol}** selected. Ask me anything about it!` : ''}

What would you like to analyze today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          context: { selectedSymbol },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          role: 'assistant',
          content: data.reply || 'Sorry, I could not process your request.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was a connection error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-surface px-1 rounded text-accent-cyan font-mono text-xs">$1</code>')
      .replace(/\n/g, '<br/>')
      .replace(/^- (.*)/gm, '• $1')
      .replace(/^#{1,3} (.*)/gm, '<strong class="text-text-primary text-lg">$1</strong>');
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2">
              🤖 FreaQ AI Analyst
            </h2>
            <p className="text-text-muted text-xs mt-0.5">
              Powered by advanced AI • Market expert for all 13+ exchanges
            </p>
          </div>
          {selectedSymbol && (
            <div className="flex items-center gap-2 text-xs bg-accent-blue bg-opacity-10 border border-accent-blue border-opacity-30 px-3 py-1.5 rounded-full">
              <span className="text-accent-blue">📊</span>
              <span className="text-accent-blue font-mono font-semibold">{selectedSymbol}</span>
              <span className="text-text-muted">selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick prompts */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border overflow-x-auto">
        <div className="flex gap-2 w-max">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              id={`quick-prompt-${i}`}
              onClick={() => sendMessage(prompt)}
              className="text-xs whitespace-nowrap px-3 py-1.5 glass rounded-full border border-border hover:border-accent-blue hover:text-accent-blue transition-colors text-text-secondary"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-accent-blue to-accent-purple text-white'
                : 'bg-gradient-to-br from-accent-green to-accent-cyan text-black'
            }`}>
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </div>

            {/* Message bubble */}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'glass border border-border text-text-primary'
                  : 'bg-accent-blue text-white'
              }`}>
                <div
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                  className="prose-sm"
                />
              </div>
              <span className="text-xs text-text-muted px-1">
                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-sm">
              🤖
            </div>
            <div className="glass border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="text-xs text-text-muted ml-2">Analyzing markets...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-border">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              id="ai-message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Ask about ${selectedSymbol || 'any market'}, strategies, or HFT concepts...`}
              className="w-full bg-surface-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent-blue transition-colors"
              rows={2}
              disabled={loading}
            />
            <div className="absolute bottom-2 right-2 text-xs text-text-muted">
              Enter to send
            </div>
          </div>
          <button
            id="ai-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-11 h-11 bg-accent-blue hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all hover:scale-105"
          >
            <span className="text-white text-lg">↑</span>
          </button>
        </div>
        <div className="text-xs text-text-muted mt-2 text-center">
          FreaQ AI provides educational information only. Not financial advice. Always do your own research.
        </div>
      </div>
    </div>
  );
}
