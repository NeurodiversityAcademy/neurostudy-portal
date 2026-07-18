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

// Keep Vercel / CI quality-gate logs free of expected RTL/jsdom/app console noise.
// Set DEBUG_TEST_CONSOLE=1 to see console output while debugging tests locally.
const shouldSilenceConsole =
  process.env.DEBUG_TEST_CONSOLE !== '1' &&
  (process.env.CI === 'true' ||
    process.env.CI === '1' ||
    process.env.VERCEL === '1' ||
    process.env.SILENT_TEST_CONSOLE === '1');

if (shouldSilenceConsole) {
  console.error = () => undefined;
  console.warn = () => undefined;
  console.info = () => undefined;
  console.debug = () => undefined;
} else {
  const ignoredConsolePatterns = [
    /Not implemented: navigation/i,
    /inside a test was not wrapped in act/i,
    /An update to .* inside a test was not wrapped in act/i,
    /Warning: An update to .* inside a test was not wrapped in act/i,
    /Failed to fetch course details:/i,
    /Failed to parse or update visited items for key/i,
  ];

  const shouldIgnoreConsoleMessage = (args: unknown[]): boolean => {
    const message = args
      .map((arg) => {
        if (typeof arg === 'string') {
          return arg;
        }
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}`;
        }
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
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
}
