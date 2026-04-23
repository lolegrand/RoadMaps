---
id: interceptors
parent: http
label: Interceptors
explored: false
order: 2
---

# Interceptors

Les interceptors sont des middlewares HTTP qui s'exécutent sur chaque requête et réponse. Angular 15+ recommande les **functional interceptors** avec `inject()`.

## Interceptor d'authentification

```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(AuthService);
  const token = auth.accessToken();

  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
```

## Interceptor de gestion d'erreurs globale

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router   = inject(Router);
  const toastSvc = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 401:
          router.navigate(['/login']);
          break;
        case 403:
          router.navigate(['/forbidden']);
          break;
        case 0:
          toastSvc.error('Pas de connexion réseau');
          break;
        default:
          if (err.status >= 500) {
            toastSvc.error('Erreur serveur, veuillez réessayer');
          }
      }
      return throwError(() => err);
    })
  );
};
```

## Interceptor de retry avec back-off exponentiel

```typescript
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // Ne retry pas les mutations
  if (req.method !== 'GET') return next(req);

  return next(req).pipe(
    retry({
      count: 3,
      delay: (error, attempt) => {
        if (error.status === 0 || error.status >= 500) {
          // Back-off : 1s, 2s, 4s
          return timer(Math.pow(2, attempt - 1) * 1000);
        }
        return throwError(() => error);
      },
    })
  );
};
```

## Interceptor de logging / timing

```typescript
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const start = performance.now();

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          const duration = Math.round(performance.now() - start);
          console.debug(`[HTTP] ${req.method} ${req.url} → ${event.status} (${duration}ms)`);
        }
      },
      error: err => console.error(`[HTTP] ${req.method} ${req.url} → ${err.status}`),
    })
  );
};
```

## Ordre des interceptors

```typescript
// Les interceptors s'appliquent dans l'ordre de déclaration
provideHttpClient(
  withInterceptors([
    loggingInterceptor,   // 1er sur requête, dernier sur réponse
    retryInterceptor,
    authInterceptor,
    errorInterceptor,     // dernier sur requête, 1er sur réponse
  ])
)
```

## Liens

- [angular.dev — HTTP Interceptors](https://angular.dev/guide/http/interceptors)
- [angular.dev — HttpInterceptorFn](https://angular.dev/api/common/http/HttpInterceptorFn)
