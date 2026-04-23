---
id: http
parent: root
label: HTTP & Async
explored: false
order: 5
---

# HTTP & Async

Angular fournit `HttpClient` — un wrapper typé autour de `fetch` basé sur RxJS. Combiné à l'`async` pipe et aux Signals, il couvre tous les besoins de communication HTTP.

## Configuration

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
      withFetch(),         // utilise fetch() au lieu de XMLHttpRequest (Angular 18+)
    ),
  ],
};
```

## Liens

- [angular.dev — HTTP Client](https://angular.dev/guide/http)
- [angular.dev — provideHttpClient](https://angular.dev/api/common/http/provideHttpClient)
