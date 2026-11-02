import { TemplateEngine } from '../core/template-engine.js';
export async function generateCrud(
  root: string,
  entity: string,
  engine: TemplateEngine
): Promise<void> {
  const name = entity.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const className = name
    .split('-')
    .map((x) => x[0].toUpperCase() + x.slice(1))
    .join('');
  const dir = `src/app/features/${name}`;
  await engine.write(
    root,
    `${dir}/${name}.model.ts`,
    `export interface ${className} { id: string; name: string; createdAt: string; }\n`
  );
  await engine.write(
    root,
    `${dir}/${name}.api.ts`,
    `import { Injectable } from '@angular/core';\nimport type { ${className} } from './${name}.model';\n@Injectable({ providedIn: 'root' }) export class ${className}Api {\n  // Replace this clearly-labeled adapter with HttpClient calls to your REST API.\n  private readonly mock: ${className}[] = [];\n  list(): ${className}[] { return [...this.mock]; }\n  get(id: string): ${className} | undefined { return this.mock.find(item => item.id === id); }\n  create(value: Omit<${className}, 'id' | 'createdAt'>): ${className} { const item = { ...value, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as ${className}; this.mock.push(item); return item; }\n  update(id: string, value: Partial<${className}>): ${className} | undefined { const item = this.get(id); if (item) Object.assign(item, value); return item; }\n  delete(id: string): void { const i = this.mock.findIndex(item => item.id === id); if (i >= 0) this.mock.splice(i, 1); }\n}\n`
  );
  await engine.write(
    root,
    `${dir}/${name}-list.component.ts`,
    `import { Component, inject } from '@angular/core';\nimport { ${className}Api } from './${name}.api';\n@Component({ standalone: true, selector: 'app-${name}-list', template: '<h2>${className}s</h2>@if (!api.list().length) { <p>No records yet.</p> }' }) export class ${className}ListComponent { readonly api = inject(${className}Api); }\n`
  );
  await engine.write(
    root,
    `${dir}/${name}-form.component.ts`,
    `import { Component, inject } from '@angular/core';\nimport { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { ${className}Api } from './${name}.api';\n@Component({ standalone: true, imports: [ReactiveFormsModule], selector: 'app-${name}-form', template: '<form [formGroup]="form" (ngSubmit)="save()"><label>Name <input formControlName="name" required></label><button type="submit" [disabled]="form.invalid">Save</button></form>' })\nexport class ${className}FormComponent { private readonly fb = inject(FormBuilder); private readonly api = inject(${className}Api); readonly form = this.fb.nonNullable.group({ name: ['', Validators.required] }); save(): void { if (this.form.valid) this.api.create(this.form.getRawValue()); } }\n`
  );
  await engine.write(
    root,
    `${dir}/${name}.routes.ts`,
    `import { Routes } from '@angular/router';\nexport const ${name}Routes: Routes = [{ path: '', loadComponent: () => import('./${name}-list.component').then(m => m.${className}ListComponent) }, { path: 'new', loadComponent: () => import('./${name}-form.component').then(m => m.${className}FormComponent) }];\n`
  );
}
