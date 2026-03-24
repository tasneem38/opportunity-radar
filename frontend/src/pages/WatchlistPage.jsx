import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/common/Badge';

import { useWatchlist } from '../hooks/useWatchlist';
import { Loader2 } from 'lucide-react';

export default function WatchlistPage({ onBack }) {
  const { watchlist, loading, error } = useWatchlist();


  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar onNavigate={onBack} />
        <PageContainer>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h1>My Watchlist</h1>
             {loading && <Loader2 className="animate-spin" size={20} />}
           </div>

           {error && <div className="card" style={{ color: 'var(--danger)', marginTop: '1rem' }}>Failed to update watchlist: {error}</div>}
           
           {!loading && watchlist.length === 0 && (
             <div className="card" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '3rem' }}>
               <p style={{ color: 'var(--text-muted)' }}>Your watchlist is empty. Add stocks from the Radar or Analysis pages.</p>
             </div>
           )}

           {watchlist.length > 0 && (
             <div className="card" style={{ marginTop: '1.5rem', padding: 0 }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead>
                   <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                     <th style={{ padding: '1rem' }}>Symbol</th>
                     <th style={{ padding: '1rem' }}>Price</th>
                     <th style={{ padding: '1rem' }}>Change</th>
                     <th style={{ padding: '1rem' }}>AI Sentiment</th>
                   </tr>
                 </thead>
                 <tbody>
                   {watchlist.map((item, idx) => (
                     <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                       <td style={{ padding: '1rem', fontWeight: 700 }}>{item.symbol}</td>
                       <td style={{ padding: '1rem' }}>₹{item.price}</td>
                       <td style={{ padding: '1rem', color: (item.change && item.change.startsWith('+')) ? 'var(--success)' : 'var(--danger)' }}>
                         {item.change}
                       </td>
                       <td style={{ padding: '1rem' }}>
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

        </PageContainer>
      </div>
    </div>
  );
}