import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Token } from '../../../constants/tokens';
import { TokenDisplay } from '../TokenDisplay';

describe('TokenDisplay', () => {
  it('should show token symbol and loading indicator when loading', () => {
    render(<TokenDisplay token={Token.USDC} amount={100} price={1.0} isLoading={true} />);

    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('$1 per USDC')).not.toBeInTheDocument();
    expect(screen.queryByText('≈ 100 USDC')).not.toBeInTheDocument();
  });

  it('should show price and amount when not loading', () => {
    render(<TokenDisplay token={Token.USDC} amount={100} price={1.0} isLoading={false} />);

    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('$1 per USDC')).toBeInTheDocument();
    expect(screen.getByText(/≈ 100 USDC/)).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should show price and amount when loading is undefined', () => {
    render(<TokenDisplay token={Token.USDC} amount={100} price={1.0} />);

    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('$1 per USDC')).toBeInTheDocument();
    expect(screen.getByText(/≈ 100 USDC/)).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should handle null amounts and prices', () => {
    render(<TokenDisplay token={Token.USDC} amount={null} price={null} isLoading={false} />);

    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('— per USDC')).toBeInTheDocument();
    expect(screen.getByText('≈ — USDC')).toBeInTheDocument();
  });
});
