import semver from 'semver';
import { execa } from 'execa';
import type { AngularRelease } from '../types/index.js';

export interface RegistryClient {
  view(spec: string): Promise<unknown>;
}
const npmRegistry: RegistryClient = {
  async view(spec) {
    return (await execa('npm', ['view', spec, '--json', '--silent'])).stdout;
  }
};

export function parseReleases(
  value: unknown,
  includePrerelease = false
): AngularRelease[] {
  const raw = typeof value === 'string' ? JSON.parse(value) : value;
  const versions: string[] = Array.isArray(raw) ? raw : (raw?.versions ?? []);
  return versions
    .filter(
      (v) => semver.valid(v) && (includePrerelease || !semver.prerelease(v))
    )
    .sort(semver.rcompare)
    .map((version) => ({
      version,
      major: semver.major(version),
      tag: `^${semver.major(version)}.0.0`
    }));
}

export function discoverSupportedReleases(
  value: unknown,
  includePrerelease = false,
  majorLimit = 3
): AngularRelease[] {
  const releases = parseReleases(value, includePrerelease);
  const majors = [...new Set(releases.map((release) => release.major))].sort(
    (a, b) => b - a
  );
  return majors
    .slice(0, majorLimit)
    .map((major) => releases.find((release) => release.major === major)!)
    .filter(Boolean);
}

export async function resolveAngularVersion(
  requested: string,
  includePrerelease = false,
  client = npmRegistry
): Promise<AngularRelease> {
  if (requested !== 'latest' && semver.valid(requested))
    return {
      version: requested,
      major: semver.major(requested),
      tag: `^${semver.major(requested)}.0.0`
    };
  const releases = parseReleases(
    await client.view('@angular/cli'),
    includePrerelease
  );
  if (/^\d+$/.test(requested)) {
    const match = releases.find(
      (release) => release.major === Number(requested)
    );
    if (!match)
      throw new Error(
        `Angular ${requested} is not available as a stable CLI release from npm.`
      );
    return match;
  }
  const latest = releases[0];
  if (!latest)
    throw new Error(
      'Could not resolve a stable Angular CLI release from npm. Check network access or choose an explicit version.'
    );
  return latest;
}
