import { describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const execFileAsync = promisify(execFile);

describe('CLI smoke e2e', () => {
  it('runs a non-interactive dry run through the compiled binary', async () => {
    const { stdout } = await execFileAsync(process.execPath, [
      resolve('dist/cli/index.js'),
      'e2e-app',
      '--angular',
      '22.2.5',
      '--architecture',
      'enterprise',
      '--style',
      'scss',
      '--auth',
      'none',
      '--state',
      'signals',
      '--ci',
      'none',
      '--yes',
      '--dry-run',
      '--no-install',
      '--no-git'
    ]);
    expect(stdout).toContain('Project created successfully');
    expect(stdout).toContain('Created');
  });
});
