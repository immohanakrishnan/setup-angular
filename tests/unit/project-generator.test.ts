import { describe, expect, it } from 'vitest';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateProject } from '../../src/core/project-generator.js';

describe('project generator process recovery', () => {
  it('retries Angular CLI with an isolated npm cache after ENOENT', async () => {
    const root = await mkdtemp(join(tmpdir(), 'setup-angular-generator-'));
    const calls: Array<{ command: string; args: string[] }> = [];
    let attempt = 0;
    const runner = {
      async run(command: string, args: string[]) {
        calls.push({ command, args });
        attempt += 1;
        if (attempt === 1) throw new Error('npm ENOENT package.json');
      }
    };

    await generateProject(
      {
        projectName: 'cache-retry-app',
        targetDirectory: root,
        angular: '22.2.5',
        architecture: 'minimal',
        style: 'css',
        auth: 'none',
        state: 'none',
        crud: false,
        docker: false,
        ci: 'none',
        testing: true,
        packageManager: 'npm',
        install: false,
        git: false,
        yes: true,
        dryRun: false,
        prerelease: false
      },
      runner
    );

    expect(calls).toHaveLength(2);
    expect(calls[1].args[0]).toBe('--cache');
  });
});
