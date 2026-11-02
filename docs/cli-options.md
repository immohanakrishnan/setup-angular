# CLI options

## Create a project

```text
setup-angular [options] [project-name]
```

Interactive mode asks for omitted wizard choices. With `--yes`, omitted values use automatic defaults. Explicit flags take precedence.

| Option                        | Values or behavior                                                      | Automatic default |
| ----------------------------- | ----------------------------------------------------------------------- | ----------------- |
| `--angular <version>`         | `latest`, major, or exact version                                       | `latest`          |
| `--architecture <type>`       | `standard`, `enterprise`, `minimal`                                     | `standard`        |
| `--style <style>`             | `scss`, `css`, `tailwind`, `material`                                   | `scss`            |
| `--auth <type>`               | `none`, `jwt`                                                           | `none`            |
| `--state <type>`              | `signals`, `ngrx`, `none`                                               | `signals`         |
| `--crud`                      | Include products CRUD scaffold                                          | Off               |
| `--docker`                    | Include Docker files                                                    | Off               |
| `--ci <provider>`             | `github`, `none`                                                        | `none`            |
| `--no-testing`                | Accepted; currently does not remove Angular CLI test scaffolding        | Tests remain      |
| `--package-manager <manager>` | `npm`, `pnpm`, `yarn`                                                   | `npm`             |
| `--no-install`                | Skip final install; feature dependencies can still trigger installation | Install enabled   |
| `--no-git`                    | Skip Git initialization                                                 | Git enabled       |
| `--yes`                       | Skip wizard and apply defaults                                          | Off               |
| `--dry-run`                   | Skip generator commands and file writes                                 | Off               |
| `--prerelease`                | Include prereleases during discovery                                    | Off               |
| `--ssr`                       | Enable SSR; local implementation pending release                        | Off               |
| `--zoneless`                  | Enable zoneless mode; local implementation pending release              | Off               |
| `--help`, `-h`                | Show help                                                               | —                 |
| `--version`, `-V`             | Show CLI version                                                        | —                 |

There are 18 configuration flags plus two informational flags. Package manager, installation, Git, SSR, and zoneless are flag-controlled rather than wizard questions.

## Existing workspaces

```bash
npx setup-angular add crud products
npx setup-angular add crud products --dry-run
```

Run inside the folder containing `angular.json`.

The parser also accepts `add feature`, `add component`, and `add service`. Currently these generate generic injectable class stubs, not full component or feature schematics. Use Angular CLI generators when you need complete Angular components.

## Local SSR and zoneless example

After building the checkout:

```bash
node dist/cli/index.js my-app --angular 20 --ssr --zoneless --yes
```

These settings are passed explicitly to Angular CLI. The published package may not yet include the local additions.
