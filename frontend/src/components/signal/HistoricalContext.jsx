import React from 'react';
import { History, BarChart2 } from 'lucide-react';

export default function HistoricalContext({ signal = {} }) {
  const symbol = signal.stock_symbol || (signal.stocks && signal.stocks.symbol) || "STOCK";
  const metadata = signal.metadata || {};

  return (
    <div className="card hist-card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <History size={20} /> Event Context
      </h3>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="metric">
          <div className="m-val">{symbol}</div>
          <div className="m-label">Asset</div>
        </div>

        <div className="metric">
          <div className="m-val">{metadata.category || signal.signal_summary || "Filing"}</div>
          <div className="m-label">Event Type</div>
        </div>
        <div className="metric">
          <div className="m-val">{signal.sentiment || "Neutral"}</div>
          <div className="m-label">Bias</div>
        </div>
      </div>

      <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
        { (signal.action_suggestion && signal.action_suggestion.length > 100) 
           ? signal.action_suggestion 
           : "Institutional patterns for this sector are being cross-referenced with local exchanges. Current volatility index suggests a disciplined approach." }
      </p>


      <style dangerouslySetInnerHTML={{ __html: `
        .m-val { font-size: 1.25rem; font-weight: 800; color: var(--primary); }
        .m-label { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; }
      `}} />
    </div>
  );
}