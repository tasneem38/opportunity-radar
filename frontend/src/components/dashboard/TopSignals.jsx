import { useState } from 'react';
import SignalCard from '../signal/SignalCard';
import { useSignals } from '../../hooks/useSignals';
import { Loader2, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function TopSignals({ onNavigate }) {
  const { signals, loading, error } = useSignals();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  if (loading && signals.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <Loader2 className="animate-spin text-primary" size={32} style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Gathering intelligence...</p>
      </div>
    );
  }

  const totalPages = Math.ceil(signals.length / pageSize);
  const displaySignals = signals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} className="text-accent" />
            High Conviction Signals
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Top opportunities detected by AI agents
          </p>
        </div>
        {loading && <Loader2 className="animate-spin" size={18} />}
      </div>
      
      {error && (
        <div style={{ 
          color: 'var(--danger)', 
          background: 'rgba(239,68,68,0.08)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          Failed to sync with radar: {error}
        </div>
      )}

      <div className="signal-list">
        {displaySignals.map((sig, idx) => {
          const cardProps = {
            symbol: sig.stock_symbol || (sig.stocks && sig.stocks.symbol) || "STOCK",
            company: sig.company_name || (sig.stocks && sig.stocks.company_name) || "Company",
            score: sig.conviction_score || 7.0,
            category: sig.signal_summary || "General",
            signal: sig.action_suggestion || sig.signal_text || "Analyzing market impact...",
            time: sig.created_at ? new Date(sig.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
          };
          return (
            <SignalCard 
              key={idx}
              {...cardProps} 
              onClick={() => onNavigate && onNavigate('detail', sig)}
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid var(--border)' 
        }}>
          <button 
            className="btn btn-secondary" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="btn btn-secondary" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
