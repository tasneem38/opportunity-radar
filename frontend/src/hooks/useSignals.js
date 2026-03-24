import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useSignals() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSignals() {
      try {
        setLoading(true);
        const data = await api.get('/api/signals');
        // If the backend returns a list, set it. If it returns an object with a signals property, use that.
        const signalList = Array.isArray(data) ? data : (data.signals || []);
        setSignals(signalList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSignals();
    // Poll every 30 seconds for new signals
    const interval = setInterval(fetchSignals, 30000);
    return () => clearInterval(interval);
  }, []);

  return { signals, loading, error };
}