---
id: angular-cli
parent: tooling
label: Angular CLI
explored: true
order: 1
---

# Angular CLI

Angular CLI (`ng`) est l'outil officiel pour créer, développer, tester et builder des applications Angular. Depuis Angular 17, le builder par défaut est **esbuild + Vite** (beaucoup plus rapide que Webpack).

## Commandes essentielles

```bash
# Créer un projet
ng new my-app --standalone --style=scss --routing

# Dev server avec hot reload
ng serve --port 4200 --open

# Générer des éléments
ng generate component features/products/product-list
ng generate service core/services/auth
ng generate guard core/guards/auth
ng generate pipe shared/pipes/time-ago
ng generate directive shared/directives/tooltip
ng generate interface shared/models/product

# Raccourcis
ng g c features/products/product-list  # component
ng g s core/services/auth              # service
ng g g core/guards/auth                # guard

# Build production
ng build --configuration production

# Tests
ng test                    # unitaires (Karma/Jest)
ng e2e                     # end-to-end

# Analyse du bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/my-app/stats.json

# Mise à jour Angular
ng update @angular/core @angular/cli
ng update                  # liste tout ce qui peut être mis à jour
```

## Schematics — génération personnalisée

```bash
# Installer un schematic tiers
ng add @angular/material
ng add @ngrx/store
ng add @angular/ssr

# Lancer une migration
ng generate @angular/core:standalone         # migrer vers standalone
ng generate @angular/core:control-flow       # migrer vers @if/@for
ng generate @angular/core:inject             # migrer vers inject()
```

## angular.json — configuration du build

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/my-app",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [],
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "budgets": [
              { "type": "initial", "maximumWarning": "500kB", "maximumError": "1MB" }
            ]
          },
          "configurations": {
            "production": {
              "optimization": true,
              "sourceMap": false,
              "fileReplacements": [
                { "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts" }
              ]
            }
          }
        }
      }
    }
  }
}
```

## Liens

- [angular.dev — CLI reference](https://angular.dev/cli)
- [angular.dev — Workspace config](https://angular.dev/reference/configs/workspace-config)
- [esbuild — Why it's fast](https://esbuild.github.io/)
