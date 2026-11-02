import { TemplateEngine } from '../core/template-engine.js';
import type { Architecture } from '../types/index.js';

const dirs = [
  'src/app/core/auth',
  'src/app/core/guards',
  'src/app/core/interceptors',
  'src/app/core/services',
  'src/app/core/config',
  'src/app/core/errors',
  'src/app/core/tokens',
  'src/app/shared/components',
  'src/app/shared/directives',
  'src/app/shared/pipes',
  'src/app/shared/models',
  'src/app/shared/utils',
  'src/app/shared/validators',
  'src/app/features/dashboard',
  'src/app/layouts/main-layout',
  'src/app/layouts/auth-layout',
  'src/environments',
  'src/styles',
  'src/assets'
];

const standardDirs = [
  'src/app/components',
  'src/app/services',
  'src/app/models',
  'src/app/pages/dashboard',
  'src/app/pages/users'
];
export async function generateArchitecture(
  root: string,
  architecture: Architecture,
  engine: TemplateEngine
): Promise<void> {
  if (architecture === 'minimal') return;
  if (architecture === 'standard') {
    for (const dir of standardDirs)
      await engine.write(root, `${dir}/.gitkeep`, '');
    await engine.write(
      root,
      'src/app/pages/dashboard/dashboard.page.ts',
      `import { ChangeDetectionStrategy, Component } from '@angular/core';\n\n@Component({ selector: 'app-dashboard-page', standalone: true, template: '<main><h1>Dashboard</h1><p>Your maintainable Angular workspace is ready.</p></main>', changeDetection: ChangeDetectionStrategy.OnPush })\nexport class DashboardPage {}\n`
    );
    await engine.write(
      root,
      'src/app/app.routes.ts',
      `import { Routes } from '@angular/router';\n\nexport const routes: Routes = [{ path: '', pathMatch: 'full', redirectTo: 'dashboard' }, { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage) }, { path: '**', redirectTo: '' }];\n`
    );
    return;
  }
  for (const dir of dirs) await engine.write(root, `${dir}/.gitkeep`, '');
  await engine.write(
    root,
    'src/app/app.routes.ts',
    `import { Routes } from '@angular/router';\n\nexport const routes: Routes = [\n  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },\n  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },\n  { path: '**', redirectTo: '' }\n];\n`
  );
  await engine.write(
    root,
    'src/app/features/dashboard/dashboard.component.ts',
    `import { ChangeDetectionStrategy, Component } from '@angular/core';\n\n@Component({ selector: 'app-dashboard', standalone: true, template: '<main><h1>Dashboard</h1><p>Welcome to your Setup Angular workspace.</p></main>', changeDetection: ChangeDetectionStrategy.OnPush })\nexport class DashboardComponent {}\n`
  );
}
