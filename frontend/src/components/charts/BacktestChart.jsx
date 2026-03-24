import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BacktestChart({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 10 }} 
          tickFormatter={(val) => val.split('-').slice(1).join('/')}
          stroke="var(--text-muted)"
        />
        <YAxis 
          tick={{ fontSize: 10 }} 
          domain={['auto', 'auto']}
          stroke="var(--text-muted)"
        />
        <Tooltip 
          contentStyle={{ 
            background: 'white', 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '0.75rem'
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="equity" 
          stroke="var(--primary)" 
          fillOpacity={1} 
          fill="url(#colorEquity)" 
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}