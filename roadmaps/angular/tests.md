---
id: tests
parent: root
label: Tests
explored: false
order: 7
---

# Tests

Angular fournit un écosystème de tests complet : **Jasmine + Karma** (historique) ou **Jest** (recommandé pour la vitesse), et **Playwright / Cypress** pour les tests E2E. `TestBed` est l'utilitaire central pour monter des composants en isolation.

## Pyramide des tests Angular

```
         ▲  E2E (Playwright/Cypress) — peu nombreux, lents
        ▲▲▲  Tests d'intégration (TestBed + HttpClientTestingModule)
      ▲▲▲▲▲  Tests unitaires (services, pipes, utils) — nombreux, rapides
```

## Configuration Jest (recommandé)

```bash
ng add jest-preset-angular
```

```typescript
// jest.config.ts
export default {
  preset: 'jest-preset-angular',
  setupFilesAfterFramework: ['<rootDir>/setup-jest.ts'],
};
```

## Liens

- [angular.dev — Testing](https://angular.dev/guide/testing)
- [jest-preset-angular](https://thymikee.github.io/jest-preset-angular/)
- [Spectator — Angular testing utilities](https://github.com/ngneat/spectator)
