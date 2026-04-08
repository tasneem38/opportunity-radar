import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import SignalDetailPage from './pages/SignalDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import BacktestPage from './pages/BacktestPage';
import SignalsPage from './pages/SignalsPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
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
    const handleNav = (e) => {
      setCurrentPage(e.detail);
    };
    window.addEventListener('globalSearch', handleSearch);
    window.addEventListener('globalNavigate', handleNav);
    return () => {
      window.removeEventListener('globalSearch', handleSearch);
      window.removeEventListener('globalNavigate', handleNav);
    };
  }, []);  return (
    <div className="app-root">
      {currentPage === 'landing' && <LandingPage onEnterApp={() => setCurrentPage('home')} />}
      {currentPage === 'home' && <HomePage onNavigate={navigate} />}
      {currentPage === 'signals' && <SignalsPage onNavigate={navigate} searchQuery={searchQuery} />}
      {currentPage === 'detail' && <SignalDetailPage signal={selectedSignal} onBack={() => setCurrentPage('signals')} />}
      {currentPage === 'watchlist' && <WatchlistPage onNavigate={navigate} />}
      {currentPage === 'backtest' && <BacktestPage onNavigate={navigate} />}
    </div>
  );
}