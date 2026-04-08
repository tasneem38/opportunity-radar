import React from 'react';
import { 
  LayoutDashboard, 
  Radar, 
  Eye, 
  History, 
  Settings, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react';

export default function Sidebar({ onNavigate }) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", id: 'home' },
    { icon: <Radar size={20} />, label: "Live Signals", id: 'signals' },


    { icon: <Eye size={20} />, label: "Watchlist", id: 'watchlist' },
    { icon: <History size={20} />, label: "Backtest Lab", id: 'backtest' },
    { icon: <TrendingUp size={20} />, label: "Markets", id: 'home' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            className={`sidebar-item`}
            onClick={() => onNavigate && onNavigate(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="sidebar-item">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
}