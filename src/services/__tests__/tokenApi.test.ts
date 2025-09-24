import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Token } from '../../constants/tokens';
import { getTokenInfo, getTokenPrice, getTokenPrices, TOKEN_CONFIG } from '../tokenApi';

// Mock the Funkit API
vi.mock('@funkit/api-base', () => ({
  getAssetErc20ByChainAndSymbol: vi.fn(),
  getAssetPriceInfo: vi.fn(),
}));

const mockGetAssetErc20ByChainAndSymbol = vi.mocked(getAssetErc20ByChainAndSymbol);
const mockGetAssetPriceInfo = vi.mocked(getAssetPriceInfo);

describe('tokenApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTokenInfo', () => {
    it('should return token info for valid token', async () => {
      const mockErc20Info = {
        address: '0x1234567890abcdef',
        symbol: 'USDC',
        chainId: '1',
      };

      mockGetAssetErc20ByChainAndSymbol.mockResolvedValue(mockErc20Info);

      const result = await getTokenInfo(Token.USDC);

      expect(result).toEqual({
        address: '0x1234567890abcdef',
        symbol: 'USDC',
        chainId: '1',
      });

      expect(mockGetAssetErc20ByChainAndSymbol).toHaveBeenCalledWith({
        chainId: TOKEN_CONFIG[Token.USDC].chainId,
        symbol: TOKEN_CONFIG[Token.USDC].symbol,
        apiKey: expect.any(String),
      });
    });

    it('should return null when API call fails', async () => {
      mockGetAssetErc20ByChainAndSymbol.mockRejectedValue(new Error('API Error'));

      const result = await getTokenInfo(Token.USDC);

      expect(result).toBe(null);
    });

    it('should handle missing address in response', async () => {
      const mockErc20Info = {
        address: null,
        symbol: 'USDC',
        chainId: '1',
      };

      mockGetAssetErc20ByChainAndSymbol.mockResolvedValue(mockErc20Info);

      const result = await getTokenInfo(Token.USDC);

      expect(result).toEqual({
        address: '',
        symbol: 'USDC',
        chainId: '1',
      });
    });
  });

  describe('getTokenPrice', () => {
    it('should return price info for valid token', async () => {
      const mockErc20Info = {
        address: '0x1234567890abcdef',
        symbol: 'USDC',
        chainId: '1',
      };

      const mockPriceInfo = {
        unitPrice: 1.0,
        symbol: 'USDC',
      };

      mockGetAssetErc20ByChainAndSymbol.mockResolvedValue(mockErc20Info);
      mockGetAssetPriceInfo.mockResolvedValue(mockPriceInfo);

      const result = await getTokenPrice(Token.USDC);

      expect(result).toEqual({
        price: 1.0,
        symbol: 'USDC',
      });

      expect(mockGetAssetPriceInfo).toHaveBeenCalledWith({
        chainId: '1',
        assetTokenAddress: '0x1234567890abcdef',
        apiKey: expect.any(String),
      });
    });

    it('should return null when token info fails', async () => {
      mockGetAssetErc20ByChainAndSymbol.mockRejectedValue(new Error('Token info failed'));

      const result = await getTokenPrice(Token.USDC);

      expect(result).toBe(null);
    });

    it('should return null when price info fails', async () => {
      const mockErc20Info = {
        address: '0x1234567890abcdef',
        symbol: 'USDC',
        chainId: '1',
      };

      mockGetAssetErc20ByChainAndSymbol.mockResolvedValue(mockErc20Info);
      mockGetAssetPriceInfo.mockRejectedValue(new Error('Price info failed'));

      const result = await getTokenPrice(Token.USDC);

      expect(result).toBe(null);
    });

    it('should handle missing unitPrice in response', async () => {
      const mockErc20Info = {
        address: '0x1234567890abcdef',
        symbol: 'USDC',
        chainId: '1',
      };

      const mockPriceInfo = {
        unitPrice: null,
        symbol: 'USDC',
      };

      mockGetAssetErc20ByChainAndSymbol.mockResolvedValue(mockErc20Info);
      mockGetAssetPriceInfo.mockResolvedValue(mockPriceInfo);

      const result = await getTokenPrice(Token.USDC);

      expect(result).toEqual({
        price: null,
        symbol: 'USDC',
      });
    });
  });

  describe('getTokenPrices', () => {
    it('should fetch multiple token prices in parallel', async () => {
      const mockErc20Info = {
        address: '0x1234567890abcdef',
        symbol: 'USDC',
        chainId: '1',
      };

      const mockPriceInfo = {
        unitPrice: 1.0,
        symbol: 'USDC',
      };

      mockGetAssetErc20ByChainAndSymbol.mockResolvedValue(mockErc20Info);
      mockGetAssetPriceInfo.mockResolvedValue(mockPriceInfo);

      const result = await getTokenPrices([Token.USDC, Token.ETH]);

      expect(result).toEqual({
        [Token.USDC]: 1.0,
        [Token.ETH]: 1.0,
      });

      // Should be called twice (once for each token)
      expect(mockGetAssetErc20ByChainAndSymbol).toHaveBeenCalledTimes(2);
      expect(mockGetAssetPriceInfo).toHaveBeenCalledTimes(2);
    });

    it('should handle mixed success and failure', async () => {
      const mockErc20Info = {
        address: '0x1234567890abcdef',
        symbol: 'USDC',
        chainId: '1',
      };

      const mockPriceInfo = {
        unitPrice: 1.0,
        symbol: 'USDC',
      };

      // First call succeeds, second fails
      mockGetAssetErc20ByChainAndSymbol
        .mockResolvedValueOnce(mockErc20Info)
        .mockRejectedValueOnce(new Error('Token info failed'));

      mockGetAssetPriceInfo.mockResolvedValue(mockPriceInfo);

      const result = await getTokenPrices([Token.USDC, Token.ETH]);

      expect(result).toEqual({
        [Token.USDC]: 1.0,
        [Token.ETH]: null,
      });
    });

    it('should handle empty token array', async () => {
      const result = await getTokenPrices([]);

      expect(result).toEqual({});
      expect(mockGetAssetErc20ByChainAndSymbol).not.toHaveBeenCalled();
      expect(mockGetAssetPriceInfo).not.toHaveBeenCalled();
    });
  });
});
