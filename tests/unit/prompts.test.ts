import { describe, expect, it, vi, beforeEach } from 'vitest';
import { confirm, input, select } from '@inquirer/prompts';
import { promptOptions } from '../../src/cli/prompts/index.js';

vi.mock('@inquirer/prompts', () => ({
  confirm: vi.fn(),
  input: vi.fn(),
  select: vi.fn()
}));

const mockedInput = vi.mocked(input);
const mockedSelect = vi.mocked(select);
const mockedConfirm = vi.mocked(confirm);

describe('non-interactive prompts', () => {
  it('does not ask questions when --yes is set', async () => {
    const options = await promptOptions({ projectName: 'ci-app', yes: true });
    expect(options.projectName).toBe('ci-app');
    expect(options.architecture).toBe('standard');
    expect(options.crud).toBe(false);
    expect(options.docker).toBe(false);
  });

  it('asks the complete interactive flow and preserves every selection', async () => {
    mockedInput.mockResolvedValueOnce('interactive-app');
    mockedSelect
      .mockResolvedValueOnce('21')
      .mockResolvedValueOnce('enterprise')
      .mockResolvedValueOnce('tailwind')
      .mockResolvedValueOnce('jwt')
      .mockResolvedValueOnce('ngrx');
    mockedConfirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    const options = await promptOptions(
      {},
      {
        angularVersions: [{ version: '21.2.29', major: 21 }]
      }
    );

    expect(options).toMatchObject({
      projectName: 'interactive-app',
      angular: '21',
      architecture: 'enterprise',
      style: 'tailwind',
      auth: 'jwt',
      state: 'ngrx',
      crud: true,
      docker: true,
      ci: 'github'
    });
    expect(mockedSelect).toHaveBeenCalledTimes(5);
    expect(mockedConfirm).toHaveBeenCalledTimes(3);
  });
});
