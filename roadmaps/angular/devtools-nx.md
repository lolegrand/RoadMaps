---
id: devtools-nx
parent: tooling
label: DevTools & Nx
explored: false
order: 3
---

# DevTools & Nx

**Angular DevTools** est l'extension Chrome officielle pour inspecter les composants et profiler la détection de changements. **Nx** est le gestionnaire de monorepo recommandé pour les grandes équipes.

## Angular DevTools

```
Extension Chrome : "Angular DevTools"
Onglets disponibles :
├── Components  — arbre des composants, inputs/outputs, signals en temps réel
├── Profiler    — enregistre les cycles de détection de changements
└── Router      — état du router, routes actives, guards exécutés
```

```typescript
// Activer les DevTools en développement (automatique avec ng serve)
// En production, Angular DevTools est désactivé par défaut

// Debug manuel — injecter ChangeDetectorRef pour forcer une détection
@Component({ ... })
export class MyComponent {
  private cdr = inject(ChangeDetectorRef);

  triggerManualUpdate(): void {
    this.cdr.markForCheck();    // avec OnPush — marque pour vérification
    // ou
    this.cdr.detectChanges();   // force la détection immédiate
  }
}
```

## Nx — monorepo Angular

Nx permet de gérer plusieurs applications et bibliothèques dans un seul repo, avec un graphe de dépendances intelligent pour ne rebuilder que ce qui a changé.

```bash
# Créer un workspace Nx
npx create-nx-workspace@latest my-org --preset=angular-monorepo

# Structure
my-org/
├── apps/
│   ├── shop/           ← application principale
│   └── admin/          ← application admin
└── libs/
    ├── ui/             ← composants partagés
    ├── data-access/    ← services et state management
    └── util/           ← utilitaires, models, helpers
```

```bash
# Générer une lib partagée
nx generate @nx/angular:library ui --standalone --directory=libs/ui

# Visualiser le graphe de dépendances
nx graph

# Build / test intelligent — uniquement ce qui a changé
nx affected:build
nx affected:test

# Cache partagé (CI)
nx connect   # Nx Cloud — cache distribué
```

## Configuration des paths TypeScript (sans Nx)

```json
// tsconfig.json — aliaser les librairies internes
{
  "compilerOptions": {
    "paths": {
      "@myapp/ui":          ["libs/ui/src/index.ts"],
      "@myapp/data-access": ["libs/data-access/src/index.ts"],
      "@myapp/util":        ["libs/util/src/index.ts"]
    }
  }
}
```

## Liens

- [Angular DevTools — Chrome Web Store](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh)
- [angular.dev — DevTools](https://angular.dev/tools/devtools)
- [nx.dev — Angular](https://nx.dev/nx-api/angular)
