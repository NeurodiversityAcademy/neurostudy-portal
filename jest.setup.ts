import { TextDecoder, TextEncoder } from 'util';
import '@testing-library/jest-dom';

if (typeof globalThis.TextEncoder === 'undefined') {
  Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder });
  Object.defineProperty(globalThis, 'TextDecoder', { value: TextDecoder });
}

// RTL / React 19 require the test act environment. Jest scripts force NODE_ENV=test
// so React.act is available even when the parent Vercel build uses NODE_ENV=production.
Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  configurable: true,
  writable: true,
  value: true,
});

const ignoredConsolePatterns = [
  /Not implemented: navigation/i,
  /inside a test was not wrapped in act/i,
  /An update to .* inside a test was not wrapped in act/i,
  /Warning: An update to .* inside a test was not wrapped in act/i,
];

const shouldIgnoreConsoleMessage = (args: unknown[]): boolean => {
  const message = args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      }
      if (arg instanceof Error) {
        return arg.message;
      }
      return String(arg);
    })
    .join(' ');

  return ignoredConsolePatterns.some((pattern) => pattern.test(message));
};

const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  if (shouldIgnoreConsoleMessage(args)) {
    return;
  }
  originalConsoleError(...args);
};
