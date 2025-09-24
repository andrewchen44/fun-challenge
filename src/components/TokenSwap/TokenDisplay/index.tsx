import './styles.css';

import type { Token } from '../../../constants/tokens';

interface TokenDisplayProps {
  token: Token;
  amount: number | null;
  price: number | null | undefined;
  isLoading?: boolean;
}

export const TokenDisplay = ({ token, amount, price, isLoading = false }: TokenDisplayProps) => {
  const formatAmount = (value: number | null) => {
    if (value === null) return '—';
    return value.toFixed(6);
  };

  const formatPrice = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '—';
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="token-display">
      <div className="token-display__header">
        <span className="token-display__symbol">{token}</span>
        {isLoading && <span className="token-display__loading">Loading...</span>}
      </div>

      <div className="token-display__price">
        {formatPrice(price)} per {token}
      </div>

      <div className="token-display__amount">
        ≈ {formatAmount(amount)} {token}
      </div>
    </div>
  );
};
