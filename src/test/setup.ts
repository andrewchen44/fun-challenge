import '@testing-library/jest-dom';

// Configure React Testing Library to use createRoot
import { configure } from '@testing-library/react';

// Use the modern React 18 rendering API
configure({
  // This ensures Testing Library uses createRoot instead of ReactDOM.render
  reactStrictMode: true,
});

// Suppress console errors during tests to keep output clean
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  // Suppress console.error and console.warn during tests
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  // Restore original console methods
  console.error = originalError;
  console.warn = originalWarn;
});
