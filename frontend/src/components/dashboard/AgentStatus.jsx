import React from 'react';
import { Cpu, Database, Search, MessageSquare, Zap } from 'lucide-react';

export default function AgentStatus() {
  const agents = [
    { name: "Filing Watcher", icon: <Search size={18} />, status: "Polling", last: "2m ago" },
    { name: "Deal Tracker", icon: <Database size={18} />, status: "Active", last: "15m ago" },
    { name: "Results AI", icon: <Cpu size={18} />, status: "Idle", last: "4h ago" },
    { name: "Sentiment Analyzer", icon: <MessageSquare size={18} />, status: "Monitoring", last: "5m ago" },
    { name: "Signal Scorer", icon: <Zap size={18} />, status: "Processing", last: "Now" },
  ];

  return (
    <div className="agent-status-panel card">
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Agent System Health</h3>
      
      <div className="agent-status-grid">
        {agents.map((agent, idx) => (
          <div key={idx} className="agent-node">
            <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{agent.icon}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{agent.name}</div>
            <div className={`status-pill ${agent.status === 'Active' || agent.status === 'Now' ? 'status-online' : 'status-pending'}`}>
              {agent.status}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{agent.last}</div>
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .status-pending { background: #fef3c7; color: #92400e; }
      `}} />
    </div>
  );
}