import React from 'react';
import './styles.css';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>Please refresh the page and try again.</p>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
};
