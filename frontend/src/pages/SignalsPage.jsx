import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PageContainer from '../components/layout/PageContainer';
import SignalCard from '../components/signal/SignalCard';

import { useSignals } from '../hooks/useSignals';
import { Loader2, Radar, Filter } from 'lucide-react';

export default function SignalsPage({ onNavigate, searchQuery }) {
  const { signals, loading, error } = useSignals();
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...new Set(signals.map(s => s.category || 'General'))];
  
  const filteredSignals = signals.filter(s => {
    if (activeFilter !== 'All' && (s.category || 'General') !== activeFilter) return false;
    
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    const symbol = (s.stock_symbol || (s.stocks && s.stocks.symbol) || '').toLowerCase();
    const company = (s.company_name || (s.stocks && s.stocks.company_name) || '').toLowerCase();
    const summary = (s.signal_summary || s.category || '').toLowerCase();
    const details = (s.action_suggestion || s.signal_text || '').toLowerCase();
    
    return symbol.includes(term) || company.includes(term) || summary.includes(term) || details.includes(term);
  });

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar onNavigate={onNavigate} />
        <PageContainer>
          <div className="signals-page-content" style={{ padding: '2rem' }}>
            <header className="page-header fade-up">
              <h1>
                <Radar size={32} className="text-primary" />
                Live Radar
              </h1>
              <p className="subtitle">
                All high-conviction opportunities detected by the multi-agent swarm.
              </p>
            </header>

            <div 
              className="filter-bar fade-up" 
              style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                marginBottom: '2rem', 
                flexWrap: 'wrap',
                alignItems: 'center',
                animationDelay: '0.1s'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginRight: '0.5rem', 
                color: 'var(--text-muted)',
                fontWeight: 600
              }}>
                <Filter size={16} /> 
                <span style={{ fontSize: '0.875rem' }}>Filter by:</span>
              </div>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading && signals.length === 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <Loader2 className="animate-spin text-primary" size={48} style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Scanning market intelligence...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="card" style={{ 
                border: '1px solid var(--danger)', 
                background: 'rgba(239,68,68,0.05)',
                color: 'var(--danger)' 
              }}>
                ⚠️ Radar system offline: {error}
              </div>
            )}

            {!loading && signals.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                <Radar size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <h3 style={{ marginBottom: '0.5rem' }}>No signals detected yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  The agents are currently scanning BSE/NSE filings. Check back in a moment.
                </p>
              </div>
            )}

            <div 
              className="signals-grid fade-up" 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                gap: '1.5rem',
                animationDelay: '0.2s'
              }}
            >
              {filteredSignals.map((sig, idx) => {
                const cardProps = {
                  symbol: sig.stock_symbol || (sig.stocks && sig.stocks.symbol) || "STOCK",
                  company: sig.company_name || (sig.stocks && sig.stocks.company_name) || "Company",
                  score: sig.conviction_score || 7.5,
                  category: sig.category || sig.signal_summary || "Opportunity",
                  signal: sig.action_suggestion || sig.signal_text || "Analyzing market impact...",
                  time: sig.created_at ? new Date(sig.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
                };

                return (
                  <SignalCard
                    key={idx}
                    {...cardProps}
                    onClick={() => {
                      if (onNavigate) onNavigate('detail', sig);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
