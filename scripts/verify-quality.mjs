#!/usr/bin/env node
/**
 * Run independent quality checks in parallel, then tests + coverage gate.
 * Same gates as before — faster wall-clock only.
 */
import { spawn } from 'node:child_process';

const run = (script) =>
  new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', script], {
      stdio: 'inherit',
      env: process.env,
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`npm run ${script} failed with exit ${code ?? 1}`));
    });
  });

const parallelScripts = ['security:audit', 'format:check', 'lint', 'typecheck'];

try {
  console.log(`Running in parallel: ${parallelScripts.join(', ')}`);
  await Promise.all(parallelScripts.map((script) => run(script)));
  console.log('Running test:ci…');
  await run('test:ci');
  console.log('Running coverage:changed…');
  await run('coverage:changed');
  console.log('verify:quality passed');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
