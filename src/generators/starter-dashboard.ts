import { TemplateEngine } from '../core/template-engine.js';
import type { ProjectOptions } from '../types/index.js';

const docs = {
  angular: 'https://angular.dev',
  cli: 'https://angular.dev/tools/cli',
  setupAngular: 'https://github.com/immohanakrishnan/setup-angular'
};

function featureCards(options: ProjectOptions): string {
  const cards = [
    {
      title: 'Architecture',
      value: options.architecture,
      detail: 'Project structure and boundaries are ready.'
    },
    {
      title: 'Styling',
      value: options.style,
      detail: 'Your selected styling foundation is configured.'
    },
    ...(options.auth === 'jwt'
      ? [
          {
            title: 'Authentication',
            value: 'JWT scaffold',
            detail: 'Login, session, guard, and interceptor files are ready.'
          }
        ]
      : []),
    ...(options.state !== 'none'
      ? [
          {
            title: 'State',
            value: options.state === 'ngrx' ? 'NgRx' : 'Angular Signals',
            detail: 'State management scaffolding is available.'
          }
        ]
      : []),
    ...(options.crud
      ? [
          {
            title: 'CRUD example',
            value: 'Products',
            detail: 'A mock products feature is ready to customize.'
          }
        ]
      : []),
    ...(options.docker
      ? [
          {
            title: 'Deployment',
            value: 'Docker',
            detail: 'Container and nginx configuration are included.'
          }
        ]
      : []),
    ...(options.ci === 'github'
      ? [
          {
            title: 'Automation',
            value: 'GitHub Actions',
            detail: 'Build, typecheck, and test workflow is included.'
          }
        ]
      : [])
  ];

  return cards
    .map(
      (card) =>
        `<article class="feature-card"><span class="feature-label">${card.title}</span><strong>${card.value}</strong><p>${card.detail}</p></article>`
    )
    .join('\n');
}

export async function generateStarterDashboard(
  root: string,
  options: ProjectOptions,
  engine: TemplateEngine
): Promise<void> {
  await engine.write(
    root,
    'src/app/app.routes.ts',
    `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  ${options.auth === 'jwt' ? "{ path: 'login', loadComponent: () => import('./core/auth/login.component').then(m => m.LoginComponent) }," : ''}
  { path: '**', redirectTo: 'dashboard' }
];
`,
    true
  );
  await engine.write(
    root,
    'src/app/dashboard/dashboard.component.ts',
    `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: ${JSON.stringify(`<div class="feature-grid">${featureCards(options)}</div>`)},
  styles: [
    ':host { display: block; width: 100%; } .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; } .feature-card { min-height: 158px; padding: 23px; border: 1px solid #23344f; border-radius: 18px; background: linear-gradient(145deg, #102039, #0c1728); box-shadow: 0 18px 45px #02071033; } .feature-label { display: block; margin-bottom: 18px; color: #8da4c2; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; } .feature-card strong { color: #fff; font-size: 24px; letter-spacing: -.04em; } .feature-card p { margin: 10px 0 0; color: #91a5bf; font-size: 13px; line-height: 1.5; }'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
`
  );
  await engine.write(
    root,
    'src/app/app.html',
    `<main class="starter-shell">
  <header class="topbar">
    <a class="brand" href="/dashboard" aria-label="${options.projectName} dashboard"><span class="brand-mark">SA</span><span>${options.projectName}</span></a>
    <nav aria-label="Documentation">
      <a href="${docs.angular}" target="_blank" rel="noreferrer">Angular docs</a>
      <a href="${docs.cli}" target="_blank" rel="noreferrer">CLI guide</a>
    </nav>
  </header>
  <section class="hero">
    <div class="eyebrow">SETUP ANGULAR STARTER</div>
    <h1>Your workspace is ready to build.</h1>
    <p class="intro">A clean, responsive starting point for <strong>${options.projectName}</strong>, configured with the choices you made in the CLI.</p>
    <div class="meta-row"><span>Angular ${options.angular}</span><span>${options.packageManager}</span>${options.ssr ? '<span>SSR enabled</span>' : ''}${options.zoneless ? '<span>Zoneless enabled</span>' : ''}</div>
  </section>
  <section class="dashboard-grid" aria-label="Generated setup summary">
    <router-outlet></router-outlet>
  </section>
  <section class="quick-start">
    <div><span class="eyebrow">NEXT STEPS</span><h2>Make it yours</h2><p>Start with the dashboard route, then connect your data and backend services as your product takes shape.</p></div>
    <div class="actions"><a class="primary-action" href="${docs.cli}" target="_blank" rel="noreferrer">Read the Angular CLI guide <span>↗</span></a><a class="text-action" href="${docs.setupAngular}" target="_blank" rel="noreferrer">Setup Angular documentation ↗</a></div>
  </section>
</main>
<style>
  :host { display: block; min-height: 100vh; color: #eef4ff; background: #08111f; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  * { box-sizing: border-box; }
  .starter-shell { min-height: 100vh; max-width: 1180px; margin: 0 auto; padding: 28px clamp(20px, 5vw, 64px) 56px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .brand { display: inline-flex; align-items: center; gap: 11px; color: #fff; text-decoration: none; font-weight: 700; letter-spacing: -.02em; }
  .brand-mark { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 10px; color: #07101c; background: linear-gradient(135deg, #77e8c3, #6fa4ff); font-size: 12px; }
  nav { display: flex; gap: 22px; } nav a, .text-action { color: #a9bad4; text-decoration: none; font-size: 13px; } nav a:hover, .text-action:hover { color: #fff; }
  .hero { padding: clamp(76px, 12vw, 142px) 0 54px; max-width: 780px; } .eyebrow { color: #77e8c3; font-size: 11px; font-weight: 800; letter-spacing: .18em; } h1 { margin: 16px 0 18px; max-width: 700px; color: #fff; font-size: clamp(42px, 7vw, 76px); line-height: .98; letter-spacing: -.07em; } .intro { max-width: 620px; color: #a9bad4; font-size: 18px; line-height: 1.6; } .intro strong { color: #fff; } .meta-row { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 28px; } .meta-row span { padding: 8px 12px; border: 1px solid #23344f; border-radius: 999px; color: #c4d1e5; background: #0d1a2d; font-size: 12px; }
  .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; } .feature-card { min-height: 158px; padding: 23px; border: 1px solid #23344f; border-radius: 18px; background: linear-gradient(145deg, #102039, #0c1728); box-shadow: 0 18px 45px #02071033; } .feature-label { display: block; margin-bottom: 18px; color: #8da4c2; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; } .feature-card strong { color: #fff; font-size: 24px; letter-spacing: -.04em; } .feature-card p { margin: 10px 0 0; color: #91a5bf; font-size: 13px; line-height: 1.5; }
  .quick-start { display: flex; justify-content: space-between; gap: 32px; margin-top: 14px; padding: 31px; border: 1px solid #23344f; border-radius: 18px; background: #0d1a2d; } h2 { margin: 10px 0 8px; color: #fff; font-size: 25px; letter-spacing: -.04em; } .quick-start p { max-width: 540px; margin: 0; color: #91a5bf; line-height: 1.55; } .actions { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 15px; min-width: 215px; } .primary-action { padding: 12px 15px; border-radius: 10px; color: #07101c; background: #77e8c3; text-decoration: none; font-size: 13px; font-weight: 800; } .primary-action span { margin-left: 12px; } @media (max-width: 650px) { .topbar nav { display: none; } .hero { padding-top: 88px; } .quick-start { flex-direction: column; } .actions { min-width: 0; } }
</style>
`,
    true
  );
}
