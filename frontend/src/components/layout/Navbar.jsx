import React from 'react';
import { BadgeCheck, Brain, TrendingUp, Bell, Search, Menu, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Brain className="logo-icon" />
          <span className="brand-text">Opportunity Radar</span>
        </div>
        
        <div className="nav-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search stocks, signals, or patterns..." />
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