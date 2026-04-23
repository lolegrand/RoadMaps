---
id: guards
parent: routing
label: Guards
explored: false
order: 1
---

# Guards

Les guards contrôlent l'accès aux routes. Angular 14+ recommande les **functional guards** avec `inject()`, plus simples que les classes.

## Types de guards

| Guard | Quand s'exécute | Cas d'usage |
|-------|----------------|-------------|
| `canActivate` | Avant d'activer une route | Authentification, rôles |
| `canActivateChild` | Avant les routes enfants | Autorisation de section |
| `canDeactivate` | Avant de quitter une route | Formulaires non sauvegardés |
| `canMatch` | Avant de matcher une route | A/B testing, feature flags |
| `resolve` | Avant d'activer, charge des données | Préchargement de données |

## canActivate — guard d'authentification

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Sauvegarder l'URL cible pour rediriger après login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

// Role guard — paramétrable
export const hasRoleGuard = (role: string): CanActivateFn => () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  return auth.hasRole(role) || router.createUrlTree(['/forbidden']);
};
```

```typescript
// Dans les routes
{
  path: 'admin',
  canActivate: [authGuard, hasRoleGuard('ADMIN')],
  component: AdminComponent,
}
```

## canDeactivate — confirmation avant de quitter

```typescript
export interface CanDeactivateComponent {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivateComponent> =
  (component) => {
    if (!component.hasUnsavedChanges()) return true;

    return inject(DialogService)
      .confirm('Quitter sans sauvegarder ?')
      .pipe(map(confirmed => confirmed));
  };
```

```typescript
@Component({ ... })
export class EditFormComponent implements CanDeactivateComponent {
  private form = inject(FormBuilder).group({ ... });

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
}
```

## canMatch — lazy loading conditionnel

```typescript
// Charge un bundle différent selon le rôle
{
  path: 'dashboard',
  canMatch: [() => inject(AuthService).hasRole('ADMIN')],
  loadComponent: () => import('./admin/dashboard.component'),
},
{
  path: 'dashboard',
  loadComponent: () => import('./user/dashboard.component'),
},
```

## Liens

- [angular.dev — Route guards](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
- [angular.dev — CanActivateFn](https://angular.dev/api/router/CanActivateFn)
- [angular.dev — CanDeactivateFn](https://angular.dev/api/router/CanDeactivateFn)
