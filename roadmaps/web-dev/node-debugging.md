---
id: node-debugging
parent: debogage
label: Débogage Node.js
explored: false
order: 2
---

# Débogage Node.js

Node.js expose un protocole de débogage (Chrome DevTools Protocol) accessible via Chrome DevTools ou VS Code. Plus besoin de console.log — les breakpoints fonctionnent comme en frontend.

## Lancer Node en mode debug

```bash
# Mode inspect — démarre le debugger, attend la connexion
node --inspect server.js                  # port 9229 par défaut
node --inspect=0.0.0.0:9229 server.js     # accessible sur le réseau

# Mode inspect-brk — s'arrête sur la première ligne (utile pour les scripts courts)
node --inspect-brk script.js

# Attacher le debugger Chrome
# → ouvrir chrome://inspect → Remote Target → Inspect
# → Les fichiers sources s'ouvrent, les breakpoints fonctionnent
```

## VS Code — configuration de debug

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Node.js — Serveur",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/server.ts",
      "runtimeArgs": ["--loader", "tsx"],
      "env": { "NODE_ENV": "development" },
      "envFile": "${workspaceFolder}/.env.local",
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "skipFiles": ["<node_internals>/**", "**/node_modules/**"],
      "restart": true,         // redémarre quand le fichier change
      "console": "integratedTerminal"
    },
    {
      "name": "Node.js — Attacher au processus",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "sourceMaps": true,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Vitest — Tests courants",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${file}"],
      "smartStep": true
    },
    {
      "name": "Chrome — Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ],
  "compounds": [
    {
      "name": "Full Stack",
      "configurations": ["Node.js — Serveur", "Chrome — Frontend"]
    }
  ]
}
```

## Déboguer TypeScript directement

```bash
# tsx — exécution TypeScript sans compilation (dev)
npx tsx --inspect src/server.ts

# ts-node avec source maps
npx ts-node --inspect --require tsconfig-paths/register src/server.ts

# Avec nodemon (reload automatique)
nodemon --exec "node --inspect --loader tsx" src/server.ts
```

```json
// package.json
{
  "scripts": {
    "dev":       "node --env-file=.env --watch --inspect --loader tsx src/server.ts",
    "debug":     "node --env-file=.env --inspect-brk --loader tsx src/server.ts"
  }
}
```

## Techniques avancées

```javascript
// Inspecter un objet sans troncature
console.dir(deepObject, { depth: null, colors: true });

// Utilisation de l'inspecteur depuis le code
import { inspect } from 'node:util';
console.log(inspect(complexObject, { depth: 4, colors: true, compact: false }));

// Dumps mémoire — détecter les fuites
import v8 from 'node:v8';
const snapshot = v8.writeHeapSnapshot();  // écrit un .heapsnapshot
// Ouvrir dans Chrome DevTools → Memory → Load snapshot

// Profiler le CPU
import { Session } from 'node:inspector';
import { writeFileSync } from 'node:fs';

const session = new Session();
session.connect();
session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // ... code à profiler ...
    session.post('Profiler.stop', (err, { profile }) => {
      writeFileSync('./cpu.cpuprofile', JSON.stringify(profile));
      // Ouvrir dans Chrome DevTools → Performance → Load profile
    });
  });
});
```

## Liens

- [Node.js — Debugging guide](https://nodejs.org/en/guides/debugging-getting-started)
- [VS Code — Node.js debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- [Chrome DevTools — Remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/)
