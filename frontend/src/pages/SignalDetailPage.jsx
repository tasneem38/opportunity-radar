import React from 'react';
import { ArrowLeft, Share2, Bookmark, TrendingUp, TrendingDown } from 'lucide-react';
import PriceChart from '../components/charts/PriceChart';
import SignalBreakdown from '../components/signal/SignalBreakdown';
import HistoricalContext from '../components/signal/HistoricalContext';
import ActionSuggestion from '../components/signal/ActionSuggestion';

import { useWatchlist } from '../hooks/useWatchlist';

export default function SignalDetailPage({ signal: passedSignal, onBack }) {
  const { addToWatchlist } = useWatchlist();
  const signal = passedSignal || {};
  
  const symbol = signal.stock_symbol || (signal.stocks && signal.stocks.symbol) || signal.symbol || "STOCK";
  const company = signal.company_name || (signal.stocks && signal.stocks.company_name) || "Company Name";
  const score = signal.conviction_score || signal.score || 7.5;
  const sentiment = signal.sentiment || "Neutral";
  const category = signal.signal_summary || signal.category || "Opportunity";
  const logic = signal.action_suggestion || signal.signal_text || "Analyzing market impact...";
  const isPositive = sentiment.toLowerCase().includes('bull') || score >= 7;

  return (
    <div className="detail-page app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <header className="detail-nav" style={{ 
        padding: '1.25rem 2rem', 
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.background = 'var(--primary-light)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'white';
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h2 style={{ 
            fontFamily: 'Syne, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--primary)'
          }}>
            {symbol} Analysis
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              addToWatchlist(symbol);
              alert(`${symbol} added to watchlist!`);
            }}
            style={{
              padding: '0.625rem 1.25rem',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Bookmark size={16} />
            Save
          </button>
          <button
            style={{
              padding: '0.625rem 1.25rem',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </header>

      <div className="content-area" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-main)', padding: '2rem' }}>
        <div className="detail-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div className="main-col">
            {/* Header Card */}
            <div className="card fade-up" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '2.5rem', 
                    fontWeight: 800,
                    color: 'var(--primary)',
                    marginBottom: '0.5rem'
                  }}>
                    {symbol}
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{company}</p>
                  <span className="category-badge" style={{ marginTop: '0.75rem' }}>{category}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '2rem', 
                    fontWeight: 700,
                    color: 'var(--primary)',
                    marginBottom: '0.5rem'
                  }}>
                    ₹{signal.price || "---"}
                  </div>
                  <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: isPositive ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 700
                  }}>
                    {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    {sentiment}
                  </div>
                </div>
              </div>
              <PriceChart symbol={symbol} />
            </div>

            <SignalBreakdown signal={signal} />
            <HistoricalContext signal={signal} />
          </div>

          <div className="side-col">
            {/* Conviction Score Card */}
            <div className="card fade-up" style={{ 
              background: `linear-gradient(135deg, ${score >= 8 ? '#10b981' : score >= 6 ? '#f59e0b' : '#ef4444'}, ${score >= 8 ? '#059669' : score >= 6 ? '#d97706' : '#dc2626'})`,
              color: '#fff', 
              textAlign: 'center', 
              marginBottom: '1.5rem',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              animationDelay: '0.1s'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '200px',
                height: '200px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }}></div>
              <p style={{ 
                opacity: 0.9, 
                fontSize: '0.8rem', 
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 700,
                marginBottom: '1rem',
                position: 'relative'
              }}>
                Conviction Score
              </p>
              <div style={{ 
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '5rem', 
                fontWeight: 900, 
                margin: '0.5rem 0',
                lineHeight: 1,
                position: 'relative'
              }}>
                {score.toFixed(1)}
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.75rem 1rem', 
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginTop: '1.5rem',
                position: 'relative'
              }}>
                {score >= 8 ? '🔥 High Conviction Setup' : score >= 6 ? '🎯 Monitor Setup' : '⚠️ Low Conviction'}
              </div>
            </div>

            <ActionSuggestion signal={signal} />
          </div>
        </div>
      </div>
    </div>
  );
}
