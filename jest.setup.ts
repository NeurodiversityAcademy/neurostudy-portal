import { TextDecoder, TextEncoder } from 'util';
import * as React from 'react';
import { act as reactAct } from 'react';
import '@testing-library/jest-dom';

if (typeof globalThis.TextEncoder === 'undefined') {
  Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder });
  Object.defineProperty(globalThis, 'TextDecoder', { value: TextDecoder });
}

// React 19 + @testing-library/react expect React.act on the namespace export.
// Some CJS/ESM interop paths on CI omit it; fall back to the named export.
Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  configurable: true,
  writable: true,
  value: true,
});
if (typeof (React as { act?: unknown }).act !== 'function') {
  Object.defineProperty(React, 'act', {
    configurable: true,
    writable: true,
    value: reactAct,
  });
}
