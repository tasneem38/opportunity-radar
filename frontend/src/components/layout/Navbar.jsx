import React from 'react';
import { BadgeCheck, Brain, TrendingUp, Bell, Search, Menu, User } from 'lucide-react';

export default function Navbar({ onSearch }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => window.dispatchEvent(new CustomEvent('globalNavigate', { detail: 'landing' }))} style={{ cursor: 'pointer' }}>
          <Brain className="logo-icon" />
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
                  // Fallback global event if onSearch isn't passed yet
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
            <User size={20} />
            <span>Investor Portal</span>
          </div>
        </div>
      </div>
    </nav>
  );
}