import { useState, useEffect } from 'react';
import { FileText, TrendingUp, BarChart3, MessageSquare, Zap } from 'lucide-react';

export default function AgentStatus() {
  const agents = [
    { 
      name: 'Filing Analyst',
      icon: <FileText size={20} />,
      status: 'online',
      lastScan: '2m ago'
    },
    { 
      name: 'Deal Tracker',
      icon: <TrendingUp size={20} />,
      status: 'online',
      lastScan: '5m ago'
    },
    { 
      name: 'Results Analyzer',
      icon: <BarChart3 size={20} />,
      status: 'online',
      lastScan: '1m ago'
    },
    { 
      name: 'Sentiment AI',
      icon: <MessageSquare size={20} />,
      status: 'online',
      lastScan: '3m ago'
    },
    { 
      name: 'Signal Scorer',
      icon: <Zap size={20} />,
      status: 'online',
      lastScan: 'Just now'
    },
  ];

  return (
    <div className="card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
          AI Agent Swarm
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          5 specialists monitoring markets 24/7
        </p>
      </div>

      <div className="agent-status-grid">
        {agents.map((agent, idx) => (
          <div key={idx} className="agent-node fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="agent-icon-wrapper">
              {agent.icon}
            </div>
            <div className="agent-name">{agent.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {agent.lastScan}
            </div>
            <div className="status-pill status-online">
              <span className="status-dot"></span>
              Active
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
