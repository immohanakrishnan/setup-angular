import { TemplateEngine } from '../core/template-engine.js';
export async function generateDocker(
  root: string,
  engine: TemplateEngine
): Promise<void> {
  await engine.write(
    root,
    'Dockerfile',
    `FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nRUN mkdir -p /site && if [ -d dist/browser ]; then cp -r dist/browser/. /site/; elif ls dist/*/browser >/dev/null 2>&1; then cp -r dist/*/browser/. /site/; else cp -r dist/. /site/; fi\nFROM nginxinc/nginx-unprivileged:alpine\nCOPY --from=build /site/ /usr/share/nginx/html/\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nEXPOSE 8080\n`
  );
  await engine.write(root, '.dockerignore', `node_modules\ndist\n.git\n`);
  await engine.write(
    root,
    'nginx.conf',
    `server { listen 8080; root /usr/share/nginx/html; location / { try_files $uri $uri/ /index.html; } }\n`
  );
  await engine.write(
    root,
    'compose.yaml',
    `services:\n  app:\n    build: .\n    ports:\n      - "8080:8080"\n`
  );
}
export async function generateCi(
  root: string,
  engine: TemplateEngine,
  manager: string
): Promise<void> {
  const install =
    manager === 'npm' ? 'npm ci' : `${manager} install --frozen-lockfile`;
  await engine.write(
    root,
    '.github/workflows/ci.yml',
    `name: CI\non:\n  push:\n  pull_request:\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: ${manager}\n      - run: ${install}\n      - run: npm run typecheck\n      - run: npm test -- --run\n      - run: npm run build\n`
  );
}
