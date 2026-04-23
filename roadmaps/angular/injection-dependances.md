---
id: injection-dependances
parent: architecture
label: Injection de dépendances
explored: false
order: 1
---

# Injection de dépendances

Le système DI d'Angular est hiérarchique : chaque composant, directive ou module peut avoir son propre injecteur, héritant de l'injecteur parent. Cela permet de scoper des services à une partie de l'arbre de composants.

## Hiérarchie des injecteurs

```
Root Injector (ApplicationRef)
├── Environment Injector (route / lazy module)
│   └── Component Injector
│       └── Component Injector enfant
```

## Fournir un service

```typescript
// 1. Root — singleton partagé dans toute l'app (le plus courant)
@Injectable({ providedIn: 'root' })
export class AuthService { ... }

// 2. Scoped à un composant — nouvelle instance par composant
@Component({
  selector: 'app-form',
  providers: [FormStateService],   // instance fraîche pour ce composant et ses enfants
})
export class FormComponent { ... }

// 3. Via appConfig (Standalone)
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: HttpClient, useClass: MockHttpClient },   // override pour les tests
  ],
};
```

## Injection de valeurs et tokens

```typescript
// Définir un token typé
export const THEME_CONFIG = new InjectionToken<ThemeConfig>('THEME_CONFIG');
export const LOCALE = new InjectionToken<string>('LOCALE');

// Fournir
providers: [
  { provide: THEME_CONFIG, useValue: { primary: '#dd0031', dark: false } },
  { provide: LOCALE, useFactory: () => navigator.language },
]

// Injecter
@Injectable()
export class ThemeService {
  private config = inject(THEME_CONFIG);  // inject() — API moderne
}
```

## `inject()` — alternative moderne aux constructeurs

```typescript
// Ancienne façon — constructeur (toujours valide)
@Injectable({ providedIn: 'root' })
export class OldService {
  constructor(private http: HttpClient, private router: Router) {}
}

// Nouvelle façon — inject() — utilisable aussi en dehors des classes
@Injectable({ providedIn: 'root' })
export class NewService {
  private http    = inject(HttpClient);
  private router  = inject(Router);
  private apiUrl  = inject(API_URL);
}

// Injection dans des fonctions (guards, interceptors, resolvers)
export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() || router.createUrlTree(['/login']);
};
```

## useFactory — injection dynamique

```typescript
providers: [
  {
    provide: LoggerService,
    useFactory: (config: AppConfig) =>
      config.production ? new NoopLogger() : new ConsoleLogger(),
    deps: [AppConfig],
  },
]
```

## Liens

- [angular.dev — Dependency injection](https://angular.dev/guide/di)
- [angular.dev — inject() function](https://angular.dev/api/core/inject)
- [angular.dev — InjectionToken](https://angular.dev/api/core/InjectionToken)
