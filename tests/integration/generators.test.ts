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
import { generateStarterDashboard } from '../../src/generators/starter-dashboard.js';
import type { ProjectOptions } from '../../src/types/index.js';

describe('feature generator integration', () => {
  it('replaces the Angular welcome page with a configured starter dashboard', async () => {
    const root = await mkdtemp(join(tmpdir(), 'setup-angular-dashboard-'));
    const engine = new TemplateEngine();
    const options: ProjectOptions = {
      projectName: 'launchpad',
      targetDirectory: root,
      angular: '22.2.5',
      architecture: 'enterprise',
      style: 'tailwind',
      auth: 'jwt',
      state: 'signals',
      crud: true,
      docker: false,
      ci: 'none',
      testing: true,
      packageManager: 'npm',
      install: false,
      git: false,
      yes: true,
      dryRun: false,
      prerelease: false
    };
    await generateStarterDashboard(root, options, engine);
    const html = await readFile(join(root, 'src/app/app.html'), 'utf8');
    const dashboard = await readFile(
      join(root, 'src/app/dashboard/dashboard.component.ts'),
      'utf8'
    );
    const routes = await readFile(join(root, 'src/app/app.routes.ts'), 'utf8');
    expect(html).toContain('Angular 22.2.5');
    expect(dashboard).toContain('JWT scaffold');
    expect(dashboard).toContain('Products');
    expect(html).toContain('Angular CLI guide');
    expect(routes).toContain("path: 'login'");
  });

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
