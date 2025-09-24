/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor, act } from '@testing-library/react';
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

  it('should initialize with loading state when tokens are provided', async () => {
    // Mock the API to return empty prices
    mockGetTokenPrices.mockResolvedValue({});

    let hookResult: any;

    await act(async () => {
      const { result } = renderHook(() => useTokenPrices(Token.USDC, Token.ETH));
      hookResult = result;
    });

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false);
    });

    expect(hookResult.current.prices).toEqual({});
    expect(hookResult.current.error).toBe(null);
    expect(hookResult.current.lastFetched).toBeInstanceOf(Date);
  });

  it('should fetch prices when tokens are provided', async () => {
    const mockPrices = {
      [Token.USDC]: 1.0,
      [Token.ETH]: 2000.0,
    };

    mockGetTokenPrices.mockResolvedValue(mockPrices);

    let hookResult: any;
    await act(async () => {
      const { result } = renderHook(() => useTokenPrices(Token.USDC, Token.ETH));
      hookResult = result;
    });

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false);
    });

    expect(hookResult.current.prices).toEqual(mockPrices);
    expect(hookResult.current.error).toBe(null);
    expect(hookResult.current.lastFetched).toBeInstanceOf(Date);
    expect(mockGetTokenPrices).toHaveBeenCalledWith([Token.USDC, Token.ETH]);
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'API Error';
    mockGetTokenPrices.mockRejectedValue(new Error(errorMessage));

    let hookResult: any;
    await act(async () => {
      const { result } = renderHook(() => useTokenPrices(Token.USDC, Token.ETH));
      hookResult = result;
    });

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false);
    });

    expect(hookResult.current.error).toBe(errorMessage);
    expect(hookResult.current.prices).toEqual({});
    expect(hookResult.current.lastFetched).toBe(null);
  });

  it('should deduplicate tokens when fetching', async () => {
    const mockPrices = {
      [Token.USDC]: 1.0,
    };

    mockGetTokenPrices.mockResolvedValue(mockPrices);

    await act(async () => {
      renderHook(() => useTokenPrices(Token.USDC, Token.USDC));
    });

    await waitFor(() => {
      expect(mockGetTokenPrices).toHaveBeenCalledWith([Token.USDC]);
    });
  });

  it('should refetch prices when refetch is called', async () => {
    const mockPrices = {
      [Token.USDC]: 1.0,
    };

    mockGetTokenPrices.mockResolvedValue(mockPrices);

    let hookResult: any;
    await act(async () => {
      const { result } = renderHook(() => useTokenPrices(Token.USDC, Token.ETH));
      hookResult = result;
    });

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false);
    });

    // Clear the mock to verify it's called again
    mockGetTokenPrices.mockClear();

    await act(async () => {
      await hookResult.current.refetch();
    });

    expect(mockGetTokenPrices).toHaveBeenCalledWith([Token.USDC, Token.ETH]);
  });

  it('should refetch individual token price', async () => {
    const mockPriceInfo = {
      price: 1.0,
      symbol: 'USDC',
    };

    mockGetTokenPrice.mockResolvedValue(mockPriceInfo);

    let hookResult: any;
    await act(async () => {
      const { result } = renderHook(() => useTokenPrices(Token.USDC, Token.ETH));
      hookResult = result;
    });

    await act(async () => {
      await hookResult.current.refetchToken(Token.USDC);
    });

    expect(mockGetTokenPrice).toHaveBeenCalledWith(Token.USDC);

    // Wait for state update
    await waitFor(() => {
      expect(hookResult.current.prices[Token.USDC]).toBe(1.0);
    });
  });

  it('should handle refetch token error gracefully', async () => {
    mockGetTokenPrice.mockRejectedValue(new Error('Token fetch failed'));

    let hookResult: any;
    await act(async () => {
      const { result } = renderHook(() => useTokenPrices(Token.USDC, Token.ETH));
      hookResult = result;
    });

    // Should not throw
    await act(async () => {
      await expect(hookResult.current.refetchToken(Token.USDC)).resolves.not.toThrow();
    });
  });

  it('should update lastFetched timestamp on successful fetch', async () => {
    const mockPrices = {
      [Token.USDC]: 1.0,
    };

    mockGetTokenPrices.mockResolvedValue(mockPrices);

    let hookResult: any;
    await act(async () => {
      const { result } = renderHook(() => useTokenPrices(Token.USDC, Token.ETH));
      hookResult = result;
    });

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false);
    });

    expect(hookResult.current.lastFetched).toBeInstanceOf(Date);
    // Just check that it's a recent date (within last minute)
    const now = Date.now();
    const lastFetched = hookResult.current.lastFetched!.getTime();
    expect(lastFetched).toBeGreaterThan(now - 60000); // Within last minute
    expect(lastFetched).toBeLessThanOrEqual(now);
  });
});
