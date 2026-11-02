# setup-angular

### Your Angular workspace. Your architecture. Your choices.

Create an application with the official Angular CLI, then add architecture folders, styling, state, and feature scaffolds.

**3 architectures · 4 styling choices · 3 state options · 8 wizard questions**

```bash
npx setup-angular my-app
```

[Quick start](#quick-start) · [Wizard](#interactive-wizard) · [Structure](#project-structure) · [Examples](#examples) · [Reference](#reference)

## Quick start

Run from the parent folder where you want to create your application:

```bash
npx setup-angular my-app
cd my-app
npm start
```

Use a Node.js version compatible with your chosen Angular release. Registry access is needed to download packages. These single-line commands work in CMD, PowerShell, and Unix shells.

Prefer automatic defaults?

```bash
npx setup-angular my-app --yes
```

Defaults: latest stable Angular CLI, Standard architecture, SCSS, Signals, npm, dependency installation, and Git initialization. Authentication, CRUD, Docker, and CI are off.

## Interactive wizard

With a project name supplied, there are **8 questions**. Omit the name for a ninth project-name question. Explicit flags skip the corresponding questions; `--yes` skips all questions.

| Step | Question                  | Choices                                    |
| ---- | ------------------------- | ------------------------------------------ |
| 1    | Angular version           | Latest Stable and discovered recent majors |
| 2    | Architecture              | Standard, Enterprise, Minimal              |
| 3    | Styling                   | SCSS, CSS, Tailwind CSS, Angular Material  |
| 4    | Authentication            | JWT scaffold, None                         |
| 5    | State management          | Angular Signals, NgRx, None                |
| 6    | Include sample CRUD?      | Yes / No                                   |
| 7    | Configure Docker?         | Yes / No                                   |
| 8    | Configure GitHub Actions? | Yes / No                                   |

Illustrative completed selections (available versions depend on npm metadata):

```text
✔ Angular version: Angular 20
✔ Architecture: Enterprise
✔ Styling: Tailwind CSS
✔ Authentication: JWT scaffold
✔ State management: Angular Signals
✔ Include sample CRUD? Yes
✔ Configure Docker? Yes
✔ Configure GitHub Actions? Yes
```

Use arrow keys to choose and Enter to confirm. Interactive authentication initially highlights JWT scaffold; automatic mode defaults to None. Yes/No questions default to No.

## What gets generated

| Feature        | Output                                                       |
| -------------- | ------------------------------------------------------------ |
| Tailwind       | Stylesheet entry point, PostCSS configuration, dependencies  |
| Material       | Theme scaffold and Angular-major-matched Material/CDK        |
| Signals        | Injectable state service using signals and computed state    |
| NgRx           | Actions, reducer, selectors, effects scaffolds, dependencies |
| JWT            | Login component, session service, models, guard, interceptor |
| CRUD           | Products example with components, models, and a mock adapter |
| Docker         | Dockerfile, Compose, and nginx configuration                 |
| GitHub Actions | Starter verification workflow                                |

## Project structure

These trees show architecture folders; Angular CLI supplies base files. Optional features add their own files. Some folders begin with a `.gitkeep` placeholder.

### Minimal — Angular CLI baseline

```text
my-app/
├── angular.json
├── package.json
├── public/
└── src/
    ├── app/
    ├── main.ts
    └── styles.scss
```

Minimal adds no architecture folders. Selected auth, state, styling, and CRUD features can still be generated.

### Standard — grouped by responsibility

```text
src/app/
├── components/
├── services/
├── models/
└── pages/
    ├── dashboard/
    │   └── dashboard.page.ts
    └── users/
```

### Enterprise — separated application concerns

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── services/
│   │   ├── config/
│   │   ├── errors/
│   │   └── tokens/
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   ├── models/
│   │   ├── utils/
│   │   └── validators/
│   ├── features/dashboard/
│   └── layouts/
│       ├── main-layout/
│       └── auth-layout/
├── environments/
├── styles/
└── assets/
```

Signals and NgRx add `src/app/state/`; JWT adds files under `core/`. Existing template files are skipped, so review routes and provider registration after generation.

## Examples

**Minimal with CSS**

```bash
npx setup-angular my-app --architecture minimal --style css --state none --yes
```

**Enterprise with Tailwind, JWT, Signals, CRUD, Docker, and CI**

```bash
npx setup-angular my-app --angular 20 --architecture enterprise --style tailwind --auth jwt --state signals --crud --docker --ci github --yes
```

**Material with NgRx**

```bash
npx setup-angular my-app --style material --state ngrx --yes
```

**Preview generation without writes**

```bash
npx setup-angular my-app --angular 20.3.42 --architecture enterprise --crud --dry-run --yes
```

Dry-run skips generation commands and file writes. Version discovery may still access the network unless an exact version is supplied.

**Add CRUD inside an existing workspace**

```bash
npx setup-angular add crud products
```

Run this from the folder containing `angular.json`.

## Reference

The creation command declares **18 configuration flags**, plus `--help` and `--version`.

- [All CLI options and defaults](docs/cli-options.md)
- [Architecture guide](docs/architecture.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Contributing](docs/contributing.md)

**Release status:** this checkout includes changes beyond published 1.0.1, including broader cache recovery and explicit `--ssr` / `--zoneless` flags. npm commands use the published package; local changes require a future release to become available there.

## Before shipping

Generated features are development scaffolds:

- Connect JWT authentication to your backend; the login service deliberately throws until implemented.
- Replace the CRUD mock adapter with your API and register its routes.
- Register NgRx providers, auth guards, and interceptors where required.
- Review generated CI commands against your application's scripts and test runner.
- The Docker template serves browser assets with nginx; SSR deployment requires a server container.

Representative Angular 20, 21, and 22 generation/build results are recorded in the repository verification reports. Docker image execution remains unverified in the current environment.

## Development

```bash
npm ci
npm run build
npm run typecheck
npm run lint
npm run format:check
npm test
npm run pack:check
```

## License

[MIT](LICENSE)
