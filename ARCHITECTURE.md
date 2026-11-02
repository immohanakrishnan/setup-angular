# Package architecture

The CLI layer parses user intent and prompts. Core services resolve Angular versions, validate compatibility, run processes, manage dependencies, and write collision-safe templates. Feature generators are independent modules. The project generator composes them after delegating base workspace creation to the official Angular CLI.
