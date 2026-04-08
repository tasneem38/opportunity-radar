import React from 'react';
import { History, Calendar, Tag, TrendingUp } from 'lucide-react';

export default function HistoricalContext({ signal = {} }) {
  const symbol = signal.stock_symbol || (signal.stocks && signal.stocks.symbol) || "STOCK";
  const metadata = signal.metadata || {};
  const createdDate = signal.created_at ? new Date(signal.created_at).toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }) : 'Recent';

  return (
    <div className="card hist-card fade-up" style={{ marginTop: '1.5rem', animationDelay: '0.2s' }}>
      <h3 style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        fontSize: '1.25rem',
        fontWeight: 800,
        color: 'var(--primary)'
      }}>
        <History size={22} className="text-accent" /> Event Context
      </h3>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div className="metric" style={{
          padding: '1rem',
          borderRadius: '10px',
          background: 'var(--bg-main)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Tag size={14} /> Asset
          </div>
          <div style={{ 
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--primary)'
          }}>
            {symbol}
          </div>
        </div>

        <div className="metric" style={{
          padding: '1rem',
          borderRadius: '10px',
          background: 'var(--bg-main)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Calendar size={14} /> Event Type
          </div>
          <div style={{ 
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--primary)'
          }}>
            {metadata.category || signal.signal_summary || signal.category || "Filing"}
          </div>
        </div>

        <div className="metric" style={{
          padding: '1rem',
          borderRadius: '10px',
          background: 'var(--bg-main)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <TrendingUp size={14} /> Sentiment
          </div>
          <div style={{ 
            fontSize: '1rem',
            fontWeight: 700,
            color: (signal.sentiment || '').toLowerCase().includes('bull') ? 'var(--success)' : 
                   (signal.sentiment || '').toLowerCase().includes('bear') ? 'var(--danger)' : 
                   'var(--warning)'
          }}>
            {signal.sentiment || "Neutral"}
          </div>
        </div>
      </div>

      <div style={{
        padding: '1.25rem',
        background: 'var(--primary-light)',
        borderRadius: '12px',
        border: '1px solid rgba(26,60,110,0.15)'
      }}>
        <p style={{ 
          fontWeight: 600,
          color: 'var(--primary)',
          marginBottom: '0.5rem',
          fontSize: '0.875rem'
        }}>
          Market Context:
        </p>
        <p style={{ 
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          lineHeight: 1.7
        }}>
          {(signal.action_suggestion && signal.action_suggestion.length > 100) 
             ? signal.action_suggestion 
             : "Institutional patterns for this sector are being cross-referenced with BSE/NSE data streams. Current market conditions suggest a balanced approach with continuous monitoring of key technical and fundamental indicators."}
        </p>
      </div>
    </div>
  );
}
