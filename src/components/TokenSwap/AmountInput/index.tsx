import { clsx } from 'clsx';
import type { ChangeEvent } from 'react';
import './styles.css';

interface AmountInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  step?: number;
}

export const AmountInput = ({
  label,
  value,
  onChange,
  placeholder = '0.00',
  disabled = false,
  min = 0,
  step = 0.1,
}: AmountInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue);
  };

  return (
    <div className="amount-input">
      <label className="amount-input__label" htmlFor="usd-amount">
        {label}
      </label>
      <input
        id="usd-amount"
        type="number"
        className={clsx('amount-input__field', { 'amount-input__field--disabled': disabled })}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        step={step}
      />
    </div>
  );
};
