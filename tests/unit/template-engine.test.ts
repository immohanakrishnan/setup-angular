import { describe, expect, it } from 'vitest';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TemplateEngine } from '../../src/core/template-engine.js';
describe('template engine', () => {
  it('does not overwrite existing files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'cap-'));
    const engine = new TemplateEngine();
    await engine.write(root, 'a.txt', 'one');
    await engine.write(root, 'a.txt', 'two');
    expect(await readFile(join(root, 'a.txt'), 'utf8')).toBe('one');
    expect(engine.getResult().skipped).toEqual(['a.txt']);
  });
});
