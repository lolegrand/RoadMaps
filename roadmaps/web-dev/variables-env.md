---
id: variables-env
parent: outillage
label: Variables d'environnement
explored: false
order: 4
---

# Variables d'environnement

Les variables d'environnement séparent la configuration du code. Elles varient selon l'environnement (dev, staging, prod) sans modifier le code source.

## Fichiers .env

```bash
# .env — valeurs par défaut (peut être committé si pas de secrets)
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# .env.local — overrides locaux, JAMAIS committé
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=mon-secret-de-dev-super-long-et-aleatoire

# .env.production — valeurs prod sans secrets (committé)
NODE_ENV=production
LOG_LEVEL=info
PORT=8080

# .env.test — variables pour les tests
DATABASE_URL=postgresql://user:test@localhost:5432/testdb
```

```bash
# .gitignore — ne JAMAIS committer les secrets
.env.local
.env.*.local
.env.production.local
```

## Node.js — charger les .env

```javascript
// Node 20.6+ — natif, sans dotenv
// package.json script
"dev": "node --env-file=.env --env-file=.env.local src/server.js"

// Ou dotenv (avant Node 20.6)
import 'dotenv/config';     // ESM
require('dotenv').config(); // CJS

// dotenv-expand — support des variables imbriquées
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
dotenvExpand.expand(dotenv.config());
```

## Validation des variables d'environnement — zod

```typescript
// env.ts — valider au démarrage
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV:     z.enum(['development', 'test', 'production']),
  PORT:         z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32, 'JWT secret trop court (min 32 chars)'),
  LOG_LEVEL:    z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  REDIS_URL:    z.string().url().optional(),
  // Booléen depuis string
  ENABLE_CACHE: z.string().transform(v => v === 'true').default('false'),
});

// Valider au démarrage — crash rapide si manquant
const _env = EnvSchema.safeParse(process.env);
if (!_env.success) {
  console.error('❌ Variables d\'environnement invalides:');
  console.error(_env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;
// env.PORT est typé number, env.DATABASE_URL est string, etc.
```

```typescript
// Utilisation partout dans l'app
import { env } from './env.js';

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
});
```

## Variables dans les CI/CD

```yaml
# GitHub Actions — secrets + variables
env:
  NODE_ENV:  production
  LOG_LEVEL: info
  DATABASE_URL: ${{ secrets.DATABASE_URL }}   # chiffrés dans GitHub
  JWT_SECRET:   ${{ secrets.JWT_SECRET }}

# Variables par environnement (GitHub Environments)
environment: production
```

## Liens

- [dotenv](https://github.com/motdotla/dotenv)
- [Node.js — --env-file](https://nodejs.org/en/blog/release/v20.6.0#built-in-env-file-support)
- [zod](https://zod.dev/)
- [t3-env — typesafe env vars](https://env.t3.gg/)
