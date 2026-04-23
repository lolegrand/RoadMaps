---
id: linting
parent: outillage
label: Linting & Formatting
explored: false
order: 3
---

# Linting & Formatting

ESLint détecte les erreurs et anti-patterns dans le code. Prettier formate automatiquement. Ensemble, ils garantissent un code cohérent dans toute l'équipe.

## ESLint — configuration (flat config, ESLint 9+)

```javascript
// eslint.config.js — nouveau format "flat config"
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  // Ignorer les fichiers générés
  { ignores: ['dist/', 'node_modules/', '*.min.js'] },

  // Règles JS de base
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React
  {
    plugins: { react: reactPlugin, 'react-hooks': reactHooks },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',   // React 17+ — pas besoin d'importer React
    },
  },

  // Règles personnalisées
  {
    rules: {
      'no-console':                ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises':  'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      }],
    },
  }
);
```

## Prettier — configuration

```json
// .prettierrc
{
  "semi":          true,
  "singleQuote":   true,
  "trailingComma": "all",
  "printWidth":    100,
  "tabWidth":      2,
  "useTabs":       false,
  "arrowParens":   "always",
  "bracketSpacing": true,
  "endOfLine":     "lf",
  "plugins":       ["prettier-plugin-tailwindcss"]
}
```

```bash
# .prettierignore
dist/
node_modules/
*.min.js
package-lock.json
pnpm-lock.yaml
```

## Intégration ESLint + Prettier

```bash
# Installer le plugin pour éviter les conflits
pnpm add -D eslint-config-prettier

# Dans eslint.config.js — ajouter en DERNIER pour désactiver les règles de style
import eslintConfigPrettier from 'eslint-config-prettier';
export default tseslint.config(
  // … autres configs …
  eslintConfigPrettier,  // désactive les règles ESLint qui conflictent avec Prettier
);
```

## Git Hooks — lint avant commit

```bash
pnpm add -D husky lint-staged
npx husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,css}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged

# .husky/commit-msg
npx --no -- commitlint --edit $1
```

## Commitlint — messages de commit standardisés

```javascript
// commitlint.config.js — Convention Conventional Commits
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'test', 'chore', 'ci', 'perf', 'revert',
    ]],
    'subject-max-length': [2, 'always', 72],
  },
};
```

```bash
# Exemples de commits valides
git commit -m "feat(auth): add JWT refresh token rotation"
git commit -m "fix(api): handle 429 rate limit responses"
git commit -m "docs: update README with Docker setup"
git commit -m "refactor!: migrate to ESM modules"  # ! = breaking change
```

## Liens

- [eslint.org](https://eslint.org/)
- [prettier.io](https://prettier.io/)
- [typicode/husky](https://github.com/typicode/husky)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
