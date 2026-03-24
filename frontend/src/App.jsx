import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import SignalDetailPage from './pages/SignalDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import BacktestPage from './pages/BacktestPage';
import SignalsPage from './pages/SignalsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (page, data = null) => {
    if (page === 'signals') {
      setSearchQuery(''); // clear search on normal nav to signals
    }
    if (data) setSelectedSignal(data);
    if (page === 'detail' && !data && !selectedSignal) {
      console.warn("Detail navigation blocked: no signal data");
      setCurrentPage('home');
      return;
    }
    setCurrentPage(page);
  };

  React.useEffect(() => {
    const handleSearch = (e) => {
      setSearchQuery(e.detail);
      setCurrentPage('signals');
    };
    window.addEventListener('globalSearch', handleSearch);
    return () => window.removeEventListener('globalSearch', handleSearch);
  }, []);  return (
    <div className="app-root">
      {currentPage === 'home' && <HomePage onNavigate={navigate} />}
      {currentPage === 'signals' && <SignalsPage onNavigate={navigate} searchQuery={searchQuery} />}
      {currentPage === 'detail' && <SignalDetailPage signal={selectedSignal} onBack={() => setCurrentPage('signals')} />}
      {currentPage === 'watchlist' && <WatchlistPage onNavigate={navigate} />}
      {currentPage === 'backtest' && <BacktestPage onNavigate={navigate} />}
    </div>
  );
}