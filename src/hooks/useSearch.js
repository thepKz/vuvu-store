import { useState, useEffect, useCallback } from 'react';
import { searchServices } from '../services/searchAPI';

// Custom hook for search functionality
export const useSearch = (initialQuery = '', initialFilters = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search
  const performSearch = useCallback(async (searchQuery = debouncedQuery, searchFilters = filters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchServices.searchProducts(searchQuery, searchFilters);
      setResults(response.products || []);
      setTotalResults(response.total || 0);
      
      // Track search
      await searchServices.trackSearch(searchQuery, response.products || []);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tìm kiếm');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters]);

  // Get suggestions
  const getSuggestions = useCallback(async (suggestionQuery) => {
    if (!suggestionQuery.trim() || suggestionQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchServices.getSuggestions(suggestionQuery);
      setSuggestions(response || []);
    } catch (err) {
      setSuggestions([]);
    }
  }, []);

  // Update query
  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    if (newQuery.length >= 2) {
      getSuggestions(newQuery);
    } else {
      setSuggestions([]);
    }
  }, [getSuggestions]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setSuggestions([]);
    setTotalResults(0);
    setError(null);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Perform search when debounced query or filters change
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch();
    }
  }, [debouncedQuery, filters, performSearch]);

  return {
    // State
    query,
    filters,
    results,
    suggestions,
    loading,
    error,
    totalResults,
    
    // Actions
    updateQuery,
    updateFilters,
    clearSearch,
    resetFilters,
    performSearch,
    getSuggestions
  };
};

// Hook for popular searches
export const usePopularSearches = () => {
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPopularSearches = async () => {
      setLoading(true);
      try {
        const response = await searchServices.getPopularSearches();
        setPopularSearches(response || []);
      } catch (error) {
        console.error('Failed to fetch popular searches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularSearches();
  }, []);

  return { popularSearches, loading };
};

// Hook for search filters
export const useSearchFilters = () => {
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    priceRanges: [],
    sortOptions: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        const response = await searchServices.getFilters();
        setAvailableFilters(response || {});
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { availableFilters, loading };
};