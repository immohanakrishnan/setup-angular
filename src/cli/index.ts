#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { promptOptions } from './prompts/index.js';
import { validateOptions } from './validators.js';
import { resolveAngularVersion } from '../core/angular-version.js';
import { discoverAngularVersions } from '../core/angular-version.js';
import { assertCompatible } from '../core/compatibility.js';
import { generateProject } from '../core/project-generator.js';
import { addGenerator } from './commands/add.js';
import type { ProjectOptions } from '../types/index.js';

const program = new Command();
program
  .name('setup-angular')
  .description(
    'Set up scalable Angular applications with an enterprise-ready baseline.'
  )
  .version(
    JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8')
    ).version
  );
program
  .argument('[project-name]', 'directory and project name')
  .option('--angular <version>', 'Angular CLI version or latest')
  .option('--architecture <type>', 'enterprise, standard, or minimal')
  .option('--style <style>', 'scss, css, tailwind, or material')
  .option('--auth <type>', 'jwt or none')
  .option('--state <type>', 'signals, ngrx, or none')
  .option('--crud', 'include the products CRUD example')
  .option('--docker', 'include Docker files')
  .option('--ci <provider>', 'github or none')
  .option('--no-testing', 'omit test setup')
  .option('--package-manager <manager>', 'npm, pnpm, or yarn', 'npm')
  .option('--no-install', 'skip dependency installation')
  .option('--no-git', 'skip git initialization')
  .option('--yes', 'use non-interactive defaults')
  .option('--dry-run', 'show planned files without writing or running commands')
  .option('--prerelease', 'allow prerelease Angular versions')
  .option('--ssr', 'enable server-side rendering')
  .option('--zoneless', 'enable zoneless change detection');
program.action(async (projectName: string | undefined, flags) => {
  const base: Partial<ProjectOptions> = {
    projectName,
    targetDirectory: projectName ? resolve(projectName) : undefined,
    ...flags
  };
  let angularVersions;
  if (!base.angular && !base.yes) {
    try {
      angularVersions = await discoverAngularVersions(Boolean(base.prerelease));
    } catch {
      angularVersions = [];
    }
  }
  const options = await promptOptions(base, { angularVersions });
  const errors = validateOptions(options);
  if (errors.length) throw new Error(errors.join('\n'));
  const release = await resolveAngularVersion(
    options.angular,
    options.prerelease
  );
  assertCompatible(options, release.version);
  options.angular = release.version;
  console.log(
    `\n🚀 Setting up Angular workspace with Angular ${release.version}`
  );
  const result = await generateProject(options);
  console.log(`\n🎉 Project created successfully: ${options.targetDirectory}`);
  console.log(
    `Created ${result.created.length} files; skipped ${result.skipped.length} existing files.`
  );
});
program
  .command('add <kind> <name>')
  .description(
    'Add a feature, component, service, or CRUD example to an existing workspace.'
  )
  .option('--dry-run')
  .action(async (kind, name, flags) => {
    const result = await addGenerator(kind, name, process.cwd(), flags.dryRun);
    console.log(
      `Created ${result.created.length} files; skipped ${result.skipped.length}.`
    );
  });
program.parseAsync().catch((error) => {
  console.error(
    `\n✖ ${error instanceof Error ? error.message : String(error)}`
  );
  process.exitCode = 1;
});
