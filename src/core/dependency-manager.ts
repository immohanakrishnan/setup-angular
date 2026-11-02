import { processRunner, type ProcessRunner } from './process-runner.js';
import { runNpmOperationWithCacheRetry } from './npm-cache-retry.js';
import type { PackageManager } from '../types/index.js';

const commands: Record<PackageManager, { install: string[]; add: string[] }> = {
  npm: { install: ['install'], add: ['install'] },
  pnpm: { install: ['install'], add: ['add'] },
  yarn: { install: [], add: ['add'] }
};
export async function installDependencies(
  cwd: string,
  manager: PackageManager,
  runner: ProcessRunner = processRunner
): Promise<void> {
  await runNpmOperationWithCacheRetry(
    manager,
    commands[manager].install,
    { cwd },
    runner
  );
}
export async function addDependencies(
  cwd: string,
  manager: PackageManager,
  dependencies: string[],
  runner: ProcessRunner = processRunner
): Promise<void> {
  if (dependencies.length)
    await runNpmOperationWithCacheRetry(
      manager,
      [...commands[manager].add, ...dependencies],
      { cwd },
      runner
    );
}
