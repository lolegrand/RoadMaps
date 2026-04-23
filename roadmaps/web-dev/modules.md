---
id: modules
parent: nodejs
label: Modules ESM & CommonJS
explored: true
order: 1
---

# Modules ESM & CommonJS

Node.js supporte deux systèmes de modules : **CommonJS** (historique, `.cjs`, `require()`) et **ES Modules** (standard web, `.mjs` / `"type":"module"`, `import/export`). Comprendre les deux est indispensable car l'écosystème npm est en transition.

## CommonJS (CJS)

```javascript
// math.cjs — exports
const PI = 3.14159;

function add(a, b) { return a + b; }
class Calculator { /* ... */ }

module.exports = { PI, add, Calculator };
// ou export par défaut
module.exports = Calculator;

// main.cjs — imports
const { PI, add } = require('./math.cjs');
const fs = require('fs');          // module natif
const express = require('express'); // npm package

// require() est synchrone — le fichier est lu, parsé, évalué
// module.exports est mis en cache — le même objet est retourné à chaque require
```

## ES Modules (ESM)

```javascript
// math.mjs — exports
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export class Calculator { /* ... */ }
export default class MainCalc { /* ... */ }

// main.mjs — imports statiques (analysés au chargement)
import MainCalc, { PI, add } from './math.mjs';
import fs from 'node:fs/promises';    // préférer le préfixe node:
import { createServer } from 'node:http';

// Import dynamique — chargement paresseux
const { default: heavy } = await import('./heavy-module.mjs');

// Import avec assertion (JSON, etc.)
import config from './config.json' with { type: 'json' };
```

## CJS vs ESM — différences clés

```javascript
// CJS — variables spéciales disponibles
__dirname;           // répertoire du fichier courant
__filename;          // chemin du fichier courant
require.resolve();   // résoudre un chemin sans charger

// ESM — équivalent avec import.meta
import.meta.url;     // URL du fichier courant (file:///…)
import.meta.dirname; // Node 21.2+ — équivalent __dirname
import.meta.resolve('./config.json');  // résolution relative

// Émulation __dirname en ESM (Node < 21.2)
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
```

## package.json — configuration des modules

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "module",        // tous les .js sont traités comme ESM
                           // omis ou "commonjs" → tous les .js sont CJS

  // Exports map — contrôle précis des exports publics
  "exports": {
    ".": {
      "import": "./dist/index.mjs",      // pour les consommateurs ESM
      "require": "./dist/index.cjs",     // pour les consommateurs CJS
      "types": "./dist/index.d.ts"
    },
    "./utils": "./dist/utils.mjs"
  },

  "main":    "./dist/index.cjs",   // fallback Node < 12
  "module":  "./dist/index.mjs",   // indication pour les bundlers
  "types":   "./dist/index.d.ts"
}
```

## Interop CJS ↔ ESM

```javascript
// ESM peut importer du CJS (avec default uniquement)
import lodash from 'lodash';   // ✅ fonctionne (default import du module.exports)
import { merge } from 'lodash'; // ⚠️ peut fonctionner selon la version Node

// CJS ne peut pas require() un ESM (erreur)
const myEsmPkg = require('pure-esm-package'); // ❌ ERR_REQUIRE_ESM

// Solution : dynamic import() dans CJS
async function loadEsm() {
  const { default: thing } = await import('pure-esm-package');
  return thing;
}
```

## Liens

- [Node.js — ESM documentation](https://nodejs.org/api/esm.html)
- [Node.js — CommonJS](https://nodejs.org/api/modules.html)
- [Are the types wrong?](https://arethetypeswrong.com/)
- [publint — vérifier les exports npm](https://publint.dev/)
