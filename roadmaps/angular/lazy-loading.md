---
id: lazy-loading
parent: routing
label: Lazy Loading
explored: false
order: 2
---

# Lazy Loading

Le lazy loading charge les composants et leurs dépendances à la demande, réduisant la taille du bundle initial et accélérant le premier chargement.

## loadComponent — composant standalone

```typescript
export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./products/product-list.component')
        .then(m => m.ProductListComponent),
  },
  // Raccourci avec default export
  {
    path: 'about',
    loadComponent: () => import('./about/about.component'),
  },
];
```

## loadChildren — groupe de routes (feature module / lazy route)

```typescript
// app.routes.ts
{
  path: 'admin',
  canMatch: [authGuard, hasRoleGuard('ADMIN')],
  loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
}

// admin/admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: UserManagementComponent },
  { path: 'settings', component: AdminSettingsComponent },
];
```

## Preloading — précharger en arrière-plan

```typescript
// app.config.ts — précharge tous les lazy modules après le bootstrap
provideRouter(
  routes,
  withPreloading(PreloadAllModules),
)

// Stratégie personnalisée — précharge seulement les routes marquées
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] ? load() : EMPTY;
  }
}

// Dans la route :
{ path: 'products', data: { preload: true }, loadChildren: () => import(...) }
```

## @defer dans les templates — lazy loading de composants

```html
<!-- Charge le composant lourd seulement quand il entre dans le viewport -->
@defer (on viewport; prefetch on idle) {
  <app-analytics-chart [data]="chartData" />
} @placeholder {
  <div class="chart-placeholder" style="height: 300px; background: #f5f5f5;" />
} @loading (after 100ms; minimum 500ms) {
  <app-spinner />
} @error {
  <p>Impossible de charger le graphique.</p>
}
```

## Triggers @defer disponibles

| Trigger | Déclenche le chargement quand |
|---------|------------------------------|
| `on idle` | Le navigateur est inactif |
| `on viewport` | L'élément est visible |
| `on interaction` | L'utilisateur clique ou focus |
| `on hover` | L'utilisateur survole |
| `on timer(2s)` | Après un délai |
| `when condition` | Une expression devient vraie |
| `prefetch on idle` | Précharge silencieusement |

## Liens

- [angular.dev — Lazy loading](https://angular.dev/guide/ngmodules/lazy-loading)
- [angular.dev — @defer](https://angular.dev/guide/defer)
- [angular.dev — Preloading](https://angular.dev/guide/routing/common-router-tasks#preloading-modules)
