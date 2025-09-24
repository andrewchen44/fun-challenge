import { clsx } from 'clsx';
import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import './styles.css';

interface AmountInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export const AmountInput = ({
  label,
  value,
  onChange,
  placeholder = '0',
  disabled = false,
  min = 0,
  max = Infinity,
}: AmountInputProps) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Filter out any non-numeric characters
    const filteredValue = rawValue.replace(/[^0-9]/g, '');

    // Prevent typing numbers larger than a trillion (13 digits)
    if (filteredValue.length > 13) {
      return;
    }

    setInputValue(filteredValue);

    if (filteredValue === '') {
      onChange(0);
    } else {
      const numValue = parseInt(filteredValue, 10);
      if (!isNaN(numValue) && numValue >= min && numValue <= max) {
        onChange(numValue);
      }
    }
  };

  return (
    <div className="amount-input">
      <label className="amount-input__label" htmlFor="usd-amount">
        {label}
      </label>
      <input
        id="usd-amount"
        type="text"
        className={clsx('amount-input__field', {
          'amount-input__field--disabled': disabled,
        })}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};
