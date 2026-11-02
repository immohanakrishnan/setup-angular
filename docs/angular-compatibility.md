# Angular compatibility

The CLI asks npm for current Angular CLI metadata, supports explicit stable major selection such as `--angular 21`, and excludes prereleases unless `--prerelease` is supplied. It can discover the most recent stable majors dynamically. The compatibility guard covers known feature floors; each major must still be generated and verified in the target environment before release support is claimed.
