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

// Mock price data - in real app, this would come from API
const MOCK_PRICES: Record<Token, number> = {
  [Token.USDC]: 1.00,
  [Token.USDT]: 1.00,
  [Token.ETH]: 2500.00,
  [Token.WBTC]: 45000.00,
};

const App = () => {
  const [sourceToken, setSourceToken] = useState<Token>(DEFAULT_TOKEN);
  const [targetToken, setTargetToken] = useState<Token>(Token.ETH);
  const [usdAmount, setUsdAmount] = useState<number>(100);

  const handleSourceTokenChange = useCallback((token: Token) => {
    setSourceToken(token);
  }, []);

  const handleTargetTokenChange = useCallback((token: Token) => {
    setTargetToken(token);
  }, []);

  const handleUsdAmountChange = useCallback((amount: number) => {
    setUsdAmount(amount);
  }, []);

  // Calculate token amounts based on USD input
  const sourceAmount = useMemo(() => {
    const price = MOCK_PRICES[sourceToken];
    return price ? usdAmount / price : null;
  }, [usdAmount, sourceToken]);

  const targetAmount = useMemo(() => {
    const price = MOCK_PRICES[targetToken];
    return price ? usdAmount / price : null;
  }, [usdAmount, targetToken]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="frame">
        <h1 className="title">Token Price Explorer</h1>
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
                price={MOCK_PRICES[sourceToken]}
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
                price={MOCK_PRICES[targetToken]}
              />
            </div>
          </Panel>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;


