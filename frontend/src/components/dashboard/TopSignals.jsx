import { useState } from 'react';
import SignalCard from '../signal/SignalCard';
import { useSignals } from '../../hooks/useSignals';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TopSignals({ onNavigate }) {
  const { signals, loading, error } = useSignals();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  if (loading && signals.length === 0) {
    return <div className="top-signals card"><Loader2 className="animate-spin" /> Gathering intel...</div>;
  }

  const totalPages = Math.ceil(signals.length / pageSize);
  const displaySignals = signals.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  return (
    <div className="top-signals card">
      <div className="card-header" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
          {loading ? 'Refreshing Signals...' : 'High Conviction Signals'}
        </h3>
        {loading && <Loader2 className="animate-spin" size={16} />}
      </div>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Failed to sync with radar: {error}</div>}

      <div className="signal-list">
        {displaySignals.map((sig, idx) => {
          // Map Supabase fields to SignalCard props
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

      <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <button 
          className="btn btn-secondary" 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button 
          className="btn btn-secondary" 
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(p => p + 1)}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}} />
    </div>

  );
}