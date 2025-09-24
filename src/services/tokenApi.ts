import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';
import type { Erc20AssetInfo, GetAssetPriceInfoResponse } from '@funkit/api-base';

import { Token } from '../constants/tokens';

export const TOKEN_CONFIG: Record<Token, { chainId: string; symbol: string }> = {
  [Token.USDC]: { chainId: '1', symbol: 'USDC' },
  [Token.USDT]: { chainId: '137', symbol: 'USDT' },
  [Token.ETH]: { chainId: '8453', symbol: 'ETH' },
  [Token.WBTC]: { chainId: '1', symbol: 'WBTC' },
};

const API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';

export interface TokenInfo {
  address: string;
  symbol: string;
  chainId: string;
}

export interface PriceInfo {
  price: number | null;
  symbol: string;
}

/**
 * Get token information (address) by chain ID and symbol
 */
export async function getTokenInfo(token: Token): Promise<TokenInfo | null> {
  try {
    const config = TOKEN_CONFIG[token];
    const result: Erc20AssetInfo = await getAssetErc20ByChainAndSymbol({
      chainId: config.chainId,
      symbol: config.symbol,
      apiKey: API_KEY,
    });

    return {
      address: result.address || '',
      symbol: config.symbol,
      chainId: config.chainId,
    };
  } catch (error) {
    console.error(`Failed to get token info for ${token}:`, error);
    return null;
  }
}

/**
 * Get token price by chain ID and token address
 */
export async function getTokenPrice(token: Token): Promise<PriceInfo | null> {
  try {
    const tokenInfo = await getTokenInfo(token);
    if (!tokenInfo || !tokenInfo.address) {
      return null;
    }

    const result: GetAssetPriceInfoResponse = await getAssetPriceInfo({
      chainId: tokenInfo.chainId,
      assetTokenAddress: tokenInfo.address,
      apiKey: API_KEY,
    });

    return {
      price: result.unitPrice || null,
      symbol: tokenInfo.symbol,
    };
  } catch (error) {
    console.error(`Failed to get price for ${token}:`, error);
    return null;
  }
}

/**
 * Get multiple token prices in parallel
 */
export async function getTokenPrices(tokens: Token[]): Promise<Record<Token, number | null>> {
  const pricePromises = tokens.map(async (token) => {
    const priceInfo = await getTokenPrice(token);
    return { token, price: priceInfo?.price || null };
  });

  const results = await Promise.all(pricePromises);

  return results.reduce(
    (acc, { token, price }) => {
      acc[token] = price;
      return acc;
    },
    {} as Record<Token, number | null>,
  );
}
