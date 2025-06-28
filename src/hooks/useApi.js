import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook for automatic API calls on component mount
export const useApiEffect = (apiFunction, dependencies = []) => {
  const { data, loading, error, execute } = useApi(apiFunction, dependencies);

  useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, refetch: execute };
};

// Hook for managing multiple API states
export const useApiStates = () => {
  const [states, setStates] = useState({});

  const setApiState = useCallback((key, state) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], ...state }
    }));
  }, []);

  const getApiState = useCallback((key) => {
    return states[key] || { data: null, loading: false, error: null };
  }, [states]);

  return { setApiState, getApiState };
};

// Hook for pagination
export const usePagination = (apiFunction, initialParams = {}) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 12,
    ...initialParams
  });
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, execute } = useApi(apiFunction, [params]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      const response = await execute(params);
      const newItems = response.items || response.data || [];
      
      if (params.page === 1) {
        setAllData(newItems);
      } else {
        setAllData(prev => [...prev, ...newItems]);
      }

      setHasMore(newItems.length === params.limit);
      setParams(prev => ({ ...prev, page: prev.page + 1 }));
    } catch (err) {
      console.error('Error loading more data:', err);
    }
  }, [params, loading, hasMore, execute]);

  const reset = useCallback((newParams = {}) => {
    setParams({ page: 1, limit: 12, ...newParams });
    setAllData([]);
    setHasMore(true);
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    params
  };
};