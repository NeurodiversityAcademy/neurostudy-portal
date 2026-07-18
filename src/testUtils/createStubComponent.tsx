import React from 'react';

/**
 * Builds a minimal presentational stub for page/section components in tests.
 */
export function createStubComponent(testId: string): React.FC {
  const Stub: React.FC = () => <div data-testid={testId} />;
  Stub.displayName = `Stub(${testId})`;
  return Stub;
}

/**
 * Jest module shape for `jest.mock(path, () => require(...).mockX)`.
 */
export function createStubModule(testId: string): {
  __esModule: true;
  default: React.FC;
} {
  return {
    __esModule: true,
    default: createStubComponent(testId),
  };
}
