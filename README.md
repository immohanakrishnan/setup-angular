# setup-angular

`setup-angular` is a TypeScript CLI that delegates the base workspace to the official Angular CLI, then applies explicit architecture and feature generators. Standard architecture is the default; Enterprise and Minimal are opt-in.

## Use

```bash
npx setup-angular my-app
npx setup-angular my-app --angular latest --architecture enterprise --style scss --auth jwt --state signals --crud --docker --ci github --yes
```

For existing workspaces:

```bash
npx setup-angular add component user-card
npx setup-angular add service users
npx setup-angular add crud products
```

The generator refuses incompatible selections, does not overwrite existing generated files, and reports skipped collisions. JWT output is an integration scaffold: connect it to a backend and prefer Secure, HttpOnly, SameSite cookies. The CRUD adapter is deliberately labeled mock data and must be replaced for production.

## Development

```bash
npm install
npm run build
npm test
npm run typecheck
npm pack
```

The CLI resolves the stable Angular CLI release from npm metadata at runtime. It does not claim a compatibility matrix entry until the target has been generated and verified in the current environment.

See `docs/` and `FINAL_HANDOVER.md` for details.
