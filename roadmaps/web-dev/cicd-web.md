---
id: cicd-web
parent: deploiement
label: CI/CD Web
explored: false
order: 2
---

# CI/CD Web

Un pipeline CI/CD automatise les étapes entre le commit et la mise en production : lint, tests, build, scan de sécurité, déploiement.

## Pipeline GitHub Actions — application Vite + Node

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Qualité & Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with: { version: 9 }

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Installer les dépendances
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: TypeCheck
        run: pnpm typecheck

      - name: Tests unitaires + couverture
        run: pnpm test:ci
        env:
          CI: true

      - name: Upload coverage → Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  build:
    name: Build
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }

      - run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          VITE_API_URL: ${{ vars.VITE_API_URL }}

      - name: Analyser la taille du bundle
        run: |
          ls -lh dist/assets/*.js | sort -k5 -rh | head -10

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 1

  deploy-preview:
    name: Deploy Preview
    needs: build
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }

      - name: Deploy Preview → Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    name: Deploy Production
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production   # nécessite une approbation manuelle si configuré
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }

      - name: Deploy → Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Lighthouse CI — vérifier les perfs dans la PR

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://preview-${{ github.event.pull_request.number }}.vercel.app
    budgetPath: .github/lighthouse-budget.json
    uploadArtifacts: true
```

```json
// .github/lighthouse-budget.json
[{
  "path": "/*",
  "timings": [
    { "metric": "first-contentful-paint",  "budget": 2000 },
    { "metric": "largest-contentful-paint","budget": 3000 },
    { "metric": "interactive",             "budget": 4000 }
  ],
  "sizes": [
    { "resourceType": "script",     "budget": 300 },
    { "resourceType": "stylesheet", "budget": 50 }
  ]
}]
```

## Bonnes pratiques CI/CD

```yaml
# Cache des dépendances — éviter npm install à chaque run
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: pnpm            # ou npm, yarn

# Secrets — jamais en dur dans le YAML
env:
  API_KEY: ${{ secrets.API_KEY }}   # ✅
  API_KEY: "sk-prod-xxxxx"          # ❌

# Environments — protection des déploiements prod
environment:
  name: production
  url: https://example.com
# → Nécessite une approbation manuelle depuis GitHub
```

## Liens

- [GitHub Actions — Documentation](https://docs.github.com/en/actions)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Codecov](https://codecov.io/)
