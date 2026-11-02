import { processRunner, type ProcessRunner } from './process-runner.js';
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
  await runner.run(manager, commands[manager].install, { cwd });
}
export async function addDependencies(
  cwd: string,
  manager: PackageManager,
  dependencies: string[],
  runner: ProcessRunner = processRunner
): Promise<void> {
  if (dependencies.length)
    await runner.run(manager, [...commands[manager].add, ...dependencies], {
      cwd
    });
}
