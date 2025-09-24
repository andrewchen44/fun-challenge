import '@testing-library/jest-dom';

// Configure React Testing Library to use createRoot
import { configure } from '@testing-library/react';

// Use the modern React 18 rendering API
configure({
  // This ensures Testing Library uses createRoot instead of ReactDOM.render
  reactStrictMode: true,
});
