import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PageContainer from '../components/layout/PageContainer';
import MarketStats from '../components/dashboard/MarketStats';
import TopSignals from '../components/dashboard/TopSignals';
import AgentStatus from '../components/dashboard/AgentStatus';

import { useSignals } from '../hooks/useSignals';

export default function HomePage({ onNavigate }) {
  const { signals } = useSignals();
  return (

    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar onNavigate={onNavigate} />
        <PageContainer>
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Opportunity Intelligence</h1>
              <p className="subtitle">Real-time signals from BSE/NSE filings and smart-money flow.</p>
            </header>

            <MarketStats signalCount={signals.length} />


            <div className="dashboard-main-grid">
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
      
      <style dangerouslySetInnerHTML={{ __html: `
        .page-header { margin-bottom: 2rem; }
        .page-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--primary); }
        .subtitle { color: var(--text-muted); margin-top: 0.25rem; }
        .dashboard-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-top: 2rem; }
      `}} />
    </div>
  );
}