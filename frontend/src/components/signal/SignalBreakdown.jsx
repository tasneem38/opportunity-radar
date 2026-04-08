import React from 'react';
import { Cpu, Search, Database, MessageSquare, Zap } from 'lucide-react';

export default function SignalBreakdown({ signal = {} }) {
  const symbol = signal.stock_symbol || (signal.stocks && signal.stocks.symbol) || "STOCK";
  const agents = (signal.metadata && signal.metadata.agents) ? signal.metadata.agents : [
    { 
      name: "Intelligence Engine", 
      signal: signal.sentiment || "Bullish", 
      detail: signal.action_suggestion || "Analyzing regulatory filings and market sentiment.", 
      confidence: (signal.conviction_score || 8.5) / 10, 
      icon: <Cpu size={18} /> 
    }
  ];

  return (
    <div className="card breakdown-card fade-up" style={{ marginTop: '1.5rem', animationDelay: '0.1s' }}>
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 800, 
        marginBottom: '2rem',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Cpu size={22} className="text-accent" />
        Multi-Agent Convergence
      </h3>
      
      <div className="agent-breakdown-list">
        {agents.map((agent, idx) => (
          <div key={idx} className="breakdown-item">
            <div className="agent-mark">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary-light), rgba(232,119,34,0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                border: '1px solid var(--border)'
              }}>
                {agent.icon}
              </div>
              <div className="line"></div>
            </div>
            <div className="agent-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>{agent.name}</span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  background: agent.confidence >= 0.8 ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                  color: agent.confidence >= 0.8 ? 'var(--success)' : 'var(--warning)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontWeight: 700,
                  letterSpacing: '0.02em'
                }}>
                  {(agent.confidence * 100).toFixed(0)}% Conf.
                </span>
              </div>
              <p style={{ 
                fontWeight: 700, 
                color: 'var(--accent)', 
                margin: '0.5rem 0',
                fontSize: '0.95rem'
              }}>
                {agent.signal}
              </p>
              <p style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-muted)', 
                lineHeight: 1.6 
              }}>
                {agent.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .agent-breakdown-list { display: flex; flex-direction: column; gap: 0; }
        .breakdown-item { display: flex; gap: 1.5rem; }
        .agent-mark { display: flex; flex-direction: column; align-items: center; }
        .agent-mark .line { 
          width: 2px; 
          flex: 1; 
          background: linear-gradient(180deg, var(--border) 0%, transparent 100%);
          margin: 0.75rem 0; 
        }
        .breakdown-item:last-child .line { display: none; }
        .agent-content { flex: 1; padding-bottom: 2rem; }
        .breakdown-item:last-child .agent-content { padding-bottom: 0; }
      `}} />
    </div>
  );
}
