import { useState, useEffect } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/signals/watchlist');
      if (!response.ok) throw new Error('Failed to fetch watchlist');
      const data = await response.json();
      setWatchlist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol) => {
    try {
      const response = await fetch(`/api/signals/watchlist/${symbol}`, { method: 'POST' });
      if (response.ok) fetchWatchlist();
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return { watchlist, loading, error, addToWatchlist, refresh: fetchWatchlist };
}