# Authentication

JWT mode generates typed login/session models, an injectable auth service, a functional guard, and an interceptor seam. It does not pretend to authenticate without a backend. Prefer backend-managed Secure, HttpOnly, SameSite sessions; bearer-token storage must be designed for the application's threat model.
