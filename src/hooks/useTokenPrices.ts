import { useState, useEffect, useCallback } from 'react';
import { getTokenPrices, getTokenPrice } from '../services/tokenApi';
import type { Token } from '../constants/tokens';

interface UseTokenPricesReturn {
  prices: Partial<Record<Token, number | null>>;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
  refetch: () => Promise<void>;
  refetchToken: (token: Token) => Promise<void>;
}

/**
 * Hook to fetch and manage token prices for specific tokens
 */
export function useTokenPrices(selectedTokens: Token[]): UseTokenPricesReturn {
  const [prices, setPrices] = useState<Partial<Record<Token, number | null>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchPrices = useCallback(async (tokens: Token[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedPrices = await getTokenPrices(tokens);
      setPrices(prev => ({ ...prev, ...fetchedPrices }));
      setLastFetched(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      console.error('Error fetching token prices:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    if (selectedTokens.length > 0) {
      fetchPrices(selectedTokens);
    }
  }, [selectedTokens.join(','), fetchPrices]);

  return {
    prices,
    isLoading,
    error,
    lastFetched,
    refetch: () => fetchPrices(selectedTokens),
    refetchToken,
  };
}
