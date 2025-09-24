import { useState, useEffect, useCallback, useMemo } from 'react';

import type { Token } from '../constants/tokens';
import { getTokenPrices, getTokenPrice } from '../services/tokenApi';

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

      // Deduplicate tokens to avoid making duplicate API calls
      const uniqueTokens = [...new Set(tokens)];
      console.log(`Fetching prices for ${uniqueTokens.length} unique tokens:`, uniqueTokens);
      const fetchedPrices = await getTokenPrices(uniqueTokens);
      setPrices((prev) => ({ ...prev, ...fetchedPrices }));
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
      setPrices((prev) => ({
        ...prev,
        [token]: priceInfo?.price || null,
      }));
    } catch (err) {
      console.error(`Error fetching price for ${token}:`, err);
    }
  }, []);

  const uniqueTokens = useMemo(() => [...new Set(selectedTokens)], [selectedTokens]);
  const selectedTokensKey = uniqueTokens.join(',');

  useEffect(() => {
    if (uniqueTokens.length > 0) {
      fetchPrices(uniqueTokens);
    }
  }, [uniqueTokens, selectedTokensKey, fetchPrices]);

  return {
    prices,
    isLoading,
    error,
    lastFetched,
    refetch: () => fetchPrices(selectedTokens),
    refetchToken,
  };
}
