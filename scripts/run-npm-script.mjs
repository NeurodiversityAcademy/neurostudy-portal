#!/usr/bin/env node
/**
 * Shared helper: spawn `npm run <script>` and resolve/reject on exit.
 */
import { spawn } from 'node:child_process';

/**
 * @param {string} script
 * @param {{ env?: NodeJS.ProcessEnv }} [options]
 * @returns {Promise<void>}
 */
export const runNpmScript = (script, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', script], {
      stdio: 'inherit',
      env: { ...process.env, ...options.env },
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

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ env?: NodeJS.ProcessEnv }} [options]
 * @returns {Promise<void>}
 */
export const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ...options.env },
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} failed with exit ${code ?? 1}`));
    });
  });
