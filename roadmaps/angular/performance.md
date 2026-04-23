---
id: performance
parent: root
label: Performance
explored: false
order: 8
---

# Performance

Les performances Angular se travaillent à trois niveaux : la **détection de changements** (réduire le travail du framework), le **bundle size** (lazy loading, tree-shaking), et le **rendu initial** (SSR + hydration).

## Checklist performance

- `ChangeDetectionStrategy.OnPush` sur tous les composants
- `trackBy` sur tous les `@for` (ou `track` en syntaxe nouvelle)
- `async` pipe plutôt que `.subscribe()` dans les composants
- Lazy loading des routes et des composants lourds (`@defer`)
- Signals pour éliminer Zone.js (`provideExperimentalZonelessChangeDetection`)
- SSR + hydration pour les apps publiques

## Liens

- [angular.dev — Performance](https://angular.dev/best-practices/runtime-performance)
- [Web.dev — Angular performance](https://web.dev/angular/)
