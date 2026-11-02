import { describe, expect, it } from 'vitest';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TemplateEngine } from '../../src/core/template-engine.js';
import { generateAuth } from '../../src/generators/auth.js';
import { generateState } from '../../src/generators/state.js';
import { generateStyling } from '../../src/generators/styling.js';
import { generateCrud } from '../../src/generators/crud.js';
import { generateDocker, generateCi } from '../../src/generators/tooling.js';

describe('feature generator integration', () => {
  it('generates the enterprise feature set without collisions', async () => {
    const root = await mkdtemp(join(tmpdir(), 'setup-angular-'));
    const engine = new TemplateEngine();
    await generateAuth(root, engine);
    await generateState(root, 'signals', engine);
    await generateStyling(root, 'tailwind', engine);
    await generateCrud(root, 'products', engine);
    await generateDocker(root, engine);
    await generateCi(root, engine, 'npm');
    expect(
      await readFile(join(root, 'src/app/core/auth/auth.service.ts'), 'utf8')
    ).toContain('AuthService');
    expect(await readFile(join(root, 'src/styles.scss'), 'utf8')).toContain(
      'tailwind.css'
    );
    expect(
      await readFile(
        join(root, 'src/app/features/products/products-list.component.ts'),
        'utf8'
      )
    ).toContain('@if');
    expect(await readFile(join(root, 'Dockerfile'), 'utf8')).toContain(
      'nginx-unprivileged'
    );
    expect(await readFile(join(root, 'Dockerfile'), 'utf8')).toContain(
      'dist/*/browser'
    );
    expect(
      await readFile(join(root, '.github/workflows/ci.yml'), 'utf8')
    ).toContain('npm ci');
  });
});
