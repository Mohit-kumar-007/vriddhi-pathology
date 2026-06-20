import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export default function useBookings(initialParams = {}, autoFetch = false) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [params, setParams] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20,
    ...initialParams
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/bookings', { params });
      if (response.data.success) {
        setBookings(response.data.data);
        setTotal(response.data.total);
        setPages(response.data.pages);
      } else {
        setError(response.data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [fetchBookings, autoFetch]);

  const submitBooking = async (bookingData) => {
    setLoading(true);
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await api.put(`/bookings/${id}/status`, { status });
      if (response.data.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update status' };
    }
  };

  const deleteBooking = async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      if (response.data.success) {
        setBookings(prev => prev.filter(b => b._id !== id));
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete booking' };
    }
  };

  const setPage = (page) => setParams(prev => ({ ...prev, page }));
  const setSearch = (search) => setParams(prev => ({ ...prev, search, page: 1 }));
  const setStatus = (status) => setParams(prev => ({ ...prev, status, page: 1 }));
  const setDateFilter = (startDate, endDate) => setParams(prev => ({ ...prev, startDate, endDate, page: 1 }));

  return {
    bookings,
    loading,
    error,
    total,
    pages,
    params,
    submitBooking,
    updateBookingStatus,
    deleteBooking,
    setPage,
    setSearch,
    setStatus,
    setDateFilter,
    refetch: fetchBookings
  };
}
