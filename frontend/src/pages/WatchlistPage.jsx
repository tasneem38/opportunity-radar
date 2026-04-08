import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/common/Badge';

import { useWatchlist } from '../hooks/useWatchlist';
import { Loader2, Eye, TrendingUp, TrendingDown } from 'lucide-react';

export default function WatchlistPage({ onNavigate }) {
  const { watchlist, loading, error } = useWatchlist();

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar onNavigate={onNavigate} />
        <PageContainer>
          <div style={{ padding: '2rem' }}>
            <div className="page-header fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Eye size={32} className="text-primary" />
                  My Watchlist
                </h1>
                <p className="subtitle">
                  Track stocks with AI-powered sentiment analysis from live signals.
                </p>
              </div>
              {loading && <Loader2 className="animate-spin text-primary" size={24} />}
            </div>

            {error && (
              <div className="card fade-up" style={{ 
                color: 'var(--danger)', 
                background: 'rgba(239,68,68,0.05)',
                marginTop: '1.5rem',
                animationDelay: '0.1s'
              }}>
                ⚠️ Failed to update watchlist: {error}
              </div>
            )}
           
            {!loading && watchlist.length === 0 && (
              <div className="card fade-up" style={{ 
                marginTop: '2rem', 
                textAlign: 'center', 
                padding: '4rem',
                animationDelay: '0.1s'
              }}>
                <Eye size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.3, color: 'var(--text-muted)' }} />
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>Your watchlist is empty</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                  Add stocks from the Radar or Analysis pages to track their AI sentiment and price movements.
                </p>
              </div>
            )}

            {watchlist.length > 0 && (
              <div className="card fade-up" style={{ marginTop: '2rem', padding: 0, animationDelay: '0.1s' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Company</th>
                      <th>Price</th>
                      <th>Change</th>
                      <th>AI Sentiment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlist.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '0.95rem' }}>
                          {item.symbol}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {item.company || item.symbol}
                        </td>
                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                          ₹{item.price}
                        </td>
                        <td>
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.25rem',
                            color: (item.change && item.change.startsWith('+')) ? 'var(--success)' : 'var(--danger)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}>
                            {(item.change && item.change.startsWith('+')) ? 
                              <TrendingUp size={16} /> : 
                              <TrendingDown size={16} />
                            }
                            {item.change}
                          </div>
                        </td>
                        <td>
                          <Badge 
                            variant={
                              item.sentiment?.toLowerCase().includes('bull') ? 'success' :
                              item.sentiment?.toLowerCase().includes('bear') ? 'danger' : 'info'
                            }
                          >
                            {item.sentiment}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
