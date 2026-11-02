import { describe, expect, it } from 'vitest';
import { validProjectName, validateOptions } from '../../src/cli/validators.js';
describe('project validation', () => {
  it('accepts normal npm project names', () =>
    expect(validProjectName('my-app')).toBe(true));
  it('rejects path traversal and separators', () =>
    expect(validProjectName('../bad')).toBe(false));
  it('accepts feature selections for minimal architecture', () =>
    expect(
      validateOptions({
        projectName: 'app',
        targetDirectory: 'app',
        angular: 'latest',
        architecture: 'minimal',
        style: 'material',
        auth: 'jwt',
        state: 'none',
        crud: true,
        docker: false,
        ci: 'none',
        testing: true,
        packageManager: 'npm',
        install: false,
        git: false,
        yes: true,
        dryRun: true,
        prerelease: false
      })
    ).toEqual([]));
});
