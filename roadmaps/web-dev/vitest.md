---
id: vitest
parent: tests
label: Vitest & Jest
explored: false
order: 1
---

# Vitest & Jest

Vitest est le test runner moderne pour les projets Vite (ultra-rapide, config partagée avec Vite). Jest reste très utilisé dans les projets existants. Leurs APIs sont quasi-identiques.

## Configuration Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals:     true,        // describe, it, expect sans import
    environment: 'node',      // ou 'jsdom' pour les tests DOM/React
    include:     ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude:     ['**/e2e/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: { lines: 80, functions: 80, branches: 70 },
    },
    setupFiles: ['./src/test-setup.ts'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
});
```

## Écrire des tests

```typescript
// math.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { add, divide, formatCurrency } from './math.js';

describe('add()', () => {
  it('additionne deux entiers positifs', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('gère les nombres négatifs', () => {
    expect(add(-1, 1)).toBe(0);
  });
});

describe('divide()', () => {
  it('divise correctement', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('lève une erreur si diviseur = 0', () => {
    expect(() => divide(10, 0)).toThrow('Division par zéro');
  });
});

describe('formatCurrency()', () => {
  it('formate en euros', () => {
    expect(formatCurrency(9.99, 'EUR')).toBe('9,99 €');
  });
});
```

## Mocking — isoler les dépendances

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserService } from './user-service.js';
import { db } from './database.js';

// Mock d'un module entier
vi.mock('./database.js', () => ({
  db: {
    users: {
      findById:  vi.fn(),
      create:    vi.fn(),
      update:    vi.fn(),
    },
  },
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(db);
    vi.clearAllMocks();     // réinitialiser les mocks entre chaque test
  });

  it('retourne un utilisateur par ID', async () => {
    const mockUser = { id: 1, name: 'Alice', email: 'alice@test.com' };
    vi.mocked(db.users.findById).mockResolvedValue(mockUser);

    const user = await service.findById(1);

    expect(db.users.findById).toHaveBeenCalledWith(1);
    expect(user).toEqual(mockUser);
  });

  it('lève NotFoundError si l\'utilisateur n\'existe pas', async () => {
    vi.mocked(db.users.findById).mockResolvedValue(null);
    await expect(service.findById(999)).rejects.toThrow('NotFoundError');
  });
});

// Spy — observer sans remplacer
const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
// ... code qui appelle console.warn ...
expect(spy).toHaveBeenCalledWith('Deprecated API');
spy.mockRestore();
```

## Snapshots — tester du HTML ou du JSON

```typescript
it('génère le bon HTML', () => {
  const html = renderCard({ title: 'Test', price: 9.99 });
  expect(html).toMatchSnapshot();  // crée / compare un fichier .snap
});

// Inline snapshot — stocké dans le fichier test
it('retourne le bon format JSON', () => {
  expect(formatUser({ id: 1, name: 'Alice' })).toMatchInlineSnapshot(`
    {
      "id": 1,
      "name": "Alice",
      "displayName": "Alice (#1)",
    }
  `);
});
```

## Commandes

```bash
vitest            # watch mode (développement)
vitest run        # one-shot (CI)
vitest run --coverage              # avec couverture de code
vitest run src/utils/math.test.ts  # fichier spécifique
vitest --reporter=verbose          # détail de chaque test
vitest ui                          # interface graphique
```

## Liens

- [vitest.dev](https://vitest.dev/)
- [jestjs.io](https://jestjs.io/)
- [vitest — Mocking](https://vitest.dev/guide/mocking)
