import { describe, expect, it } from 'vitest';
import { promptOptions } from '../../src/cli/prompts/index.js';

describe('non-interactive prompts', () => {
  it('does not ask questions when --yes is set', async () => {
    const options = await promptOptions({ projectName: 'ci-app', yes: true });
    expect(options.projectName).toBe('ci-app');
    expect(options.architecture).toBe('standard');
    expect(options.crud).toBe(false);
    expect(options.docker).toBe(false);
  });
});
