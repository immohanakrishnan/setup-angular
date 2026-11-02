import { mkdir, access, mkdtemp } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, resolve, win32 } from 'node:path';
import { tmpdir } from 'node:os';
import { processRunner, type ProcessRunner } from './process-runner.js';
import { TemplateEngine } from './template-engine.js';
import { addDependencies, installDependencies } from './dependency-manager.js';
import { generateArchitecture } from '../generators/architecture.js';
import { generateAuth } from '../generators/auth.js';
import { generateState } from '../generators/state.js';
import { generateStyling } from '../generators/styling.js';
import { generateCrud } from '../generators/crud.js';
import { generateCi, generateDocker } from '../generators/tooling.js';
import type { ProjectOptions, CommandResult } from '../types/index.js';

export async function generateProject(
  options: ProjectOptions,
  runner: ProcessRunner = processRunner
): Promise<CommandResult> {
  const root =
    isAbsolute(options.targetDirectory) ||
    win32.isAbsolute(options.targetDirectory)
      ? options.targetDirectory
      : resolve(options.targetDirectory);
  if (!options.dryRun) {
    try {
      await access(root);
    } catch {
      await mkdir(root, { recursive: true });
    }
  }
  const engine = new TemplateEngine(options.dryRun);
  if (!options.dryRun) {
    const args = [
      '--yes',
      `@angular/cli@${options.angular}`,
      'new',
      options.projectName,
      '--directory',
      basename(root),
      '--style',
      options.style === 'css' ? 'css' : 'scss',
      '--routing',
      '--standalone',
      '--skip-git',
      '--skip-install',
      '--package-manager',
      options.packageManager
    ];
    try {
      await runner.run('npx', args, { cwd: dirname(root) });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('ENOENT') && !message.includes('package.json'))
        throw error;
      const isolatedCache = await mkdtemp(
        join(tmpdir(), 'setup-angular-npm-cache-')
      );
      console.warn(
        'Angular CLI lookup hit an npm cache error; retrying with an isolated cache.'
      );
      await runner.run('npx', ['--cache', isolatedCache, ...args], {
        cwd: dirname(root)
      });
    }
  }
  await generateArchitecture(root, options.architecture, engine);
  if (options.auth === 'jwt') await generateAuth(root, engine);
  await generateState(root, options.state, engine);
  await generateStyling(root, options.style, engine);
  if (options.crud) await generateCrud(root, 'products', engine);
  if (options.docker) await generateDocker(root, engine);
  if (options.ci === 'github')
    await generateCi(root, engine, options.packageManager);
  const extra: string[] = [];
  const angularMajor = options.angular.split('.')[0];
  if (options.state === 'ngrx')
    extra.push(
      `@ngrx/store@^${angularMajor}.0.0`,
      `@ngrx/effects@^${angularMajor}.0.0`
    );
  if (options.style === 'tailwind')
    extra.push('tailwindcss', '@tailwindcss/postcss');
  if (options.style === 'material')
    extra.push(
      `@angular/material@^${angularMajor}.0.0`,
      `@angular/cdk@^${angularMajor}.0.0`
    );
  if (!options.dryRun) {
    await addDependencies(root, options.packageManager, extra, runner);
    if (options.install)
      await installDependencies(root, options.packageManager, runner);
    if (options.git) await runner.run('git', ['init'], { cwd: root });
  }
  return engine.getResult();
}
