import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PageContainer from '../components/layout/PageContainer';
import SignalCard from '../components/signal/SignalCard';

import { useSignals } from '../hooks/useSignals';
import { Loader2, Radar, Filter } from 'lucide-react';

export default function SignalsPage({ onNavigate }) {
  const { signals, loading, error } = useSignals();
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...new Set(signals.map(s => s.category || 'General'))];
  
  const filteredSignals = activeFilter === 'All' 
    ? signals 
    : signals.filter(s => (s.category || 'General') === activeFilter);


  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar onNavigate={onNavigate} />
        <PageContainer>
          <div className="signals-page-content">
            <header className="page-header" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Radar className="text-primary" size={28} />
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Live Radar</h1>
              </div>
              <p className="subtitle" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                All high-conviction opportunities detected by the multi-agent swarm.
              </p>
            </header>

            <div className="filter-bar" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>
                <Filter size={16} /> <span style={{ fontSize: '0.875rem' }}>Filter:</span>
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
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            )}

            {error && (
              <div className="card" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                Radar system offline: {error}
              </div>
            )}

            {!loading && signals.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                <h3>No signals detected yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>The agents are currently scanning BSE/NSE filings. Check back in a moment.</p>
              </div>
            )}

            <div className="signals-grid">
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
                      console.log("Card Clicked:", cardProps.symbol);
                      if (onNavigate) onNavigate('detail', sig);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </PageContainer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .signals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .filter-btn {
          padding: 0.5rem 1rem;
          border-radius: 99px;
          border: 1px solid var(--border);
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }
        .filter-btn:hover:not(.active) {
          border-color: var(--primary);
          color: var(--primary);
        }
        .animate-spin { animation: spin 1s linear infinite; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
