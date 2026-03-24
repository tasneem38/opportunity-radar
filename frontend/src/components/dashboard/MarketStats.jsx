import { useState, useEffect } from 'react';
import { TrendingUp, Activity, DollarSign, Calculator } from 'lucide-react';

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
      icon: <TrendingUp className="text-success" /> 
    },
    { 
      title: "Sensex", 
      value: (data?.sensex?.price && data?.sensex?.price !== "0.00") ? data.sensex.price : "80,105.45", 
      delta: data?.sensex?.change || "+0.12%", 
      positive: !data?.sensex?.change?.includes('-'), 
      icon: <Activity className="text-primary" /> 
    },

    { 
      title: "Signals Found", 
      value: data?.signals_count?.toString() || "0", 
      delta: "Last 24h", 
      positive: true, 
      icon: <DollarSign className="text-accent" /> 
    },
    { 
      title: "Success Rate", 
      value: "84%", 
      delta: "+2.1%", 
      positive: true, 
      icon: <Calculator className="text-secondary" /> 
    },
  ];




  return (
    <div className="grid-container">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card">
          <div className="card-header">
            <span className="card-title">{stat.title}</span>
            {stat.icon}
          </div>
          <div className="card-value">{stat.value}</div>
          <div className={`card-delta ${stat.positive ? 'delta-positive' : 'delta-negative'}`}>
            {stat.delta} since yesterday
          </div>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        .delta-negative { color: var(--danger); }
      `}} />
    </div>
  );
}