import { describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);

describe('CLI smoke e2e', () => {
  it.each(['--version', '-V'])(
    'reports installed metadata for %s from another directory',
    async (flag) => {
      const metadata = JSON.parse(
        await readFile(resolve('package.json'), 'utf8')
      );
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        [resolve('dist/cli/index.js'), flag],
        { cwd: tmpdir(), env: { ...process.env, npm_package_version: '0.0.0' } }
      );
      expect(stdout.trim()).toBe(metadata.version);
      expect(stderr).toBe('');
    }
  );
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
