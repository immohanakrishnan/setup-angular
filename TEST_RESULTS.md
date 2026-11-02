# Test results

Verified locally on 2026-11-02 for `setup-angular@1.0.0`:

- `npm install` — passed.
- `npm run build` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed: 6 files, 10 tests.
- `npm run lint` — passed.
- `npm run format:check` — passed.
- `npm audit --omit=dev` — passed: 0 production vulnerabilities.
- Credential scan — passed: no private-key, AWS-key, GitHub-token, or Slack-token patterns found in release sources.
- `node dist/cli/index.js --help` — passed with `setup-angular` branding.
- `node dist/cli/index.js --version` — passed: `1.0.0`.
- `npm run pack:check` — passed; tarball is `setup-angular@1.0.0` and contains compiled runtime, `bin/setup-angular.js`, docs, and metadata only.
- CLI dry-run e2e — passed through the compiled binary.
- Generator integration suite — passed: feature composition and collision-safe output.
- Angular 22.2.5 Enterprise + SCSS + Signals — generated, installed, built, and Angular tests passed (1 file, 2 tests).
- Angular 22.2.5 Enterprise + Tailwind + JWT — generated, dependencies installed, and production build passed.
- Angular 22.2.5 Enterprise + Material + NgRx — generated, Material/CDK and NgRx installed, and production build passed after updating to the current Material theme API.
- Angular 22.2.5 Standard + CSS + no auth/state — generated, installed, and production build passed.
- Angular 22.2.5 Enterprise + CRUD + Docker + GitHub Actions — generated and production build passed with an explicit output path; the default output path encountered a Windows `EPERM` directory-cleanup issue in this environment.
- Packed tarball — installed into a clean consumer directory; `npx setup-angular --help` and `npx setup-angular --version` passed.
- Packed tarball project generation — passed: installed `setup-angular` generated a real Angular 22.2.5 workspace with `--yes --no-install --no-git` using an isolated npm cache.
- Final packed-workspace production build — bundle compilation completed, but Angular 22's Windows builder failed while creating the nested browser output directory with `EPERM` in the clean temporary directory. The same Angular 22 configurations built successfully in the workspace; this clean-temp filesystem limitation is not marked as passed.
- Standard architecture — verified as a distinct components/services/models/pages structure; Enterprise and Minimal remain separately selectable.
- Explicit Angular major resolution — unit tested for Angular 21 and dynamic recent-major discovery.
- Angular 20.3.42 matrix — Minimal/CSS, Standard/SCSS/Signals/JWT/CRUD, Enterprise/Material/NgRx/JWT/CRUD, and Standard/Tailwind/JWT/Signals/CRUD all generated and installed. Production builds passed; Tailwind passed with `--output-path dist2` because the Windows Temp filesystem raised `EPERM` for Angular's default nested output directory.
- Angular 21.2.29 matrix — Minimal/CSS, Standard/SCSS/Signals/JWT/CRUD, Enterprise/Material/NgRx/JWT/CRUD, and Standard/Tailwind/JWT/Signals/CRUD all generated and installed. Production builds passed; Tailwind passed with `--output-path dist2` for the same Windows Temp filesystem limitation.
- Angular 20/21 dependency compatibility fix — NgRx, Material, and CDK are now installed using the resolved Angular major (`@ngrx/*@^<major>.0.0`, `@angular/material@^<major>.0.0`, `@angular/cdk@^<major>.0.0`). Angular 20 initially rejected latest NgRx 22; the corrected rerun passed.
- Angular 20 tests — test bundles compiled; Karma could not launch Chrome in this environment.
- Angular 21 tests — test bundle compiled; Vitest hit an environment `EPERM` while renaming its temporary cache file.
- Docker — configuration was statically inspected, but image build was not run because Docker is not installed in this environment.

Full `npm audit` reports development-only advisories in the current Vitest/ESLint toolchain; production dependencies report zero vulnerabilities. No package was published and no remote was pushed.
