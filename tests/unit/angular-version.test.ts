import { describe, expect, it } from 'vitest';
import {
  discoverSupportedReleases,
  parseReleases,
  resolveAngularVersion
} from '../../src/core/angular-version.js';
describe('Angular version resolution', () => {
  it('sorts stable releases and excludes prereleases', () =>
    expect(
      parseReleases({ versions: ['20.0.0-next.1', '19.2.0', '18.0.0'] })[0]
        .version
    ).toBe('19.2.0'));
  it('resolves latest through an injectable registry client', async () =>
    expect(
      (
        await resolveAngularVersion('latest', false, {
          view: async () => ({ versions: ['17.0.0', '18.1.0'] })
        })
      ).version
    ).toBe('18.1.0'));
  it('resolves an explicit major and discovers recent majors', async () => {
    const registry = {
      view: async () => ({
        versions: ['20.2.0', '21.1.0', '22.0.1', '19.3.0']
      })
    };
    expect((await resolveAngularVersion('21', false, registry)).version).toBe(
      '21.1.0'
    );
    expect(discoverSupportedReleases(await registry.view())).toHaveLength(3);
  });
});
