import React from 'react';
import { Target, TrendingUp, Lightbulb } from 'lucide-react';

export default function ActionSuggestion({ signal = {} }) {
  const metadata = signal.metadata || {};
  const sentiment = signal.sentiment || "Monitor";
  const isPositive = sentiment.toLowerCase().includes('bull') || (signal.conviction_score || 0) >= 7;
  
  return (
    <div className="card action-card fade-up" style={{ animationDelay: '0.2s' }}>
      <h3 style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        fontSize: '1.25rem',
        fontWeight: 800,
        color: 'var(--primary)'
      }}>
        <Target size={22} className="text-accent" /> Action Plan
      </h3>
      
      <div style={{ 
        marginBottom: '1.5rem',
        padding: '1.25rem',
        borderRadius: '12px',
        background: isPositive ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
        border: `2px solid ${isPositive ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
      }}>
        <div style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          Recommendation
        </div>
        <div style={{ 
          fontSize: '1.5rem',
          fontWeight: 800,
          color: isPositive ? 'var(--success)' : 'var(--warning)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TrendingUp size={24} />
          {sentiment}
        </div>
      </div>
      
      <div className="action-item">
        <div className="action-label">Focus Area</div>
        <div className="action-val">{signal.signal_summary || signal.category || "BSE/NSE Filing"}</div>
      </div>

      <div className="action-item">
        <div className="action-label">Category</div>
        <div className="action-val">{signal.category || "Market Intelligence"}</div>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1.25rem', 
        background: 'var(--primary-light)', 
        borderRadius: '12px',
        border: '1px solid rgba(26,60,110,0.15)'
      }}>
        <p style={{ 
          fontWeight: 700, 
          color: 'var(--primary)',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <Lightbulb size={16} />
          Intelligence Logic:
        </p>
        <p style={{ 
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          lineHeight: 1.6
        }}>
          {signal.action_suggestion || signal.signal_text || "Awaiting further agent consolidation..."}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .action-item { 
          display: flex; 
          justify-content: space-between; 
          padding: 1rem 0; 
          border-bottom: 1px solid var(--border);
          align-items: center;
        }
        .action-item:last-of-type {
          border-bottom: none;
        }
        .action-label { 
          color: var(--text-muted); 
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .action-val { 
          font-weight: 700;
          color: var(--primary);
        }
      `}} />
    </div>
  );
}
