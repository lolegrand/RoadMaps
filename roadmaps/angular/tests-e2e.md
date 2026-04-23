---
id: tests-e2e
parent: tests
label: Tests E2E (Playwright)
explored: false
order: 2
---

# Tests E2E (Playwright)

Playwright est l'outil E2E recommandé pour les nouvelles apps Angular. Il pilote un vrai navigateur et teste l'application de bout en bout, y compris les interactions réseau.

```bash
npm init playwright@latest
```

## Test de navigation et d'UI

```typescript
// e2e/products.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Catalogue produits', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('affiche la liste des produits', async ({ page }) => {
    await expect(page.getByTestId('product-card')).toHaveCount(10);
    await expect(page.getByText('Widget Pro')).toBeVisible();
  });

  test('filtre les produits par catégorie', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Catégorie' }).selectOption('electronics');
    await expect(page.getByTestId('product-card')).toHaveCount(3);
  });

  test('navigue vers le détail', async ({ page }) => {
    await page.getByText('Widget Pro').click();
    await expect(page).toHaveURL(/\/products\/\d+/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Widget Pro');
  });
});
```

## Mocker les appels réseau

```typescript
test('affiche un message d\'erreur si l\'API échoue', async ({ page }) => {
  await page.route('**/api/products', route =>
    route.fulfill({ status: 500, body: 'Internal Server Error' })
  );

  await page.goto('/products');
  await expect(page.getByRole('alert')).toContainText('Erreur serveur');
});

test('intercepte et modifie une réponse', async ({ page }) => {
  await page.route('**/api/products', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json[0].name = 'Produit modifié par le test';
    await route.fulfill({ response, json });
  });

  await page.goto('/products');
  await expect(page.getByText('Produit modifié par le test')).toBeVisible();
});
```

## Test d'un formulaire complet

```typescript
test('crée un compte utilisateur', async ({ page }) => {
  await page.goto('/register');

  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Mot de passe').fill('SecureP@ss1');
  await page.getByLabel('Confirmer').fill('SecureP@ss1');

  await expect(page.getByRole('button', { name: 'S\'inscrire' })).toBeEnabled();
  await page.getByRole('button', { name: 'S\'inscrire' }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Bienvenue !')).toBeVisible();
});
```

## Configuration Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'ng serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile',   use: { ...devices['iPhone 14'] } },
  ],
});
```

## Liens

- [playwright.dev](https://playwright.dev/)
- [Playwright — Angular testing](https://playwright.dev/docs/intro)
- [angular.dev — E2E testing](https://angular.dev/tools/cli/end-to-end)
