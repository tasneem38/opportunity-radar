import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PageContainer from '../components/layout/PageContainer';
import MarketStats from '../components/dashboard/MarketStats';
import TopSignals from '../components/dashboard/TopSignals';
import AgentStatus from '../components/dashboard/AgentStatus';
import { Activity } from 'lucide-react';

import { useSignals } from '../hooks/useSignals';

export default function HomePage({ onNavigate }) {
  const { signals } = useSignals();
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar onNavigate={onNavigate} />
        <PageContainer>
          <div className="dashboard-content" style={{ padding: '2rem' }}>
            <header className="page-header fade-up">
              <h1>
                <Activity size={32} className="text-accent" />
                Opportunity Intelligence
              </h1>
              <p className="subtitle">
                Real-time signals from BSE/NSE filings and institutional smart-money flow.
              </p>
            </header>

            <MarketStats signalCount={signals.length} />

            <div className="dashboard-main-grid fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="left-panel">
                <TopSignals onNavigate={onNavigate} />
              </div>
              <div className="right-panel">
                <AgentStatus />
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
