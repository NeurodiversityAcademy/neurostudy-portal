#!/usr/bin/env node
/**
 * Vercel / deploy build: overlap next build with static quality checks.
 * Deploy fails if any gate fails. Lint, test, coverage, and build always run.
 *
 * Schedule (no Jest ↔ build thrash; no tsc ↔ .next/types race):
 *  1. Start next build + audit/format/lint together
 *     (typecheck is covered by next build's "Running TypeScript" step)
 *  2. After both finish, run test:ci then coverage:changed (full Jest workers)
 *
 * Local `npm run verify:quality` still runs standalone tsc for fast feedback.
 */
import { runCommand, runNpmScript } from './run-npm-script.mjs';

const staticQuality = async () => {
  // security:audit omits devDependencies (prod tree only); run security:audit:all locally for full tree.
  console.log('[quality] parallel: security:audit, format:check, lint');
  await Promise.all([
    runNpmScript('security:audit'),
    runNpmScript('format:check'),
    runNpmScript('lint'),
  ]);
  console.log('[quality] static checks passed');
};

/**
 * `next build`'s type-check step needs more than Node's default old-space limit
 * on this project: at ~2 GB it dies with "Failed to type check" after a
 * Mark-Compact allocation failure. Raise the heap for the build process only.
 */
const BUILD_HEAP_MB = 4096;

const buildNodeOptions = () => {
  const current = process.env.NODE_OPTIONS ?? '';
  if (current.includes('--max-old-space-size')) {
    return current;
  }
  return `${current} --max-old-space-size=${BUILD_HEAP_MB}`.trim();
};

const buildLane = async () => {
  console.log(`[build] next build… (heap ${BUILD_HEAP_MB} MB)`);
  await runCommand('npx', ['next', 'build'], {
    env: { NODE_OPTIONS: buildNodeOptions() },
  });
  console.log('[build] passed');
};

try {
  // Shallow fetch helps coverage:changed resolve origin/main on Vercel.
  await runCommand('git', ['fetch', '--depth=50', 'origin', 'main']).catch(() => {
    console.warn('[vercel-build] git fetch origin main skipped (non-fatal)');
  });

  console.log('[vercel-build] overlapping static checks with next build…');
  await Promise.all([staticQuality(), buildLane()]);

  console.log('[quality] test:ci…');
  await runNpmScript('test:ci');
  console.log('[quality] coverage:changed…');
  await runNpmScript('coverage:changed');

  console.log('[vercel-build] all gates passed');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
