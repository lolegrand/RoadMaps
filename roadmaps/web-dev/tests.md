---
id: tests
parent: root
label: Tests
explored: false
order: 6
---

# Tests

Tester son code évite les régressions et documente le comportement attendu. La pyramide des tests guide l'équilibre entre vitesse et couverture.

## Pyramide des tests web

```
              ▲  E2E (Playwright)
             ▲▲▲  Tests d'intégration — composants + DOM + API
           ▲▲▲▲▲  Tests unitaires — fonctions, services, utils

+ rapides, + nombreux, + bas        + lents, - nombreux, + haut
```

## Liens

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
