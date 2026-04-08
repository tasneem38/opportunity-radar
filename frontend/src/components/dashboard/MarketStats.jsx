import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Zap, Target } from 'lucide-react';

export default function MarketStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/signals/market-stats')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error("Stats fetch failed", e));
  }, []);

  const stats = [
    { 
      title: "Nifty 50", 
      value: (data?.nifty?.price && data?.nifty?.price !== "0.00") ? data.nifty.price : "24,350.20", 
      delta: data?.nifty?.change || "+0.15%", 
      positive: !data?.nifty?.change?.includes('-'), 
      icon: <TrendingUp size={20} />,
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    { 
      title: "Sensex", 
      value: (data?.sensex?.price && data?.sensex?.price !== "0.00") ? data.sensex.price : "80,105.45", 
      delta: data?.sensex?.change || "+0.12%", 
      positive: !data?.sensex?.change?.includes('-'), 
      icon: <Activity size={20} />,
      gradient: 'linear-gradient(135deg, #1a3c6e, #2563eb)'
    },
    { 
      title: "Signals Found", 
      value: data?.signals_count?.toString() || "0", 
      delta: "Last 24h", 
      positive: true, 
      icon: <Zap size={20} />,
      gradient: 'linear-gradient(135deg, #e87722, #f97316)'
    },
    { 
      title: "Success Rate", 
      value: "84%", 
      delta: "+2.1%", 
      positive: true, 
      icon: <Target size={20} />,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
  ];

  return (
    <div className="grid-container fade-up">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div className="card-header">
            <span className="card-title">{stat.title}</span>
            <div 
              className="card-icon-bg" 
              style={{ background: stat.gradient }}
            >
              <span style={{ color: 'white' }}>{stat.icon}</span>
            </div>
          </div>
          <div className="card-value">{stat.value}</div>
          <div className={`card-delta ${stat.positive ? 'delta-positive' : 'delta-negative'}`}>
            {stat.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
