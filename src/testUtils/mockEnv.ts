/**
 * Saves and restores process.env between tests.
 * Usage:
 *   const env = saveEnv();
 *   afterEach(() => restoreEnv(env));
 */
export function saveEnv(): NodeJS.ProcessEnv {
  return { ...process.env };
}

export function restoreEnv(saved: NodeJS.ProcessEnv): void {
  process.env = saved;
}

export function setEnv(overrides: Record<string, string>): void {
  Object.assign(process.env, overrides);
}
