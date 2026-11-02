import path from 'node:path';
import type { ProjectOptions } from '../types/index.js';
export const validProjectName = (name: string): boolean =>
  /^[a-zA-Z][a-zA-Z0-9._-]*$/.test(name) && name !== '.' && name !== '..';
export function validateOptions(options: ProjectOptions): string[] {
  const errors: string[] = [];
  if (!validProjectName(options.projectName))
    errors.push(
      'Project name must start with a letter and contain only letters, numbers, dots, underscores, or hyphens.'
    );
  if (options.projectName.includes(path.sep))
    errors.push('Project name must not contain path separators.');
  return errors;
}
