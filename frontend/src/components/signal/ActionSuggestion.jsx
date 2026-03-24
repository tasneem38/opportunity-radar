import React from 'react';
import { Target, TrendingUp, ShieldCheck } from 'lucide-react';

export default function ActionSuggestion({ signal = {} }) {
  const metadata = signal.metadata || {};
  return (
    <div className="card action-card">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Target size={20} className="text-accent" /> Action Plan
      </h3>
      
      <div className="action-item">
        <div className="action-label">Recommendation</div>
        <div className="action-val">{signal.sentiment || "Monitor"}</div>
      </div>
      
      <div className="action-item">
        <div className="action-label">Focus Area</div>
        <div className="action-val">{signal.signal_summary || "BSE/NSE Filing"}</div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--primary-light)', borderRadius: '8px', fontSize: '0.875rem' }}>
        <p style={{ fontWeight: 600, color: 'var(--primary)' }}>Logic:</p>
        <p style={{ color: 'var(--text-muted)' }}>{signal.action_suggestion || "Awaiting further agent consolidation..."}</p>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        .action-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
        .action-label { color: var(--text-muted); font-size: 0.875rem; }
        .action-val { font-weight: 700; }
        .text-success { color: var(--success); }
        .text-danger { color: var(--danger); }
      `}} />
    </div>
  );
}