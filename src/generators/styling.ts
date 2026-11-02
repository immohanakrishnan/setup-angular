import { TemplateEngine } from '../core/template-engine.js';
import type { Style } from '../types/index.js';
export async function generateStyling(
  root: string,
  style: Style,
  engine: TemplateEngine
): Promise<void> {
  if (style === 'tailwind') {
    await engine.write(
      root,
      'tailwind.config.js',
      `/** @type {import('tailwindcss').Config} */\nmodule.exports = { content: ['./src/**/*.{html,ts}'], theme: { extend: {} }, plugins: [] };\n`
    );
    await engine.write(
      root,
      'src/styles/tailwind.css',
      '@import "tailwindcss";\n'
    );
    await engine.write(
      root,
      '.postcssrc.json',
      '{\n  "plugins": { "@tailwindcss/postcss": {} }\n}\n'
    );
    await engine.append(
      root,
      'src/styles.scss',
      '@import "./styles/tailwind.css";'
    );
  }
  if (style === 'material') {
    await engine.write(
      root,
      'src/styles/material-theme.scss',
      `@use '@angular/material' as mat;\n@include mat.core();\n$theme: mat.define-theme((color: (theme-type: light, primary: mat.$azure-palette, tertiary: mat.$blue-palette)));\n@include mat.all-component-themes($theme);\n`
    );
    await engine.append(
      root,
      'src/styles.scss',
      '@use "./styles/material-theme";'
    );
  }
}
