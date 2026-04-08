import { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function PriceChart({ data: passedData, symbol }) {

  const [chartData, setChartData] = useState(passedData || []);
  const [loading, setLoading] = useState(!passedData && symbol);

  useEffect(() => {
    if (!passedData && symbol) {
      setLoading(true);
      fetch(`/api/signals/price/${symbol}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setChartData(data);
          } else {
            console.warn("No price history for", symbol);
            // Default mock if fetch fails
            setChartData([
               { time: '2025-03-10', price: 1240 },
               { time: '2025-03-17', price: 1295 },
               { time: '2025-03-21', price: 1410 },
            ]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Price fetch failed:", err);
          setLoading(false);
        });
    }
  }, [symbol, passedData]);

  if (loading) return <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading market data...</div>;


  return (
    <div className="chart-container" style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
          />
          <YAxis 
            hide={true} 
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="var(--primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}