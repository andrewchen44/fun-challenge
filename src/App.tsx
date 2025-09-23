import React, { useState, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { TokenChip } from './components/TokenChip';
import { Panel } from './components/Panel';
import { ErrorFallback } from './components/ErrorFallback';
import { Token, TOKEN_LIST, DEFAULT_TOKEN } from './constants/tokens';

const App = () => {
  const [active, setActive] = useState<Token>(DEFAULT_TOKEN);

  const handleTokenSelect = useCallback((token: Token) => {
    setActive(token);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="frame">
        <h1 className="title">Token Price Explorer</h1>
        <div className="token-row" role="tablist">
          {TOKEN_LIST.map((token) => (
            <TokenChip
              key={token}
              label={token}
              active={active === token}
              onClick={() => handleTokenSelect(token)}
            />
          ))}
        </div>

        <div className="panes">
          <Panel>
            {/* left content placeholder */}
          </Panel>
          <div className="arrow" aria-hidden="true">
            →
          </div>
          <Panel>
            {/* right content placeholder */}
          </Panel>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;


