---
id: source-maps-profiling
parent: debogage
label: Source Maps & Profiling
explored: false
order: 3
---

# Source Maps & Profiling

Les source maps relient le code compilé/minifié à votre code source original. Le profiling identifie les goulots d'étranglement de performance.

## Source Maps — du build au code original

```
Code TypeScript (src/app.ts)
         │ Compilation / Bundling
         ▼
Code JS minifié (dist/app.min.js) + Source Map (dist/app.min.js.map)
         │
Navigateur / Node → décode la source map → affiche src/app.ts dans DevTools
```

```typescript
// tsconfig.json — générer les source maps
{
  "compilerOptions": {
    "sourceMap":     true,          // génère les .map
    "inlineSources": true,          // inclut le source original dans le .map
    "sourceRoot":    "/"            // racine des chemins dans le .map
  }
}
```

```typescript
// vite.config.ts — source maps selon l'environnement
export default defineConfig({
  build: {
    sourcemap: true,          // true | false | 'inline' | 'hidden'
    // 'hidden' → génère le .map mais ne référence pas dans le bundle
    //            → pour les outils d'erreurs (Sentry) sans exposer le source
  }
});
```

## Sentry — erreurs avec source maps en production

```typescript
// sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.COMMIT_SHA,    // pour mapper aux source maps uploadées
  tracesSampleRate: 0.1,              // 10% des transactions
});

// Vite — uploader les source maps à chaque build
// vite.config.ts
import { sentryVitePlugin } from '@sentry/vite-plugin';
export default defineConfig({
  plugins: [
    sentryVitePlugin({
      org:     'my-org',
      project: 'my-project',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  build: { sourcemap: true },
});
```

## Profiling de performance Node.js

```bash
# Profil CPU intégré — V8
node --prof server.js          # génère un isolate-xxxx-v8.log
node --prof-process isolate-xxxx-v8.log > processed.txt
# Analyse : quelle fonction prend le plus de temps CPU

# Avec clinicjs — suite de profiling Node.js
npx clinic doctor -- node server.js      # diagnostic général
npx clinic flame  -- node server.js      # flamegraph CPU (le plus utile)
npx clinic bubbleprof -- node server.js  # visualise les I/O async

# Avec 0x (flamegraph simplifié)
npx 0x server.js    # génère un flamegraph.html interactif
```

## Lire un Flamegraph

```
Un flamegraph = pile d'appels dans le temps
- Axe X = temps (largeur = % du temps CPU)
- Axe Y = profondeur de la pile d'appels

┌─────────────────────────────────────────┐
│           handleRequest (80%)            │  ← goulot d'étranglement
│  ┌───────────────┐  ┌──────────────────┐│
│  │ parseBody(15%)│  │ dbQuery (65%)    ││
│  └───────────────┘  │ ┌──────────────┐ ││
│                      │ │ serialize(5%)│ ││
│                      │ └──────────────┘ ││
│                      └──────────────────┘│
└─────────────────────────────────────────┘
→ Optimiser dbQuery en priorité
```

## Memory leaks — détecter et corriger

```javascript
// Simuler une fuite mémoire pour test
const leaks = [];
setInterval(() => {
  leaks.push(new Array(1000000).fill('x'));  // fuite intentionnelle
}, 1000);

// Détecter : surveiller process.memoryUsage()
setInterval(() => {
  const { heapUsed, heapTotal } = process.memoryUsage();
  console.log(`Heap: ${Math.round(heapUsed / 1024 / 1024)}MB / ${Math.round(heapTotal / 1024 / 1024)}MB`);
}, 5000);

// Patterns courants de fuites
// 1. Closures qui retiennent des refs inutilement
// 2. EventEmitters sans .removeListener()
// 3. Caches sans limite (Map / Set qui grandissent sans borne)
// 4. Timers setInterval non clearés
// 5. Promises non résolues qui retiennent des objets
```

## Liens

- [source-map-support](https://github.com/evanw/node-source-map-support)
- [clinicjs.org](https://clinicjs.org/)
- [Sentry — Source Maps](https://docs.sentry.io/platforms/javascript/sourcemaps/)
- [Chrome DevTools — Memory](https://developer.chrome.com/docs/devtools/memory-problems/)
