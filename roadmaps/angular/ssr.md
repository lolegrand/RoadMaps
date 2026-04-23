---
id: ssr
parent: performance
label: SSR & Hydration
explored: false
order: 2
---

# SSR & Hydration

Le Server-Side Rendering (SSR) rend le HTML côté serveur pour améliorer le FCP (First Contentful Paint) et le SEO. Angular 17 introduit l'**hydration non-destructive** : le client reprend le HTML existant sans le recréer.

## Activation

```bash
ng add @angular/ssr
# Ou à la création
ng new my-app --ssr
```

## Architecture SSR Angular

```
Navigateur                    Serveur Node.js
    │                               │
    │─── GET /products ────────────▶│
    │                          renderApplication()
    │                          [composants Angular]
    │                          [requêtes API préchargées]
    │◀─── HTML complet ─────────────│
    │
    │ Affichage immédiat (FCP rapide)
    │
    │ Téléchargement bundle JS
    │ Hydration (reprise du DOM existant)
    │ App interactive ✅
```

## Configuration app.config.server.ts

```typescript
// app.config.server.ts
export const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideRouter(routes),
    provideHttpClient(withFetch()),   // fetch() disponible côté serveur Node.js
  ],
};
```

## Préchargement des données (TransferState)

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http          = inject(HttpClient);
  private transferState = inject(TransferState);

  getAll(): Observable<Product[]> {
    const key = makeStateKey<Product[]>('products');

    // Côté serveur — charge et sérialise dans le HTML
    if (this.transferState.hasKey(key)) {
      const data = this.transferState.get(key, []);
      this.transferState.remove(key);
      return of(data);   // côté client — réutilise les données, pas de double requête
    }

    return this.http.get<Product[]>('/api/products').pipe(
      tap(data => this.transferState.set(key, data))
    );
  }
}
```

## Static Site Generation (SSG / Prerendering)

```typescript
// angular.json — prérendre certaines routes statiquement
"prerender": {
  "routesFile": "routes.txt"
}
```

```
# routes.txt
/
/about
/products
/products/1
/products/2
```

## Bonnes pratiques SSR

```typescript
// Détecter l'environnement d'exécution
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private platformId = inject(PLATFORM_ID);

  get(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;   // pas de localStorage côté serveur
    return localStorage.getItem(key);
  }
}
```

## Liens

- [angular.dev — Server-side rendering](https://angular.dev/guide/ssr)
- [angular.dev — Hydration](https://angular.dev/guide/hydration)
- [angular.dev — Prerendering](https://angular.dev/guide/prerendering)
