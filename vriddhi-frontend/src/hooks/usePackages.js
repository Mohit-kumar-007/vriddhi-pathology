import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function usePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/packages');
      if (response.data.success) {
        setPackages(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch packages');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return { packages, loading, error, refetch: fetchPackages };
}
