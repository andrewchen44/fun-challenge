import { clsx } from 'clsx';
import './styles.css';

import type { Token } from '../../../constants/tokens';

interface TokenSelectorProps {
  label: string;
  selectedToken: Token;
  onTokenChange: (token: Token) => void;
  tokens: Token[];
  disabled?: boolean;
}

export const TokenSelector = ({
  label,
  selectedToken,
  onTokenChange,
  tokens,
  disabled = false,
}: TokenSelectorProps) => {
  return (
    <div className="token-selector">
      <label className="token-selector__label">{label}</label>
      <select
        className={clsx('token-selector__select', { 'token-selector__select--disabled': disabled })}
        value={selectedToken}
        onChange={(e) => onTokenChange(e.target.value as Token)}
        disabled={disabled}
      >
        {tokens.map((token) => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>
    </div>
  );
};
