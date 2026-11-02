import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { Options } from 'execa';
import type { ProcessRunner } from './process-runner.js';

const npmCommands = new Set(['npm', 'npm.cmd', 'npx', 'npx.cmd']);

export function isRecoverableNpmCacheError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const hasCacheContext =
    /(_cacache|_npx|npm[- ]cache|cache(?: directory| path)?|package\.json)/i.test(
      message
    );
  if (!/(npm|npx|_cacache|tarball|integrity|cache)/i.test(message))
    return false;
  if (
    /(EACCES|EPERM|permission denied|invalid package|EINVALIDTAGNAME|ERESOLVE|peer dep|unsupported engine|EBADENGINE|notsup)/i.test(
      message
    )
  )
    return false;
  if (/ENOENT/i.test(message)) return hasCacheContext;
  return /(_cacache|cache.*(fail|error|miss|corrupt)|corrupt|tarball.*(corrupt|bad|unexpected)|TAR_BAD_ARCHIVE|EINTEGRITY|integrity.*(fail|checksum|mismatch)|checksum.*(fail|mismatch)|unexpected end of file)/i.test(
    message
  );
}

function withIsolatedCache(
  command: string,
  args: string[],
  cacheDirectory: string
): string[] {
  if (command.toLowerCase().startsWith('npx'))
    return ['--cache', cacheDirectory, ...args];
  return [...args, '--cache', cacheDirectory];
}

export async function runNpmOperationWithCacheRetry(
  command: string,
  args: string[],
  options: Options | undefined,
  runner: ProcessRunner
): Promise<void> {
  try {
    await runner.run(command, args, options);
    return;
  } catch (error) {
    if (
      !npmCommands.has(command.toLowerCase()) ||
      !isRecoverableNpmCacheError(error)
    )
      throw error;

    let isolatedCache: string | undefined;
    try {
      isolatedCache = await mkdtemp(join(tmpdir(), 'setup-angular-npm-cache-'));
      console.warn(
        'npm cache recovery: retrying the failed operation with an isolated cache.'
      );
      await runner.run(
        command,
        withIsolatedCache(command, args, isolatedCache),
        options
      );
    } finally {
      if (isolatedCache) {
        try {
          await rm(isolatedCache, { recursive: true, force: true });
        } catch {
          console.warn(
            `npm cache recovery: could not remove temporary cache ${isolatedCache}`
          );
        }
      }
    }
  }
}
