import { useState, useEffect, useCallback } from 'react';
import analyticsService from '../services/analyticsService';

/**
 * Hook for tracking product views
 */
export const useProductView = () => {
  const trackView = useCallback((productId) => {
    if (productId) {
      analyticsService.trackProductView(productId);
    }
  }, []);

  return { trackView };
};

/**
 * Hook for tracking search queries
 */
export const useSearchTracking = () => {
  const trackSearch = useCallback((query, resultCount) => {
    if (query) {
      analyticsService.trackSearchQuery(query, resultCount);
    }
  }, []);

  return { trackSearch };
};

/**
 * Hook for getting product view statistics
 */
export const useProductViewStats = (initialParams = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getProductViewStats(params);
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch product view statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(initialParams);
  }, [fetchStats, initialParams]);

  return { stats, loading, error, fetchStats };
};

/**
 * Hook for getting dashboard statistics
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getDashboardStats();
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, fetchStats };
};

/**
 * Hook for getting sales statistics
 */
export const useSalesStats = (initialParams = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getSalesStats(params);
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch sales statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(initialParams);
  }, [fetchStats, initialParams]);

  return { stats, loading, error, fetchStats };
};

/**
 * Hook for getting user activity statistics
 */
export const useUserActivityStats = (initialParams = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getUserActivityStats(params);
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch user activity statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(initialParams);
  }, [fetchStats, initialParams]);

  return { stats, loading, error, fetchStats };
};