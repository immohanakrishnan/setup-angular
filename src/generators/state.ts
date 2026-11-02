import { TemplateEngine } from '../core/template-engine.js';
import type { State } from '../types/index.js';
export async function generateState(
  root: string,
  state: State,
  engine: TemplateEngine
): Promise<void> {
  if (state === 'signals')
    await engine.write(
      root,
      'src/app/state/app.state.ts',
      `import { Injectable, computed, signal } from '@angular/core';\n@Injectable({ providedIn: 'root' })\nexport class AppState { readonly loading = signal(false); readonly ready = computed(() => !this.loading()); }\n`
    );
  if (state === 'ngrx') {
    await engine.write(
      root,
      'src/app/state/app.actions.ts',
      `import { createAction } from '@ngrx/store';\nexport const appStarted = createAction('[App] Started');\n`
    );
    await engine.write(
      root,
      'src/app/state/app.reducer.ts',
      `import { createReducer, on } from '@ngrx/store';\nimport { appStarted } from './app.actions';\nexport interface AppState { started: boolean; }\nexport const initialState: AppState = { started: false };\nexport const appReducer = createReducer(initialState, on(appStarted, state => ({ ...state, started: true })));\n`
    );
    await engine.write(
      root,
      'src/app/state/app.selectors.ts',
      `import { createFeatureSelector, createSelector } from '@ngrx/store';\nimport type { AppState } from './app.reducer';\nexport const selectAppState = createFeatureSelector<AppState>('app');\nexport const selectStarted = createSelector(selectAppState, state => state.started);\n`
    );
    await engine.write(
      root,
      'src/app/state/app.effects.ts',
      `import { Injectable } from '@angular/core';\nimport { Actions } from '@ngrx/effects';\n@Injectable() export class AppEffects { constructor(readonly actions$: Actions) {} }\n`
    );
  }
}
