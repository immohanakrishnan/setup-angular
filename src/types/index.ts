export type Architecture = 'enterprise' | 'standard' | 'minimal';
export type Style = 'scss' | 'css' | 'tailwind' | 'material';
export type Auth = 'jwt' | 'none';
export type State = 'signals' | 'ngrx' | 'none';
export type PackageManager = 'npm' | 'pnpm' | 'yarn';
export type CiProvider = 'github' | 'none';

export interface ProjectOptions {
  projectName: string;
  targetDirectory: string;
  angular: string;
  architecture: Architecture;
  style: Style;
  auth: Auth;
  state: State;
  crud: boolean;
  docker: boolean;
  ci: CiProvider;
  testing: boolean;
  packageManager: PackageManager;
  install: boolean;
  git: boolean;
  yes: boolean;
  dryRun: boolean;
  prerelease: boolean;
  ssr?: boolean;
  zoneless?: boolean;
}

export interface AngularRelease {
  version: string;
  major: number;
  tag: string;
}

export interface CommandResult {
  created: string[];
  modified: string[];
  skipped: string[];
}
