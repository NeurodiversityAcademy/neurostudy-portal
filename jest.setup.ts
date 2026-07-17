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
