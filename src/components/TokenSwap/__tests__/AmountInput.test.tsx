import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { AmountInput } from '../AmountInput';

describe('AmountInput', () => {
  it('should render with correct label', () => {
    render(<AmountInput label="USD Amount" value={100} onChange={vi.fn()} />);

    expect(screen.getByLabelText('USD Amount')).toBeInTheDocument();
  });

  it('should display the current value', () => {
    render(<AmountInput label="USD Amount" value={100} onChange={vi.fn()} />);

    const input = screen.getByDisplayValue('100');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<AmountInput label="USD Amount" value={100} onChange={handleChange} />);

    const input = screen.getByLabelText('USD Amount');
    await user.clear(input);
    await user.type(input, '200');

    // The component calls onChange for valid input
    expect(handleChange).toHaveBeenCalled();
    // onChange is called for clear + each valid character typed
    expect(handleChange).toHaveBeenCalledTimes(4); // For clear + each character: clear, 2, 0, 0
  });

  it('should handle zero value correctly', () => {
    render(<AmountInput label="USD Amount" value={0} onChange={vi.fn()} />);

    // When value is 0, the component shows "0"
    const input = screen.getByLabelText('USD Amount');
    expect(input).toHaveValue('0');
  });

  it('should handle empty value correctly', () => {
    render(<AmountInput label="USD Amount" value={0} onChange={vi.fn()} />);

    const input = screen.getByLabelText('USD Amount');
    expect(input).toHaveValue('0');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<AmountInput label="USD Amount" value={100} onChange={vi.fn()} disabled />);

    const input = screen.getByLabelText('USD Amount');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('amount-input__field--disabled');
  });

  it('should have correct input attributes', () => {
    render(
      <AmountInput
        label="USD Amount"
        value={100}
        onChange={vi.fn()}
        placeholder="Enter amount"
        min={0}
      />,
    );

    const input = screen.getByLabelText('USD Amount');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Enter amount');
    // min attribute is used for validation but not as HTML attribute
  });

  it('should use default placeholder when not provided', () => {
    render(<AmountInput label="USD Amount" value={100} onChange={vi.fn()} />);

    const input = screen.getByLabelText('USD Amount');
    expect(input).toHaveAttribute('placeholder', '0');
  });

  it('should handle integer input correctly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<AmountInput label="USD Amount" value={0} onChange={handleChange} />);

    const input = screen.getByLabelText('USD Amount');
    await user.clear(input);
    await user.type(input, '123');

    // The component calls onChange for valid input
    expect(handleChange).toHaveBeenCalled();
    // onChange is called for clear + each valid character typed
    expect(handleChange).toHaveBeenCalledTimes(4); // For clear + each character: clear, 1, 2, 3
  });

  it('should filter out non-numeric characters', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<AmountInput label="USD Amount" value={0} onChange={handleChange} />);

    const input = screen.getByLabelText('USD Amount');
    await user.clear(input);
    await user.type(input, 'abc123def');

    // Should only show the numeric characters
    expect(input).toHaveValue('123');
    expect(handleChange).toHaveBeenCalledWith(123);
  });
});
