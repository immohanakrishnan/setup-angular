import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { CommandResult } from '../types/index.js';

export class TemplateEngine {
  constructor(
    private readonly dryRun = false,
    private readonly result: CommandResult = {
      created: [],
      modified: [],
      skipped: []
    }
  ) {}
  async write(
    root: string,
    relative: string,
    content: string,
    overwrite = false
  ): Promise<void> {
    const target = join(root, relative);
    try {
      await access(target);
    } catch {
      if (!this.dryRun) {
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, content, 'utf8');
      }
      this.result.created.push(relative);
      return;
    }
    if (!overwrite) {
      this.result.skipped.push(relative);
      return;
    }
    if (!this.dryRun) await writeFile(target, content, 'utf8');
    this.result.modified.push(relative);
  }
  async append(root: string, relative: string, content: string): Promise<void> {
    const target = join(root, relative);
    let current = '';
    try {
      current = await readFile(target, 'utf8');
    } catch {
      /* new file */
    }
    await this.write(
      root,
      relative,
      current.includes(content.trim())
        ? current
        : `${current}${current ? '\n' : ''}${content}`,
      true
    );
  }
  getResult(): CommandResult {
    return this.result;
  }
}
