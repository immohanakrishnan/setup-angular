import { execa, type Options } from 'execa';

export interface ProcessRunner {
  run(command: string, args: string[], options?: Options): Promise<void>;
}

export const processRunner: ProcessRunner = {
  async run(command, args, options) {
    await execa(command, args, { stdio: 'inherit', ...options });
  }
};
