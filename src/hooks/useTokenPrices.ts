import { useState, useEffect, useCallback } from 'react';
import { getTokenPrices, getTokenPrice } from '../services/tokenApi';
import type { Token } from '../constants/tokens';

interface UseTokenPricesReturn {
  prices: Partial<Record<Token, number | null>>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refetchToken: (token: Token) => Promise<void>;
}

/**
 * Hook to fetch and manage token prices
 */
export function useTokenPrices(tokens: Token[]): UseTokenPricesReturn {
  const [prices, setPrices] = useState<Partial<Record<Token, number | null>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedPrices = await getTokenPrices(tokens);
      setPrices(fetchedPrices);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      console.error('Error fetching token prices:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tokens]);

  const refetchToken = useCallback(async (token: Token) => {
    try {
      const priceInfo = await getTokenPrice(token);
      setPrices(prev => ({
        ...prev,
        [token]: priceInfo?.price || null,
      }));
    } catch (err) {
      console.error(`Error fetching price for ${token}:`, err);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices,
    isLoading,
    error,
    refetch: fetchPrices,
    refetchToken,
  };
}
