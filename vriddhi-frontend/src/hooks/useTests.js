import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export default function useTests(initialParams = {}) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [params, setParams] = useState({
    search: '',
    category: 'All',
    page: 1,
    limit: 24,
    featured: false,
    ...initialParams
  });

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tests', { params });
      if (response.data.success) {
        setTests(response.data.data);
        setTotal(response.data.total);
        setPages(response.data.pages);
      } else {
        setError(response.data.message || 'Failed to fetch tests');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tests');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const setPage = (page) => setParams(prev => ({ ...prev, page }));
  const setSearch = (search) => setParams(prev => ({ ...prev, search, page: 1 }));
  const setCategory = (category) => setParams(prev => ({ ...prev, category, page: 1 }));
  const setFeatured = (featured) => setParams(prev => ({ ...prev, featured, page: 1 }));

  return { tests, loading, error, total, pages, params, setPage, setSearch, setCategory, setFeatured, refetch: fetchTests };
}
