import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { TemplateEngine } from '../../core/template-engine.js';
import { generateCrud } from '../../generators/crud.js';
import type { CommandResult } from '../../types/index.js';
export async function addGenerator(
  kind: string,
  name: string,
  cwd: string,
  dryRun = false
): Promise<CommandResult> {
  try {
    await access(join(cwd, 'angular.json'));
  } catch {
    throw new Error(
      'No angular.json found. Run this command inside an Angular workspace.'
    );
  }
  const engine = new TemplateEngine(dryRun);
  if (kind === 'crud') await generateCrud(cwd, name, engine);
  else {
    const dir = `src/app/shared/${kind}s`;
    await engine.write(
      cwd,
      `${dir}/${name}.${kind}.ts`,
      `import { Injectable } from '@angular/core';\n@Injectable({ providedIn: 'root' }) export class ${name[0].toUpperCase()}${name.slice(1)}${kind[0].toUpperCase()}${kind.slice(1)} {}\n`
    );
  }
  return engine.getResult();
}
