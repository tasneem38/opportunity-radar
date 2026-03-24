import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import SignalDetailPage from './pages/SignalDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import BacktestPage from './pages/BacktestPage';
import SignalsPage from './pages/SignalsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSignal, setSelectedSignal] = useState(null);

  const navigate = (page, data = null) => {
    console.log(`App Navigating to ${page}`, data);
    if (data) setSelectedSignal(data);
    if (page === 'detail' && !data && !selectedSignal) {
      console.warn("Detail navigation blocked: no signal data");
      setCurrentPage('home');
      return;
    }
    setCurrentPage(page);
  };



  return (
    <div className="app-root">
      {currentPage === 'home' && <HomePage onNavigate={navigate} />}
      {currentPage === 'signals' && <SignalsPage onNavigate={navigate} />}
      {currentPage === 'detail' && <SignalDetailPage signal={selectedSignal} onBack={() => setCurrentPage('signals')} />}
      {currentPage === 'watchlist' && <WatchlistPage onNavigate={navigate} />}
      {currentPage === 'backtest' && <BacktestPage onBack={() => setCurrentPage('home')} />}
    </div>
  );
}