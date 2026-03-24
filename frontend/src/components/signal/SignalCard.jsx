import React from 'react';

export default function SignalCard({ symbol, company, score, category, signal, time, onClick }) {
  const getScoreColor = (s) => {
    if (s >= 8) return 'conviction-high';
    if (s >= 6) return 'conviction-med';
    return 'conviction-low';
  };

  return (
    <div className="signal-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>

      <div className={`conviction-badge ${getScoreColor(score)}`}>
        {score}
      </div>
      <div className="signal-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>
            {symbol} 
            {company && company !== symbol && (
              <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}> • {company}</span>
            )}
          </h4>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{time}</span>
        </div>
        <p style={{ fontWeight: 600, color: 'var(--accent)', margin: '0.1rem 0' }}>{category}</p>
        <p>{signal}</p>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .conviction-med { background: #fffbeb; color: #b45309; border: 2px solid #fef3c7; }
        .conviction-low { background: #f0fdf4; color: #15803d; border: 2px solid #dcfce7; }
      `}} />
    </div>
  );
}