---
id: architecture
parent: root
label: Architecture
explored: true
order: 2
---

# Architecture

Angular propose deux modèles d'organisation : les **NgModules** (historique, encore très présents) et les **Standalone Components** (défaut depuis Angular 17, recommandé pour les nouveaux projets).

## NgModule vs Standalone

| | NgModule | Standalone |
|---|---|---|
| Depuis | Angular 2 (2016) | Angular 14 stable (2022) |
| Organisation | Modules qui déclarent/exportent des composants | Composants auto-suffisants |
| Imports | Dans le module | Dans chaque composant |
| Boilerplate | Élevé (`declarations`, `exports`, `imports`) | Minimal |
| Tree-shaking | Moins fin | Plus efficace |
| Recommandé pour | Projets existants | Nouveaux projets |

## Application bootstrapée en Standalone

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig);
```

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
  ],
};
```

## Liens

- [angular.dev — Standalone components](https://angular.dev/guide/components/importing)
- [angular.dev — NgModules](https://angular.dev/guide/ngmodules)
- [Migration guide — Standalone](https://angular.dev/reference/migrations/standalone)
