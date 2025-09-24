import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Token } from '../../../constants/tokens';
import { TokenChip } from '../TokenChip';

describe('TokenChip', () => {
  it('should render with correct label', () => {
    render(<TokenChip label={Token.USDC} />);

    expect(screen.getByText('USDC')).toBeInTheDocument();
  });

  it('should show active state when active prop is true', () => {
    render(<TokenChip label={Token.USDC} active />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('chip--active');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('should not show active state when active prop is false', () => {
    render(<TokenChip label={Token.USDC} active={false} />);

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('chip--active');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<TokenChip label={Token.USDC} onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<TokenChip label={Token.USDC} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('chip--disabled');
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<TokenChip label={Token.USDC} onClick={handleClick} disabled />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have correct button type', () => {
    render(<TokenChip label={Token.USDC} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should render all token types correctly', () => {
    const tokens = [Token.USDC, Token.USDT, Token.ETH, Token.WBTC];

    tokens.forEach((token) => {
      const { unmount } = render(<TokenChip label={token} />);
      expect(screen.getByText(token)).toBeInTheDocument();
      unmount();
    });
  });
});
