import React, { useState, useCallback, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  TokenChip,
  Panel,
  TokenSelector,
  AmountInput,
  TokenDisplay
} from './components/TokenSwap';
import { ErrorFallback } from './components/ErrorFallback';
import { Token, TOKEN_LIST, DEFAULT_TOKEN } from './constants/tokens';
import { useTokenPrices } from './hooks/useTokenPrices';

const App = () => {
  const [sourceToken, setSourceToken] = useState<Token>(DEFAULT_TOKEN);
  const [targetToken, setTargetToken] = useState<Token>(Token.ETH);
  const [usdAmount, setUsdAmount] = useState<number>(100);

  // Fetch real token prices from API
  const { prices, isLoading, error, refetch } = useTokenPrices(TOKEN_LIST);

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
        <div className="token-row" role="tablist">
          {TOKEN_LIST.map((token) => (
            <TokenChip
              key={token}
              label={token}
              active={sourceToken === token}
              onClick={() => handleSourceTokenChange(token)}
            />
          ))}
        </div>

        <div className="panes">
          <Panel>
            <div className="panel-content">
              <TokenSelector
                label="From"
                selectedToken={sourceToken}
                onTokenChange={handleSourceTokenChange}
                tokens={TOKEN_LIST}
              />
              
              <AmountInput
                label="USD Amount"
                value={usdAmount}
                onChange={handleUsdAmountChange}
                placeholder="100.00"
                min={0}
                step={0.01}
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
              <TokenSelector
                label="To"
                selectedToken={targetToken}
                onTokenChange={handleTargetTokenChange}
                tokens={TOKEN_LIST}
              />
              
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
