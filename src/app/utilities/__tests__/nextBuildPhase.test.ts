describe('isNextProductionBuildPhase', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('is true when NEXT_PHASE equals phase-production-build', () => {
    process.env.NEXT_PHASE = 'phase-production-build';
    const { isNextProductionBuildPhase } = require('@/app/utilities/nextBuildPhase');
    expect(isNextProductionBuildPhase).toBe(true);
  });

  it('is false when NEXT_PHASE is unset', () => {
    delete process.env.NEXT_PHASE;
    const { isNextProductionBuildPhase } = require('@/app/utilities/nextBuildPhase');
    expect(isNextProductionBuildPhase).toBe(false);
  });

  it('is false when NEXT_PHASE is a different value', () => {
    process.env.NEXT_PHASE = 'phase-development-server';
    const { isNextProductionBuildPhase } = require('@/app/utilities/nextBuildPhase');
    expect(isNextProductionBuildPhase).toBe(false);
  });
});
