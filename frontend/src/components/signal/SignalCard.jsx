import React from 'react';

export default function SignalCard({ symbol, company, score, category, signal, time, onClick }) {
  const getScoreClass = (s) => {
    if (s >= 8) return 'conviction-high';
    if (s >= 6) return 'conviction-med';
    return 'conviction-low';
  };

  return (
    <div className="signal-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={`conviction-badge ${getScoreClass(score)}`}>
        {score.toFixed(1)}
      </div>
      <div className="signal-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 700 }}>
              {symbol}
            </h4>
            {company && company !== symbol && (
              <span style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {company}
              </span>
            )}
          </div>
          <span style={{ 
            fontSize: '0.72rem', 
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            {time}
          </span>
        </div>
        <span className="category-badge">{category}</span>
        <p style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>{signal}</p>
      </div>
    </div>
  );
}
