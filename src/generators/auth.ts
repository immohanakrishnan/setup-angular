import { TemplateEngine } from '../core/template-engine.js';
export async function generateAuth(
  root: string,
  engine: TemplateEngine
): Promise<void> {
  await engine.write(
    root,
    'src/app/core/auth/auth.models.ts',
    `export interface LoginRequest { email: string; password: string; }\nexport interface Session { userId: string; email: string; }\n`
  );
  await engine.write(
    root,
    'src/app/core/auth/auth.config.ts',
    `import { InjectionToken } from '@angular/core';\n\nexport const AUTH_API_URL = new InjectionToken<string>('AUTH_API_URL', { factory: () => '/api' });\n`
  );
  await engine.write(
    root,
    'src/app/core/auth/login.component.ts',
    `import { Component, inject } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { AuthService } from './auth.service';\n\n@Component({ standalone: true, imports: [FormsModule], selector: 'app-login', template: '<form (ngSubmit)="submit()"><label>Email <input name="email" [(ngModel)]="email" type="email" required></label><label>Password <input name="password" [(ngModel)]="password" type="password" required></label><button type="submit">Sign in</button></form>' })\nexport class LoginComponent { private readonly auth = inject(AuthService); email = ''; password = ''; async submit(): Promise<void> { await this.auth.login({ email: this.email, password: this.password }); } }\n`
  );
  await engine.write(
    root,
    'src/app/core/auth/auth.service.ts',
    `import { Injectable, signal } from '@angular/core';\nimport type { LoginRequest, Session } from './auth.models';\n\n@Injectable({ providedIn: 'root' })\nexport class AuthService {\n  readonly session = signal<Session | null>(null);\n  async login(credentials: LoginRequest): Promise<void> { void credentials; throw new Error('Connect AuthService to your backend session endpoint.'); }\n  logout(): void { this.session.set(null); }\n}\n`
  );
  await engine.write(
    root,
    'src/app/core/guards/auth.guard.ts',
    `import { inject } from '@angular/core';\nimport { CanActivateFn, Router } from '@angular/router';\nimport { AuthService } from '../auth/auth.service';\nexport const authGuard: CanActivateFn = () => inject(AuthService).session() ? true : inject(Router).createUrlTree(['/login']);\n`
  );
  await engine.write(
    root,
    'src/app/core/interceptors/auth.interceptor.ts',
    `import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';\nimport { catchError, throwError } from 'rxjs';\nexport const authInterceptor: HttpInterceptorFn = (req, next) => next(req).pipe(catchError((error: HttpErrorResponse) => { if (error.status === 401) { /* route to login or refresh session */ } return throwError(() => error); }));\n// Prefer Secure, HttpOnly, SameSite cookies. Add bearer-token handling only for a backend that requires it.\n`
  );
}
