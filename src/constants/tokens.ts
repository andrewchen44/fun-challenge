export enum Token {
  USDC = 'USDC',
  USDT = 'USDT',
  ETH = 'ETH',
  WBTC = 'WBTC',
}

export const TOKEN_LIST = Object.values(Token) as Token[];

export const DEFAULT_TOKEN = Token.USDC;
