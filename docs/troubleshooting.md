# Troubleshooting

If release resolution fails, check npm connectivity or pass a valid explicit Angular version. If an add command fails, run it from the workspace containing `angular.json`. Existing files are skipped rather than overwritten.

## npm cache and tarball failures

If npm reports `ENOENT` under `_cacache`, corrupted tarball data, `EINTEGRITY`, or a cache checksum failure, `setup-angular` retries the failed npm or npx operation once with a fresh temporary cache. The user's global npm cache is never deleted or modified, and the temporary cache is removed after the retry.

Permission errors, invalid package names, unsupported Node versions, peer-dependency conflicts, and other non-cache failures are not retried. If the isolated retry also fails, its original npm exit code and error are returned.

## Angular CLI questions

`setup-angular` owns the project-level choices it generates. Angular CLI creation choices that affect the base workspace are passed explicitly, including routing, standalone components, SSR, and zoneless mode. Use `--ssr` and `--zoneless` when those modes are required; this keeps generation suitable for CMD, PowerShell, and `npx` without relying on nested Angular CLI prompts.
