import React from 'react';
import { BadgeCheck, Search, Database, MessageSquare, Zap } from 'lucide-react';

export default function SignalBreakdown({ signal = {} }) {
  const symbol = signal.stock_symbol || (signal.stocks && signal.stocks.symbol) || "STOCK";
  const agents = (signal.metadata && signal.metadata.agents) ? signal.metadata.agents : [
    { 
      name: "Intelligence Engine", 
      signal: signal.sentiment || "Bullish", 
      detail: signal.action_suggestion || "Analyzing regulatory filings and market sentiment.", 
      confidence: (signal.conviction_score || 8.5) / 10, 
      icon: <Search size={18} /> 
    }
  ];


  return (
    <div className="card breakdown-card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Multi-Agent Convergence</h3>
      
      <div className="agent-breakdown-list">
        {agents.map((agent, idx) => (
          <div key={idx} className="breakdown-item">
            <div className="agent-mark">
              {agent.icon}
              <div className="line"></div>
            </div>
            <div className="agent-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{agent.name}</span>
                <span className="conf-pill">{(agent.confidence * 100).toFixed(0)}% Conf.</span>
              </div>
              <p style={{ fontWeight: 600, color: 'var(--success)', margin: '0.2rem 0' }}>{agent.signal}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{agent.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .agent-breakdown-list { display: flex; flex-direction: column; gap: 0; }
        .breakdown-item { display: flex; gap: 1.5rem; }
        .agent-mark { display: flex; flex-direction: column; align-items: center; color: var(--text-muted); }
        .agent-mark .line { width: 2px; flex: 1; background: var(--border); margin: 0.5rem 0; }
        .breakdown-item:last-child .line { display: none; }
        .agent-content { flex: 1; padding-bottom: 2rem; }
        .breakdown-item:last-child .agent-content { padding-bottom: 0; }
        .conf-pill { font-size: 0.75rem; background: var(--primary-light); color: var(--primary); padding: 0.1rem 0.5rem; border-radius: 4px; font-weight: 700; }
      `}} />
    </div>
  );
}