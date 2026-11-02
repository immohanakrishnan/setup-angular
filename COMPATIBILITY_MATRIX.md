# Compatibility matrix

| Angular major   | Resolution                         | Generated/build verified here                                                                                                                                                                                      |
| --------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Angular 22.2.5  | Generated and resolved dynamically | Enterprise/SCSS/Signals, Tailwind/JWT, Material/NgRx, Standard/CSS, and CRUD/Docker/CI build checks passed; Docker image unavailable                                                                               |
| Angular 21.2.29 | Resolved from `--angular 21`       | Minimal/CSS, Standard/SCSS/Signals/JWT/CRUD, Enterprise/Material/NgRx/JWT/CRUD, and Standard/Tailwind/JWT/Signals/CRUD generated and production-built; Tailwind used explicit output path due Windows Temp `EPERM` |
| Angular 20.3.42 | Resolved from `--angular 20`       | Minimal/CSS, Standard/SCSS/Signals/JWT/CRUD, Enterprise/Material/NgRx/JWT/CRUD, and Standard/Tailwind/JWT/Signals/CRUD generated and production-built; Tailwind used explicit output path due Windows Temp `EPERM` |

## Test execution notes

Angular 20's generated Karma test bundles compiled, but Chrome was unavailable to launch. Angular 21's generated Vitest bundle compiled, but the sandbox Temp filesystem returned `EPERM` during a cache rename. These are environment runner limitations; production compilation passed for every listed project.

No Angular major is advertised as fully supported until generation, installation, build, and tests pass for that major.
