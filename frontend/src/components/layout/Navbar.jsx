import React from 'react';
import { Brain, Search, Bell, User } from 'lucide-react';

export default function Navbar({ onSearch }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div 
          className="nav-brand" 
          onClick={() => window.dispatchEvent(new CustomEvent('globalNavigate', { detail: 'landing' }))} 
          style={{ cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            background: 'var(--accent)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain size={20} style={{ color: 'white' }} />
          </div>
          <span className="brand-text">Opportunity Radar</span>
        </div>
        
        <div className="nav-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search stocks, signals, or patterns..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (onSearch) onSearch(e.target.value);
                else {
                  window.dispatchEvent(new CustomEvent('globalSearch', { detail: e.target.value }));
                }
              }
            }}
          />
        </div>

        <div className="nav-actions">
          <div className="nav-item">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </div>
          <div className="nav-user">
            <User size={18} />
            <span>Investor Portal</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
