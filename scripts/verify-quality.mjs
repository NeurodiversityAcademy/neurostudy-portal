#!/usr/bin/env node
/**
 * Run independent quality checks in parallel, then tests + coverage gate.
 * Same gates as before — faster wall-clock only.
 *
 * Tests run after static checks so Jest does not fight tsc/eslint for CPU
 * (parallelizing them increased Jest time more than the overlap saved).
 */
import { runNpmScript } from './run-npm-script.mjs';

const parallelScripts = ['security:audit', 'format:check', 'lint', 'typecheck'];

try {
  console.log(`Running in parallel: ${parallelScripts.join(', ')}`);
  await Promise.all(parallelScripts.map((script) => runNpmScript(script)));
  console.log('Running test:ci…');
  await runNpmScript('test:ci');
  console.log('Running coverage:changed…');
  await runNpmScript('coverage:changed');
  console.log('verify:quality passed');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
