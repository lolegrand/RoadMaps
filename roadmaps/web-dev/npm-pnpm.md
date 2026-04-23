---
id: npm-pnpm
parent: outillage
label: npm & pnpm
explored: true
order: 1
---

# npm & pnpm

npm est le gestionnaire de paquets livré avec Node.js. pnpm est une alternative plus rapide et économe en espace disque grâce à un store partagé et des liens symboliques.

## npm — commandes essentielles

```bash
# Initialiser un projet
npm init -y                      # package.json avec valeurs par défaut
npm init                         # mode interactif

# Installer des dépendances
npm install express              # dépendance de production
npm install -D typescript jest   # dépendance de développement
npm install -g nodemon           # globale (outil CLI)
npm install                      # installer toutes les dépendances du package.json
npm ci                           # install propre depuis package-lock.json (CI)

# Mettre à jour
npm update                       # màj dans les contraintes semver
npm update express               # màj un paquet spécifique
npm outdated                     # lister ce qui peut être mis à jour

# Supprimer
npm uninstall express
npm prune                        # supprimer les paquets non listés dans package.json

# Inspecter
npm list                         # arbre de dépendances local
npm list --depth=0               # dépendances directes seulement
npm list -g --depth=0            # globales
npm info express                 # métadonnées d'un paquet
npm view express versions        # toutes les versions publiées

# Sécurité
npm audit                        # scan des vulnérabilités
npm audit fix                    # corriger automatiquement
npm audit fix --force            # corriger même les breaking changes

# Scripts
npm run build                    # lancer le script "build"
npm run dev                      # lancer "dev"
npm test                         # raccourci pour "test"
npm start                        # raccourci pour "start"
```

## package.json — anatomie complète

```json
{
  "name": "my-app",
  "version": "1.2.3",
  "description": "Mon application",
  "author": "Alice <alice@example.com>",
  "license": "MIT",
  "private": true,

  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "require": "./dist/index.cjs" }
  },

  "scripts": {
    "dev":       "vite",
    "build":     "tsc && vite build",
    "preview":   "vite preview",
    "test":      "vitest",
    "test:ci":   "vitest run --coverage",
    "lint":      "eslint src --ext .ts,.tsx",
    "lint:fix":  "eslint src --ext .ts,.tsx --fix",
    "format":    "prettier --write src",
    "typecheck": "tsc --noEmit",
    "prepare":   "husky"
  },

  "dependencies": {
    "express": "^4.21.0"
  },
  "devDependencies": {
    "typescript":       "^5.6.0",
    "vitest":           "^2.0.0",
    "@types/express":   "^4.17.0"
  },
  "peerDependencies": {
    "react": ">=18"
  },

  "engines": {
    "node": ">=20",
    "npm":  ">=10"
  }
}
```

## Semver — comprendre les contraintes de version

```
1.2.3
│ │ └─ patch — bug fixes (rétrocompatible)
│ └─── minor — nouvelles fonctionnalités (rétrocompatible)
└───── major — breaking changes

^1.2.3 → >=1.2.3 <2.0.0   (minor + patch autorisés)
~1.2.3 → >=1.2.3 <1.3.0   (patch seulement)
1.2.3  → exactement 1.2.3 (version fixée)
*      → n'importe quelle version (dangereux)
```

## pnpm — plus rapide, moins d'espace

```bash
# Installer
npm install -g pnpm
# ou
curl -fsSL https://get.pnpm.io/install.sh | sh

# Utilisation — CLI quasi-identique à npm
pnpm install
pnpm add express
pnpm add -D typescript
pnpm remove express
pnpm run dev
pnpm test

# Store partagé — une copie par version de paquet sur la machine
pnpm store path       # emplacement du store
pnpm store status     # vérifier l'intégrité
pnpm store prune      # nettoyer les paquets non utilisés
```

```yaml
# .npmrc — configuration partagée dans le repo
engine-strict=true       # respecter le champ "engines"
save-exact=true          # fixer les versions (pas de ^)

# pnpm-workspace.yaml — monorepo
packages:
  - 'packages/*'
  - 'apps/*'
```

## npx — exécuter sans installer

```bash
# Exécuter un binaire npm sans l'installer globalement
npx create-react-app my-app
npx @angular/cli new my-app
npx prettier --write .
npx npm-check-updates -u        # voir les mises à jour disponibles

# Forcer la dernière version
npx --yes cowsay "Hello"
```

## Liens

- [docs.npmjs.com](https://docs.npmjs.com/)
- [pnpm.io](https://pnpm.io/)
- [semver.org](https://semver.org/lang/fr/)
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates)
