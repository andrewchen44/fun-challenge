import clsx from 'clsx';
import './styles.css';

import type { Token } from '../../../constants/tokens';

interface TokenChipProps {
  label: Token;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const TokenChip = ({ label, active = false, onClick, disabled = false }: TokenChipProps) => {
  return (
    <button
      type="button"
      className={clsx('chip', { 'chip--active': active, 'chip--disabled': disabled })}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {label}
    </button>
  );
};
