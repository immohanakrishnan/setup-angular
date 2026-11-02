import { describe, expect, it } from 'vitest';
import { access } from 'node:fs/promises';
import {
  runNpmOperationWithCacheRetry,
  isRecoverableNpmCacheError
} from '../../src/core/npm-cache-retry.js';

describe('npm cache recovery', () => {
  it('recognizes cache, tarball, and integrity failures', () => {
    expect(
      isRecoverableNpmCacheError('npm ERR! code ENOENT _cacache/content-v2')
    ).toBe(true);
    expect(
      isRecoverableNpmCacheError('tarball data seems to be corrupted')
    ).toBe(true);
    expect(isRecoverableNpmCacheError('npm ERR! code EINTEGRITY')).toBe(true);
    expect(isRecoverableNpmCacheError('spawn npm ENOENT')).toBe(false);
  });

  it('retries npm once with an isolated cache and cleans it up', async () => {
    const calls: Array<{ command: string; args: string[] }> = [];
    let cacheExistedDuringRetry = false;
    let attempt = 0;
    const runner = {
      async run(command: string, args: string[]) {
        calls.push({ command, args });
        attempt += 1;
        if (attempt === 1) throw new Error('npm ERR! code EINTEGRITY _cacache');
        cacheExistedDuringRetry = await access(args.at(-1)!).then(
          () => true,
          () => false
        );
      }
    };

    await runNpmOperationWithCacheRetry(
      'npm',
      ['install', 'tailwindcss'],
      undefined,
      runner
    );

    expect(calls).toHaveLength(2);
    expect(calls[1].args).toContain('--cache');
    expect(cacheExistedDuringRetry).toBe(true);
    await expect(access(calls[1].args.at(-1)!)).rejects.toThrow();
  });

  it('preserves the retry failure and does not retry unrelated errors', async () => {
    let calls = 0;
    const conflict = new Error(
      'npm ERR! ERESOLVE unable to resolve dependency tree'
    );
    const runner = {
      async run() {
        calls += 1;
        throw conflict;
      }
    };

    await expect(
      runNpmOperationWithCacheRetry('npm', ['install'], undefined, runner)
    ).rejects.toBe(conflict);
    expect(calls).toBe(1);

    calls = 0;
    const retryFailure = new Error('npm ERR! code EINTEGRITY after retry');
    const failingRunner = {
      async run() {
        calls += 1;
        throw calls === 1
          ? new Error('npm ERR! _cacache ENOENT')
          : retryFailure;
      }
    };
    await expect(
      runNpmOperationWithCacheRetry(
        'npm',
        ['install'],
        undefined,
        failingRunner
      )
    ).rejects.toBe(retryFailure);
    expect(calls).toBe(2);
  });
});
