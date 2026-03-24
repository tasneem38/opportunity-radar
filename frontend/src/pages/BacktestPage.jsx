import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PageContainer from '../components/layout/PageContainer';
import BacktestChart from '../components/charts/BacktestChart';
import { Play, Loader2, Calendar, Target, TrendingUp } from 'lucide-react';

export default function BacktestPage({ onBack }) {
  const [config, setConfig] = useState({ symbol: 'RELIANCE', start: '2024-01-01', end: '2024-03-24' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runBacktest = () => {
    setLoading(true);
    fetch(`/api/backtest/run?symbol=${config.symbol}&start=${config.start}&end=${config.end}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar onNavigate={onBack} />
        <PageContainer>
          <div className="backtest-header" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Backtest Lab</h1>
            <p className="subtitle" style={{ color: 'var(--text-muted)' }}>Validate Opportunity Radar's historical precision on past market events.</p>
          </div>

          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
            {/* Config Panel */}
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} /> Configuration
              </h3>
              
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Stock Symbol</label>
                <input 
                  type="text" 
                  className="input" 
                  value={config.symbol} 
                  onChange={e => setConfig({...config, symbol: e.target.value.toUpperCase()})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Start Date</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={config.start}
                    onChange={e => setConfig({...config, start: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>End Date</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={config.end}
                    onChange={e => setConfig({...config, end: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <button 
                className="btn-primary" 
                onClick={runBacktest}
                disabled={loading}
                style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                {loading ? 'Simulating...' : 'Run Analysis'}
              </button>
            </div>

            {/* Results Panel */}
            <div className="results-container">
              {!results && !loading && (
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <TrendingUp size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>Configure parameters and click "Run Analysis" to see historical performance.</p>
                </div>
              )}

              {loading && (
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin text-primary" size={48} />
                  <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Crunching historical data...</p>
                </div>
              )}

              {results && results.status === 'success' && (
                <div className="results-content">
                  <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Return</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: results.summary.total_return.startsWith('-') ? 'var(--danger)' : 'var(--success)' }}>
                        {results.summary.total_return}
                      </div>
                    </div>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Win Rate</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{results.summary.success_rate}</div>
                    </div>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Signals Hits</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{results.summary.signals_triggered} / 4</div>
                    </div>
                  </div>

                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Equity Curve (%)</h3>
                    <div style={{ height: '300px' }}>
                      <BacktestChart data={results.chart_data} />
                    </div>
                  </div>
                </div>
              )}

              {results && results.status === 'error' && (
                <div className="card" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                  {results.message}
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}