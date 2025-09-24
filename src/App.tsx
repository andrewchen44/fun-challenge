import { useState, useCallback, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from './components/ErrorFallback';
import { TokenChip, Panel, AmountInput, TokenDisplay } from './components/TokenSwap';
import { Token, TOKEN_LIST, DEFAULT_TOKEN } from './constants/tokens';
import { useTokenPrices } from './hooks/useTokenPrices';

const App = () => {
  const [sourceToken, setSourceToken] = useState<Token>(DEFAULT_TOKEN);
  const [targetToken, setTargetToken] = useState<Token>(Token.ETH);
  const [usdAmount, setUsdAmount] = useState<number>(100);

  const { prices, isLoading, error, lastFetched, refetch } = useTokenPrices(
    sourceToken,
    targetToken,
  );

  const handleSourceTokenChange = useCallback((token: Token) => {
    setSourceToken(token);
  }, []);

  const handleTargetTokenChange = useCallback((token: Token) => {
    setTargetToken(token);
  }, []);

  const handleUsdAmountChange = useCallback((amount: number) => {
    setUsdAmount(amount);
  }, []);

  const sourceAmount = useMemo(() => {
    const price = prices[sourceToken];
    return price ? usdAmount / price : null;
  }, [usdAmount, sourceToken, prices]);

  const targetAmount = useMemo(() => {
    const price = prices[targetToken];
    return price ? usdAmount / price : null;
  }, [usdAmount, targetToken, prices]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="frame">
        <h1 className="title">Token Price Explorer</h1>

        {error && (
          <div className="error-banner">
            <p>Error loading prices: {error}</p>
            <button type="button" onClick={refetch}>
              Retry
            </button>
          </div>
        )}

        <div className="price-info">
          {lastFetched && (
            <p className="last-updated">
              Last updated:{' '}
              {lastFetched.toLocaleString(undefined, {
                timeZoneName: 'short',
              })}
            </p>
          )}
          <button type="button" className="refresh-button" onClick={refetch} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh Prices'}
          </button>
        </div>
        <div className="panes">
          <Panel>
            <div className="panel-content">
              <div className="token-row" role="tablist">
                {TOKEN_LIST.map((token) => (
                  <TokenChip
                    key={token}
                    label={token}
                    active={sourceToken === token}
                    onClick={() => handleSourceTokenChange(token)}
                    disabled={isLoading}
                  />
                ))}
              </div>

              <AmountInput
                label="USD Amount"
                value={usdAmount}
                onChange={handleUsdAmountChange}
                placeholder="100.00"
                min={0}
                max={1000000000000}
                disabled={isLoading}
              />

              <TokenDisplay
                token={sourceToken}
                amount={sourceAmount}
                price={prices[sourceToken]}
                isLoading={isLoading}
              />
            </div>
          </Panel>

          <div className="arrow" aria-hidden="true">
            →
          </div>

          <Panel>
            <div className="panel-content">
              <div className="token-row" role="tablist">
                {TOKEN_LIST.map((token) => (
                  <TokenChip
                    key={token}
                    label={token}
                    active={targetToken === token}
                    onClick={() => handleTargetTokenChange(token)}
                    disabled={isLoading}
                  />
                ))}
              </div>

              <div className="amount-display">
                <div className="amount-display__label">USD Amount</div>
                <div className="amount-display__value">
                  $
                  {usdAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              <TokenDisplay
                token={targetToken}
                amount={targetAmount}
                price={prices[targetToken]}
                isLoading={isLoading}
              />
            </div>
          </Panel>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
