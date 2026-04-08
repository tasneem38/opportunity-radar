import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PageContainer from '../components/layout/PageContainer';
import BacktestChart from '../components/charts/BacktestChart';
import { Play, Loader2, Calendar, Target, TrendingUp, BarChart3 } from 'lucide-react';

export default function BacktestPage({ onNavigate }) {
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
        <Sidebar onNavigate={onNavigate} />
        <PageContainer>
          <div style={{ padding: '2rem' }}>
            <div className="page-header fade-up">
              <h1>
                <BarChart3 size={32} className="text-primary" />
                Backtest Lab
              </h1>
              <p className="subtitle">
                Validate Opportunity Radar's historical precision on past market events.
              </p>
            </div>

            <div className="grid fade-up" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'minmax(320px, 1fr) 2fr', 
              gap: '2rem',
              marginTop: '2rem',
              animationDelay: '0.1s'
            }}>
              {/* Config Panel */}
              <div className="card">
                <h3 style={{ 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: 800
                }}>
                  <Calendar size={20} className="text-accent" /> Configuration
                </h3>
                
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    marginBottom: '0.5rem',
                    color: 'var(--text-main)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Stock Symbol
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    value={config.symbol} 
                    onChange={e => setConfig({...config, symbol: e.target.value.toUpperCase()})}
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem', 
                      borderRadius: '10px', 
                      border: '1.5px solid var(--border)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div className="grid-2" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem', 
                  marginBottom: '2rem' 
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      marginBottom: '0.5rem',
                      color: 'var(--text-main)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Start Date
                    </label>
                    <input 
                      type="date" 
                      className="input" 
                      value={config.start}
                      onChange={e => setConfig({...config, start: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '0.875rem', 
                        borderRadius: '10px', 
                        border: '1.5px solid var(--border)',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      marginBottom: '0.5rem',
                      color: 'var(--text-main)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      End Date
                    </label>
                    <input 
                      type="date" 
                      className="input" 
                      value={config.end}
                      onChange={e => setConfig({...config, end: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '0.875rem', 
                        borderRadius: '10px', 
                        border: '1.5px solid var(--border)',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={runBacktest}
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.75rem',
                    fontSize: '0.95rem'
                  }}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                  {loading ? 'Simulating...' : 'Run Analysis'}
                </button>
              </div>

              {/* Results Panel */}
              <div className="results-container">
                {!results && !loading && (
                  <div className="card" style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    textAlign: 'center', 
                    padding: '4rem'
                  }}>
                    <TrendingUp size={64} strokeWidth={1.5} style={{ marginBottom: '1.5rem', opacity: 0.3, color: 'var(--primary)' }} />
                    <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>Ready to Backtest</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
                      Configure parameters and click "Run Analysis" to see historical performance.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="card" style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '4rem'
                  }}>
                    <Loader2 className="animate-spin text-primary" size={64} />
                    <p style={{ marginTop: '2rem', fontWeight: 600, fontSize: '1.1rem' }}>Crunching historical data...</p>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>This may take a moment</p>
                  </div>
                )}

                {results && results.status === 'success' && (
                  <div className="results-content">
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '1.25rem', 
                      marginBottom: '2rem' 
                    }}>
                      <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 700,
                          marginBottom: '0.75rem'
                        }}>
                          Total Return
                        </div>
                        <div style={{ 
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '2rem', 
                          fontWeight: 800, 
                          color: results.summary.total_return.startsWith('-') ? 'var(--danger)' : 'var(--success)' 
                        }}>
                          {results.summary.total_return}
                        </div>
                      </div>
                      <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 700,
                          marginBottom: '0.75rem'
                        }}>
                          Win Rate
                        </div>
                        <div style={{ 
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '2rem', 
                          fontWeight: 800, 
                          color: 'var(--primary)' 
                        }}>
                          {results.summary.success_rate}
                        </div>
                      </div>
                      <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 700,
                          marginBottom: '0.75rem'
                        }}>
                          Signals Detected
                        </div>
                        <div style={{ 
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '2rem', 
                          fontWeight: 800,
                          color: 'var(--accent)'
                        }}>
                          {results.summary.signals_triggered}
                        </div>
                      </div>
                    </div>

                    <div className="card" style={{ padding: '2rem' }}>
                      <h3 style={{ 
                        marginBottom: '2rem',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <TrendingUp size={20} className="text-success" />
                        Equity Curve (%)
                      </h3>
                      <div style={{ height: '320px' }}>
                        <BacktestChart data={results.chart_data} />
                      </div>
                    </div>
                  </div>
                )}

                {results && results.status === 'error' && (
                  <div className="card" style={{ 
                    border: '1.5px solid var(--danger)', 
                    background: 'rgba(239,68,68,0.05)',
                    color: 'var(--danger)',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>⚠️ {results.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
