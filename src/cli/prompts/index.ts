import { confirm, select, input } from '@inquirer/prompts';
import type { ProjectOptions } from '../../types/index.js';
export async function promptOptions(
  base: Partial<ProjectOptions>
): Promise<ProjectOptions> {
  const automated = base.yes === true;
  const projectName =
    base.projectName ??
    (automated ? 'angular-app' : await input({ message: 'Project name:' }));
  const architecture =
    base.architecture ??
    (automated
      ? 'standard'
      : await select({
          message: 'Architecture:',
          choices: [
            { name: 'Standard', value: 'standard' },
            { name: 'Enterprise', value: 'enterprise' },
            { name: 'Minimal', value: 'minimal' }
          ]
        }));
  const style =
    base.style ??
    (automated
      ? 'scss'
      : await select({
          message: 'Styling:',
          choices: [
            { name: 'SCSS', value: 'scss' },
            { name: 'CSS', value: 'css' },
            { name: 'Tailwind CSS', value: 'tailwind' },
            { name: 'Angular Material', value: 'material' }
          ]
        }));
  const auth =
    base.auth ??
    (automated
      ? 'none'
      : await select({
          message: 'Authentication:',
          choices: [
            { name: 'JWT scaffold', value: 'jwt' },
            { name: 'None', value: 'none' }
          ]
        }));
  const state =
    base.state ??
    (automated
      ? 'signals'
      : await select({
          message: 'State management:',
          choices: [
            { name: 'Angular Signals', value: 'signals' },
            { name: 'NgRx', value: 'ngrx' },
            { name: 'None', value: 'none' }
          ]
        }));
  const crud =
    base.crud ??
    (automated
      ? false
      : await confirm({ message: 'Include sample CRUD?', default: false }));
  const docker =
    base.docker ??
    (automated
      ? false
      : await confirm({ message: 'Configure Docker?', default: false }));
  const ci =
    base.ci ??
    (automated
      ? 'none'
      : (await confirm({
            message: 'Configure GitHub Actions?',
            default: false
          }))
        ? 'github'
        : 'none');
  return {
    projectName,
    targetDirectory: base.targetDirectory ?? projectName,
    angular: base.angular ?? 'latest',
    architecture,
    style,
    auth,
    state,
    crud,
    docker,
    ci,
    testing: base.testing ?? true,
    packageManager: base.packageManager ?? 'npm',
    install: base.install ?? true,
    git: base.git ?? true,
    yes: base.yes ?? false,
    dryRun: base.dryRun ?? false,
    prerelease: base.prerelease ?? false
  } as ProjectOptions;
}
