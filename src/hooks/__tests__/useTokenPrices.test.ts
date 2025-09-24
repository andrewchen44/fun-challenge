import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { Token } from '../../constants/tokens';
import { getTokenPrices, getTokenPrice } from '../../services/tokenApi';
import { useTokenPrices } from '../useTokenPrices';

// Mock the API functions
vi.mock('../../services/tokenApi', () => ({
  getTokenPrices: vi.fn(),
  getTokenPrice: vi.fn(),
}));

const mockGetTokenPrices = vi.mocked(getTokenPrices);
const mockGetTokenPrice = vi.mocked(getTokenPrice);

describe('useTokenPrices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useTokenPrices([]));

    expect(result.current.prices).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.lastFetched).toBe(null);
  });

  it('should fetch prices when tokens are provided', async () => {
    const mockPrices = {
      [Token.USDC]: 1.0,
      [Token.ETH]: 2000.0,
    };

    mockGetTokenPrices.mockResolvedValue(mockPrices);

    const { result } = renderHook(() => useTokenPrices([Token.USDC, Token.ETH]));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prices).toEqual(mockPrices);
    expect(result.current.error).toBe(null);
    expect(result.current.lastFetched).toBeInstanceOf(Date);
    expect(mockGetTokenPrices).toHaveBeenCalledWith([Token.USDC, Token.ETH]);
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'API Error';
    mockGetTokenPrices.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTokenPrices([Token.USDC]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.prices).toEqual({});
    expect(result.current.lastFetched).toBe(null);
  });

  it('should deduplicate tokens when fetching', async () => {
    const mockPrices = {
      [Token.USDC]: 1.0,
    };

    mockGetTokenPrices.mockResolvedValue(mockPrices);

    renderHook(() => useTokenPrices([Token.USDC, Token.USDC, Token.USDC]));

    await waitFor(() => {
      expect(mockGetTokenPrices).toHaveBeenCalledWith([Token.USDC]);
    });
  });

  it('should refetch prices when refetch is called', async () => {
    const mockPrices = {
      [Token.USDC]: 1.0,
    };

    mockGetTokenPrices.mockResolvedValue(mockPrices);

    const { result } = renderHook(() => useTokenPrices([Token.USDC]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Clear the mock to verify it's called again
    mockGetTokenPrices.mockClear();

    await result.current.refetch();

    expect(mockGetTokenPrices).toHaveBeenCalledWith([Token.USDC]);
  });

  it('should refetch individual token price', async () => {
    const mockPriceInfo = {
      price: 1.0,
      symbol: 'USDC',
    };

    mockGetTokenPrice.mockResolvedValue(mockPriceInfo);

    const { result } = renderHook(() => useTokenPrices([]));

    await result.current.refetchToken(Token.USDC);

    expect(mockGetTokenPrice).toHaveBeenCalledWith(Token.USDC);

    // Wait for state update
    await waitFor(() => {
      expect(result.current.prices[Token.USDC]).toBe(1.0);
    });
  });

  it('should handle refetch token error gracefully', async () => {
    mockGetTokenPrice.mockRejectedValue(new Error('Token fetch failed'));

    const { result } = renderHook(() => useTokenPrices([]));

    // Should not throw
    await expect(result.current.refetchToken(Token.USDC)).resolves.not.toThrow();
  });

  it('should not fetch when no tokens are provided', () => {
    renderHook(() => useTokenPrices([]));

    expect(mockGetTokenPrices).not.toHaveBeenCalled();
  });

  it('should update lastFetched timestamp on successful fetch', async () => {
    const mockPrices = {
      [Token.USDC]: 1.0,
    };

    mockGetTokenPrices.mockResolvedValue(mockPrices);

    const { result } = renderHook(() => useTokenPrices([Token.USDC]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.lastFetched).toBeInstanceOf(Date);
    // Just check that it's a recent date (within last minute)
    const now = Date.now();
    const lastFetched = result.current.lastFetched!.getTime();
    expect(lastFetched).toBeGreaterThan(now - 60000); // Within last minute
    expect(lastFetched).toBeLessThanOrEqual(now);
  });
});
