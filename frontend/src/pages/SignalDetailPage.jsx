import React from 'react';
import { ArrowLeft, Share2, Bookmark, CheckCircle, AlertTriangle } from 'lucide-react';
import PriceChart from '../components/charts/PriceChart';
import SignalBreakdown from '../components/signal/SignalBreakdown';
import HistoricalContext from '../components/signal/HistoricalContext';
import ActionSuggestion from '../components/signal/ActionSuggestion';

import { useWatchlist } from '../hooks/useWatchlist';

export default function SignalDetailPage({ signal: passedSignal, onBack }) {
  const { addToWatchlist } = useWatchlist();
  // If no signal, redirect handled by App.jsx, but safety fallback here
  const signal = passedSignal || {};
  
  // Extract data from signal or nested stocks object
  const symbol = signal.stock_symbol || (signal.stocks && signal.stocks.symbol) || signal.symbol || "STOCK";

  const company = signal.company_name || (signal.stocks && signal.stocks.company_name) || "Company Name";
  const score = signal.conviction_score || signal.score || 7.5;
  const sentiment = signal.sentiment || "Neutral";
  const category = signal.signal_summary || signal.category || "Opportunity";
  const logic = signal.action_suggestion || signal.signal_text || "Analyzing market impact...";

  return (
    <div className="detail-page app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <header className="detail-nav" style={{ padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ArrowLeft className="clickable" onClick={onBack} />
          <h2 style={{ fontSize: '1.25rem' }}>{symbol} Analysis</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Bookmark 
            className="clickable" 
            size={20} 
            onClick={() => {
              addToWatchlist(symbol);
              alert(`${symbol} added to watchlist!`);
            }} 
          />
          <Share2 className="clickable" size={20} />
        </div>

      </header>


      <div className="content-area" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-main)', padding: '2rem' }}>
        <div className="detail-grid">
          <div className="main-col">
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{symbol}</h1>
                  <p style={{ color: 'var(--text-muted)' }}>{company}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{signal.price || "---"}</div>
                  <div style={{ color: 'var(--success)', fontWeight: 600 }}>{sentiment}</div>
                </div>
              </div>
              <PriceChart symbol={symbol} />
            </div>

            <SignalBreakdown signal={signal} />
            <HistoricalContext signal={signal} />
          </div>

          <div className="side-col">
            <div className="card score-card" style={{ background: 'var(--primary)', color: '#fff', textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ opacity: 0.8, fontSize: '0.8rem', textTransform: 'uppercase' }}>Conviction Score</p>
              <div style={{ fontSize: '4rem', fontWeight: 900, margin: '0.5rem 0' }}>{score}</div>
              <p style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                { score > 8 ? 'High Conviction Setup' : 'Monitor Setup' }
              </p>
            </div>

            <ActionSuggestion signal={signal} />
          </div>
        </div>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        .detail-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        .clickable { cursor: pointer; transition: opacity 0.2s; }
        .clickable:hover { opacity: 0.7; }
      `}} />
    </div>
  );
}