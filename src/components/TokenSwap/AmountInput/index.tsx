import { clsx } from 'clsx';
import type { ChangeEvent, KeyboardEvent } from 'react';
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
  placeholder = '0.00',
  disabled = false,
  min = 0,
  max = Infinity,
}: AmountInputProps) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [error, setError] = useState<string>('');

  // Sync internal state with external value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const validateInput = (input: string): boolean => {
    // Allow empty string
    if (input === '') return true;

    // Check if input contains only numbers and at most one period
    const validPattern = /^[0-9]*\.?[0-9]*$/;
    if (!validPattern.test(input)) return false;

    // Check if there's more than one period
    const periodCount = (input.match(/\./g) || []).length;
    if (periodCount > 1) return false;

    return true;
  };

  const isCompleteValidNumber = (input: string): boolean => {
    if (input === '') return true;

    const numValue = parseFloat(input);
    if (isNaN(numValue)) return false;

    // Check minimum value
    if (numValue < min) return false;

    // Check maximum value
    if (numValue > max) return false;

    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;

    if (validateInput(newInputValue)) {
      setInputValue(newInputValue);

      // Check if it's a complete valid number
      if (isCompleteValidNumber(newInputValue)) {
        setError('');

        // Only update the parent if it's a valid number
        if (newInputValue !== '') {
          const numValue = parseFloat(newInputValue);
          if (!isNaN(numValue)) {
            onChange(numValue);
          }
        } else {
          onChange(0);
        }
      } else {
        setError(
          `Please enter a valid number between ${min.toLocaleString()} and ${max.toLocaleString()}`,
        );
      }
    } else {
      setInputValue(newInputValue);
      setError('Please enter a valid number (only digits and one decimal point allowed)');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    if (
      [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }

    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105) &&
      e.keyCode !== 190
    ) {
      e.preventDefault();
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
          'amount-input__field--error': error,
        })}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <div className="amount-input__error">{error}</div>}
    </div>
  );
};
