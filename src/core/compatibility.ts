import semver from 'semver';
import type { ProjectOptions } from '../types/index.js';

export function validateCompatibility(
  options: ProjectOptions,
  angularVersion: string
): string[] {
  const errors: string[] = [];
  if (!semver.valid(angularVersion))
    errors.push(`Invalid Angular version: ${angularVersion}`);
  if (
    options.state === 'ngrx' &&
    semver.valid(angularVersion) &&
    semver.major(angularVersion) < 16
  )
    errors.push('NgRx generation requires Angular 16 or newer.');
  if (
    options.style === 'tailwind' &&
    semver.valid(angularVersion) &&
    semver.major(angularVersion) < 15
  )
    errors.push('Tailwind generation requires Angular 15 or newer.');
  return errors;
}

export function assertCompatible(
  options: ProjectOptions,
  angularVersion: string
): void {
  const errors = validateCompatibility(options, angularVersion);
  if (errors.length) throw new Error(errors.join('\n'));
}
